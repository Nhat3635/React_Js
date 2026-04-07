import React from 'react';
import { Link } from 'react-router-dom';

const ProductManagement = () => {
    // Mock Data based on requirements
    const products = [
        { id: '001', name: 'Ghế Sofa Minimalist', sku: 'SKU-SM-001', category: 'Sofa', price: '12.500.000 ₫', status: 'Còn hàng', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80' },
        { id: '002', name: 'Đèn Trang Trí Đứng', sku: 'SKU-SM-002', category: 'Đèn', price: '1.800.000 ₫', status: 'Còn hàng', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&q=80' },
        { id: '003', name: 'Bàn Trà Hiện Đại', sku: 'SKU-SM-003', category: 'Bàn ghế', price: '4.200.000 ₫', status: 'Đang xử lý', image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=300&q=80' },
        { id: '004', name: 'Kệ Tivi Gỗ Sồi', sku: 'SKU-SM-004', category: 'Nội thất gỗ', price: '8.500.000 ₫', status: 'Hết hàng', image: 'https://images.unsplash.com/photo-1616137533615-ce4e21a224f8?w=300&q=80' },
        { id: '005', name: 'Giường Ngủ Cao Cấp', sku: 'SKU-SM-005', category: 'Phòng ngủ', price: '24.000.000 ₫', status: 'Còn hàng', image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=300&q=80' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Còn hàng': return 'bg-green-100/60 text-green-600 border border-green-200';
            case 'Đang xử lý': return 'bg-orange-100/60 text-orange-600 border border-orange-200';
            case 'Hết hàng': return 'bg-red-100/60 text-red-600 border border-red-200';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getCategoryStyle = (category) => {
        switch (category) {
            case 'Sofa': return 'bg-blue-50 text-blue-500';
            case 'Đèn': return 'bg-purple-50 text-purple-500';
            case 'Bàn ghế': return 'bg-teal-50 text-teal-500';
            default: return 'bg-gray-50 text-gray-500';
        }
    };

    return (
        <div className="space-y-6">
            {/* 1. Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Quản lý sản phẩm</h1>
                
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg className="h-4 h-4 text-gray-400 group-focus-within:text-brandOrange transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            className="block w-64 pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange shadow-soft transition-all" 
                            placeholder="Tìm sản phẩm..." 
                        />
                    </div>

                    {/* Filters */}
                    <select className="bg-white border border-gray-100 text-gray-500 text-sm rounded-xl focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange block p-2.5 shadow-soft transition-all outline-none">
                        <option>Tất cả trạng thái</option>
                        <option>Còn hàng</option>
                        <option>Hết hàng</option>
                        <option>Đang nhập hàng</option>
                    </select>

                    <select className="bg-white border border-gray-100 text-gray-500 text-sm rounded-xl focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange block p-2.5 shadow-soft transition-all outline-none">
                        <option>Tất cả danh mục</option>
                        <option>Sofa</option>
                        <option>Đèn</option>
                        <option>Bàn ghế</option>
                    </select>

                    {/* Primary CTA */}
                    <Link to="/admin/products/create" className="bg-brandOrange text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_8px_16px_rgba(249,115,22,0.2)] hover:bg-orange-600 transition-all flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                        Thêm sản phẩm mới
                    </Link>
                </div>
            </div>

            {/* 2. Product Table (Card-Based) */}
            <div className="bg-white rounded-[24px] shadow-soft border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-[0.1em] font-bold">
                                <th className="p-5 pl-8">ID</th>
                                <th className="p-5">Hình ảnh</th>
                                <th className="p-5">Thông tin sản phẩm</th>
                                <th className="p-5">Danh mục</th>
                                <th className="p-5">Thương hiệu</th>
                                <th className="p-5">Giá cơ bản</th>
                                <th className="p-5 text-center">Trạng thái</th>
                                <th className="p-5 pr-8 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="p-5 pl-8">
                                        <span className="text-sm font-semibold text-gray-400 font-mono">#{item.id}</span>
                                    </td>
                                    <td className="p-5 text-gray-500">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm bg-secondary border border-gray-100">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-primary group-hover:text-brandOrange transition-colors">{item.name}</span>
                                            <span className="text-[11px] text-gray-400 mt-1 font-medium">{item.sku}</span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider ${getCategoryStyle(item.category)}`}>
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Ashley Furniture</span>
                                    </td>
                                    <td className="p-5">
                                        <span className="text-sm font-extrabold text-brandOrange">{item.price}</span>
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase border ${getStatusStyle(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-5 pr-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to="/admin/products/edit" className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-orange-50 hover:text-brandOrange transition-all" title="Sửa">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                            </Link>
                                            <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all" title="Xóa">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 3. Pagination */}
                <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                        Hiển thị <span className="text-primary font-bold">1-10</span> trên tổng số <span className="text-primary font-bold">120</span> sản phẩm
                    </span>
                    
                    <div className="flex items-center gap-2">
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-brandOrange hover:text-brandOrange transition transition-all disabled:opacity-30 disabled:hover:border-gray-200" disabled>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        {[1, 2, 3, '...', 12].map((page, i) => (
                            <button 
                                key={i}
                                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all shadow-sm ${
                                    page === 1 
                                    ? "bg-brandOrange text-white shadow-[0_4px_12px_rgba(249,115,22,0.3)]" 
                                    : "bg-white text-gray-500 border border-transparent hover:border-brandOrange/30 hover:text-brandOrange"
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-brandOrange hover:text-brandOrange transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;
