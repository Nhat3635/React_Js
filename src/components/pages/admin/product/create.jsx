import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import requestAPI from "../../../../api";
import Toast from "../../../ui/common/Toast";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colorValues, setColorValues] = useState([]);
  const [sizeValues, setSizeValues] = useState([]);
  const [variants, setVariants] = useState([{ sku: "", price: 0, stock_quantity: 0, variant_image: "", color_value_id: "", size_value_id: "", skuError: "" }]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [nameError, setNameError] = useState("");
  const [allProducts, setAllProducts] = useState([]);

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
        const colRes = await requestAPI({ method: "GET", url: `/products/attributes/values/${colorAttr.id}` }).catch(() => ({ data: [] }));
        setColorValues(Array.isArray(colRes?.data?.data) ? colRes.data.data : Array.isArray(colRes?.data) ? colRes.data : []);
      }
      if (sizeAttr) {
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

  const checkVariantSku = (index, sku) => {
    const updated = [...variants];
    const val = (sku || "").trim();
    if (!val) {
      updated[index].skuError = "Mã SKU không được trống";
    } else if (variants.some((v, i) => i !== index && v.sku.toLowerCase().trim() === val.toLowerCase())) {
      updated[index].skuError = "Mã SKU trùng với biến thể khác";
    } else {
      updated[index].skuError = "";
    }
    setVariants(updated);
    return updated[index].skuError;
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
          const val = (v.sku || "").trim();
          if (!val) {
            updatedVariants[index].skuError = "Mã SKU không được trống";
            hasError = true;
          } else if (updatedVariants.some((ov, i) => i !== index && ov.sku.toLowerCase().trim() === val.toLowerCase())) {
            updatedVariants[index].skuError = "Mã SKU trùng với biến thể khác";
            hasError = true;
          }
        });
        if (hasError) {
          setVariants(updatedVariants);
          showToast("Vui lòng kiểm tra lại mã SKU của các biến thể", "error");
          setIsSaving(false);
          return;
        }
      }

      const payload = {
        name: data.name,
        category_id: Number(data.category_id),
        brand_id: data.brand_id ? Number(data.brand_id) : null,
        base_price: Number(data.base_price),
        image: data.image || null,
        status: Number(data.status),
        variants: variants.map(v => {
          const attribute_value_ids = [];
          if (v.color_value_id) attribute_value_ids.push(Number(v.color_value_id));
          if (v.size_value_id) attribute_value_ids.push(Number(v.size_value_id));
          return {
            sku: v.sku,
            price: Number(v.price) || 0,
            stock_quantity: Number(v.stock_quantity) || 0,
            variant_image: v.variant_image || null,
            attribute_value_ids,
          };
        }),
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

      showToast("Tạo sản phẩm thành công!");
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      console.error("Create Error:", err);
      const errorMsg = err.response?.data?.message || err.message || "";
      
      // Specifically catch "duplicate name" error — show inline under input
      if (errorMsg.toLowerCase().includes("trùng tên") || errorMsg.toLowerCase().includes("already exists") || errorMsg.toLowerCase().includes("duplicate")) {
        if (errorMsg.toLowerCase().includes("sku") || errorMsg.toLowerCase().includes("biến thể")) {
          showToast("Có mã SKU đã tồn tại trong hệ thống, vui lòng kiểm tra lại", "error");
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
    setVariants([...variants, { sku: "", price: 0, stock_quantity: 0, variant_image: "", color_value_id: "", size_value_id: "", skuError: "" }]);
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    if (field === 'sku') {
      updated[index].skuError = "";
    }
    setVariants(updated);
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
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Tên sản phẩm</label>
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
                        {/* SKU */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mã SKU</label>
                          <input
                            type="text"
                            value={v.sku}
                            onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                            onBlur={() => checkVariantSku(index, v.sku)}
                            placeholder="SKU-001"
                            className={`w-full px-3 py-2.5 rounded-xl border outline-none text-xs font-bold bg-white transition ${v.skuError ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-brandOrange"}`}
                          />
                          {v.skuError && <small className="text-red-500 text-[10px] font-bold flex items-center gap-1">⚠ {v.skuError}</small>}
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

                        {/* Số lượng kho */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Số lượng kho</label>
                          <input
                            type="number"
                            value={v.stock_quantity}
                            onChange={(e) => handleVariantChange(index, "stock_quantity", e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-brandOrange outline-none text-xs font-bold text-center bg-white"
                          />
                        </div>

                        {/* Màu sắc */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Màu sắc</label>
                          <select
                            value={v.color_value_id}
                            onChange={(e) => handleVariantChange(index, "color_value_id", e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-brandOrange outline-none text-xs font-bold bg-white appearance-none"
                          >
                            <option value="">-- Chọn màu --</option>
                            {colorValues.map((c) => (
                              <option key={c.id} value={c.id}>{c.value}</option>
                            ))}
                          </select>
                        </div>

                        {/* Kích thước */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kích thước</label>
                          <select
                            value={v.size_value_id}
                            onChange={(e) => handleVariantChange(index, "size_value_id", e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-brandOrange outline-none text-xs font-bold bg-white appearance-none"
                          >
                            <option value="">-- Chọn kích thước --</option>
                            {sizeValues.map((s) => (
                              <option key={s.id} value={s.id}>{s.value}</option>
                            ))}
                          </select>
                        </div>

                        {/* Ảnh biến thể */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ảnh biến thể (URL)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={v.variant_image}
                              onChange={(e) => handleVariantChange(index, "variant_image", e.target.value)}
                              placeholder="https://..."
                              className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 focus:border-brandOrange outline-none text-xs font-medium bg-white"
                            />
                            {v.variant_image && (
                              <img src={v.variant_image} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0" />
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
                    <button type="button" className="px-4 py-2 bg-white rounded-xl text-[10px] font-bold text-primary shadow-lg">Tải ảnh lên</button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Đường dẫn ảnh (URL)</label>
                  <input
                    type="text"
                    {...register("image")}
                    onChange={(e) => setImagePreview(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white focus:border-brandOrange outline-none text-[11px] font-medium"
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

