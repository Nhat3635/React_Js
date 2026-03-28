import React from 'react';
import { Link } from 'react-router-dom';

const PaymentManagement = () => {
    const methods = [
        { id: 'PM-01', name: 'Thanh toán khi nhận hàng (COD)', description: 'Thanh toán bằng tiền mặt khi shipper giao hàng đến địa chỉ của bạn.', status: 'Hoạt động', icon: <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> },
        { id: 'PM-02', name: 'Chuyển khoản ngân hàng', description: 'Khách hàng chuyển khoản trực tiếp vào số tài khoản của công ty.', status: 'Hoạt động', icon: <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg> },
        { id: 'PM-03', name: 'Ví điện tử Momo', description: 'Tích hợp cổng thanh toán tự động qua ứng dụng Momo.', status: 'Hoạt động', icon: <div className="w-6 h-6 rounded bg-pink-500 flex items-center justify-center text-[8px] text-white font-bold">MOMO</div> },
        { id: 'PM-04', name: 'VNPay', description: 'Quét mã QR qua ứng dụng ngân hàng và ví điện tử.', status: 'Tạm ngưng', icon: <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-[7px] text-white font-bold">VNPAY</div> },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Cấu hình thanh toán</h1>
                    <p className="text-sm text-gray-400 mt-1 font-medium">Quản lý các phương thức thanh toán có sẵn trên website.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {methods.map((method) => (
                    <div key={method.id} className="bg-white rounded-[24px] p-6 shadow-soft border border-gray-50 flex flex-col justify-between hover:shadow-lg transition duration-300 group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-white transition-colors">
                                    {method.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-primary text-base">{method.name}</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">#{method.id}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                method.status === 'Hoạt động' 
                                ? 'bg-green-50 text-green-600 border border-green-100' 
                                : 'bg-gray-50 text-gray-400 border border-gray-100'
                            }`}>
                                {method.status}
                            </span>
                        </div>
                        
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">
                            {method.description}
                        </p>

                        <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                            <button className="flex-1 px-4 py-2 rounded-lg bg-gray-50 text-primary text-xs font-bold hover:bg-orange-50 hover:text-brandOrange transition shadow-sm">
                                Chỉnh sửa cấu hình
                            </button>
                            <button className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                                method.status === 'Hoạt động' ? 'text-green-500 bg-green-50 hover:bg-green-100' : 'text-gray-300 bg-gray-50 hover:bg-gray-100'
                            }`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add new method placeholder */}
                <div className="bg-secondary/20 rounded-[24px] p-6 border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4 text-center group hover:border-brandOrange/30 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-300 group-hover:text-brandOrange transition shadow-sm">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                    <div className="space-y-1">
                        <p className="font-bold text-gray-400 group-hover:text-primary transition">Thêm phương thức mới</p>
                        <p className="text-xs text-gray-300 uppercase tracking-tighter">Tích hợp thêm cổng thanh toán</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentManagement;
