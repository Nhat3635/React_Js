import React from "react";
import { Link, useLocation } from "react-router-dom";

const NotFoundPage = () => {
  const location = useLocation();
  const message = location.state?.message || "Trang bạn tìm không tồn tại.";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full bg-white border border-gray-100 rounded-[24px] shadow-soft p-10 text-center">
        <p className="text-6xl font-black text-brandOrange leading-none">404</p>
        <h1 className="mt-4 text-2xl font-bold text-primary">Không tìm thấy trang</h1>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/admin/orders"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-100 hover:bg-gray-50 transition"
          >
            Quay về đơn hàng
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-brandOrange hover:bg-orange-600 transition"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;