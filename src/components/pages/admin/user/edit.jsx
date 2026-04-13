import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import requestAPI from "../../../../api";
import Toast from "../../../ui/common/Toast";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await requestAPI({
          method: "GET",
          url: `/users/${id}`,
        });

        if (response?.data) {
          const user = response.data.data;
          setUserData(user);
          reset({
            full_name: user.full_name,
            phone: user.phone,
            email: user.email,
            status: user.status,
          });
        }
      } catch (err) {
        setToast({ show: true, message: "Lỗi tải dữ liệu", type: "error" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id, reset]);

  const onUpdateUser = async (data) => {
    try {
      console.log("Dữ liệu gửi lên:", { status: Number(data.status) });

      await requestAPI({
        method: "PUT",
        url: `/users/${id}`,
        data: {
          status: Number(data.status),
        },
      });

      setToast({
        show: true,
        message: "Cập nhật trạng thái thành công!",
        type: "success",
      });

      setTimeout(() => navigate("/admin/users"), 1500);
    } catch (err) {
      console.error("Lỗi API:", err);
      setToast({
        show: true,
        message: err.response?.data?.message || "Cập nhật thất bại",
        type: "error",
      });
    }
  };

  if (isLoading)
    return <div className="p-10 text-center font-bold">Đang tải...</div>;

  return (
    <form
      className="space-y-6 pb-20"
      id="editUserForm"
      onSubmit={handleSubmit(onUpdateUser)}
    >
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
            <Link to="/admin" className="hover:text-brandOrange transition">
              Admin
            </Link>
            <span className="mx-2 text-gray-300">/</span>
            <Link
              to="/admin/users"
              className="hover:text-brandOrange transition"
            >
              Tài khoản
            </Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-primary font-bold">
              Cập nhật @{userData?.full_name}
            </span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
            Cấu hình tài khoản
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-white border border-gray-100 shadow-soft hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brandOrange shadow-lg hover:bg-orange-600 transition"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="w-1.5 h-6 bg-brandOrange rounded-full"></span>
              Thông tin cơ bản
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  {...register("full_name")}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-sm font-medium"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  {...register("phone")}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-sm font-medium"
                  readOnly
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">
                  Email (Chỉ đọc)
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-sm font-medium"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
              Trạng thái hoạt động
            </h2>
            <div className="flex gap-4">
              <select
                {...register("status")}
                className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-white focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-bold text-primary"
              >
                <option value={1}>Đang hoạt động (Kích hoạt)</option>
                <option value={0}>Đã khóa (Tạm dừng)</option>
              </select>
            </div>
            <p className="text-[11px] text-gray-400 italic font-medium">
              * Tài khoản bị khóa sẽ không thể đăng nhập vào hệ thống.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg ring-1 ring-gray-100">
              <img
                src={`https://ui-avatars.com/api/?name=${userData?.full_name}&background=random`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary">
                {userData?.full_name}
              </h3>
              <p className="text-[10px] text-gray-400 font-mono mt-1 uppercase">
                Mã số: {userData?.id}
              </p>
            </div>

            <div className="w-full pt-4 border-t border-gray-50 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium">Vai trò</span>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${userData?.role === 1 ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-gray-50 text-gray-500 border-gray-100"}`}
                >
                  {userData?.role === 1 ? "Quản trị viên" : "Khách hàng"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium">Ngày gia nhập</span>
                <span className="text-primary font-bold">
                  {userData?.created_at
                    ? new Date(userData.created_at).toLocaleDateString("vi-VN")
                    : "---"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditUser;
