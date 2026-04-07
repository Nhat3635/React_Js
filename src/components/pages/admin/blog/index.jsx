import React from 'react';
import { Link } from 'react-router-dom';

const BlogManagement = () => {
    // Mock Data for Admin Blog
    const blogs = [
        { id: '1', title: '10 Cách Tối Ưu Không Gian Phòng Khách Nhỏ', category: 'Mẹo nội thất', author: 'Nguyễn Văn An', createdAt: '20/05/2024', status: 'Hiển thị', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80' },
        { id: '2', title: 'Xu Hướng Nội Thất Tối Giản Năm 2024', category: 'Xu hướng', author: 'Trần Thị Bình', createdAt: '18/05/2024', status: 'Hiển thị', image: 'https://images.unsplash.com/photo-1598928506311-c55f43f22876?w=300&q=80' },
        { id: '3', title: 'Bí Quyết Chọn Đèn Trang Trí Cho Phòng Ngủ', category: 'Trang trí', author: 'Lê Hoàng Nam', createdAt: '15/05/2024', status: 'Ẩn', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=300&q=80' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Hiển thị': return 'bg-green-100/60 text-green-600 border border-green-200';
            case 'Ẩn': return 'bg-red-100/60 text-red-600 border border-red-200';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary font-sans">Quản lý Blog</h1>
                
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400 group-focus-within:text-brandOrange transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            className="block w-64 pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange shadow-soft transition-all" 
                            placeholder="Tìm bài viết..." 
                        />
                    </div>

                    <select className="bg-white border border-gray-100 text-gray-500 text-sm rounded-xl focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange block p-2.5 shadow-soft transition-all outline-none">
                        <option>Tất cả danh mục</option>
                        <option>Mẹo nội thất</option>
                        <option>Xu hướng</option>
                        <option>Trang trí</option>
                    </select>

                    <Link to="/admin/blogs/create" className="bg-brandOrange text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_8px_16px_rgba(249,115,22,0.2)] hover:bg-orange-600 transition-all flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                        Thêm bài viết mới
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-[24px] shadow-soft border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-[0.1em] font-bold">
                                <th className="p-5 pl-8">ID</th>
                                <th className="p-5">Ảnh bìa</th>
                                <th className="p-5">Tiêu đề & Danh mục</th>
                                <th className="p-5 text-center">Tác giả</th>
                                <th className="p-5 text-center">Ngày đăng</th>
                                <th className="p-5 text-center">Trạng thái</th>
                                <th className="p-5 pr-8 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {blogs.map((blog) => (
                                <tr key={blog.id} className="hover:bg-gray-50/30 transition-colors group text-sm">
                                    <td className="p-5 pl-8">
                                        <span className="text-sm font-semibold text-gray-400 font-mono">#{blog.id}</span>
                                    </td>
                                    <td className="p-5">
                                        <div className="w-20 h-14 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-primary group-hover:text-brandOrange transition-colors max-w-md truncate">{blog.title}</span>
                                            <span className="text-[11px] text-gray-400 mt-1 uppercase font-semibold tracking-wider">{blog.category}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className="font-semibold text-gray-600">{blog.author}</span>
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className="text-gray-500 font-mono text-xs">{blog.createdAt}</span>
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase border ${getStatusStyle(blog.status)}`}>
                                            {blog.status}
                                        </span>
                                    </td>
                                    <td className="p-5 pr-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/admin/blogs/edit/${blog.id}`} className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-orange-50 hover:text-brandOrange transition-all" title="Sửa">
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

                <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">
                        Page 1 of 12
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-100 text-gray-400 hover:border-brandOrange hover:text-brandOrange transition-all disabled:opacity-20" disabled>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <button className="w-8 h-8 bg-brandOrange text-white text-xs font-bold rounded-lg shadow-md">1</button>
                        <button className="w-8 h-8 border border-gray-100 text-gray-400 hover:text-brandOrange hover:border-brandOrange text-xs font-bold rounded-lg transition-all">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-100 text-gray-400 hover:border-brandOrange hover:text-brandOrange transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogManagement;
