import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const OrderDetail = () => {
    const navigate = useNavigate();
    const [orderStatus, setOrderStatus] = useState('Đang xử lý');

    const order = {
        id: 'ORD-0891',
        date: '28/03/2026 14:30',
        customer: {
            name: 'Trần An',
            email: 'tranan@email.com',
            phone: '0901 234 567',
            address: '123 Đường Láng, Đống Đa, Hà Nội'
        },
        items: [
            { id: 1, name: 'Ghế Sofa Minimalist', price: '12.500.000 ₫', quantity: 1, subtotal: '12.500.000 ₫', color: 'Xám khói' },
            { id: 2, name: 'Đèn Trang Trí Đứng', price: '1.800.000 ₫', quantity: 2, subtotal: '3.600.000 ₫', color: 'Vàng sồi' },
        ],
        summary: {
            subtotal: '16.100.000 ₫',
            shipping: '250.000 ₫',
            discount: '1.000.000 ₫',
            total: '15.350.000 ₫'
        },
        payment: 'Thanh toán khi nhận hàng (COD)',
    };

    const statusOptions = ['Đang xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy', 'Chờ thanh toán'];

    return (
        <div className="space-y-6 pb-20">
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
                        <Link to="/admin" className="hover:text-brandOrange transition">Admin</Link>
                        <span className="mx-2 text-gray-300">/</span>
                        <Link to="/admin/orders" className="hover:text-brandOrange transition">Đơn hàng</Link>
                        <span className="mx-2 text-gray-300">/</span>
                        <span className="text-primary font-bold">Chi tiết #{order.id}</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Chi tiết đơn hàng</h1>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                            orderStatus === 'Hoàn thành' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                            {orderStatus}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/admin/orders')}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-white border border-gray-100 shadow-soft hover:bg-gray-50 transition"
                    >
                        Quay lại
                    </button>
                    <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brandOrange shadow-[0_8px_16px_rgba(249,115,22,0.2)] hover:bg-orange-600 transition">
                        Lưu trạng thái
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Order details & Status */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Status Management */}
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-brandOrange rounded-full"></span>
                            Quản lý trạng thái
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            {statusOptions.map((opt) => (
                                <button 
                                    key={opt}
                                    onClick={() => setOrderStatus(opt)}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                                        orderStatus === opt 
                                        ? 'bg-primary text-white border-primary shadow-md' 
                                        : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-primary/30'
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="bg-white rounded-[24px] shadow-soft border border-gray-50 overflow-hidden px-8 py-8 space-y-6">
                        <h2 className="text-lg font-bold text-primary">Danh sách sản phẩm</h2>
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
                                    {order.items.map((item) => (
                                        <tr key={item.id} className="group">
                                            <td className="p-4 pl-0 py-5">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-primary">{item.name}</span>
                                                    <span className="text-[11px] text-gray-400 mt-1 uppercase font-medium">Bản: {item.color}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-500">{item.price}</td>
                                            <td className="p-4 text-center font-bold text-primary">x{item.quantity}</td>
                                            <td className="p-4 pr-0 text-right font-extrabold text-primary">{item.subtotal}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Summary */}
                        <div className="flex justify-end pt-6 border-t border-gray-50">
                            <div className="w-64 space-y-3">
                                <div className="flex justify-between text-sm text-gray-500 font-medium">
                                    <span>Tạm tính</span>
                                    <span>{order.summary.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 font-medium">
                                    <span>Phí giao hàng</span>
                                    <span>{order.summary.shipping}</span>
                                </div>
                                <div className="flex justify-between text-sm text-red-500 font-medium italic">
                                    <span>Giảm giá</span>
                                    <span>-{order.summary.discount}</span>
                                </div>
                                <div className="flex justify-between text-base font-extrabold text-primary pt-3 border-t border-gray-100">
                                    <span>Tổng cộng</span>
                                    <span className="text-brandOrange">{order.summary.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Delivery Info */}
                <div className="space-y-8">
                    {/* Delivery Info */}
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <h2 className="text-lg font-bold text-primary">Thông tin giao hàng</h2>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Người nhận</p>
                                <p className="text-sm font-bold text-primary">{order.customer.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Số điện thoại</p>
                                <p className="text-sm font-medium text-gray-500">{order.customer.phone}</p>
                            </div>
                            <div className="space-y-1 pt-2">
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Địa chỉ giao hàng</p>
                                <p className="text-sm font-medium text-gray-500 leading-relaxed">{order.customer.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-primary">Thanh toán</h2>
                            <span className="text-[10px] bg-green-50 text-green-600 font-bold px-3 py-1 rounded-full border border-green-100 uppercase">Đã thanh toán</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-orange-500 shadow-sm">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-primary">{order.payment}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5 whitespace-nowrap">Mã GD: #PAY-992100342</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-xl bg-secondary/30 border border-gray-50 text-center">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Ngày GD</p>
                                    <p className="text-xs font-bold text-primary mt-1">28/03/2026</p>
                                </div>
                                <div className="p-3 rounded-xl bg-secondary/30 border border-gray-50 text-center">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Loại</p>
                                    <p className="text-xs font-bold text-primary mt-1">Trả trước 100%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Logs (Static) */}
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <h2 className="text-lg font-bold text-primary">Lịch sử đơn hàng</h2>
                        <div className="space-y-4 relative pl-4 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
                            <div className="relative">
                                <div className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-brandOrange ring-4 ring-orange-50"></div>
                                <p className="text-xs font-bold text-primary">Đã xác nhận thanh toán</p>
                                <p className="text-[10px] text-gray-400">28/03/2026 - 15:00</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-gray-200"></div>
                                <p className="text-xs font-bold text-gray-400">Khách hàng đặt đơn</p>
                                <p className="text-[10px] text-gray-400">28/03/2026 - 14:30</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
