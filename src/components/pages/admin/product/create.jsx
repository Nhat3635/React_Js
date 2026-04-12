import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import requestAPI from "../../../../api";
import { uploadImageToServer } from "../../../../api/upload";
import Toast from "../../../ui/common/Toast";
import DeleteConfirmationModal from "../../../ui/common/DeleteModal";

const CreateProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colorValues, setColorValues] = useState([]);
  const [sizeValues, setSizeValues] = useState([]);
  const [variants, setVariants] = useState([{ name: "", price: 0, variant_image: "", color_name: "", size_name: "", variantNameError: "" }]);
  const [attrIds, setAttrIds] = useState({ color: null, size: null });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [nameError, setNameError] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [newSpec, setNewSpec] = useState({ spec_name: "", spec_value: "" });
  const [newPolicy, setNewPolicy] = useState({ policy_type: "", content: "" });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, itemType: null, itemId: null, isDeleting: false });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: "1",
    },
  });

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

  const loadDependencies = useCallback(async () => {
    try {
      setIsLoading(true);
      const [categoriesRes, brandsRes, attrsRes] = await Promise.all([
        requestAPI({ method: "GET", url: "/categories/list" }),
        requestAPI({ method: "GET", url: "/brands/list" }).catch(() => ({ data: [] })),
        requestAPI({ method: "GET", url: "/products/attributes/list" }).catch(() => ({ data: [] })),
      ]);

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
      showToast("Lỗi tải danh mục hoặc thương hiệu", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  // Validate duplicate name on blur
  const checkDuplicateName = useCallback((name) => {
    if (!name || name.trim() === "") {
      setNameError("");
      return;
    }
    const isDuplicate = allProducts.some(
      (p) => p.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
    if (isDuplicate) {
      setNameError(`Tên sản phẩm "${name.trim()}" đã tồn tại!`);
    } else {
      setNameError("");
    }
  }, [allProducts]);

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

  useEffect(() => {
    loadDependencies();
  }, [loadDependencies]);

  const onCreateProduct = async (data) => {
    try {
      setIsSaving(true);

      // Re-check duplicate (safety net)
      const isDuplicate = allProducts.some(p =>
        p.name.toLowerCase().trim() === data.name.toLowerCase().trim()
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

      // Basic validation for variants
      if (variants.length > 0) {
        let hasError = false;
        const updatedVariants = [...variants];
        updatedVariants.forEach((v, index) => {
          const val = (v.name || "").trim();
          if (!val) {
            updatedVariants[index].variantNameError = "Tên biến thể không được trống";
            hasError = true;
          } else if (updatedVariants.some((ov, i) => i !== index && ov.name?.toLowerCase().trim() === val.toLowerCase())) {
            updatedVariants[index].variantNameError = "Tên biến thể trùng với biến thể khác";
            hasError = true;
          }
        });
        if (hasError) {
          setVariants(updatedVariants);
          showToast("Vui lòng kiểm tra lại tên của các biến thể", "error");
          setIsSaving(false);
          return;
        }
      }

      // Resolve attributes
      const finalVariants = [];
      const updatedColorValues = [...colorValues];
      const updatedSizeValues = [...sizeValues];
      let currentCAttrId = attrIds.color;
      let currentSAttrId = attrIds.size;

      for (const v of variants) {
          const attribute_value_ids = [];
          
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
          
          finalVariants.push({
            name: v.name,
            price: Number(v.price) || 0,
            variant_image: v.variant_image || null,
            attribute_value_ids,
          });
      }
      setColorValues(updatedColorValues);
      setSizeValues(updatedSizeValues);

      const payload = {
        name: data.name,
        category_id: Number(data.category_id),
        brand_id: data.brand_id ? Number(data.brand_id) : null,
        base_price: Number(data.base_price),
        image: data.image || null,
        status: Number(data.status),
        short_description: data.short_description,
        detail_content: data.detail_content,
        variants: finalVariants,
      };

      const response = await requestAPI({
        method: "POST",
        url: "/products/add",
        data: payload,
      });

      if (!response || !response.data) {
        throw new Error("Không nhận được phản hồi từ server");
      }

      if (response.data?.status === false || response.data?.error) {
        throw new Error(response.data?.message || "Lỗi từ server");
      }

      const productId = response.data?.data?.id || response.data?.id;

      // Save specs if any
      if (specs.length > 0 && productId) {
        for (const spec of specs) {
          try {
            await requestAPI({
              method: "POST",
              url: "/products/specs/add",
              data: { product_id: productId, spec_name: spec.spec_name, spec_value: spec.spec_value }
            });
          } catch (err) {
            console.log("Warning: Could not save spec", err);
          }
        }
      }

      // Save policies if any
      if (policies.length > 0 && productId) {
        for (const policy of policies) {
          try {
            await requestAPI({
              method: "POST",
              url: "/products/policies/add",
              data: { product_id: productId, policy_type: policy.policy_type, content: policy.content }
            });
          } catch (err) {
            console.log("Warning: Could not save policy", err);
          }
        }
      }

      showToast("Tạo sản phẩm thành công!");
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      console.error("Create Error:", err);
      const errorMsg = err.response?.data?.message || err.message || "";
      
      // Specifically catch "duplicate name" error — show inline under input
      if (errorMsg.toLowerCase().includes("trùng tên") || errorMsg.toLowerCase().includes("already exists") || errorMsg.toLowerCase().includes("duplicate")) {
        if (errorMsg.toLowerCase().includes("biến thể")) {
          showToast("Tên biến thể đã tồn tại trong hệ thống, vui lòng kiểm tra lại", "error");
        } else {
          setNameError("Tên sản phẩm đã tồn tại trong hệ thống");
        }
      } else {
        showToast(errorMsg || "Tạo sản phẩm thất bại", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, { name: "", price: 0, variant_image: "", color_name: "", size_name: "", variantNameError: "" }]);
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    if (field === 'name') {
      updated[index].variantNameError = "";
    }
    setVariants(updated);
  };

  const handleAddSpec = () => {
    if (!newSpec.spec_name.trim() || !newSpec.spec_value.trim()) {
      showToast("Vui lòng nhập đầy đủ tên và giá trị thông số", "error");
      return;
    }
    setSpecs([...specs, { ...newSpec, id: Date.now() }]);
    setNewSpec({ spec_name: "", spec_value: "" });
    showToast("Thêm thông số thành công");
  };

  const handleDeleteSpec = (specId) => {
    setDeleteModal({ isOpen: true, itemType: "spec", itemId: specId, isDeleting: false });
  };

  const handleAddPolicy = () => {
    if (!newPolicy.policy_type.trim() || !newPolicy.content.trim()) {
      showToast("Vui lòng nhập đầy đủ loại và nội dung chính sách", "error");
      return;
    }
    setPolicies([...policies, { ...newPolicy, id: Date.now() }]);
    setNewPolicy({ policy_type: "", content: "" });
    showToast("Thêm chính sách thành công");
  };

  const handleDeletePolicy = (policyId) => {
    setDeleteModal({ isOpen: true, itemType: "policy", itemId: policyId, isDeleting: false });
  };

  const confirmDelete = async () => {
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));
    
    try {
      if (deleteModal.itemType === "spec") {
        setSpecs(specs.filter(s => s.id !== deleteModal.itemId));
        showToast("Xóa thông số thành công");
      } else if (deleteModal.itemType === "policy") {
        setPolicies(policies.filter(p => p.id !== deleteModal.itemId));
        showToast("Xóa chính sách thành công");
      }
      
      setDeleteModal({ isOpen: false, itemType: null, itemId: null, isDeleting: false });
    } catch (err) {
      showToast("Lỗi xóa mục", "error");
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-brandOrange/20 border-t-brandOrange rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Đang chuẩn bị biểu mẫu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        title={
          deleteModal.itemType === "spec"
            ? "Xóa thông số"
            : deleteModal.itemType === "policy"
            ? "Xóa chính sách"
            : ""
        }
        message={
          deleteModal.itemType === "spec"
            ? "Bạn có chắc chắn muốn xóa thông số này? Hành động này không thể hoàn tác."
            : deleteModal.itemType === "policy"
            ? "Bạn có chắc chắn muốn xóa chính sách này? Hành động này không thể hoàn tác."
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, itemType: null, itemId: null, isDeleting: false })}
        isLoading={deleteModal.isDeleting}
      />

      <form onSubmit={handleSubmit(onCreateProduct)} id="createProductForm">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <nav className="flex text-[10px] text-gray-400 mb-2 font-bold tracking-widest uppercase">
              <Link to="/admin" className="hover:text-brandOrange transition">Admin</Link>
              <span className="mx-2 text-gray-300">/</span>
              <Link to="/admin/products" className="hover:text-brandOrange transition">Sản phẩm</Link>
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-primary">Thêm mới</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Tạo sản phẩm mới</h1>
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
                  Đang khởi tạo...
                </>
              ) : "Lưu sản phẩm"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  <textarea
                    {...register("detail_content", { required: "Nội dung chi tiết không được để trống", minLength: { value: 20, message: "Nội dung chi tiết phải ít nhất 20 ký tự" } })}
                    placeholder="Nhập nội dung chi tiết sản phẩm (tối thiểu 20 ký tự)..."
                    rows={4}
                    className={`w-full px-5 py-4 rounded-2xl border bg-white focus:outline-none focus:ring-4 focus:ring-brandOrange/5 transition text-sm font-medium text-primary resize-none ${errors.detail_content ? "border-red-400 focus:border-red-400" : "border-gray-100 focus:border-brandOrange"}`}
                  ></textarea>
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
            {/* Variants Table */}
            <div className="bg-white rounded-[32px] p-8 shadow-soft border border-gray-50 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                  Biến thể sản phẩm
                </h2>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-blue-500 bg-blue-50 hover:bg-blue-100 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                  Thêm biến thể
                </button>
              </div>

              <div className="space-y-4">
                {variants.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 italic text-sm border-2 border-dashed border-gray-100 rounded-2xl">
                    Click nút trên để thêm biến thể.
                  </div>
                ) : (
                  variants.map((v, index) => (
                    <div key={index} className="relative border border-gray-100 rounded-2xl p-5 hover:border-blue-200 transition-colors bg-gray-50/30">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-lg">Biến thể #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
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
                            list={`color-list-create-${index}`}
                            value={v.color_name}
                            onChange={(e) => handleVariantChange(index, "color_name", e.target.value)}
                            placeholder="Nhập màu..."
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-brandOrange outline-none text-xs font-bold bg-white"
                          />
                          <datalist id={`color-list-create-${index}`}>
                            {colorValues.map((c) => <option key={c.id} value={c.value} />)}
                          </datalist>
                        </div>

                        {/* Kích thước */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kích thước</label>
                          <input
                            type="text"
                            list={`size-list-create-${index}`}
                            value={v.size_name}
                            onChange={(e) => handleVariantChange(index, "size_name", e.target.value)}
                            placeholder="Nhập kích thước..."
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-brandOrange outline-none text-xs font-bold bg-white"
                          />
                          <datalist id={`size-list-create-${index}`}>
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
              <h3 className="text-lg font-bold">Lưu ý khi tạo</h3>
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                Tên sản phẩm nên bao gồm thương hiệu và tính chất nổi bật nhất để tối ưu tìm kiếm (SEO). Cấu hình ít nhất một biến thể để khách hàng có thể đặt hàng.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;

