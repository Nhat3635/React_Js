import React from 'react';

const SalesReport = () => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Báo cáo doanh thu</h1>
                    <p className="text-sm text-gray-400 mt-1 font-medium">Phân tích chuyên sâu về tình hình kinh doanh của SmartLiving.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:text-brandOrange hover:border-brandOrange shadow-soft transition-all flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Xuất báo cáo (CSV)
                    </button>
                    <select className="bg-white border border-gray-100 text-gray-600 text-xs font-bold rounded-xl block p-2.5 shadow-soft outline-none">
                        <option>Tháng này</option>
                        <option>Tháng trước</option>
                        <option>3 tháng qua</option>
                        <option>Năm nay</option>
                    </select>
                </div>
            </div>

            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[24px] shadow-soft border border-emerald-50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition duration-500">
                        <svg className="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tổng doanh thu</p>
                    <h3 className="text-2xl font-extrabold text-emerald-600">2.845.000.000 ₫</h3>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold">
                        <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md">+14.2%</span>
                        <span className="text-gray-300">Tăng trưởng so với cùng kỳ</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[24px] shadow-soft border border-orange-50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition duration-500">
                        <svg className="w-16 h-16 text-brandOrange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tổng đơn hàng</p>
                    <h3 className="text-2xl font-extrabold text-primary">1,248 Đơn</h3>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold">
                        <span className="bg-orange-50 text-brandOrange px-2 py-0.5 rounded-md">86%</span>
                        <span className="text-gray-300">Tỷ lệ hoàn thành đơn</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[24px] shadow-soft border border-blue-50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition duration-500">
                        <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Lợi nhuận ròng</p>
                    <h3 className="text-2xl font-extrabold text-blue-600">620.000.000 ₫</h3>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold">
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">21.8%</span>
                        <span className="text-gray-300">Biên độ lợi nhuận trung bình</span>
                    </div>
                </div>
            </div>

            {/* Charts Placeholder Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[32px] shadow-soft border border-gray-50 flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center text-gray-200">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-primary">Biểu đồ tăng trưởng doanh thu</h4>
                        <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">Tích hợp dữ liệu thời gian thực để phân tích xu hướng mua sắm của khách hàng.</p>
                    </div>
                    <div className="w-full h-48 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-gray-300 italic-none">
                        Dự kiến: Chart.js Area Chart
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] shadow-soft border border-gray-50 flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center text-gray-200">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-primary">Doanh số theo danh mục</h4>
                        <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">Phân tích tỷ trọng đóng góp doanh thu của từng nhóm sản phẩm chính.</p>
                    </div>
                    <div className="w-full h-48 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-gray-300 italic-none">
                        Dự kiến: Chart.js Doughnut Chart
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-[24px] shadow-soft border border-gray-50 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-primary uppercase text-xs tracking-widest">Top sản phẩm bán chạy nhất</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                                <th className="p-5 pl-8">Sản phẩm</th>
                                <th className="p-5 text-center">Số lượng bán</th>
                                <th className="p-5">Doanh thu thu về</th>
                                <th className="p-5 pr-8 text-right">Tình trạng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                { name: 'Ghế Sofa Minimalist', sold: 124, revenue: '1.550.000.000 ₫', status: 'Cực tốt' },
                                { name: 'Đèn Trang Trí Đứng', sold: 86, revenue: '154.800.000 ₫', status: 'Ổn định' },
                                { name: 'Bàn Trà Hiện Đại', sold: 52, revenue: '218.400.000 ₫', status: 'Ổn định' },
                            ].map((item, i) => (
                                <tr key={i} className="hover:bg-gray-50/20 transition duration-300">
                                    <td className="p-5 pl-8 font-bold text-sm text-primary">{item.name}</td>
                                    <td className="p-5 text-center font-extrabold text-primary">{item.sold}</td>
                                    <td className="p-5 text-sm font-medium text-emerald-600 font-mono tracking-tighter">{item.revenue}</td>
                                    <td className="p-5 pr-8 text-right">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            item.status === 'Cực tốt' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesReport;
