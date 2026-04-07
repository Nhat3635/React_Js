import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const EditCategory = () => {
    const navigate = useNavigate();
    const [categoryData, setCategoryData] = React.useState({
        id: 'CAT-01',
        name: 'Sofa & Ghế bành',
        description: 'Các loại sofa văng, sofa góc và ghế thư giãn cao cấp.',
        status: 'Hoạt động',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80'
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: categoryData.name,
            description: categoryData.description,
            status: categoryData.status,
        },
    });

    const onUpdateCategory = (data) => {
        setCategoryData((prev) => ({
            ...prev,
            ...data,
        }));
        console.log(data);
    };

    return (
        <form className="space-y-6 pb-20" id="editCategoryForm" onSubmit={handleSubmit(onUpdateCategory)}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
                        <Link to="/admin" className="hover:text-brandOrange transition">Admin</Link>
                        <span className="mx-2 text-gray-300">/</span>
                        <Link to="/admin/categories" className="hover:text-brandOrange transition">Danh mục</Link>
                        <span className="mx-2 text-gray-300">/</span>
                        <span className="text-primary font-bold">Chỉnh sửa #{categoryData.id}</span>
                    </nav>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Cập nhật danh mục</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={() => navigate('/admin/categories')} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-white border border-gray-100 shadow-soft hover:bg-gray-50 transition">Hủy bỏ</button>
                    <button type="submit" form="editCategoryForm" className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brandOrange shadow-[0_8px_16px_rgba(249,115,22,0.2)] hover:bg-orange-600 transition">Cập nhật thay đổi</button>
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
                                <input
                                    type="text"
                                    className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-bold text-primary"
                                    {...register('name', {
                                        required: {
                                            value: true,
                                            message: 'Tên danh mục không được để trống',
                                        },
                                        minLength: {
                                            value: 2,
                                            message: 'Tên danh mục phải có ít nhất 2 ký tự',
                                        },
                                    })}
                                />
                                {errors.name && <small className="text-red-500 text-sm">{errors.name.message}</small>}
                            </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Mô tả tóm tắt</label>
                                <div className="prose-editor border border-gray-100 rounded-xl overflow-hidden shadow-soft bg-white">
                                    <CKEditor
                                        editor={ ClassicEditor }
                                        data={watch('description') || ''}
                                        onReady={ editor => {
                                            console.log( 'Editor is ready to use!', editor );
                                        } }
                                        onChange={ ( event, editor ) => {
                                            const data = editor.getData();
                                            setValue('description', data, { shouldValidate: true });
                                        } }
                                    />
                                    {/* Register description to be tracked by react-hook-form */}
                                    <input type="hidden" {...register('description', { required: 'Mô tả tóm tắt không được để trống' })} />
                                </div>
                                {errors.description && <small className="text-red-500 text-sm">{errors.description.message}</small>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <h2 className="text-lg font-bold text-primary">Hình đại diện</h2>
                        <div className="aspect-square w-full rounded-[24px] border border-gray-100 flex flex-col items-center justify-center gap-3 text-center p-1 grayscale-0 group relative overflow-hidden">
                            <img src={categoryData.image} alt="Main" className="w-full h-full object-cover rounded-[20px]" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition flex items-center justify-center rounded-[20px] cursor-pointer">
                                <span className="text-white text-xs font-bold font-bold">Thay đổi ảnh</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-4">
                        <h2 className="text-lg font-bold text-primary">Trạng thái h.động</h2>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-bold outline-none"
                            {...register('status', {
                                required: {
                                    value: true,
                                    message: 'Vui lòng chọn trạng thái',
                                },
                            })}
                        >
                            <option value="Hoạt động">Hoạt động</option>
                            <option value="Tạm ngưng">Tạm ngưng</option>
                        </select>
                        {errors.status && <small className="text-red-500 text-sm">{errors.status.message}</small>}
                    </div>
                </div>
            </div>
        </form>
    );
};

export default EditCategory;
