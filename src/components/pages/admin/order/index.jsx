import React from 'react';
import { Link } from 'react-router-dom';

const OrderManagement = () => {
    const orders = [
        { id: 'ORD-0891', customer: 'Trần An', date: '28/03/2026', total: '12.500.000 ₫', status: 'Đang xử lý', payment: 'Thanh toán khi nhận hàng' },
        { id: 'ORD-0890', customer: 'Lê Thị Mai', date: '27/03/2026', total: '24.000.000 ₫', status: 'Hoàn thành', payment: 'Chuyển khoản' },
        { id: 'ORD-0889', customer: 'Phạm Vượng', date: '26/03/2026', total: '1.800.000 ₫', status: 'Đang giao', payment: 'VNPay' },
        { id: 'ORD-0888', customer: 'Nguyễn Tâm', date: '25/03/2026', total: '15.200.000 ₫', status: 'Chờ thanh toán', payment: 'Momo' },
        { id: 'ORD-0887', customer: 'Hoàng Long', date: '24/03/2026', total: '8.400.000 ₫', status: 'Đã hủy', payment: 'Thanh toán khi nhận hàng' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Đang xử lý': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'Hoàn thành': return 'bg-green-50 text-green-600 border-green-100';
            case 'Đang giao': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Chờ thanh toán': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'Đã hủy': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

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
                            className="w-64 pl-4 pr-10 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange shadow-soft outline-none transition-all" 
                            placeholder="Mã đơn, khách hàng..." 
                        />
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                    <select className="bg-white border border-gray-100 text-gray-500 text-sm rounded-xl focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange block p-2.5 shadow-soft outline-none">
                        <option>Tất cả trạng thái</option>
                        <option>Đang xử lý</option>
                        <option>Đang giao</option>
                        <option>Hoàn thành</option>
                        <option>Đã hủy</option>
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
                            {orders.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="p-5 pl-8 font-bold text-sm text-primary">{item.id}</td>
                                    <td className="p-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-primary">{item.customer}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-sm text-gray-500">{item.date}</td>
                                    <td className="p-5 text-sm font-extrabold text-primary">{item.total}</td>
                                    <td className="p-5 text-xs text-gray-400 font-medium">{item.payment}</td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-5 pr-8 text-right">
                                        <Link to="/admin/orders/detail" className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-brandOrange hover:text-white text-gray-400 rounded-lg transition-all text-xs font-bold">
                                            Chi tiết
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">Hiển thị 5 đơn hàng mới nhất</span>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-100 text-gray-400 disabled:opacity-30" disabled>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-100 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderManagement;
