import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const EditProduct = () => {
    const navigate = useNavigate();
    
    // Static Initial Data for Edit
    const [productData, setProductData] = useState({
        name: 'Ghế Sofa Minimalist Cao Cấp',
        sku: 'SKU-SM-001',
        category: 'Sofa',
        price: '12.500.000',
        discountPrice: '10.800.000',
        description: 'Sự kết hợp hoàn hảo giữa phong cách thiết kế tối giản và chất liệu nỉ nhung cao cấp. Ghế sofa Minimalist mang đến không gian sống hiện đại, thanh lịch và trải nghiệm thư giãn tuyệt đối cho gia đình bạn.',
        status: 'Công khai',
        stockStatus: 'Còn hàng'
    });

    const [selectedColors, setSelectedColors] = useState(['Xám Khói', 'Trắng Kem']);
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

    // Brands mock
    const brands = ['IKEA', 'Ashley Furniture', 'Home Pro', 'Living Creative', 'Nội thất Xinh'];

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: productData.name,
            category: productData.category,
            brand: 'IKEA', // Mock for existing brand
            price: productData.price,
            discountPrice: productData.discountPrice,
            description: productData.description,
            status: '1',
        },
    });

    const onUpdateProduct = (data) => {
        setProductData((prev) => ({
            ...prev,
            ...data,
        }));
        console.log({ ...data, selectedColors, selectedSizes });
    };

    return (
        <form className="space-y-6 pb-20" id="editProductForm" onSubmit={handleSubmit(onUpdateProduct)}>
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
                        <Link to="/admin" className="hover:text-brandOrange transition">Admin</Link>
                        <span className="mx-2 text-gray-300">/</span>
                        <Link to="/admin/products" className="hover:text-brandOrange transition">Sản phẩm</Link>
                        <span className="mx-2 text-gray-300">/</span>
                        <span className="text-primary font-bold">Chỉnh sửa #{productData.sku}</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Cập nhật sản phẩm</h1>
                        <span className="bg-orange-50 text-brandOrange text-[10px] uppercase font-bold px-3 py-1 rounded-full">Sửa bản ghi</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-white border border-gray-100 shadow-soft hover:bg-gray-50 transition"
                    >
                        Quay lại
                    </button>
                    <button type="submit" form="editProductForm" className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brandOrange shadow-[0_8px_16px_rgba(249,115,22,0.2)] hover:bg-orange-600 transition">
                        Cập nhật thay đổi
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
                            Thông tin chi tiết
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Tên sản phẩm</label>
                                <input 
                                    type="text" 
                                    {...register('name', {
                                        required: {
                                            value: true,
                                            message: 'Tên sản phẩm không được để trống',
                                        },
                                        minLength: {
                                            value: 3,
                                            message: 'Tên sản phẩm phải có ít nhất 3 ký tự',
                                        },
                                    })}
                                    className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-bold text-primary" 
                                />
                                {errors.name && <small className="text-red-500 text-sm">{errors.name.message}</small>}
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Danh mục (category_id)</label>
                                <select
                                    {...register('category', {
                                        required: {
                                            value: true,
                                            message: 'Vui lòng chọn danh mục',
                                        },
                                    })}
                                    className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-medium outline-none"
                                >
                                    <option value="Sofa">Sofa</option>
                                    <option value="Bàn trà">Bàn trà</option>
                                    <option value="Đèn trang trí">Đèn trang trí</option>
                                    <option value="Giường ngủ">Giường ngủ</option>
                                </select>
                                {errors.category && <small className="text-red-500 text-sm">{errors.category.message}</small>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Thương hiệu (brand_id)</label>
                                <select
                                    {...register('brand', {
                                        required: {
                                            value: true,
                                            message: 'Vui lòng chọn thương hiệu',
                                        },
                                    })}
                                    className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-medium outline-none"
                                >
                                    {brands.map(brand => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                                {errors.brand && <small className="text-red-500 text-sm">{errors.brand.message}</small>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Giá bán cơ bản (base_price)</label>
                                <input 
                                    type="text" 
                                    {...register('price', {
                                        required: {
                                            value: true,
                                            message: 'Giá bán không được để trống',
                                        },
                                        pattern: {
                                            value: /^\d{1,3}(\.\d{3})*|\d+$/,
                                            message: 'Giá bán không hợp lệ',
                                        },
                                    })}
                                    className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-bold text-brandOrange" 
                                />
                                {errors.price && <small className="text-red-500 text-sm">{errors.price.message}</small>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Mã sản phẩm (ID: #{productData.sku})</label>
                                <input 
                                    type="text" 
                                    value={productData.sku}
                                    className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-secondary/10 text-gray-400 focus:outline-none transition text-sm font-medium" 
                                    disabled 
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Mô tả sản phẩm</label>
                                <textarea 
                                    rows="4" 
                                    {...register('description', {
                                        required: {
                                            value: true,
                                            message: 'Mô tả sản phẩm không được để trống',
                                        },
                                        minLength: {
                                            value: 10,
                                            message: 'Mô tả sản phẩm phải có ít nhất 10 ký tự',
                                        },
                                    })}
                                    className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-medium resize-none leading-relaxed"
                                ></textarea>
                                {errors.description && <small className="text-red-500 text-sm">{errors.description.message}</small>}
                            </div>
                        </div>
                    </div>

                    {/* Variants Section */}
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-blue-400 rounded-full"></span>
                                Quản lý Biến thể (Variants)
                            </h2>
                            <span className="text-[10px] bg-blue-50 text-blue-500 font-bold px-3 py-1 rounded-full uppercase tracking-tighter"> product_variants mapping </span>
                        </div>

                        <div className="space-y-6">
                            {/* Color Attributes */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-primary flex items-center gap-2">Màu sắc (Attribute: Color)</label>
                                <div className="flex flex-wrap gap-2">
                                    {colors.map((color) => (
                                        <button 
                                            type="button"
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
                                </div>
                            </div>

                            {/* Size Attributes */}
                            <div className="space-y-4 pt-4">
                                <label className="text-sm font-bold text-primary flex items-center gap-2">Kích thước (Attribute: Size)</label>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((size) => (
                                        <button 
                                            type="button"
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
                                </div>
                            </div>
                        </div>

                        {/* Variants Table */}
                        <div className="pt-6 border-t border-gray-50">
                            <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Cấu hình chi tiết biến thể</h3>
                            <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                                <table className="w-full text-left border-collapse text-[11px]">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-400 font-bold uppercase tracking-widest">
                                            <th className="p-3">Biến thể</th>
                                            <th className="p-3 w-32">SKU</th>
                                            <th className="p-3 w-32">Giá biến thể</th>
                                            <th className="p-3 w-24 text-center">Số lượng</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {selectedColors.map(color => (
                                            selectedSizes.map(size => (
                                                <tr key={`${color}-${size}`} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="p-3 font-medium text-primary uppercase">{color} / {size}</td>
                                                    <td className="p-3">
                                                        <input type="text" defaultValue={`SKU-${color.substring(0,1)}-${size.substring(0,1)}-01`} className="w-full px-2 py-1.5 rounded-lg border border-gray-100 focus:outline-none focus:border-brandOrange transition-all bg-white" />
                                                    </td>
                                                    <td className="p-3">
                                                        <input type="text" defaultValue={productData.price} className="w-full px-2 py-1.5 rounded-lg border border-gray-100 focus:outline-none focus:border-brandOrange transition-all font-bold text-brandOrange bg-white" />
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <input type="number" defaultValue="20" className="w-16 px-2 py-1.5 rounded-lg border border-gray-100 focus:outline-none focus:border-brandOrange transition-all text-center bg-white" />
                                                    </td>
                                                </tr>
                                            ))
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Photos & Status */}
                <div className="space-y-8">
                    {/* Status & Options */}
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <h2 className="text-lg font-bold text-primary">Cấu hình hiển thị</h2>
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-green-50/50 border border-green-100 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-green-600">Trạng thái (status)</span>
                                    <span className="text-[10px] text-green-500/70 font-medium uppercase tracking-tight">Active / Inactive</span>
                                </div>
                                <div className="w-10 h-5 bg-green-500 rounded-full relative p-1 cursor-pointer">
                                    <div className="w-3 h-3 bg-white rounded-full ml-auto"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Hiển thị ngoài trang chủ</label>
                                <select
                                    {...register('status', {
                                        required: true
                                    })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-bold outline-none"
                                >
                                    <option value="1">Đang kinh doanh (Active)</option>
                                    <option value="0">Ngừng kinh doanh (Inactive)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <h2 className="text-lg font-bold text-primary">Hình ảnh</h2>
                        <div className="aspect-square w-full rounded-[32px] border border-gray-100 bg-secondary/10 flex flex-col items-center justify-center gap-4 group hover:border-brandOrange/40 transition-colors cursor-pointer overflow-hidden p-2 text-center relative">
                            <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80" alt="Main" className="w-full h-full object-cover rounded-[28px]" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[28px]">
                                <span className="text-white text-xs font-bold font-bold">Thay đổi ảnh</span>
                            </div>
                        </div>

                        {/* Thumbnails list */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="aspect-square rounded-xl overflow-hidden border border-brandOrange">
                                <img src="https://images.unsplash.com/photo-1493663284031-b7e3a9032ff1?w=150&q=80" className="w-full h-full object-cover" alt="T1" />
                            </div>
                            <div className="aspect-square rounded-xl overflow-hidden border border-gray-100 grayscale hover:grayscale-0 transition cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=150&q=80" className="w-full h-full object-cover" alt="T2" />
                            </div>
                            <div className="aspect-square rounded-xl bg-gray-50 border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300 hover:text-brandOrange transition cursor-pointer">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default EditProduct;
