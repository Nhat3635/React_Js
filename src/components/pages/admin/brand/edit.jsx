import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Toast from "../../../ui/common/Toast";
import requestAPI from "../../../../api";

const EditBrand = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        name: "",
        description: "",
    });
    const [errors, setErrors] = React.useState({});
    const [brands, setBrands] = React.useState([]); // Để kiểm tra trùng tên
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [toast, setToast] = React.useState({
        show: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [brandRes, brandsRes] = await Promise.all([
                    requestAPI({ method: "GET", url: `/brands/${id}` }),
                    requestAPI({ method: "GET", url: "/brands/list" })
                ]);
                
                const brand = brandRes?.data?.data || brandRes?.data;
                if (brand) {
                    setFormData({
                        name: brand.name || "",
                        description: brand.description || "",
                    });
                }
                setBrands(brandsRes?.data?.data || brandsRes?.data || []);
            } catch (err) {
                showToast(err.message || "Không thể tải thông tin thương hiệu", "error");
                setTimeout(() => navigate("/admin/brands"), 2000);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, navigate]);

    const validateField = (name, value) => {
        let error = "";
        if (name === "name") {
            if (!value.trim()) {
                error = "Tên thương hiệu không được để trống";
            } else if (value.trim().length < 2) {
                error = "Tên thương hiệu phải có ít nhất 2 ký tự";
            } else if (brands.some(b => b.name.toLowerCase() === value.trim().toLowerCase() && String(b.id) !== String(id))) {
                error = "Tên thương hiệu này đã tồn tại ở bản ghi khác";
            }
        } else if (name === "description") {
            if (!value.trim()) {
                error = "Mô tả không được để trống";
            }
        }
        setErrors(prev => ({ ...prev, [name]: error }));
        return !error;
    };

    const validateAll = () => {
        const nameValid = validateField("name", formData.name);
        const descValid = validateField("description", formData.description);
        return nameValid && descValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateAll()) {
            showToast("Vui lòng kiểm tra lại thông tin", "error");
            return;
        };

        try {
            setIsSubmitting(true);
            await requestAPI({
                method: "PUT",
                url: `/brands/${id}`,
                data: formData,
            });
            showToast("Cập nhật thương hiệu thành công");
            setTimeout(() => navigate("/admin/brands"), 1500);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Cập nhật thương hiệu thất bại";
            showToast(errorMsg, "error");
            if (errorMsg.includes("Tên")) setErrors(prev => ({ ...prev, name: errorMsg }));
            if (errorMsg.includes("Mô tả")) setErrors(prev => ({ ...prev, description: errorMsg }));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-brandOrange/20 border-t-brandOrange rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-gray-400">Đang tải thông tin...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
                        Chỉnh sửa thương hiệu
                    </h1>
                    <p className="text-sm text-gray-400 mt-1 font-medium">
                        Cập nhật thông tin chi tiết cho thương hiệu #{id}.
                    </p>
                </div>
                <Link
                    to="/admin/brands"
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Quay lại
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[24px] shadow-soft border border-gray-50 p-8 space-y-8">
                <div className="space-y-6">
                    {/* Tên thương hiệu */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary ml-1">Tên thương hiệu <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value });
                                if (errors.name) setErrors({ ...errors, name: "" });
                            }}
                            onBlur={(e) => validateField("name", e.target.value)}
                            className={`w-full px-5 py-3.5 bg-secondary/30 border ${errors.name ? "border-red-500 bg-red-50" : "border-gray-100"} rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition-all`}
                            placeholder="Ví dụ: Nike, Samsung, Apple..."
                        />
                        {errors.name && <p className="text-xs font-bold text-red-500 ml-1 flex items-center gap-1">⚠ {errors.name}</p>}
                    </div>

                    {/* Mô tả */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary ml-1">Mô tả thương hiệu <span className="text-red-500">*</span></label>
                        <textarea
                            rows="5"
                            value={formData.description}
                            onChange={(e) => {
                                setFormData({ ...formData, description: e.target.value });
                                if (errors.description) setErrors({ ...errors, description: "" });
                            }}
                            onBlur={(e) => validateField("description", e.target.value)}
                            className={`w-full px-5 py-3.5 bg-secondary/30 border ${errors.description ? "border-red-500 bg-red-50" : "border-gray-100"} rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition-all resize-none`}
                            placeholder="Nhập giới thiệu ngắn về thương hiệu..."
                        />
                        {errors.description && <p className="text-xs font-bold text-red-500 ml-1 flex items-center gap-1">⚠ {errors.description}</p>}
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/brands")}
                        className="px-8 py-3.5 rounded-xl text-sm font-bold text-gray-400 hover:bg-gray-50 transition-all border border-transparent"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3.5 bg-brandOrange text-white rounded-xl font-bold text-sm shadow-[0_8px_16px_rgba(249,115,22,0.2)] hover:bg-orange-600 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                            </svg>
                        )}
                        {isSubmitting ? "Đang cập nhật..." : "Cập nhật thương hiệu"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditBrand;
