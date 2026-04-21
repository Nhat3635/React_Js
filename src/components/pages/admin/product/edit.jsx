import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import requestAPI from "../../../../api";
import { uploadImageToServer } from "../../../../api/upload";
import Toast from "../../../ui/common/Toast";
import DeleteConfirmationModal from "../../../ui/common/DeleteModal";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colorValues, setColorValues] = useState([]);
  const [sizeValues, setSizeValues] = useState([]);
  const [variants, setVariants] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [newSpec, setNewSpec] = useState({ spec_name: "", spec_value: "" });
  const [newPolicy, setNewPolicy] = useState({ policy_type: "", content: "" });
  const [attrIds, setAttrIds] = useState({ color: null, size: null });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [nameError, setNameError] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, itemType: null, itemId: null, isDeleting: false });

  // Tab State
  const [activeTab, setActiveTab] = useState("general"); // general, comments
  const [productComments, setProductComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [feedbackType, setFeedbackType] = useState("comment"); // comment, review
  const [feedbackPagination, setFeedbackPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 0 });
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [commentReplies, setCommentReplies] = useState({});
  const [replyTo, setReplyTo] = useState(null); // ID of comment being replied to
  const [replyContent, setReplyContent] = useState("");
  const [detailContent, setDetailContent] = useState(""); // CKEditor state

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const showToast = useCallback((message, type = "success") => {
    setToast({ show: true, message, type });
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast("Đang tải ảnh lên...");
      const imageUrl = await uploadImageToServer(file, "products");
      setImagePreview(imageUrl);
      setValue("image", imageUrl);
      showToast("Tải ảnh thành công!");
    } catch (err) {
      showToast("Lỗi khi tải ảnh lên", "error");
      console.error("Image upload error:", err);
    }
  };

  const handleVariantImageUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast("Đang tải ảnh biến thể lên...");
      const imageUrl = await uploadImageToServer(file, "products");
      const updated = [...variants];
      updated[index].variant_image = imageUrl;
      // Mark as dirty if not a new variant
      if (!updated[index].isNew) {
        updated[index].isDirty = true;
      }
      setVariants(updated);
      showToast("Tải ảnh biến thể thành công!");
    } catch (err) {
      showToast("Lỗi khi tải ảnh biến thể lên", "error");
      console.error("Variant image upload error:", err);
    }
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [productRes, categoriesRes, brandsRes, attrsRes] = await Promise.all([
        requestAPI({ method: "GET", url: `/products/${id}` }),
        requestAPI({ method: "GET", url: "/categories/list" }),
        requestAPI({ method: "GET", url: "/brands/list" }).catch(() => ({ data: [] })),
        requestAPI({ method: "GET", url: "/products/attributes/list" }).catch(() => ({ data: [] })),
      ]);

      const product = productRes?.data?.data || productRes?.data;
      if (!product) throw new Error("Không tìm thấy thông tin sản phẩm");

      // Set basic form values
      reset({
        name: product.name,
        category_id: product.category_id,
        brand_id: product.brand_id,
        base_price: Math.floor(product.base_price),
        status: product.status,
        image: product.image,
        short_description: product.short_description || "",
        detail_content: product.detail_content || "",
      });

      setDetailContent(product.detail_content || ""); // Set CKEditor state
      setImagePreview(product.image);

      setSpecs(product.specs || []);
      setPolicies(product.policies || []);

      // Map variants from database schema
      const variations = product.variants || product.product_variants || product.variations || [];
      setVariants(variations.map(v => {
        let color_name = "";
        let size_name = "";
        if (v.attribute_summary) {
            const parts = v.attribute_summary.split(", ");
            parts.forEach(p => {
                if (p.includes("Màu") || p.includes("Color")) color_name = p.split(": ")[1] || "";
                if (p.includes("Kích") || p.includes("Size")) size_name = p.split(": ")[1] || "";
            });
        }
        return {
          id: v.id,
          name: v.name || "",
          price: Math.floor(v.price) || 0,
          variant_image: v.variant_image || "",
          color_name,
          size_name,
          isNew: false,
          isDirty: false,
          variantNameError: "",
          colorNameError: "",
          sizeNameError: ""
        };
      }));

      setCategories(Array.isArray(categoriesRes?.data?.data) ? categoriesRes.data.data : Array.isArray(categoriesRes?.data) ? categoriesRes.data : []);
      setBrands(Array.isArray(brandsRes?.data?.data) ? brandsRes.data.data : Array.isArray(brandsRes?.data) ? brandsRes.data : []);

      // Pre-load product list for duplicate name checking
      try {
        const prodRes = await requestAPI({ method: "GET", url: "/products/list" });
        setAllProducts(prodRes?.data?.data || prodRes?.data || []);
      } catch { setAllProducts([]); }

      // Load attribute values (Màu sắc, Kích thước)
      const attrs = Array.isArray(attrsRes?.data?.data) ? attrsRes.data.data : Array.isArray(attrsRes?.data) ? attrsRes.data : [];
      const colorAttr = attrs.find(a => a.name.toLowerCase().includes("màu"));
      const sizeAttr = attrs.find(a => a.name.toLowerCase().includes("kích thước") || a.name.toLowerCase().includes("size"));

      if (colorAttr) {
        setAttrIds(prev => ({ ...prev, color: colorAttr.id }));
        const colRes = await requestAPI({ method: "GET", url: `/products/attributes/values/${colorAttr.id}` }).catch(() => ({ data: [] }));
        setColorValues(Array.isArray(colRes?.data?.data) ? colRes.data.data : Array.isArray(colRes?.data) ? colRes.data : []);
      }
      if (sizeAttr) {
        setAttrIds(prev => ({ ...prev, size: sizeAttr.id }));
        const sizeRes = await requestAPI({ method: "GET", url: `/products/attributes/values/${sizeAttr.id}` }).catch(() => ({ data: [] }));
        setSizeValues(Array.isArray(sizeRes?.data?.data) ? sizeRes.data.data : Array.isArray(sizeRes?.data) ? sizeRes.data : []);
      }
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
      // Redirect to admin 404 if product not found
      navigate("/admin/404-not-found", { 
        replace: true, 
        state: { message: "Sản phẩm bạn đang cố chỉnh sửa không tồn tại hoặc đã bị xóa." } 
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, reset, showToast, navigate]);

  const fetchFeedback = useCallback(async () => {
    try {
      setIsCommentsLoading(true);
      const queryParams = new URLSearchParams({
        productId: id,
        page: feedbackPagination.page,
        limit: feedbackPagination.limit,
      });

      const endpoint = feedbackType === "comment" ? "/comments/list" : "/reviews/list";
      const res = await requestAPI({ method: "GET", url: `${endpoint}?${queryParams.toString()}` });
      
      if (res?.data) {
        setProductComments(res.data.data || []);
        setFeedbackPagination(prev => ({
          ...prev,
          total: res.data.pagination?.total || 0,
          total_pages: res.data.pagination?.total_pages || 0
        }));
      }
    } catch (err) {
      showToast("Không thể tải phản hồi sản phẩm", "error");
    } finally {
      setIsCommentsLoading(false);
    }
  }, [id, feedbackType, feedbackPagination.page, feedbackPagination.limit, showToast]);

  useEffect(() => {
    if (activeTab === "comments") fetchFeedback();
  }, [activeTab, fetchFeedback]);

  const toggleRow = async (parentId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(parentId)) {
      newExpanded.delete(parentId);
    } else {
      newExpanded.add(parentId);
      if (!commentReplies[parentId]) {
        try {
          const res = await requestAPI({ method: "GET", url: `/comments/replies/${parentId}` });
          setCommentReplies(prev => ({ ...prev, [parentId]: res?.data?.data || [] }));
        } catch (err) {
          showToast("Không thể tải phản hồi", "error");
        }
      }
    }
    setExpandedRows(newExpanded);
  };

  const handleToggleCommentStatus = async (commentId, field, value, parentId = null) => {
    try {
      const endpoint = feedbackType === "comment" ? `/comments/status/${commentId}` : `/reviews/status/${commentId}`;
      const data = feedbackType === "comment" ? { [field]: value } : { is_visible: value };

      await requestAPI({
        method: "PUT",
        url: endpoint,
        data: data
      });

      if (parentId) {
        setCommentReplies(prev => ({
          ...prev,
          [parentId]: prev[parentId].map(r => r.id === commentId ? { ...r, [field]: value } : r)
        }));
      } else {
        setProductComments(prev => prev.map(c => c.id === commentId ? { ...c, [field]: value } : c));
      }

      showToast("Cập nhật trạng thái thành công");
    } catch (err) {
      showToast("Lỗi cập nhật: " + err.message, "error");
    }
  };

  const handleDeleteComment = (commentId, parentId = null) => {
    setDeleteModal({ isOpen: true, itemType: "comment", itemId: commentId, parentId, isDeleting: false });
  };

  const handleReplyComment = async () => {
    if (!replyContent.trim()) return;
    try {
      setIsSaving(true);
      await requestAPI({
        method: "POST",
        url: "/comments/reply",
        data: {
          product_id: id,
          parent_id: replyTo,
          content: replyContent
        }
      });
      showToast("Đã gửi phản hồi");
      
      // Tải lại replies cho parent này
      const res = await requestAPI({ method: "GET", url: `/comments/replies/${replyTo}` });
      setCommentReplies(prev => ({ ...prev, [replyTo]: res?.data?.data || [] }));
      
      const newExpanded = new Set(expandedRows);
      newExpanded.add(replyTo);
      setExpandedRows(newExpanded);

      setReplyTo(null);
      setReplyContent("");
      fetchFeedback(); // Cập nhật replies_count ở cha
    } catch (err) {
      showToast("Lỗi phản hồi: " + err.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Validate duplicate name on blur (excluding current product)
  const checkDuplicateName = useCallback((name) => {
    if (!name || name.trim() === "") {
      setNameError("");
      return;
    }
    const isDuplicate = allProducts.some(
      (p) => p.name.toLowerCase().trim() === name.toLowerCase().trim() && p.id.toString() !== id.toString()
    );
    if (isDuplicate) {
      setNameError(`Tên sản phẩm "${name.trim()}" đã tồn tại!`);
    } else {
      setNameError("");
    }
  }, [allProducts, id]);

  const checkVariantName = (index, name) => {
    const updated = [...variants];
    const val = (name || "").trim();
    if (!val) {
      updated[index].variantNameError = "Tên biến thể không được trống";
    } else if (variants.some((v, i) => i !== index && v.name?.toLowerCase().trim() === val.toLowerCase())) {
      updated[index].variantNameError = "Tên biến thể trùng với biến thể khác";
    } else {
      updated[index].variantNameError = "";
    }
    setVariants(updated);
    return updated[index].variantNameError;
  };

  const checkColorName = (index, color) => {
    const updated = [...variants];
    const colorVal = (color || "").trim();
    const sizeVal = (variants[index]?.size_name || "").trim();

    if (!colorVal) {
      updated[index].colorNameError = "Màu sắc không được trống";
    } else if (colorVal && sizeVal) {
      // Check duplicate (color + size)
      const isDuplicate = variants.some((v, i) => 
        i !== index && 
        (v.color_name || "").trim().toLowerCase() === colorVal.toLowerCase() &&
        (v.size_name || "").trim().toLowerCase() === sizeVal.toLowerCase()
      );
      if (isDuplicate) {
        updated[index].colorNameError = `Màu ${colorVal} + Kích thước ${sizeVal} đã tồn tại`;
      } else {
        updated[index].colorNameError = "";
      }
    } else {
      updated[index].colorNameError = "";
    }
    setVariants(updated);
    return updated[index].colorNameError;
  };

  const checkSizeName = (index, size) => {
    const updated = [...variants];
    const sizeVal = (size || "").trim();
    const colorVal = (variants[index]?.color_name || "").trim();

    if (!sizeVal) {
      updated[index].sizeNameError = "Kích thước không được trống";
    } else if (colorVal && sizeVal) {
      // Check duplicate (color + size)
      const isDuplicate = variants.some((v, i) => 
        i !== index && 
        (v.color_name || "").trim().toLowerCase() === colorVal.toLowerCase() &&
        (v.size_name || "").trim().toLowerCase() === sizeVal.toLowerCase()
      );
      if (isDuplicate) {
        updated[index].sizeNameError = `Màu ${colorVal} + Kích thước ${sizeVal} đã tồn tại`;
      } else {
        updated[index].sizeNameError = "";
      }
    } else {
      updated[index].sizeNameError = "";
    }
    setVariants(updated);
    return updated[index].sizeNameError;
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onUpdateProduct = async (data) => {
    try {
      setIsSaving(true);

      // Validate detail_content from CKEditor
      if (!detailContent || detailContent.trim().length < 20) {
        showToast("Nội dung chi tiết phải ít nhất 20 ký tự", "error");
        setIsSaving(false);
        return;
      }

      // Re-check duplicate (safety net)
      const isDuplicate = allProducts.some(p =>
        p.name.toLowerCase().trim() === data.name.toLowerCase().trim() && p.id.toString() !== id.toString()
      );

      if (isDuplicate) {
        setNameError(`Tên sản phẩm "${data.name}" đã tồn tại!`);
        setIsSaving(false);
        return;
      }

      if (nameError) {
        setIsSaving(false);
        return;
      }

      const payload = {
        name: data.name,
        category_id: Number(data.category_id),
        brand_id: data.brand_id ? Number(data.brand_id) : null,
        base_price: Number(data.base_price),
        image: data.image || null,
        status: Number(data.status),
        short_description: data.short_description,
        detail_content: detailContent, // Use CKEditor state instead of form data
      };

      await requestAPI({
        method: "PUT",
        url: `/products/${id}`,
        data: payload,
      });

      showToast("Cập nhật thông tin sản phẩm thành công!");
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      console.error("Update Error:", err);
      const errorMsg = err.response?.data?.message || err.message || "";

      // Specifically catch "duplicate name" error — show inline under input
      if (errorMsg.toLowerCase().includes("trùng tên") || errorMsg.toLowerCase().includes("already exists") || errorMsg.toLowerCase().includes("duplicate")) {
        setNameError("Tên sản phẩm đã tồn tại trong hệ thống");
      } else {
        showToast(errorMsg || "Cập nhật sản phẩm thất bại", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const resolveAttributesForVariant = async (v) => {
    const attribute_value_ids = [];
    const updatedColorValues = [...colorValues];
    const updatedSizeValues = [...sizeValues];
    let currentCAttrId = attrIds.color;
    let currentSAttrId = attrIds.size;

    if (v.color_name && v.color_name.trim()) {
        if (!currentCAttrId) {
            const res = await requestAPI({ method: "POST", url: "/products/attributes/add", data: { name: "Màu sắc" } });
            currentCAttrId = res.data?.data?.id || res.data?.id;
            setAttrIds(prev => ({...prev, color: currentCAttrId}));
        }
        const cleanStr = v.color_name.trim();
        const existing = updatedColorValues.find(c => c.value.toLowerCase() === cleanStr.toLowerCase());
        if (existing) {
            attribute_value_ids.push(existing.id);
        } else {
            const res = await requestAPI({ method: "POST", url: "/products/attributes/values/add", data: { attribute_id: currentCAttrId, value: cleanStr } });
            const newId = res.data?.data?.id || res.data?.id;
            updatedColorValues.push({ id: newId, value: cleanStr });
            attribute_value_ids.push(newId);
        }
    }

    if (v.size_name && v.size_name.trim()) {
        if (!currentSAttrId) {
            const res = await requestAPI({ method: "POST", url: "/products/attributes/add", data: { name: "Kích thước" } });
            currentSAttrId = res.data?.data?.id || res.data?.id;
            setAttrIds(prev => ({...prev, size: currentSAttrId}));
        }
        const cleanStr = v.size_name.trim();
        const existing = updatedSizeValues.find(s => s.value.toLowerCase() === cleanStr.toLowerCase());
        if (existing) {
            attribute_value_ids.push(existing.id);
        } else {
            const res = await requestAPI({ method: "POST", url: "/products/attributes/values/add", data: { attribute_id: currentSAttrId, value: cleanStr } });
            const newId = res.data?.data?.id || res.data?.id;
            updatedSizeValues.push({ id: newId, value: cleanStr });
            attribute_value_ids.push(newId);
        }
    }

    setColorValues(updatedColorValues);
    setSizeValues(updatedSizeValues);
    return attribute_value_ids;
  };

  const handleAddVariantRow = () => {
    setVariants([...variants, { name: "", price: 0, variant_image: "", color_name: "", size_name: "", isNew: true, isDirty: false, variantNameError: "", colorNameError: "", sizeNameError: "" }]);
  };

  const handleSaveNewVariant = async (index) => {
    const v = variants[index];
    const updated = [...variants];

    // Validate variant name
    const nameErr = checkVariantName(index, v.name);
    if (nameErr) {
      showToast(nameErr, "error");
      return;
    }

    // Validate color name
    const colorVal = (v.color_name || "").trim();
    if (!colorVal) {
      updated[index].colorNameError = "Màu sắc không được trống";
      setVariants(updated);
      showToast("Màu sắc không được trống", "error");
      return;
    }

    // Validate size name
    const sizeVal = (v.size_name || "").trim();
    if (!sizeVal) {
      updated[index].sizeNameError = "Kích thước không được trống";
      setVariants(updated);
      showToast("Kích thước không được trống", "error");
      return;
    }

    // Check duplicate color+size combination
    if (colorVal && sizeVal) {
      const isDuplicate = variants.some((ov, i) => 
        i !== index && 
        (ov.color_name || "").trim().toLowerCase() === colorVal.toLowerCase() &&
        (ov.size_name || "").trim().toLowerCase() === sizeVal.toLowerCase()
      );
      if (isDuplicate) {
        updated[index].colorNameError = `Màu ${colorVal} + Kích thước ${sizeVal} đã tồn tại`;
        setVariants(updated);
        showToast(`Màu ${colorVal} + Kích thước ${sizeVal} đã tồn tại`, "error");
        return;
      }
    }

    try {
      const attribute_value_ids = await resolveAttributesForVariant(v);

      const response = await requestAPI({
        method: "POST",
        url: "/products/variants/add",
        data: {
          product_id: id,
          name: v.name,
          price: Number(v.price) || 0,
          variant_image: v.variant_image || null,
          attribute_value_ids,
        }
      });

      showToast("Thêm biến thể thành công!");
      const updated = [...variants];
      updated[index] = { ...v, id: response.data?.data?.id || response.data?.id, isNew: false, isDirty: false, variantNameError: "", colorNameError: "", sizeNameError: "" };
      setVariants(updated);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "";
      if (errorMsg.toLowerCase().includes("duplicate") || errorMsg.toLowerCase().includes("trùng")) {
        const updated = [...variants];
        updated[index].variantNameError = "Tên biến thể đã tồn tại trong hệ thống";
        setVariants(updated);
        showToast("Tên biến thể đã tồn tại trong hệ thống", "error");
      } else {
        showToast(errorMsg || "Không thể thêm biến thể", "error");
      }
    }
  };

  const handleUpdateVariant = async (index) => {
    const v = variants[index];
    if (!v.id || v.isNew) return;
    const updated = [...variants];

    // Validate variant name
    const nameErr = checkVariantName(index, v.name);
    if (nameErr) {
      showToast(nameErr, "error");
      return;
    }

    // Validate color name
    const colorVal = (v.color_name || "").trim();
    if (!colorVal) {
      updated[index].colorNameError = "Màu sắc không được trống";
      setVariants(updated);
      showToast("Màu sắc không được trống", "error");
      return;
    }

    // Validate size name
    const sizeVal = (v.size_name || "").trim();
    if (!sizeVal) {
      updated[index].sizeNameError = "Kích thước không được trống";
      setVariants(updated);
      showToast("Kích thước không được trống", "error");
      return;
    }

    // Check duplicate color+size combination
    if (colorVal && sizeVal) {
      const isDuplicate = variants.some((ov, i) => 
        i !== index && 
        (ov.color_name || "").trim().toLowerCase() === colorVal.toLowerCase() &&
        (ov.size_name || "").trim().toLowerCase() === sizeVal.toLowerCase()
      );
      if (isDuplicate) {
        updated[index].colorNameError = `Màu ${colorVal} + Kích thước ${sizeVal} đã tồn tại`;
        setVariants(updated);
        showToast(`Màu ${colorVal} + Kích thước ${sizeVal} đã tồn tại`, "error");
        return;
      }
    }

    try {
      const attribute_value_ids = await resolveAttributesForVariant(v);

      await requestAPI({
        method: "PUT",
        url: `/products/variants/${v.id}`,
        data: {
          name: v.name,
          price: Number(v.price) || 0,
          variant_image: v.variant_image || null,
          attribute_value_ids,
        }
      });

      showToast("Cập nhật biến thể thành công!");
      const updated = [...variants];
      updated[index] = { ...v, isDirty: false, variantNameError: "", colorNameError: "", sizeNameError: "" };
      setVariants(updated);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "";
      if (errorMsg.toLowerCase().includes("duplicate") || errorMsg.toLowerCase().includes("trùng")) {
        const updated = [...variants];
        updated[index].variantNameError = "Tên biến thể đã tồn tại trong hệ thống";
        setVariants(updated);
        showToast("Tên biến thể đã tồn tại trong hệ thống", "error");
      } else {
        showToast(errorMsg || "Không thể cập nhật biến thể", "error");
      }
    }
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    // Only clear name error on change (not color/size - will validate on blur)
    if (field === 'name') {
      updated[index].variantNameError = "";
    }
    // Mark as dirty if not a new variant
    if (!updated[index].isNew) {
      updated[index].isDirty = true;
    }
    setVariants(updated);
  };

  const handleAddSpec = async () => {
    if (!newSpec.spec_name.trim() || !newSpec.spec_value.trim()) {
      showToast("Vui lòng nhập đầy đủ tên và giá trị thông số", "error");
      return;
    }

    try {
      const specData = {
        product_id: id,
        spec_name: newSpec.spec_name.trim(),
        spec_value: newSpec.spec_value.trim()
      };

      const response = await requestAPI({
        method: "POST",
        url: "/products/specs/add",
        data: specData
      });

      // Extract ID from response, use the exact data we sent
      const serverData = response?.data?.data || response?.data;
      const newSpecData = {
        id: serverData?.id || Date.now(),
        spec_name: specData.spec_name,
        spec_value: specData.spec_value
      };

      setSpecs([...specs, newSpecData]);
      setNewSpec({ spec_name: "", spec_value: "" });
      showToast("Thêm thông số thành công");
    } catch (err) {
      showToast("Lỗi khi thêm thông số", "error");
      console.error("Add spec error:", err);
    }
  };

  const handleAddPolicy = async () => {
    if (!newPolicy.policy_type.trim() || !newPolicy.content.trim()) {
      showToast("Vui lòng nhập đầy đủ loại và nội dung chính sách", "error");
      return;
    }

    try {
      const policyData = {
        product_id: id,
        policy_type: newPolicy.policy_type.trim(),
        content: newPolicy.content.trim()
      };

      const response = await requestAPI({
        method: "POST",
        url: "/products/policies/add",
        data: policyData
      });

      // Extract ID from response, use the exact data we sent
      const serverData = response?.data?.data || response?.data;
      const newPolicyData = {
        id: serverData?.id || Date.now(),
        policy_type: policyData.policy_type,
        content: policyData.content
      };

      setPolicies([...policies, newPolicyData]);
      setNewPolicy({ policy_type: "", content: "" });
      showToast("Thêm chính sách thành công");
    } catch (err) {
      showToast("Lỗi khi thêm chính sách", "error");
      console.error("Add policy error:", err);
    }
  };

  const handleRemoveVariant = async (index) => {
    const v = variants[index];
    if (v.isNew) {
      setVariants(variants.filter((_, i) => i !== index));
      return;
    }

    setDeleteModal({ isOpen: true, itemType: "variant", itemId: v.id, itemIndex: index, isDeleting: false });
  };

  const handleDeleteSpec = async (specId) => {
    setDeleteModal({ isOpen: true, itemType: "spec", itemId: specId, isDeleting: false });
  };

  const handleDeletePolicy = async (policyId) => {
    setDeleteModal({ isOpen: true, itemType: "policy", itemId: policyId, isDeleting: false });
  };

  const confirmDelete = async () => {
    const { itemType, itemId, itemIndex } = deleteModal;
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      if (itemType === "variant") {
        await requestAPI({ method: "DELETE", url: `/products/variants/${itemId}` });
        setVariants(variants.filter((_, i) => i !== itemIndex));
        showToast("Xóa biến thể thành công!");
      } else if (itemType === "spec") {
        await requestAPI({ method: "DELETE", url: `/products/specs/${itemId}` });
        setSpecs(specs.filter(s => s.id !== itemId));
        showToast("Xóa thông số thành công");
      } else if (itemType === "policy") {
        await requestAPI({ method: "DELETE", url: `/products/policies/${itemId}` });
        setPolicies(policies.filter(p => p.id !== itemId));
        showToast("Xóa chính sách thành công");
      } else if (itemType === "comment") {
        await requestAPI({ method: "DELETE", url: `/comments/delete/${itemId}` });
        showToast("Xóa thành công");
        const parentId = deleteModal.parentId;
        if (parentId) {
          setCommentReplies(prev => ({
            ...prev,
            [parentId]: (prev[parentId] || []).filter(r => r.id !== itemId)
          }));
          setProductComments(prev => prev.map(c => c.id === parentId ? { ...c, replies_count: Math.max(0, c.replies_count - 1)} : c));
          
          if ((commentReplies[parentId]?.length || 0) <= 1) {
            const newExpanded = new Set(expandedRows);
            newExpanded.delete(parentId);
            setExpandedRows(newExpanded);
          }
        } else {
          setProductComments(prev => prev.filter(c => c.id !== itemId));
        }
      }
      setDeleteModal({ isOpen: false, itemType: null, itemId: null, isDeleting: false });
    } catch (err) {
      showToast("Lỗi khi xóa", "error");
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-brandOrange/20 border-t-brandOrange rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        title={
          deleteModal.itemType === "variant" ? "Xóa biến thể" :
          deleteModal.itemType === "spec" ? "Xóa thông số" :
          deleteModal.itemType === "comment" ? "Xóa bình luận" :
          "Xóa chính sách"
        }
        message={
          deleteModal.itemType === "variant" ? "Bạn có chắc chắn muốn xóa biến thể này không? Hành động này không thể hoàn tác." :
          deleteModal.itemType === "spec" ? "Bạn có chắc chắn muốn xóa thông số này không?" :
          deleteModal.itemType === "comment" ? "Hành động này sẽ xóa vĩnh viễn bình luận/phản hồi này. Bạn có chắc chắn không?" :
          "Bạn có chắc chắn muốn xóa chính sách này không?"
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, itemType: null, itemId: null, isDeleting: false })}
        isLoading={deleteModal.isDeleting}
      />

      <form onSubmit={handleSubmit(onUpdateProduct)} id="editProductForm">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <nav className="flex text-[10px] text-gray-400 mb-2 font-bold tracking-widest uppercase">
              <Link to="/admin" className="hover:text-brandOrange transition">Admin</Link>
              <span className="mx-2 text-gray-300">/</span>
              <Link to="/admin/products" className="hover:text-brandOrange transition">Sản phẩm</Link>
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-primary">Chỉnh sửa</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
              Cập nhật sản phẩm
              <span className="bg-orange-50 text-brandOrange text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-orange-100 italic">ID: #{id}</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 bg-white border border-gray-100 shadow-soft hover:bg-gray-50 transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-brandOrange shadow-[0_8px_20px_rgba(249,115,22,0.3)] hover:bg-orange-600 transition-all flex items-center gap-2 ${isSaving ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Đang lưu...
                </>
              ) : "Lưu thay đổi"}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-2xl p-1 shadow-soft border border-gray-50 mb-8 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "general" ? "bg-brandOrange text-white shadow-lg shadow-orange-100" : "text-gray-400 hover:text-primary hover:bg-gray-50"}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Thông tin chung
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("comments")}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "comments" ? "bg-brandOrange text-white shadow-lg shadow-orange-100" : "text-gray-400 hover:text-primary hover:bg-gray-50"}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            Bình luận
            {productComments.length > 0 && <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${activeTab === "comments" ? "bg-white text-brandOrange" : "bg-gray-100 text-gray-400"}`}>{productComments.length}</span>}
          </button>
        </div>

        {activeTab === "general" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[32px] p-8 shadow-soft border border-gray-50 space-y-8">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brandOrange rounded-full"></span>
                Thông tin cơ bản
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              

                <div className="space-y-2 md:col-span-2">
                  <input
                    type="text"
                    {...register("name", { required: "Tên sản phẩm không được trống" })}
                    onChange={(e) => { register("name").onChange(e); setNameError(""); }}
                    onBlur={(e) => { register("name").onBlur(e); checkDuplicateName(e.target.value); }}
                    placeholder="Nhập tên sản phẩm..."
                    className={`w-full px-5 py-4 rounded-2xl border bg-white focus:outline-none focus:ring-4 focus:ring-brandOrange/5 transition text-sm font-bold text-primary ${nameError ? "border-red-400 focus:border-red-400" : "border-gray-100 focus:border-brandOrange"}`}
                  />
                  {errors.name && <small className="text-red-500 text-xs font-bold pl-1">{errors.name.message}</small>}
                  {nameError && <small className="text-red-500 text-xs font-bold pl-1 flex items-center gap-1">⚠ {nameError}</small>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Danh mục</label>
                  <select
                    {...register("category_id", { required: "Vui lòng chọn danh mục" })}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white focus:outline-none focus:ring-4 focus:ring-brandOrange/5 focus:border-brandOrange transition text-sm font-bold text-primary appearance-none"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category_id && <small className="text-red-500 text-xs font-bold pl-1">{errors.category_id.message}</small>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Thương hiệu</label>
                  <select
                    {...register("brand_id")}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white focus:outline-none focus:ring-4 focus:ring-brandOrange/5 focus:border-brandOrange transition text-sm font-bold text-primary appearance-none"
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Giá bán cơ bản</label>
                  <div className="relative">
                    <input
                      type="number"
                      {...register("base_price", { required: "Giá không được trống" })}
                      placeholder="0"
                      className="w-full pl-5 pr-12 py-4 rounded-2xl border border-gray-100 bg-white focus:outline-none focus:ring-4 focus:ring-brandOrange/5 focus:border-brandOrange transition text-sm font-bold text-brandOrange"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">₫</span>
                  </div>
                  {errors.base_price && <small className="text-red-500 text-xs font-bold pl-1">{errors.base_price.message}</small>}
                </div>
                

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Trạng thái (status)</label>
                  <select
                    {...register("status")}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white focus:outline-none focus:ring-4 focus:ring-brandOrange/5 focus:border-brandOrange transition text-sm font-bold text-primary appearance-none"
                  >
                    <option value="1">Đang kinh doanh</option>
                    <option value="0">Tạm dừng</option>
                  </select>
                </div>
                  <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Mô tả ngắn </label>
                  <textarea
                    {...register("short_description", { required: "Mô tả ngắn không được để trống", minLength: { value: 10, message: "Mô tả ngắn phải ít nhất 10 ký tự" } })}
                    placeholder="Tóm tắt nhanh về sản phẩm (tối thiểu 10 ký tự)..."
                    rows={2}
                    className={`w-full px-5 py-4 rounded-2xl border bg-white focus:outline-none focus:ring-4 focus:ring-brandOrange/5 transition text-sm font-medium text-primary resize-none ${errors.short_description ? "border-red-400 focus:border-red-400" : "border-gray-100 focus:border-brandOrange"}`}
                  ></textarea>
                  {errors.short_description && <small className="text-red-500 text-xs font-bold pl-1">{errors.short_description.message}</small>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Nội dung chi tiết </label>
                  <div className="bg-white rounded-2xl border border-gray-100 focus-within:border-brandOrange focus-within:ring-4 focus-within:ring-brandOrange/5 transition overflow-hidden">
                    <CKEditor
                      editor={ClassicEditor}
                      data={detailContent}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setDetailContent(data);
                        setValue("detail_content", data); // Update form value
                      }}
                      config={{
                        toolbar: [
                          "heading",
                          "|",
                          "bold",
                          "italic",
                          "link",
                          "bulletedList",
                          "numberedList",
                          "|",
                          "blockQuote",
                          "undo",
                          "redo",
                        ],
                        placeholder: "Nhập nội dung chi tiết sản phẩm (tối thiểu 20 ký tự)...",
                      }}
                    />
                  </div>
                  {errors.detail_content && <small className="text-red-500 text-xs font-bold pl-1">{errors.detail_content.message}</small>}
                </div>
              </div>
            </div>
      {/* Specs Card */}
            <div className="bg-white rounded-[32px] p-8 shadow-soft border border-gray-50 space-y-6">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                Thông số kỹ thuật
              </h2>
              <div className="space-y-4">
                {specs.length === 0 ? (
                  <p className="text-gray-400 italic text-sm">Chưa có thông số</p>
                ) : (
                  specs.map((s, i) => (
                    <div key={i} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-purple-200 transition-colors">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <span className="text-xs font-bold text-gray-600">{s.spec_name}</span>
                        <span className="text-xs font-medium text-gray-800">{s.spec_value}</span>
                      </div>
                      <button type="button" onClick={() => handleDeleteSpec(s.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex-shrink-0" title="Xóa thông số">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  ))
                )}
                <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Tên TH (VD: Chất liệu)" value={newSpec.spec_name} onChange={e => setNewSpec({...newSpec, spec_name: e.target.value})} className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-white transition" />
                    <input type="text" placeholder="Giá trị (VD: Cotton)" value={newSpec.spec_value} onChange={e => setNewSpec({...newSpec, spec_value: e.target.value})} className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-white transition" />
                  </div>
                  <button type="button" onClick={handleAddSpec} className="px-4 py-2.5 rounded-xl text-xs font-bold text-purple-500 bg-purple-50 hover:bg-purple-100 transition-all flex items-center gap-2 justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                    Thêm thông số
                  </button>
                </div>
              </div>
            </div>

            {/* Policies Card */}
            <div className="bg-white rounded-[32px] p-8 shadow-soft border border-gray-50 space-y-6">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                Chính sách
              </h2>
              <div className="space-y-4">
                {policies.length === 0 ? (
                  <p className="text-gray-400 italic text-sm">Chưa có chính sách</p>
                ) : (
                  policies.map((p, i) => (
                    <div key={i} className="flex flex-col gap-3 bg-gray-50 p-5 rounded-xl border border-gray-100 hover:border-emerald-200 transition-colors relative">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <span className="text-xs font-bold text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-lg inline-block">{p.policy_type}</span>
                          <p className="text-sm font-medium text-gray-800 mt-2 break-words">{p.content}</p>
                        </div>
                        <button type="button" onClick={() => handleDeletePolicy(p.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex-shrink-0" title="Xóa chính sách">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
                <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-gray-100">
                  <input type="text" placeholder="Loại (VD: Đổi trả, Bảo hành)" value={newPolicy.policy_type} onChange={e => setNewPolicy({...newPolicy, policy_type: e.target.value})} className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 bg-white transition" />
                  <textarea placeholder="Nội dung chính sách..." rows="2" value={newPolicy.content} onChange={e => setNewPolicy({...newPolicy, content: e.target.value})} className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 bg-white transition resize-none"></textarea>
                  <button type="button" onClick={handleAddPolicy} className="px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-500 bg-emerald-50 hover:bg-emerald-100 transition-all flex items-center gap-2 justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                    Thêm chính sách
                  </button>
                </div>
              </div>
            </div>
            {/* Variants Card */}
            <div className="bg-white rounded-[32px] p-8 shadow-soft border border-gray-50 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                  Biến thể sản phẩm
                </h2>
                <button
                  type="button"
                  onClick={handleAddVariantRow}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-blue-500 bg-blue-50 hover:bg-blue-100 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                  Thêm biến thể
                </button>
              </div>

              <div className="space-y-4">
                {variants.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 italic text-sm border-2 border-dashed border-gray-100 rounded-2xl">
                    Sản phẩm chưa có biến thể nào. Click nút trên để thêm.
                  </div>
                ) : (
                  variants.map((v, index) => (
                    <div key={index} className="relative border border-gray-100 rounded-2xl p-5 hover:border-blue-200 transition-colors bg-gray-50/30">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-lg">Biến thể #{index + 1}</span>
                          {v.isNew && <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">Mới</span>}
                          {!v.isNew && v.isDirty && <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">Đã sửa</span>}
                          {!v.isNew && v.id && <span className="text-[10px] text-gray-300 font-mono">ID: {v.id}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          {v.isNew && (
                            <button
                              type="button"
                              onClick={() => handleSaveNewVariant(index)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                              title="Lưu biến thể mới"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </button>
                          )}
                          {!v.isNew && v.isDirty && (
                            <button
                              type="button"
                              onClick={() => handleUpdateVariant(index)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                              title="Cập nhật biến thể"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(index)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Tên biến thể */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tên biến thể</label>
                          <input
                            type="text"
                            value={v.name}
                            onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                            onBlur={() => checkVariantName(index, v.name)}
                            placeholder="Tên biến thể"
                            className={`w-full px-3 py-2.5 rounded-xl border outline-none text-xs font-bold bg-white transition ${v.variantNameError ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-brandOrange"}`}
                          />
                          {v.variantNameError && <small className="text-red-500 text-[10px] font-bold flex items-center gap-1">⚠ {v.variantNameError}</small>}
                        </div>

                        {/* Giá */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Giá (₫)</label>
                          <input
                            type="number"
                            value={v.price}
                            onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-brandOrange outline-none text-xs font-bold text-brandOrange bg-white"
                          />
                        </div>

                        {/* Màu sắc */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Màu sắc</label>
                          <input
                            type="text"
                            list={`color-list-edit-${index}`}
                            value={v.color_name}
                            onChange={(e) => handleVariantChange(index, "color_name", e.target.value)}
                            onBlur={(e) => checkColorName(index, e.target.value)}
                            placeholder="Nhập màu..."
                            className={`w-full px-3 py-2.5 rounded-xl border outline-none text-xs font-bold bg-white ${v.colorNameError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-brandOrange'}`}
                          />
                          {v.colorNameError && <p className="text-red-500 text-[10px] font-bold">{v.colorNameError}</p>}
                          <datalist id={`color-list-edit-${index}`}>
                            {colorValues.map((c) => <option key={c.id} value={c.value} />)}
                          </datalist>
                        </div>

                        {/* Kích thước */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kích thước</label>
                          <input
                            type="text"
                            list={`size-list-edit-${index}`}
                            value={v.size_name}
                            onChange={(e) => handleVariantChange(index, "size_name", e.target.value)}
                            onBlur={(e) => checkSizeName(index, e.target.value)}
                            placeholder="Nhập kích thước..."
                            className={`w-full px-3 py-2.5 rounded-xl border outline-none text-xs font-bold bg-white ${v.sizeNameError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-brandOrange'}`}
                          />
                          {v.sizeNameError && <p className="text-red-500 text-[10px] font-bold">{v.sizeNameError}</p>}
                          <datalist id={`size-list-edit-${index}`}>
                            {sizeValues.map((s) => <option key={s.id} value={s.value} />)}
                          </datalist>
                        </div>

                        {/* Ảnh biến thể */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ảnh biến thể</label>
                          <div className="flex gap-2 items-start">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleVariantImageUpload(e, index)}
                              className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 focus:border-brandOrange outline-none text-xs font-medium bg-white file:bg-brandOrange file:text-white file:border-0 file:px-2 file:py-1 file:rounded file:font-bold file:cursor-pointer file:text-[10px]"
                            />
                            {v.variant_image && (
                              <img src={v.variant_image} alt="" title="Click để xem" className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0 cursor-pointer hover:opacity-75" onClick={() => window.open(v.variant_image, '_blank')} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
      

          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Image Section */}
            <div className="bg-white rounded-[32px] p-8 shadow-soft border border-gray-50 space-y-6">
              <h2 className="text-lg font-bold text-primary">Ảnh sản phẩm</h2>

              <div className="space-y-4">
                <div className="aspect-square w-full rounded-2xl bg-secondary/10 border-2 border-dashed border-gray-100 overflow-hidden relative group">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      <span className="text-xs font-bold mt-2">Chưa có ảnh</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white rounded-xl text-[10px] font-bold text-primary shadow-lg">Tải ảnh lên</button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Tải ảnh sản phẩm</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white focus:border-brandOrange outline-none text-[11px] font-medium file:bg-brandOrange file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:font-bold file:cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Hint Card */}
            <div className="bg-gradient-to-br from-brandOrange to-orange-400 rounded-[32px] p-8 text-white space-y-4 shadow-xl shadow-orange-200">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h3 className="text-lg font-bold">Lưu ý khi cập nhật</h3>
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                Biến thể mới thêm cần nhấn nút ✓ (lưu) để lưu vào hệ thống. Thay đổi thông tin cơ bản chỉ cần nhấn "Lưu thay đổi" phía trên.
              </p>
            </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[40px] p-8 shadow-soft border border-gray-50 flex flex-col gap-8 animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-primary flex items-center gap-3">
                  <span className="w-2 h-8 bg-brandOrange rounded-full"></span>
                  Phản hồi khách hàng
                </h2>
                <p className="text-xs font-bold text-gray-400">Kiểm duyệt bình luận và đánh giá sản phẩm</p>
              </div>

              <div className="flex bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100 self-start">
                <button
                  type="button"
                  onClick={() => { setFeedbackType("comment"); setFeedbackPagination(p => ({ ...p, page: 1 })); }}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 ${feedbackType === "comment" ? "bg-white text-brandOrange shadow-soft" : "text-gray-400 hover:text-primary"}`}
                >
                  Bình luận (Q&A)
                </button>
                <button
                  type="button"
                  onClick={() => { setFeedbackType("review"); setFeedbackPagination(p => ({ ...p, page: 1 })); }}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 ${feedbackType === "review" ? "bg-white text-brandOrange shadow-soft" : "text-gray-400 hover:text-primary"}`}
                >
                  Đánh giá (Reviews)
                </button>
              </div>
            </div>

            {isCommentsLoading ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-brandOrange/20 border-t-brandOrange rounded-full animate-spin mx-auto"></div>
                <p className="text-sm font-black text-gray-400">Đang tải dữ liệu...</p>
              </div>
            ) : productComments.length === 0 ? (
              <div className="py-20 text-center bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold italic">Chưa có {feedbackType === "comment" ? "bình luận" : "đánh giá"} nào cho sản phẩm này.</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-6">
                  {productComments.map((c) => (
                    <div key={c.id} className="space-y-4">
                      {/* Main Feedback item */}
                      <div className={`p-6 rounded-[32px] transition-all border ${expandedRows.has(c.id) ? "bg-gray-50/30 border-brandOrange/10" : "bg-white border-gray-50 hover:border-brandOrange/20"}`}>
                        <div className="flex items-start gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-brandOrange/10 text-brandOrange flex items-center justify-center font-black text-lg shrink-0">
                            {c.user_name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-3">
                                  <span className="font-black text-primary">{c.user_name || "Ẩn danh"}</span>
                                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{new Date(c.created_at).toLocaleDateString("vi-VN")}</span>
                                </div>
                                {feedbackType === "review" && (
                                  <div className="flex items-center gap-0.5 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                      <svg key={i} className={`w-3.5 h-3.5 ${i < c.rating ? "fill-yellow-400" : "fill-gray-200"}`} viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {feedbackType === "comment" && (
                                  <button type="button" onClick={() => handleDeleteComment(c.id)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                  </button>
                                )}
                              </div>
                            </div>

                            <p className="text-sm text-secondary-text leading-relaxed font-bold">{c.content || c.comment}</p>
                            
                            <div className="flex flex-wrap items-center gap-6 pt-2">
                              {feedbackType === "comment" && (
                                <div className="flex items-center gap-3">
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={c.is_approved === 1} onChange={() => handleToggleCommentStatus(c.id, "is_approved", c.is_approved === 1 ? 0 : 1)} className="sr-only peer" />
                                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                  </label>
                                  <span className={`text-[10px] font-black uppercase tracking-wider ${c.is_approved === 1 ? "text-emerald-500" : "text-gray-300"}`}>{c.is_approved === 1 ? "Đã duyệt" : "Chờ duyệt"}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" checked={(feedbackType === "comment" ? c.id_visible : c.is_visible) === 1} onChange={() => handleToggleCommentStatus(c.id, feedbackType === "comment" ? "id_visible" : "is_visible", (feedbackType === "comment" ? c.id_visible : c.is_visible) === 1 ? 0 : 1)} className="sr-only peer" />
                                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                                </label>
                                <span className={`text-[10px] font-black uppercase tracking-wider ${(feedbackType === "comment" ? c.id_visible : c.is_visible) === 1 ? "text-blue-500" : "text-gray-300"}`}>{(feedbackType === "comment" ? c.id_visible : c.is_visible) === 1 ? "Hiển thị" : "Bị ẩn"}</span>
                              </div>

                              {feedbackType === "comment" && c.replies_count > 0 && (
                                <button type="button" onClick={() => toggleRow(c.id)} className="text-[10px] font-black text-brandOrange hover:underline flex items-center gap-1">
                                  {expandedRows.has(c.id) ? "Đóng phản hồi" : `Xem ${c.replies_count} phản hồi`}
                                  <svg className={`w-3 h-3 transition-transform ${expandedRows.has(c.id) ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Section (Replies + Reply Form) */}
                      {expandedRows.has(c.id) && (
                        <div className="ml-16 space-y-6 border-l-2 border-gray-100 pl-8 py-2 animate-slide-up">
                          {/* Existing Replies List */}
                          {commentReplies[c.id]?.length > 0 && (
                            <div className="space-y-6">
                              {commentReplies[c.id].map((reply) => (
                                <div key={reply.id} className="flex flex-col gap-3 relative before:absolute before:w-6 before:h-[2px] before:bg-gray-100 before:-left-8 before:top-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-primary uppercase">
                                        {reply.user_name?.charAt(0) || "A"}
                                      </div>
                                      <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-black text-primary">{reply.user_name || "Admin"}</span>
                                          {reply.user_role === 1 && <span className="px-2 py-0.5 bg-blue-500 text-white text-[7px] font-black rounded-lg uppercase tracking-tighter">Admin</span>}
                                        </div>
                                        <span className="text-[9px] font-bold text-gray-400">{new Date(reply.created_at).toLocaleDateString("vi-VN")}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                      <div className="flex items-center gap-3">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                          <input type="checkbox" checked={reply.id_visible === 1} onChange={() => handleToggleCommentStatus(reply.id, "id_visible", reply.id_visible === 1 ? 0 : 1, c.id)} className="sr-only peer" />
                                          <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-500"></div>
                                        </label>
                                        <span className={`text-[9px] font-black uppercase tracking-wider ${reply.id_visible === 1 ? "text-blue-500" : "text-gray-300"}`}>Hiển thị</span>
                                      </div>
                                      <button type="button" onClick={() => handleDeleteComment(reply.id, c.id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                      </button>
                                    </div>
                                  </div>
                                  <div className="bg-white p-4 rounded-2xl border border-gray-100 text-xs text-secondary-text leading-relaxed font-bold">
                                    {reply.content}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Trigger Reply Button or Form */}
                          {replyTo !== c.id ? (
                            <button
                              type="button"
                              onClick={() => setReplyTo(c.id)}
                              className="text-[10px] font-black text-brandOrange hover:bg-orange-50 px-4 py-2 rounded-xl transition-all flex items-center gap-2 w-fit -ml-2"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                              Viết phản hồi...
                            </button>
                          ) : (
                            <div className="p-6 bg-orange-50/30 border border-brandOrange/20 rounded-[32px] animate-slide-up space-y-4">
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-brandOrange tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-brandOrange"></span>
                                Phản hồi bình luận
                              </div>
                              <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Nhập nội dung phản hồi từ Admin..."
                                className="w-full p-4 rounded-2xl border border-gray-100 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-brandOrange/5 focus:border-brandOrange transition-all resize-none"
                                rows="2"
                              ></textarea>
                              <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => { setReplyTo(null); setReplyContent(""); }} className="px-5 py-2 text-xs font-bold text-gray-400 hover:text-primary">Hủy</button>
                                <button 
                                  type="button" 
                                  onClick={handleReplyComment}
                                  disabled={!replyContent.trim() || isSaving}
                                  className="px-6 py-2 bg-brandOrange text-white text-xs font-black rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-100 disabled:opacity-50 transition-all flex items-center gap-2"
                                >
                                  {isSaving ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : null}
                                  Gửi phản hồi
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Feedback Pagination */}
                {feedbackPagination.total_pages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-50 font-sans">
                    {Array.from({ length: feedbackPagination.total_pages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFeedbackPagination(prev => ({ ...prev, page: p }))}
                        className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${feedbackPagination.page === p ? "bg-brandOrange text-white shadow-lg shadow-orange-100" : "text-gray-400 hover:bg-gray-50 hover:text-primary"}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default EditProduct;
