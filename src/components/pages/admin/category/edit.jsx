import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Toast from '../../../ui/common/Toast';
import requestAPI from '../../../../api';

const EditCategory = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [categoryData, setCategoryData] = React.useState({
        id: '',
        name: '',
        description: '',
        status: '1',
        image: ''
    });
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [loadError, setLoadError] = React.useState('');
    const [toast, setToast] = React.useState({ show: false, message: '', type: 'success' });

    const showToast = React.useCallback((message, type = 'success') => {
        setToast({ show: true, message, type });
    }, []);

    const closeToast = React.useCallback(() => {
        setToast((prev) => ({ ...prev, show: false }));
    }, []);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            status: '1',
        },
    });

    React.useEffect(() => {
        const loadCategory = async () => {
            try {
                setIsLoading(true);
                setLoadError('');
                const response = await requestAPI({
                    method: 'GET',
                    url: `/categories/${id}`,
                });
                const data = response?.data?.data || response?.data || null;

                if (!data) {
                    throw new Error('Khong tim thay du lieu danh muc');
                }

                setCategoryData({
                    id: data.id,
                    name: data.name || '',
                    description: data.description || '',
                    status: String(Number(data.status) === 1 ? 1 : 0),
                    image: data.image || '',
                });

                reset({
                    name: data.name || '',
                    description: data.description || '',
                    status: String(Number(data.status) === 1 ? 1 : 0),
                });
            } catch (err) {
                setLoadError(err.message || 'Khong the tai chi tiet danh muc');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            loadCategory();
        }
    }, [id, reset]);

    const onUpdateCategory = async (data) => {
        try {
            setIsSubmitting(true);
            await requestAPI({
                method: 'PUT',
                url: `/categories/${id}`,
                data: {
                name: data.name,
                description: data.description,
                status: Number(data.status),
                parent_id: categoryData.parent_id || null,
                product_count: categoryData.product_count || 0,
                },
            });

            showToast('Cap nhat danh muc thanh cong');
            setTimeout(() => navigate('/admin/categories'), 500);
        } catch (err) {
            showToast(err.message || 'Cap nhat danh muc that bai', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-sm text-gray-500">Dang tai du lieu danh muc...</div>;
    }

    if (loadError) {
        return <div className="p-8 text-sm text-red-500">{loadError}</div>;
    }

    return (
        <>
        <Toast show={toast.show} message={toast.message} type={toast.type} onClose={closeToast} />
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
                    <button disabled={isSubmitting} type="submit" form="editCategoryForm" className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brandOrange shadow-[0_8px_16px_rgba(249,115,22,0.2)] hover:bg-orange-600 transition disabled:opacity-60 disabled:cursor-not-allowed">{isSubmitting ? 'Dang cap nhat...' : 'Cập nhật thay đổi'}</button>
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
                                        validate: (value) => {
                                            if (!value?.trim()) {
                                                return 'Tên danh mục không được để trống';
                                            }
                                            return true;
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
                            <img src={categoryData.image || 'https://placehold.co/500x500?text=IMG'} alt="Main" className="w-full h-full object-cover rounded-[20px]" />
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
                            <option value="1">Hoạt động</option>
                            <option value="0">Tạm ngưng</option>
                        </select>
                        {errors.status && <small className="text-red-500 text-sm">{errors.status.message}</small>}
                    </div>
                </div>
            </div>
        </form>
        </>
    );
};

export default EditCategory;
