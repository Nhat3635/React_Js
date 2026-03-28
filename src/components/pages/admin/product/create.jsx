import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CreateProduct = () => {
    const navigate = useNavigate();
    const [selectedColors, setSelectedColors] = useState(['Xám Khói']);
    const [selectedSizes, setSelectedSizes] = useState(['Vừa (2.0m)']);

    const colors = ['Trắng Kem', 'Xám Khói', 'Vàng Sồi', 'Đen Tuyền', 'Xanh Navy', 'Hồng Pastel'];
    const sizes = ['Nhỏ (1.6m)', 'Vừa (2.0m)', 'Lớn (2.4m)', 'Cực đại (2.8m)'];

    const toggleColor = (color) => {
        setSelectedColors(prev => 
            prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
        );
    };

    const toggleSize = (size) => {
        setSelectedSizes(prev => 
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
                        <Link to="/admin" className="hover:text-brandOrange transition">Admin</Link>
                        <span className="mx-2 text-gray-300">/</span>
                        <Link to="/admin/products" className="hover:text-brandOrange transition">Sản phẩm</Link>
                        <span className="mx-2 text-gray-300">/</span>
                        <span className="text-primary font-bold">Thêm mới</span>
                    </nav>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Tạo sản phẩm mới</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/admin/products')}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-white border border-gray-100 shadow-soft hover:bg-gray-50 transition"
                    >
                        Hủy bỏ
                    </button>
                    <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brandOrange shadow-[0_8px_16px_rgba(249,115,22,0.2)] hover:bg-orange-600 transition">
                        Lưu sản phẩm
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Essential Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-brandOrange rounded-full"></span>
                            Thông tin cơ bản
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Tên sản phẩm</label>
                                <input 
                                    type="text" 
                                    placeholder="Nhập tên sản phẩm (vd: Ghế Sofa Minimalist)" 
                                    className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-medium" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">SKU</label>
                                <input 
                                    type="text" 
                                    placeholder="SKU-XXX-000" 
                                    className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-medium" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Danh mục</label>
                                <select className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-medium outline-none">
                                    <option>Sofa</option>
                                    <option>Bàn trà</option>
                                    <option>Đèn trang trí</option>
                                    <option>Giường ngủ</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Giá bán cơ bản (₫)</label>
                                <input 
                                    type="text" 
                                    placeholder="0" 
                                    className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-bold text-brandOrange" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Giá khuyến mãi (tùy chọn)</label>
                                <input 
                                    type="text" 
                                    placeholder="0" 
                                    className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-medium" 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Mô tả sản phẩm</label>
                            <textarea 
                                rows="6" 
                                placeholder="Viết mô tả chi tiết về sản phẩm..." 
                                className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-medium resize-none leading-relaxed"
                            ></textarea>
                        </div>
                    </div>

                    {/* Variants Section */}
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-blue-400 rounded-full"></span>
                                Biến thể sản phẩm
                            </h2>
                            <span className="text-[10px] bg-blue-50 text-blue-500 font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Đa lựa chọn</span>
                        </div>

                        <div className="space-y-6">
                            {/* Color Variants */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-primary flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.172-1.172a4 4 0 115.656 5.656l-1.172 1.172" /></svg>
                                    Màu sắc khả dụng
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {colors.map((color) => (
                                        <button 
                                            key={color}
                                            onClick={() => toggleColor(color)}
                                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                                                selectedColors.includes(color) 
                                                ? 'bg-brandOrange text-white border-brandOrange shadow-md scale-105' 
                                                : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-brandOrange/30'
                                            }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                    <button className="px-4 py-2 rounded-xl text-xs font-bold text-brandOrange border border-dashed border-brandOrange/50 hover:bg-orange-50 transition-all flex items-center gap-1">
                                        + Thêm màu
                                    </button>
                                </div>
                            </div>

                            {/* Size Variants */}
                            <div className="space-y-4 pt-4">
                                <label className="text-sm font-bold text-primary flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                    Kích thước khả dụng
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((size) => (
                                        <button 
                                            key={size}
                                            onClick={() => toggleSize(size)}
                                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                                                selectedSizes.includes(size) 
                                                ? 'bg-primary text-white border-primary shadow-md scale-105' 
                                                : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-primary/30'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                    <button className="px-4 py-2 rounded-xl text-xs font-bold text-primary border border-dashed border-primary/50 hover:bg-gray-100 transition-all flex items-center gap-1">
                                        + Thêm size
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Table for Variants (Mockup) */}
                        <div className="pt-6 border-t border-gray-50">
                            <p className="text-xs text-textMuted mb-4">Hệ thống sẽ tự động tạo bảng tồn kho cho từng cặp biến thể bên dưới.</p>
                            <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 text-[11px] text-gray-400 text-center font-medium">
                                Chọn biến thể để kích hoạt thiết lập giá & kho riêng
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Photos & Status */}
                <div className="space-y-8">
                    {/* Status & Options */}
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <h2 className="text-lg font-bold text-primary">Tình trạng</h2>
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-green-50/50 border border-green-100 flex items-center justify-between">
                                <span className="text-sm font-bold text-green-600">Công khai</span>
                                <div className="w-10 h-5 bg-green-500 rounded-full relative p-1 cursor-pointer">
                                    <div className="w-3 h-3 bg-white rounded-full ml-auto"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Trạng thái kho</label>
                                <select className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-medium outline-none">
                                    <option>Còn hàng</option>
                                    <option>Sắp về</option>
                                    <option>Ngừng kinh doanh</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <h2 className="text-lg font-bold text-primary">Hình ảnh</h2>
                        <div className="aspect-square w-full rounded-[32px] border-2 border-dashed border-gray-100 bg-secondary/20 flex flex-col items-center justify-center gap-4 group hover:border-brandOrange/40 transition-colors cursor-pointer overflow-hidden p-6 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-soft flex items-center justify-center text-gray-300 group-hover:text-brandOrange transition-colors">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-primary">Tải ảnh lên</p>
                                <p className="text-[11px] text-gray-400 mt-1">Dung lượng tối đa 5MB, định dạng .jpg, .png</p>
                            </div>
                        </div>

                        {/* Thumbnails list */}
                        <div className="grid grid-cols-3 gap-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="aspect-square rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;
