import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import requestAPI from "../../../../api/index.jsx";
import Toast from "../../../ui/common/Toast";

const EditProfile = () => {
    const navigate = useNavigate();
    // Trạng thái loading khi gọi API
    const [loading, setLoading] = useState(true);
    // Trạng thái đang lưu
    const [saving, setSaving] = useState(false);
    // Lưu thông tin user để hiển thị sidebar
    const [userData, setUserData] = useState(null);
    // Toast thông báo
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fullName: "",
            phone: "",
            email: "",
            address: "",
        },
    });

    // Lấy thông tin profile từ API khi component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await requestAPI({ method: "GET", url: "/users/profile" });
                const profile = res.data.data;
                setUserData(profile);
                reset({
                    fullName: profile.full_name || "",
                    phone: profile.phone || "",
                    email: profile.email || "",
                    address: profile.address || "",
                });
            } catch (error) {
                console.error("Lỗi khi lấy thông tin profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [reset]);

    const onSaveProfile = async (data) => {
        try {
            setSaving(true);
            await requestAPI({
                method: "PUT",
                url: "/users/profile",
                data: {
                    full_name: data.fullName,
                    phone: data.phone,
                    address: data.address,
                },
            });
            setToast({ show: true, message: "Cập nhật thông tin thành công!", type: "success" });
            setTimeout(() => navigate("/profile"), 1500);
        } catch (error) {
            console.error("Lỗi khi cập nhật profile:", error);
            setToast({ show: true, message: error.message || "Cập nhật thất bại!", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100">
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />
            <div className="flex items-center justify-between mb-8 px-1">
                <h2 className="text-2xl font-bold text-primary">Chỉnh sửa thông tin cá nhân</h2>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSaveProfile)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-textMuted px-1">Họ và tên</label>
                            <input
                                {...register("fullName", {
                                    required: {
                                        value: true,
                                        message: "Họ và tên không được để trống",
                                    },
                                    minLength: {
                                        value: 2,
                                        message: "Họ và tên phải có ít nhất 2 ký tự",
                                    },
                                })}
                                type="text"
                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-secondary transition text-sm"
                            />
                            {errors.fullName && (
                                <small className="text-red-500 text-sm">{errors.fullName.message}</small>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-textMuted px-1">Số điện thoại</label>
                            <input
                                {...register("phone", {
                                    required: {
                                        value: true,
                                        message: "Số điện thoại không được để trống",
                                    },
                                    pattern: {
                                        value: /^(\+84|0)\d{9}$/,
                                        message: "Số điện thoại không hợp lệ",
                                    },
                                })}
                                type="tel"
                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-secondary transition text-sm"
                            />
                            {errors.phone && (
                                <small className="text-red-500 text-sm">{errors.phone.message}</small>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-textMuted px-1">Địa chỉ Email</label>
                            <input
                                {...register("email")}
                                type="email"
                                className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 transition text-sm cursor-not-allowed"
                                readOnly
                            />
                            <span className="text-xs text-textMuted px-1">Email không thể thay đổi</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-textMuted px-1">Địa chỉ</label>
                            <input
                                {...register("address", {
                                    required: {
                                        value: true,
                                        message: "Địa chỉ không được để trống",
                                    },
                                    minLength: {
                                        value: 5,
                                        message: "Địa chỉ phải có ít nhất 5 ký tự",
                                    },
                                })}
                                type="text"
                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-secondary transition text-sm"
                            />
                            {errors.address && (
                                <small className="text-red-500 text-sm">{errors.address.message}</small>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-orange-500 text-white px-10 py-4 rounded-xl font-bold hover:bg-primary transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                        <Link
                            to="/profile"
                            className="px-8 py-4 rounded-xl border border-gray-200 text-sm font-bold text-textMuted hover:bg-gray-100 hover:text-primary transition duration-300"
                        >
                            Hủy
                        </Link>
                    </div>
                </form>
            )}
        </div>
    );
};

export default EditProfile;
