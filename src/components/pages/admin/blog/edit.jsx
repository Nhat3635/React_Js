import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const EditBlog = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [previewImage, setPreviewImage] = useState('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80');

    // Initial values
    const initialBlog = {
        title: '10 Cách Tối Ưu Không Gian Phòng Khách Nhỏ',
        category: 'Mẹo nội thất',
        author: 'Nguyễn Văn An',
        excerpt: 'Biến phòng khách chật hẹp trở nên rộng rãi và thoáng đãng hơn với những mẹo sắp xếp nội thất thông minh này...',
        content: 'Phòng khách không chỉ là nơi sinh hoạt chung của cả gia đình mà còn là bộ mặt của ngôi nhà...',
        status: 'Hiển thị'
    };

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: initialBlog
    });

    useEffect(() => {
        // Mocking an API call
        if (id) {
            reset(initialBlog);
        }
    }, [id, reset]);

    const onUpdateBlog = (data) => {
        console.log("Updating blog ID:", id, "Data:", data);
        // Implement blog update logic here
        navigate('/admin/blogs');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    return (
        <form className="space-y-6 pb-20" id="editBlogForm" onSubmit={handleSubmit(onUpdateBlog)}>
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 text-sm font-sans">
                <div>
                    <nav className="flex text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
                        <Link to="/admin" className="hover:text-brandOrange transition">Admin</Link>
                        <span className="mx-2 text-gray-300">/</span>
                        <Link to="/admin/blogs" className="hover:text-brandOrange transition">Quản lý Blog</Link>
                        <span className="mx-2 text-gray-300">/</span>
                        <span className="text-primary font-bold">Chỉnh sửa bài viết</span>
                    </nav>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary font-sans leading-none flex items-center gap-3">
                        <span className="text-gray-400 font-mono text-sm uppercase">#{id}</span>
                        {initialBlog.title}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        type="button"
                        onClick={() => navigate('/admin/blogs')}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-400 bg-white border border-gray-100 shadow-soft hover:bg-gray-50 transition"
                    >
                        Hủy bỏ
                    </button>
                    <button type="submit" form="editBlogForm" className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-500 shadow-[0_8px_16px_rgba(59,130,246,0.2)] hover:bg-blue-600 transition">
                        Cập nhật bài viết
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Content Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-400 rounded-full"></span>
                            Thông tin bài viết hiện tại
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Tiêu đề bài viết</label>
                                <input 
                                    type="text" 
                                    {...register('title', {
                                        required: 'Tiêu đề không được để trống',
                                        minLength: { value: 10, message: 'Tiêu đề phải ít nhất 10 ký tự' }
                                    })}
                                    className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-base font-semibold" 
                                />
                                {errors.title && <small className="text-red-500 text-sm">{errors.title.message}</small>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1 font-sans">Danh mục bài viết</label>
                                    <select
                                        {...register('category', { required: 'Vui lòng chọn danh mục' })}
                                        className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm font-medium outline-none"
                                    >
                                        <option value="Mẹo nội thất">Mẹo nội thất</option>
                                        <option value="Xu hướng">Xu hướng</option>
                                        <option value="Trang trí">Trang trí</option>
                                        <option value="Lối sống">Lối sống</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1 font-sans">Tên tác giả</label>
                                    <input 
                                        type="text"
                                        {...register('author', { required: 'Tên tác giả không được để trống' })}
                                        className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm font-medium outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1 font-sans">Tóm tắt ngắn gọn</label>
                                <textarea 
                                    rows="3" 
                                    {...register('excerpt', { required: 'Vui lòng nhập tóm tắt' })}
                                    className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm font-medium resize-none leading-relaxed"
                                ></textarea>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1 font-sans">Nội dung chi tiết (Markdown support)</label>
                                <div className="prose-editor border border-gray-100 rounded-xl overflow-hidden shadow-soft bg-white">
                                    <CKEditor
                                        editor={ ClassicEditor }
                                        data={watch('content') || ''}
                                        onReady={ editor => {
                                            console.log( 'Editor is ready to use!', editor );
                                        } }
                                        onChange={ ( event, editor ) => {
                                            const data = editor.getData();
                                            setValue('content', data, { shouldValidate: true });
                                        } }
                                    />
                                    {/* Sync to hidden field */}
                                    <input type="hidden" {...register('content', { required: 'Nội dung bài viết không được để trống' })} />
                                </div>
                                {errors.content && <small className="text-red-500 text-sm">{errors.content.message}</small>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Options & Image */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6 overflow-hidden">
                        <h2 className="text-lg font-bold text-primary font-sans">Cấu hình xuất bản bài viết</h2>
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-blue-600">Lượt xem bài viết</span>
                                    <span className="text-[10px] text-blue-400 font-medium uppercase tracking-tight">1,240 lượt xem</span>
                                </div>
                                <div className="w-10 h-5 bg-blue-500 rounded-full relative p-1 cursor-pointer">
                                    <div className="w-3 h-3 bg-white rounded-full ml-auto"></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1 font-sans leading-none">Cập nhật trạng thái bài viết</label>
                                <select
                                    {...register('status')}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-secondary/30 focus:border-blue-500 transition text-sm font-medium outline-none"
                                >
                                    <option value="Hiển thị">Hiển thị công khai (Public)</option>
                                    <option value="Ẩn">Lưu nháp (Draft)</option>
                                    <option value="Lên lịch">Lên lịch tự động (Schedule)</option>
                                </select>
                            </div>
                            <div className="pt-2">
                                <button type="button" className="text-xs font-semibold text-red-500 hover:underline flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    Xóa bài viết vĩnh viễn
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <h2 className="text-lg font-bold text-primary font-sans leading-tight">Thay đổi ảnh đại diện bài viết</h2>
                        <div className="relative aspect-video w-full rounded-[24px] border-2 border-dashed border-gray-100 bg-secondary/20 flex flex-col items-center justify-center group hover:border-blue-500 transition-colors cursor-pointer overflow-hidden shadow-sm">
                           {previewImage ? (
                               <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                           ) : (
                               <>
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-soft flex items-center justify-center text-gray-300 group-hover:text-blue-500 transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                    </div>
                                    <p className="text-[11px] font-bold text-gray-400">Chọn ảnh mới thay thế</p>
                               </>
                           )}
                           <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                accept="image/*"
                                onChange={handleImageChange}
                           />
                        </div>
                        <div className="flex gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mt-1"></div>
                            <p className="text-[10px] text-gray-400 font-medium italic">Ảnh bìa giúp tăng đáng kể tỷ lệ truy cập bài viết. Hãy cân nhắc hình ảnh bắt mắt nhất.</p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default EditBlog;
