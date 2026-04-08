import React from "react";
import { Link } from "react-router-dom";
import Toast from "../../../ui/common/Toast";
import requestAPI from "../../../../api";

const ProductManagement = () => {
  const [products, setProducts] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [pendingDeleteId, setPendingDeleteId] = React.useState(null);
  const [toast, setToast] = React.useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = React.useCallback((message, type = "success") => {
    setToast({ show: true, message, type });
  }, []);

  const closeToast = React.useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const loadProducts = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await requestAPI({
        method: "GET",
        url: "/products/list",
      });

      const payload = response?.data;
      const normalizedProducts = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : [];

      setProducts(normalizedProducts);
    } catch (err) {
      setError(err.message || "Khong the tai danh sach san pham");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const onDelete = async (id) => {
    try {
      await requestAPI({
        method: "DELETE",
        url: `/products/${id}`,
      });
      setProducts((prev) =>
        (Array.isArray(prev) ? prev : []).filter((item) => item.id !== id),
      );
      showToast("Xoa san pham thanh cong");
    } catch (err) {
      showToast(err.message || "Xoa san pham that bai", "error");
    }
  };

  const requestDelete = (id) => {
    setPendingDeleteId(id);
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    await onDelete(pendingDeleteId);
    setPendingDeleteId(null);
  };

  const filteredProducts = (
    Array.isArray(products) ? products : []
  ).filter((item) => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return true;

    return (
      String(item.id).toLowerCase().includes(keyword) ||
      (item.name || "").toLowerCase().includes(keyword)
    );
  });

  const formatPrice = (value) => {
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return "-";

    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numericValue);
  };

  const getCategoryLabel = (item) => {
    return item.category_name || item.category || item.categoryName || "-";
  };

  return (
    <div className="space-y-6">
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
            Quản lý sản phẩm
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-medium">
            Quản lý danh sách sản phẩm của cửa hàng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-64 pl-4 pr-10 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange shadow-soft outline-none transition-all"
              placeholder="Tìm sản phẩm..."
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brandOrange transition-colors">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <Link
            to="/admin/products/create"
            className="bg-brandOrange text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_8px_16px_rgba(249,115,22,0.2)] hover:bg-orange-600 transition-all flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-[24px] shadow-soft border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
                <th className="p-5 pl-8">ID</th>
                <th className="p-5">Hình ảnh</th>
                <th className="p-5">Tên sản phẩm</th>
                <th className="p-5">Danh mục</th>
                <th className="p-5">Giá</th>
                <th className="p-5">Trạng thái</th>
                <th className="p-5 pr-8 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-sm text-gray-500"
                  >
                    Dang tai danh sach san pham...
                  </td>
                </tr>
              )}

              {!isLoading && error && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-sm text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              )}

              {!isLoading && !error && filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-sm text-gray-500"
                  >
                    Khong co san pham nao.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !error &&
                filteredProducts.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/30 transition-colors group"
                  >
                    <td className="p-5 pl-8">
                      <span className="text-xs font-bold text-gray-400">
                        #{item.id}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary shadow-sm">
                        <img
                          src={
                            item.image || "https://placehold.co/80x80?text=IMG"
                          }
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="text-sm font-bold text-primary group-hover:text-brandOrange transition-colors">
                        {item.name}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className="text-xs text-gray-500 font-medium">
                        {getCategoryLabel(item)}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className="text-sm font-bold text-brandOrange">
                        {formatPrice(item.base_price ?? item.price)}
                      </span>
                    </td>
                    <td className="p-5">
                      {(() => {
                        const isActive =
                          item.status === 1 ||
                          item.status === "1" ||
                          item.status === "Hoạt động" ||
                          item.status === "Hoat dong";

                        return (
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                              isActive
                                ? "bg-green-100/60 text-green-600 border border-green-100"
                                : "bg-gray-100 text-gray-400 border border-gray-200"
                            }`}
                          >
                            {isActive ? "Hoạt động" : "Tạm ngưng"}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="p-5 pr-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/edit/${item.id}`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-orange-50 hover:text-brandOrange transition-all"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            ></path>
                          </svg>
                        </Link>
                        <button
                          onClick={() => requestDelete(item.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {pendingDeleteId && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-primary">Xac nhan xoa san pham</h3>
            <p className="mt-2 text-sm text-gray-500">Ban co chac chan muon xoa san pham nay khong?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelDelete}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50"
              >
                Huy
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                Xoa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
