import React from "react";
import { Link } from "react-router-dom";
import requestAPI from "../../../../api";

const OrderManagement = () => {
  const [orders, setOrders] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const pageSize = 8;

  const normalizeStatus = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "processing" || normalized === "đang xử lý") {
      return "Đang xử lý";
    }
    if (normalized === "shipped" || normalized === "đang giao") {
      return "Đang giao";
    }
    if (normalized === "delivered" || normalized === "hoàn thành") {
      return "Hoàn thành";
    }
    if (normalized === "pending" || normalized === "chờ thanh toán") {
      return "Chờ thanh toán";
    }
    if (normalized === "cancelled" || normalized === "đã hủy") {
      return "Đã hủy";
    }

    return "Không xác định";
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Đang xử lý":
        return "bg-orange-50 text-orange-600 border-orange-100";
      case "Hoàn thành":
        return "bg-green-50 text-green-600 border-green-100";
      case "Đang giao":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Chờ thanh toán":
        return "bg-purple-50 text-purple-600 border-purple-100";
      case "Đã hủy":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  const formatCurrency = (value) => {
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return "-";

    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numericValue);
  };

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat("vi-VN").format(date);
  };

  const displayOrderCode = (id) => {
    if (typeof id === "string" && id.startsWith("ORD-")) return id;

    const numericId = Number(id);
    if (Number.isNaN(numericId)) return String(id || "-");

    return `ORD-${String(numericId).padStart(4, "0")}`;
  };

  const loadOrders = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await requestAPI({
        method: "GET",
        url: "/orders/admin/list",
      });

      const payload = response?.data;
      const normalizedOrders = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : [];

      setOrders(normalizedOrders);
    } catch (err) {
      setError(err.message || "Khong the tai danh sach don hang");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = (Array.isArray(orders) ? orders : []).filter((item) => {
    const keyword = searchText.trim().toLowerCase();
    const orderCode = displayOrderCode(item.id).toLowerCase();
    const customerName = String(
      item.customer_name || item.customer || item.full_name || item?.user?.full_name || "",
    ).toLowerCase();
    const mappedStatus = normalizeStatus(item.order_status || item.status);

    const matchesKeyword = !keyword || orderCode.includes(keyword) || customerName.includes(keyword);
    const matchesStatus = statusFilter === "all" || mappedStatus === statusFilter;

    return matchesKeyword && matchesStatus;
  });

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchText, statusFilter, orders.length]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (safeCurrentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (safeCurrentPage >= totalPages - 2) {
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [safeCurrentPage - 2, safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, safeCurrentPage + 2];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Quản lý đơn hàng</h1>
          <p className="text-sm text-gray-400 mt-1 font-medium">Theo dõi và cập nhật trạng thái vận chuyển cho khách hàng.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-64 pl-4 pr-10 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange shadow-soft outline-none transition-all"
              placeholder="Mã đơn, khách hàng..."
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-100 text-gray-500 text-sm rounded-xl focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange block p-2.5 shadow-soft outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Đang giao">Đang giao</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Chờ thanh toán">Chờ thanh toán</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[24px] shadow-soft border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
                <th className="p-5 pl-8">Mã đơn</th>
                <th className="p-5">Khách hàng</th>
                <th className="p-5">Ngày đặt</th>
                <th className="p-5">Tổng tiền</th>
                <th className="p-5">Thanh toán</th>
                <th className="p-5">Trạng thái</th>
                <th className="p-5 pr-8 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-sm text-gray-500">
                    Dang tai danh sach don hang...
                  </td>
                </tr>
              )}

              {!isLoading && error && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-sm text-red-500">
                    {error}
                  </td>
                </tr>
              )}

              {!isLoading && !error && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-sm text-gray-500">
                    Khong co don hang nao.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !error &&
                paginatedOrders.map((item) => {
                  const displayStatus = normalizeStatus(item.order_status || item.status);
                  const customerName =
                    item.customer_name || item.customer || item.full_name || item?.user?.full_name || "-";

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="p-5 pl-8 font-bold text-sm text-primary">{displayOrderCode(item.id)}</td>
                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-primary">{customerName}</span>
                        </div>
                      </td>
                      <td className="p-5 text-sm text-gray-500">{formatDate(item.created_at || item.date)}</td>
                      <td className="p-5 text-sm font-extrabold text-primary">{formatCurrency(item.total_amount || item.total)}</td>
                      <td className="p-5 text-xs text-gray-400 font-medium">{item.payment_method || item.payment || "-"}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(displayStatus)}`}>
                          {displayStatus}
                        </span>
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <Link
                          to={`/admin/orders/detail/${item.id}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-brandOrange hover:text-white text-gray-400 rounded-lg transition-all text-xs font-bold"
                        >
                          Chi tiết
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">
            Trang {safeCurrentPage} / {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-100 text-gray-400 hover:border-brandOrange hover:text-brandOrange transition-all disabled:opacity-20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>

            {visiblePages.map((page) => {
              const isActive = page === safeCurrentPage;
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${
                    isActive
                      ? "bg-brandOrange text-white shadow-md"
                      : "border border-gray-100 text-gray-400 hover:text-brandOrange hover:border-brandOrange"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-100 text-gray-400 hover:border-brandOrange hover:text-brandOrange transition-all disabled:opacity-20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;