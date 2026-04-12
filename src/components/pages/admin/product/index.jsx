import React from "react";
import { Link } from "react-router-dom";
import requestAPI from "../../../../api";
import Toast from "../../../ui/common/Toast";
import DeleteConfirmationModal from "../../../ui/common/DeleteModal";

const ProductManagement = () => {
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("Tất cả danh mục");
  const [selectedStatus, setSelectedStatus] = React.useState("Tất cả trạng thái");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [pendingDeleteId, setPendingDeleteId] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 10;
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

  const loadData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      // Fetch products and categories in parallel
      const [productsRes, categoriesRes] = await Promise.all([
        requestAPI({ method: "GET", url: "/products/list" }),
        requestAPI({ method: "GET", url: "/categories/list" }),
      ]);

      const productsPayload = productsRes?.data;
      const normalizedProducts = Array.isArray(productsPayload?.data)
        ? productsPayload.data
        : Array.isArray(productsPayload)
          ? productsPayload
          : [];

      const categoriesPayload = categoriesRes?.data;
      const normalizedCategories = Array.isArray(categoriesPayload?.data)
        ? categoriesPayload.data
        : Array.isArray(categoriesPayload)
          ? categoriesPayload
          : [];

      setProducts(normalizedProducts);
      setCategories(normalizedCategories);
    } catch (err) {
      setError(err.message || "Không thể tải danh sách sản phẩm");
      showToast(err.message || "Lỗi tải dữ liệu", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedCategory, selectedStatus]);

  const onDelete = async (id) => {
    try {
      setIsDeleting(true);
      await requestAPI({
        method: "DELETE",
        url: `/products/${id}`,
      });
      setProducts((prev) => prev.filter((item) => item.id !== id));
      showToast("Xóa sản phẩm thành công");
      setPendingDeleteId(null);
    } catch (err) {
      showToast(err.message || "Xóa sản phẩm thất bại", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProducts = products.filter((item) => {
    const keyword = searchText.trim().toLowerCase();
    const matchesSearch =
      !keyword ||
      item.name?.toLowerCase().includes(keyword) ||
      String(item.id).includes(keyword);

    const matchesCategory =
      selectedCategory === "Tất cả danh mục" ||
      item.category_name === selectedCategory;

    const matchesStatus =
      selectedStatus === "Tất cả trạng thái" ||
      (selectedStatus === "Còn hàng" && (item.status === 1 || item.status === "1")) ||
      (selectedStatus === "Hết hàng" && (item.status === 0 || item.status === "0"));

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);
  };

  const getStatusStyle = (status) => {
    const isActive = status === 1 || status === "1" || status === "Hoạt động";
    if (isActive)
      return "bg-green-100/60 text-green-600 border border-green-200";
    return "bg-red-100/60 text-red-600 border border-red-200";
  };

  return (
    <div className="space-y-6">
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      {/* 1. Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
            Quản lý sản phẩm
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-medium">
            Quản lý danh sách sản phẩm và kho hàng của bạn.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400 group-focus-within:text-brandOrange transition-colors"
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
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="block w-64 pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange shadow-soft transition-all"
              placeholder="Tìm sản phẩm..."
            />
          </div>

          {/* Filters */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white border border-gray-100 text-gray-500 text-sm rounded-xl focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange block p-2.5 shadow-soft transition-all outline-none"
          >
            <option>Tất cả trạng thái</option>
            <option>Còn hàng</option>
            <option>Hết hàng</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-gray-100 text-gray-500 text-sm rounded-xl focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange block p-2.5 shadow-soft transition-all outline-none min-w-[160px]"
          >
            <option>Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Primary CTA */}
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
            Thêm sản phẩm mới
          </Link>
        </div>
      </div>

      {/* 2. Product Table */}
      <div className="bg-white rounded-[24px] shadow-soft border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-[0.1em] font-bold">
                <th className="p-5 pl-8">ID</th>
                <th className="p-5">Hình ảnh</th>
                <th className="p-5">Thông tin sản phẩm</th>
                <th className="p-5">Danh mục</th>
                <th className="p-5">Thương hiệu</th>
                <th className="p-5">Giá cơ bản</th>
                <th className="p-5 text-center">Trạng thái</th>
                <th className="p-5 pr-8 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-brandOrange/20 border-t-brandOrange rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">Đang tải danh sách sản phẩm...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-red-500 text-sm font-medium">
                    {error}
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-gray-400 text-sm font-medium">
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/30 transition-colors group"
                  >
                    <td className="p-5 pl-8">
                      <span className="text-sm font-semibold text-gray-400 font-mono">
                        #{item.id}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm bg-secondary border border-gray-100">
                        <img
                          src={item.image || item.thumbnail || "https://placehold.co/100x100?text=SP"}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-primary group-hover:text-brandOrange transition-colors max-w-[200px] truncate">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-secondary text-primary">
                        {item.category_name || "Chưa phân loại"}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        {item.brand_name || "N/A"}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className="text-sm font-extrabold text-brandOrange">
                        {formatCurrency(item.base_price)}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase border ${getStatusStyle(
                          item.status
                        )}`}
                      >
                        {item.status === 1 || item.status === "1" ? "Còn hàng" : "Hết hàng"}
                      </span>
                    </td>
                    <td className="p-5 pr-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/edit/${item.id}`}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-orange-50 hover:text-brandOrange transition-all"
                          title="Sửa"
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
                          onClick={() => setPendingDeleteId(item.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                          title="Xóa"
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 3. Pagination */}
        {!isLoading && !error && filteredProducts.length > 0 && (
          <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
              Hiển thị <span className="text-primary font-bold">{paginatedProducts.length}</span> trên tổng <span className="text-primary font-bold">{filteredProducts.length}</span> sản phẩm
            </span>
            
            {totalPages > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                      currentPage === page
                        ? "bg-brandOrange text-white shadow-[0_4px_10px_rgba(249,115,22,0.3)]"
                        : "border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-primary"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!pendingDeleteId}
        title="Xác nhận xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan."
        onConfirm={() => onDelete(pendingDeleteId)}
        onCancel={() => setPendingDeleteId(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProductManagement;

