import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CreateBlog = () => {
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState(null);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            category: 'Mẹo nội thất',
            status: 'Hiển thị',
            author: 'Admin'
        },
    });

    const onCreateBlog = (data) => {
        console.log("Creating blog:", data);
        // Implement blog creation logic here
        navigate('/admin/blogs');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    return (
        <form className="space-y-6 pb-20" id="createBlogForm" onSubmit={handleSubmit(onCreateBlog)}>
            {/* Action Bar / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                <div>
                    <nav className="flex text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
                        <Link to="/admin" className="hover:text-brandOrange transition">Admin</Link>
                        <span className="mx-2 text-gray-300">/</span>
                        <Link to="/admin/blogs" className="hover:text-brandOrange transition tracking-wider">Quản lý Blog</Link>
                        <span className="mx-2 text-gray-300">/</span>
                        <span className="text-primary font-bold tracking-wider">Thêm mới bài viết</span>
                    </nav>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary font-sans leading-none">Tạo bài viết mới</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        type="button"
                        onClick={() => navigate('/admin/blogs')}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-400 bg-white border border-gray-100 shadow-soft hover:bg-gray-50 transition"
                    >
                        Hủy bỏ
                    </button>
                    <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brandOrange shadow-[0_8px_16px_rgba(249,115,22,0.2)] hover:bg-orange-600 transition">
                        Lưu bài viết
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Content Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-brandOrange rounded-full"></span>
                            Nội dung bài viết
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Tiêu đề bài viết</label>
                                <input 
                                    type="text" 
                                    placeholder="Nhập tiêu đề hấp dẫn..." 
                                    {...register('title', {
                                        required: 'Tiêu đề không được để trống',
                                        minLength: { value: 10, message: 'Tiêu đề phải ít nhất 10 ký tự' }
                                    })}
                                    className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-base font-semibold" 
                                />
                                {errors.title && <small className="text-red-500 text-sm">{errors.title.message}</small>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Danh mục</label>
                                    <select
                                        {...register('category', { required: 'Vui lòng chọn danh mục' })}
                                        className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-medium outline-none"
                                    >
                                        <option value="Mẹo nội thất">Mẹo nội thất</option>
                                        <option value="Xu hướng">Xu hướng</option>
                                        <option value="Trang trí">Trang trí</option>
                                        <option value="Lối sống">Lối sống</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Tác giả</label>
                                    <input 
                                        type="text"
                                        placeholder="Tên tác giả..."
                                        {...register('author', { required: 'Tên tác giả không được để trống' })}
                                        className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-medium outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Tóm tắt ngắn (Excerpt)</label>
                                <textarea 
                                    rows="3" 
                                    placeholder="Viết một đoạn ngắn giới thiệu bài viết..." 
                                    {...register('excerpt', { required: 'Vui lòng nhập tóm tắt' })}
                                    className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-medium resize-none leading-relaxed"
                                ></textarea>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1 font-sans">Nội dung chi tiết</label>
                                <div className="prose-editor border border-gray-100 rounded-xl overflow-hidden shadow-soft">
                                    <CKEditor
                                        editor={ ClassicEditor }
                                        data=""
                                        onReady={ editor => {
                                            console.log( 'Editor is ready to use!', editor );
                                        } }
                                        onChange={ ( event, editor ) => {
                                            const data = editor.getData();
                                            setValue('content', data, { shouldValidate: true });
                                        } }
                                    />
                                    {/* Register content to be tracked by react-hook-form */}
                                    <input type="hidden" {...register('content', { required: 'Nội dung bài viết không được để trống' })} />
                                </div>
                                {errors.content && <small className="text-red-500 text-sm">{errors.content.message}</small>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Options & Image */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6 text-sm font-sans">
                        <h2 className="text-lg font-bold text-primary font-sans leading-none">Tùy chọn hiển thị</h2>
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-orange-600">Bài viết nổi bật</span>
                                    <span className="text-[10px] text-orange-400 font-medium uppercase tracking-tight">Hiển thị ở trang chủ</span>
                                </div>
                                <div className="w-10 h-5 bg-orange-500 rounded-full relative p-1 cursor-pointer">
                                    <div className="w-3 h-3 bg-white rounded-full ml-auto"></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Trạng thái đăng tải</label>
                                <select
                                    {...register('status')}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-secondary/30 focus:border-brandOrange transition text-sm font-medium outline-none"
                                >
                                    <option value="Hiển thị">Hiển thị công khai (Public)</option>
                                    <option value="Ẩn">Lưu nháp (Draft)</option>
                                    <option value="Lên lịch">Lên lịch tự động (Schedule)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <h2 className="text-lg font-bold text-primary">Ảnh đại diện bài viết</h2>
                        <div className="relative aspect-video w-full rounded-[24px] border-2 border-dashed border-gray-100 bg-secondary/20 flex flex-col items-center justify-center gap-2 group hover:border-brandOrange transition-colors cursor-pointer overflow-hidden group">
                           {previewImage ? (
                               <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                           ) : (
                               <>
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-soft flex items-center justify-center text-gray-300 group-hover:text-brandOrange transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                    </div>
                                    <p className="text-[11px] font-bold text-gray-400">Tải ảnh chất lượng cao lên</p>
                               </>
                           )}
                           <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                accept="image/*"
                                onChange={handleImageChange}
                           />
                        </div>
                        <div className="p-4 bg-secondary rounded-2xl">
                             <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">Gợi ý: Tỷ lệ ảnh 16:9 với kích thước ít nhất 1200x675px để hiển thị đẹp nhất trên mọi thiết bị.</p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CreateBlog;
