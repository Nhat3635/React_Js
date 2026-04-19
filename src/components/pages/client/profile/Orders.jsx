import { useState, useEffect } from "react";
import requestAPI from "../../../../api/index.jsx";

const statusMap = {
    pending: { label: "Chờ xác nhận", bg: "bg-yellow-50", text: "text-yellow-600", dot: "bg-yellow-500" },
    processing: { label: "Đang xử lý", bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
    shipped: { label: "Đang giao", bg: "bg-indigo-50", text: "text-indigo-600", dot: "bg-indigo-500" },
    delivered: { label: "Hoàn thành", bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500" },
    cancelled: { label: "Đã hủy", bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [loadingId, setLoadingId] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

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

    const fetchOrderDetail = async (orderId) => {
        try {
            setDetailLoading(true);
            setLoadingId(orderId);
            const res = await requestAPI({ method: "GET", url: `/orders/detail/${orderId}` });
            setSelectedOrder(res.data.data);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
            showToast("Không thể tải chi tiết đơn hàng", "error");
        } finally {
            setDetailLoading(false);
            setLoadingId(null);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;
        
        try {
            await requestAPI({ method: "PUT", url: `/orders/cancel/${orderId}` });
            showToast("Đã hủy đơn hàng thành công!");
            setSelectedOrder(null);
            const res = await requestAPI({ method: "GET", url: "/orders/my-orders" });
            setOrders(res.data.data || []);
        } catch (error) {
            console.error("Lỗi khi hủy đơn hàng:", error);
            showToast(error.response?.data?.message || "Lỗi khi hủy đơn hàng!", "error");
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    const formatCurrency = (amount) => {
        return Number(amount || 0).toLocaleString("vi-VN") + "₫";
    };

    const normalizeStatusKey = (status) => {
        const normalized = String(status || "").trim().toLowerCase();

        if (normalized === "pending" || normalized === "chờ xác nhận" || normalized === "chờ thanh toán") return "pending";
        if (normalized === "processing" || normalized === "đang xử lý") return "processing";
        if (normalized === "shipped" || normalized === "đang giao") return "shipped";
        if (normalized === "delivered" || normalized === "hoàn thành" || normalized === "đã giao") return "delivered";
        if (normalized === "cancelled" || normalized === "canceled" || normalized === "đã hủy") return "cancelled";

        return "unknown";
    };

    const renderStatusBadge = (status) => {
        const statusKey = normalizeStatusKey(status);
        const s = statusMap[statusKey] || { label: "Không xác định", bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-500" };
        return (
            <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full ${s.bg} ${s.text} font-medium text-xs`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                {s.label}
            </span>
        );
    };

    const filteredOrders = orders.filter((o) => statusFilter === "All" || normalizeStatusKey(o.order_status) === statusFilter);

    return (
        <div id="tabOrders" className="profile-content bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100 relative">
            {/* Custom Toast */}
            {toast && (
                <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[2000] px-6 py-3 rounded-2xl shadow-xl border animate-in slide-in-from-top duration-300 font-bold text-sm flex items-center gap-2 ${
                    toast.type === "success" ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                }`}>
                    {toast.type === "success" ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    )}
                    {toast.message}
                </div>
            )}

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
                            {status === "All" ? "Tất cả" : statusMap[status]?.label}
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
                                <th className="py-4 px-2 font-medium text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-primary">
                            {filteredOrders.map((order, index) => (
                                <tr key={order.id} className={`${index < filteredOrders.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50 transition`}>
                                    <td className="py-5 px-2 font-semibold">#{order.id}</td>
                                    <td className="py-5 px-2 text-textMuted">{formatDate(order.created_at).split(',')[0]}</td>
                                    <td className="py-5 px-2 font-semibold text-orange-600">{formatCurrency(order.total_amount)}</td>
                                    <td className="py-5 px-2 text-textMuted">{order.payment_method || "—"}</td>
                                    <td className="py-5 px-2">{renderStatusBadge(order.order_status)}</td>
                                    <td className="py-5 px-2 text-right">
                                        <button 
                                            onClick={() => fetchOrderDetail(order.id)}
                                            disabled={detailLoading}
                                            className="min-w-[105px] text-orange-500 hover:text-orange-700 font-bold transition text-xs border border-orange-200 hover:border-orange-500 px-3 py-1.5 rounded-lg disabled:opacity-50"
                                        >
                                            {loadingId === order.id ? "Đang tải..." : "Xem chi tiết"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedOrder && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
                    <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl relative flex flex-col">
                        {/* Fixed Header */}
                        <div className="p-6 md:p-8 pb-4 flex justify-between items-center border-b border-gray-50 bg-white z-10">
                            <div>
                                <h3 className="text-xl font-bold text-primary">Chi tiết đơn hàng #{selectedOrder.id}</h3>
                                <p className="text-sm text-textMuted mt-1">{formatDate(selectedOrder.created_at)}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Scrollable Content wrapper to protect rounded corners */}
                        <div className="flex-1 overflow-y-auto px-1">
                            <div className="p-6 md:p-8 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-gray-50 p-5 rounded-2xl">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-textMuted mb-3">Người nhận</h4>
                                        <p className="font-bold text-sm mb-1">{selectedOrder.full_name || selectedOrder.user_name}</p>
                                        <p className="text-sm text-textMuted mb-1">{selectedOrder.phone || "—"}</p>
                                        <p className="text-sm text-textMuted line-clamp-2">{selectedOrder.shipping_address || selectedOrder.address || "—"}</p>
                                    </div>
                                    <div className="bg-gray-50 p-5 rounded-2xl">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-textMuted mb-3">Thanh toán</h4>
                                        <p className="font-bold text-sm mb-1">{selectedOrder.payment_method || "COD"}</p>
                                        <div className="mt-2 text-sm">
                                            Trạng thái: {renderStatusBadge(selectedOrder.order_status)}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-textMuted mb-4">Sản phẩm</h4>
                                    <div className="space-y-4">
                                        {selectedOrder.items?.map((item) => (
                                            <div key={item.id} className="flex gap-4 items-center">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                                                    <img 
                                                        src={item.image || "https://placehold.co/100x100?text=No+Image"} 
                                                        alt={item.product_name} 
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = "https://placehold.co/100x100?text=Error" }}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="font-bold text-sm line-clamp-1">{item.product_name}</h5>
                                                    <p className="text-xs text-textMuted mt-1">
                                                        {item.sku ? `SKU: ${item.sku} | ` : ''}Số lượng: {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-sm">{formatCurrency(item.price_at_purchase)}</p>
                                                    <p className="text-[10px] text-textMuted mt-0.5">Thành tiền: {formatCurrency(item.price_at_purchase * item.quantity)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6 mt-4 pb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm text-textMuted">Tạm tính</p>
                                        <p className="text-sm font-medium">{formatCurrency(selectedOrder.total_amount)}</p>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="text-sm text-textMuted">Phí vận chuyển</p>
                                        <p className="text-sm font-medium">Miễn phí</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-lg font-bold">Tổng cộng</p>
                                        <p className="text-xl font-black text-orange-600 font-secondary">{formatCurrency(selectedOrder.total_amount)}</p>
                                    </div>
                                    
                                    {selectedOrder.order_status === 'Pending' && (
                                        <div className="mt-6">
                                            <button 
                                                onClick={() => handleCancelOrder(selectedOrder.id)}
                                                className="w-full bg-red-50 text-red-600 hover:bg-red-100 font-bold py-3 rounded-2xl transition"
                                            >
                                                Hủy đơn hàng
                                            </button>
                                            <p className="text-[10px] text-center text-textMuted mt-2 italic">
                                                (*) Chỉ có thể hủy đơn hàng khi trạng thái là "Chờ xử lý"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
