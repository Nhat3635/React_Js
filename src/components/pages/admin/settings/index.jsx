import React, { useState } from 'react';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('general');

    const menuItems = [
        { id: 'general', name: 'Cài đặt chung', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> },
        { id: 'shipping', name: 'Vận chuyển & Thuế', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg> },
        { id: 'interface', name: 'Giao diện & UI', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> },
        { id: 'security', name: 'Tài khoản & Bảo mật', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg> },
    ];

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Cài đặt hệ thống</h1>
                <p className="text-sm text-gray-400 mt-1 font-medium">Cấu hình các thông số chung, vận chuyển và bảo mật cho SmartLiving.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left: Navigation Menu */}
                <div className="lg:col-span-1 space-y-4">
                    {menuItems.map((item) => (
                        <button 
                            key={item.id} 
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-bold transition-all ${
                                activeTab === item.id 
                                ? 'bg-orange-50 text-brandOrange border border-orange-100 shadow-sm' 
                                : 'text-gray-400 hover:bg-white hover:text-primary transition-colors border border-transparent'
                            }`}
                        >
                            <span className={activeTab === item.id ? 'text-brandOrange' : 'text-gray-400'}>{item.icon}</span>
                            {item.name}
                        </button>
                    ))}
                </div>

                {/* Right: Content Area */}
                <div className="lg:col-span-3">
                    {activeTab === 'general' && (
                        <div className="bg-white rounded-[32px] p-8 shadow-soft border border-gray-50 space-y-8">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                    <span className="w-2 h-8 bg-brandOrange rounded-full"></span>
                                    Cài đặt chung
                                </h2>
                                <button className="px-6 py-2.5 bg-brandOrange text-white rounded-xl text-xs font-bold shadow-[0_8px_16px_rgba(249,115,22,0.2)] hover:bg-orange-600 transition">
                                    Lưu thay đổi
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Tên cửa hàng</label>
                                    <input type="text" defaultValue="SmartLiving Furniture Store" className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-secondary/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-bold text-primary shadow-inner" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Email liên hệ</label>
                                    <input type="email" defaultValue="support@smartliving.com" className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-secondary/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-bold text-primary shadow-inner" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Số điện thoại</label>
                                    <input type="text" defaultValue="0901 234 567" className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-secondary/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-bold text-primary shadow-inner" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Tiền tệ chính</label>
                                    <div className="px-5 py-4 rounded-xl border border-gray-100 bg-gray-50 text-sm font-bold text-primary select-none opacity-60 flex items-center gap-2">
                                        Vietnam Dong (₫)
                                        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'shipping' && (
                        <div className="bg-white rounded-[32px] p-8 shadow-soft border border-gray-50 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                    <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                                    Vận chuyển & Thuế
                                </h2>
                                <button className="px-6 py-2.5 bg-brandOrange text-white rounded-xl text-xs font-bold shadow-[0_8px_16px_rgba(249,115,22,0.2)] hover:bg-orange-600 transition">
                                    Lưu thay đổi
                                </button>
                            </div>
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phí ship mặc định (₫)</label>
                                        <input type="text" defaultValue="35.000" className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Thuế VAT (%)</label>
                                        <input type="number" defaultValue="8" className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold text-primary" />
                                    </div>
                                </div>
                                <div className="p-6 bg-indigo-50/50 rounded-[24px] border border-indigo-100">
                                    <h4 className="text-sm font-extrabold text-indigo-700 mb-2 uppercase tracking-tight">Khu vực vận chuyển</h4>
                                    <p className="text-xs text-indigo-500 font-medium">Hiện tại hệ thống đang áp dụng biểu phí vận chuyển đồng giá cho tất cả các tỉnh thành tại Việt Nam.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'interface' && (
                        <div className="bg-white rounded-[32px] p-8 shadow-soft border border-gray-50 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                <span className="w-2 h-8 bg-pink-500 rounded-full"></span>
                                Giao diện & UI
                            </h2>
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Chủ đề (Theme)</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="p-3 rounded-xl border-2 border-brandOrange bg-white text-xs font-bold text-primary shadow-sm">Sáng (Light)</button>
                                            <button className="p-3 rounded-xl border border-gray-100 bg-gray-50 text-xs font-bold text-gray-400">Tối (Dark)</button>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Màu thương hiệu</label>
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brandOrange ring-4 ring-orange-100 cursor-pointer"></div>
                                            <div className="w-10 h-10 rounded-full bg-blue-600 cursor-pointer"></div>
                                            <div className="w-10 h-10 rounded-full bg-indigo-600 cursor-pointer"></div>
                                            <div className="w-10 h-10 rounded-full bg-green-600 cursor-pointer"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="bg-white rounded-[32px] p-8 shadow-soft border border-gray-50 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                <span className="w-2 h-8 bg-red-500 rounded-full"></span>
                                Bảo mật & Tài khoản
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-6 rounded-2xl bg-gray-50/50 border border-gray-100">
                                    <div>
                                        <h4 className="text-sm font-bold text-primary">Xác thực 2 lớp (2FA)</h4>
                                        <p className="text-xs text-gray-400 mt-1">Tăng cường bảo mật cho tài khoản admin của bạn.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer active:scale-95 transition-transform">
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm shadow-black/10"></div>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-gray-50">
                                    <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Đổi mật khẩu nhanh</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="password" placeholder="Mật khẩu cũ" className="px-4 py-3 rounded-xl border border-gray-100 text-sm italic-none" />
                                        <input type="password" placeholder="Mật khẩu mới" className="px-4 py-3 rounded-xl border border-gray-100 text-sm italic-none" />
                                    </div>
                                    <button className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-black transition">Cập nhật mật khẩu</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
