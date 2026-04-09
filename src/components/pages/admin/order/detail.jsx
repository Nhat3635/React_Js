import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import requestAPI from '../../../../api';
import Toast from '../../../ui/common/Toast';

const OrderDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [orderData, setOrderData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isCancelling, setIsCancelling] = React.useState(false);
    const [loadError, setLoadError] = React.useState('');
    const [toast, setToast] = React.useState({ show: false, message: '', type: 'success' });

    const showToast = React.useCallback((message, type = 'success') => {
        setToast({ show: true, message, type });
    }, []);

    const closeToast = React.useCallback(() => {
        setToast((prev) => ({ ...prev, show: false }));
    }, []);

    const normalizeStatus = (status) => {
        const normalized = String(status || '').toLowerCase();

        if (normalized === 'processing' || normalized === 'đang xử lý') return 'Đang xử lý';
        if (normalized === 'shipped' || normalized === 'đang giao') return 'Đang giao';
        if (normalized === 'delivered' || normalized === 'hoàn thành') return 'Hoàn thành';
        if (normalized === 'cancelled' || normalized === 'canceled' || normalized === 'đã hủy') return 'Đã hủy';
        if (
            normalized === 'pending' ||
            normalized === 'chờ xác nhận' ||
            normalized === 'cho xac nhan' ||
            normalized === 'chờ thanh toán'
        ) {
            return 'Chờ xác nhận';
        }

        return 'Không xác định';
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Đang xử lý':
                return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'Đang giao':
                return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Hoàn thành':
                return 'bg-green-50 text-green-600 border-green-100';
            case 'Đã hủy':
                return 'bg-red-50 text-red-600 border-red-100';
            case 'Chờ xác nhận':
                return 'bg-purple-50 text-purple-600 border-purple-100';
            default:
                return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    const toNumeric = (value) => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const parsed = Number(value.replace(/[^\d.-]/g, ''));
            return Number.isNaN(parsed) ? 0 : parsed;
        }

        const parsed = Number(value);
        return Number.isNaN(parsed) ? 0 : parsed;
    };

    const formatCurrency = (value) => {
        const numericValue = toNumeric(value);

        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(Number.isFinite(numericValue) ? numericValue : 0);
    };

    const formatDate = (value) => {
        if (!value) return '-';

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return String(value);

        return new Intl.DateTimeFormat('vi-VN', {
            dateStyle: 'short',
            timeStyle: 'short',
        }).format(date);
    };

    const displayOrderCode = (orderId) => {
        if (typeof orderId === 'string' && orderId.startsWith('ORD-')) return orderId;

        const numericId = Number(orderId);
        if (Number.isNaN(numericId)) return String(orderId || '-');

        return `ORD-${String(numericId).padStart(4, '0')}`;
    };

    const normalizeOrder = (payload) => {
        const source = payload?.data && typeof payload.data === 'object' ? payload.data : payload;
        const nestedOrder = source?.order && typeof source.order === 'object' ? source.order : source;
        const rawItems = nestedOrder?.items || nestedOrder?.order_items || nestedOrder?.orderItems || [];

        const items = Array.isArray(rawItems)
            ? rawItems.map((item, index) => {
                  const quantity = toNumeric(item?.quantity);
                  const unitPrice = toNumeric(item?.price_at_purchase || item?.price);

                  return {
                      id: item?.id ?? `${item?.order_id || nestedOrder?.id || 'item'}-${index}`,
                      name: item?.product_name || item?.name || `Sản phẩm ${index + 1}`,
                      sku: item?.sku || '-',
                      quantity,
                      price: unitPrice,
                      subtotal: toNumeric(item?.subtotal || unitPrice * quantity),
                  };
              })
            : [];

        const subtotal = toNumeric(
            nestedOrder?.subtotal ||
            items.reduce((sum, item) => sum + toNumeric(item.subtotal), 0),
        );
        const shippingFee = toNumeric(nestedOrder?.shipping_fee || nestedOrder?.shipping || 0);
        const discount = toNumeric(nestedOrder?.discount || nestedOrder?.discount_amount || 0);
        const totalAmount = toNumeric(nestedOrder?.total_amount || subtotal + shippingFee - discount);

        return {
            id: nestedOrder?.id ?? source?.id ?? payload?.id ?? '',
            code: displayOrderCode(nestedOrder?.id ?? source?.id ?? payload?.id ?? ''),
            createdAt: nestedOrder?.created_at || nestedOrder?.date || '',
            status: normalizeStatus(nestedOrder?.order_status || nestedOrder?.status),
            paymentMethod: nestedOrder?.payment_method || '-',
            customerName: nestedOrder?.user_name || nestedOrder?.customer_name || '-',
            customerEmail: nestedOrder?.user_email || nestedOrder?.email || '-',
            customerPhone: nestedOrder?.phone || '-',
            shippingAddress: nestedOrder?.shipping_address || '-',
            note: nestedOrder?.note || '',
            items,
            subtotal,
            shippingFee,
            discount,
            totalAmount,
        };
    };

    React.useEffect(() => {
        const loadOrder = async () => {
            if (!id) {
                navigate('/404', {
                    replace: true,
                    state: {
                        message: 'Không tìm thấy đơn hàng.',
                    },
                });
                return;
            }

            setIsLoading(true);
            setLoadError('');

            try {
                const response = await requestAPI({
                    method: 'GET',
                    url: `/orders/admin/detail/${id}`,
                });
                const data = response?.data?.data || response?.data || null;

                if (!data) {
                    navigate('/404', {
                        replace: true,
                        state: {
                            message: 'Không tìm thấy đơn hàng.',
                        },
                    });
                    return;
                }

                const normalized = normalizeOrder(data);
                setOrderData(normalized);
            } catch (err) {
                const message = String(err?.message || '');
                const isNotFoundError =
                    message.includes('Không tìm thấy đơn hàng') ||
                    message.includes('404');

                if (isNotFoundError) {
                    navigate('/404', {
                        replace: true,
                        state: {
                            message: 'Không tìm thấy đơn hàng.',
                        },
                    });
                    return;
                }

                setLoadError(message || 'Không thể tải chi tiết đơn hàng.');
                setOrderData(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadOrder();
    }, [id, navigate]);

    const order = orderData;
    const displayedStatus = order?.status || 'Không xác định';
    const itemCount = Array.isArray(order?.items) ? order.items.length : 0;
    const canCancelOrder = displayedStatus === 'Chờ xác nhận';

    const handleCancelOrder = async () => {
        if (!order?.id || !canCancelOrder) {
            return;
        }

        setIsCancelling(true);
        try {
            await requestAPI({
                method: 'PUT',
                url: `/orders/admin/detail/${order.id}`,
                data: {
                    status: 'Cancelled',
                },
            });

            setOrderData((prev) => (prev ? { ...prev, status: 'Đã hủy' } : prev));
            showToast('Hủy đơn hàng thành công');
        } catch (err) {
            showToast(err.message || 'Không thể hủy đơn hàng', 'error');
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <Toast show={toast.show} message={toast.message} type={toast.type} onClose={closeToast} />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
                        <Link to="/admin" className="hover:text-brandOrange transition">Admin</Link>
                        <span className="mx-2 text-gray-300">/</span>
                        <Link to="/admin/orders" className="hover:text-brandOrange transition">Đơn hàng</Link>
                        <span className="mx-2 text-gray-300">/</span>
                        <span className="text-primary font-bold">Chi tiết #{order?.code || '...'}</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Chi tiết đơn hàng</h1>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all border ${getStatusStyle(displayedStatus)}`}>
                            {displayedStatus}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {canCancelOrder && (
                        <button
                            onClick={handleCancelOrder}
                            disabled={isCancelling}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 shadow-[0_8px_16px_rgba(239,68,68,0.2)] hover:bg-red-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isCancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
                        </button>
                    )}
                    <button 
                        onClick={() => navigate('/admin/orders')}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-white border border-gray-100 shadow-soft hover:bg-gray-50 transition"
                    >
                        Quay lại
                    </button>
                </div>
            </div>

            {isLoading && (
                <div className="p-8 text-sm text-gray-500 bg-white rounded-[24px] shadow-soft border border-gray-50">
                    Đang tải dữ liệu đơn hàng...
                </div>
            )}

            {!isLoading && loadError && (
                <div className="p-8 text-sm text-red-500 bg-white rounded-[24px] shadow-soft border border-gray-50">
                    {loadError}
                </div>
            )}

            {!isLoading && !loadError && order && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[24px] shadow-soft border border-gray-50 overflow-hidden px-8 py-8 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <h2 className="text-lg font-bold text-primary">Danh sách sản phẩm</h2>
                            <span className="text-xs font-semibold text-gray-400">{itemCount} sản phẩm</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
                                        <th className="p-4 pl-0">Sản phẩm</th>
                                        <th className="p-4">Giá</th>
                                        <th className="p-4 text-center">Số lượng</th>
                                        <th className="p-4 pr-0 text-right">Tạm tính</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {order.items.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="py-8 text-center text-gray-500">
                                                Đơn hàng chưa có sản phẩm.
                                            </td>
                                        </tr>
                                    )}

                                    {order.items.map((item) => (
                                        <tr key={item.id} className="group">
                                            <td className="p-4 pl-0 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-primary">{item.name}</span>
                                                    <span className="text-[11px] text-gray-400 uppercase font-medium">SKU: {item.sku}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-500">{formatCurrency(item.price)}</td>
                                            <td className="p-4 text-center font-bold text-primary">x{item.quantity}</td>
                                            <td className="p-4 pr-0 text-right font-extrabold text-primary">{formatCurrency(item.subtotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-gray-50">
                            <div className="w-72 space-y-3">
                                <div className="flex justify-between text-sm text-gray-500 font-medium">
                                    <span>Tạm tính</span>
                                    <span>{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 font-medium">
                                    <span>Phí giao hàng</span>
                                    <span>{formatCurrency(order.shippingFee)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-red-500 font-medium italic">
                                    <span>Giảm giá</span>
                                    <span>-{formatCurrency(order.discount)}</span>
                                </div>
                                <div className="flex justify-between text-base font-extrabold text-primary pt-3 border-t border-gray-100">
                                    <span>Tổng cộng</span>
                                    <span className="text-brandOrange">{formatCurrency(order.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <h2 className="text-lg font-bold text-primary">Thông tin đơn hàng</h2>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Mã đơn</p>
                                <p className="text-sm font-bold text-primary">#{order.code}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Ngày tạo</p>
                                <p className="text-sm font-medium text-gray-500">{formatDate(order.createdAt)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Trạng thái</p>
                                <p className="text-sm font-medium text-gray-500">{displayedStatus}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <h2 className="text-lg font-bold text-primary">Thông tin giao hàng</h2>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Người nhận</p>
                                <p className="text-sm font-bold text-primary">{order.customerName}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Email</p>
                                <p className="text-sm font-medium text-gray-500">{order.customerEmail}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Số điện thoại</p>
                                <p className="text-sm font-medium text-gray-500">{order.customerPhone}</p>
                            </div>
                            <div className="space-y-1 pt-2">
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Địa chỉ giao hàng</p>
                                <p className="text-sm font-medium text-gray-500 leading-relaxed">{order.shippingAddress}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-primary">Thanh toán</h2>
                            <span className="text-[10px] bg-green-50 text-green-600 font-bold px-3 py-1 rounded-full border border-green-100 uppercase">{order.paymentMethod}</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-orange-500 shadow-sm">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-primary">{order.paymentMethod}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5 whitespace-nowrap">Tổng thanh toán: {formatCurrency(order.totalAmount)}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-xl bg-secondary/30 border border-gray-50 text-center">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Ngày tạo</p>
                                    <p className="text-xs font-bold text-primary mt-1">{formatDate(order.createdAt)}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-secondary/30 border border-gray-50 text-center">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Trạng thái</p>
                                    <p className="text-xs font-bold text-primary mt-1">{displayedStatus}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <h2 className="text-lg font-bold text-primary">Lịch sử đơn hàng</h2>
                        <div className="space-y-4 relative pl-4 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
                            <div className="relative">
                                <div className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-brandOrange ring-4 ring-orange-50"></div>
                                <p className="text-xs font-bold text-primary">Đơn hàng được tạo</p>
                                <p className="text-[10px] text-gray-400">{formatDate(order.createdAt)}</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-gray-200"></div>
                                <p className="text-xs font-bold text-gray-400">Trạng thái hiện tại: {displayedStatus}</p>
                                <p className="text-[10px] text-gray-400">{formatDate(order.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    {order.note && (
                        <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-4">
                            <h2 className="text-lg font-bold text-primary">Ghi chú</h2>
                            <p className="text-sm text-gray-500 leading-relaxed">{order.note}</p>
                        </div>
                    )}
                </div>
            </div>
            )}
        </div>
    );
};

export default OrderDetail;
