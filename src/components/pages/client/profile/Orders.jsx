import { useState, useEffect } from "react";
import requestAPI from "../../../../api/index.jsx";

const statusMap = {
    Pending: { label: "Chờ xử lý", bg: "bg-yellow-50", text: "text-yellow-600", dot: "bg-yellow-500" },
    Processing: { label: "Đang xử lý", bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
    Shipped: { label: "Đang giao", bg: "bg-indigo-50", text: "text-indigo-600", dot: "bg-indigo-500" },
    Delivered: { label: "Đã giao", bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500" },
    Cancelled: { label: "Đã hủy", bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const res = await requestAPI({ method: "GET", url: "/orders/my-orders" });
                setOrders(res.data.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    };

    const formatCurrency = (amount) => {
        return Number(amount).toLocaleString("vi-VN") + "₫";
    };

    const renderStatusBadge = (status) => {
        const s = statusMap[status] || { label: status, bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-500" };
        return (
            <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full ${s.bg} ${s.text} font-medium text-xs`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                {s.label}
            </span>
        );
    };

    const filteredOrders = orders.filter(o => statusFilter === "All" || o.order_status === statusFilter);

    return (
        <div id="tabOrders" className="profile-content bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 px-1 gap-4">
                <h2 className="text-2xl font-bold text-primary">Đơn hàng của tôi</h2>
                <div className="flex bg-secondary p-1 rounded-xl overflow-x-auto max-w-full no-scrollbar">
                    {["All", ...Object.keys(statusMap)].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                                statusFilter === status
                                    ? "bg-white text-orange-500 shadow-sm"
                                    : "text-textMuted hover:text-primary"
                            }`}
                        >
                            {status === "All" ? "Tất cả" : statusMap[status].label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-16">
                    <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    <p className="text-textMuted text-sm">Không có đơn hàng nào khớp với yêu cầu</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-sm text-textMuted uppercase tracking-wider">
                                <th className="py-4 px-2 font-medium">Mã đơn hàng</th>
                                <th className="py-4 px-2 font-medium">Ngày đặt</th>
                                <th className="py-4 px-2 font-medium">Tổng tiền</th>
                                <th className="py-4 px-2 font-medium">Thanh toán</th>
                                <th className="py-4 px-2 font-medium">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-primary">
                            {filteredOrders.map((order, index) => (
                                <tr key={order.id} className={`${index < filteredOrders.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50 transition`}>
                                    <td className="py-5 px-2 font-semibold">#{order.id}</td>
                                    <td className="py-5 px-2 text-textMuted">{formatDate(order.created_at)}</td>
                                    <td className="py-5 px-2 font-semibold">{formatCurrency(order.total_amount)}</td>
                                    <td className="py-5 px-2 text-textMuted">{order.payment_method || "—"}</td>
                                    <td className="py-5 px-2">{renderStatusBadge(order.order_status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Orders;
