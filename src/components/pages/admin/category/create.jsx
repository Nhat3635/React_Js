import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CreateCategory = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
                        <Link to="/admin" className="hover:text-brandOrange transition">Admin</Link>
                        <span className="mx-2 text-gray-300">/</span>
                        <Link to="/admin/categories" className="hover:text-brandOrange transition">Danh mục</Link>
                        <span className="mx-2 text-gray-300">/</span>
                        <span className="text-primary font-bold">Thêm mới</span>
                    </nav>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Tạo danh mục mới</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/admin/categories')} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-white border border-gray-100 shadow-soft hover:bg-gray-50 transition">Hủy bỏ</button>
                    <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brandOrange shadow-[0_8px_16px_rgba(249,115,22,0.2)] hover:bg-orange-600 transition">Lưu danh mục</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-brandOrange rounded-full"></span>
                            Thông tin danh mục
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Tên danh mục</label>
                                <input type="text" placeholder="Nhập tên" className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-medium" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Mô tả tóm tắt</label>
                                <textarea rows="4" className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-medium resize-none" placeholder="Giới thiệu sơ lược về danh mục..."></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <h2 className="text-lg font-bold text-primary">Hình đại diện</h2>
                        <div className="aspect-square w-full rounded-[24px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-3 text-center p-6 grayscale hover:grayscale-0 transition cursor-pointer group hover:border-brandOrange/30">
                            <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center text-gray-300 group-hover:text-brandOrange transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            </div>
                            <span className="text-xs font-bold text-gray-400 group-hover:text-primary transition">Tải ảnh lên</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-4">
                        <h2 className="text-lg font-bold text-primary">Trạng thái h.động</h2>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-medium outline-none">
                            <option>Hoạt động</option>
                            <option>Tạm ngưng</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCategory;
