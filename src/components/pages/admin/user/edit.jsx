import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const EditUser = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = React.useState({
        id: 'USR-001',
        name: 'Nhật Hồ',
        email: 'nhatho@admin.com',
        phone: '0123 456 789',
        role: 'Admin',
        status: 'Hoạt động',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500\u0026q=80',
        joinDate: '01/01/2026'
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: userData.name,
            phone: userData.phone,
            email: userData.email,
        },
    });

    const onUpdateUser = (data) => {
        setUserData((prev) => ({
            ...prev,
            name: data.name,
            phone: data.phone,
        }));
        console.log(data);
    };

    return (
        <form className="space-y-6 pb-20" id="editUserForm" onSubmit={handleSubmit(onUpdateUser)}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
                        <Link to="/admin" className="hover:text-brandOrange transition">Admin</Link>
                        <span className="mx-2 text-gray-300">/</span>
                        <Link to="/admin/users" className="hover:text-brandOrange transition">Tài khoản</Link>
                        <span className="mx-2 text-gray-300">/</span>
                        <span className="text-primary font-bold">Chỉnh sửa @{userData.name}</span>
                    </nav>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Cập nhật tài khoản</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={() => navigate('/admin/users')} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-white border border-gray-100 shadow-soft hover:bg-gray-50 transition">Hủy bỏ</button>
                    <button type="submit" form="editUserForm" className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brandOrange shadow-[0_8px_16px_rgba(249,115,22,0.2)] hover:bg-orange-600 transition">Cập nhật hồ sơ</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Private Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-brandOrange rounded-full"></span>
                            Thông tin cá nhân
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Họ và tên</label>
                                <input
                                    type="text"
                                    {...register('name', {
                                        required: {
                                            value: true,
                                            message: 'Họ và tên không được để trống',
                                        },
                                        minLength: {
                                            value: 2,
                                            message: 'Họ và tên phải có ít nhất 2 ký tự',
                                        },
                                    })}
                                    className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-bold text-primary"
                                />
                                {errors.name && <small className="text-red-500 text-sm">{errors.name.message}</small>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Số điện thoại</label>
                                <input
                                    type="text"
                                    {...register('phone', {
                                        required: {
                                            value: true,
                                            message: 'Số điện thoại không được để trống',
                                        },
                                        pattern: {
                                            value: /^(0|\+84)\d{9,10}$/,
                                            message: 'Số điện thoại không hợp lệ',
                                        },
                                    })}
                                    className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-bold text-primary"
                                />
                                {errors.phone && <small className="text-red-500 text-sm">{errors.phone.message}</small>}
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Địa chỉ Email</label>
                                <input
                                    type="email"
                                    {...register('email', {
                                        required: {
                                            value: true,
                                            message: 'Email không được để trống',
                                        },
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Email không hợp lệ',
                                        },
                                    })}
                                    className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-secondary/20 text-gray-400 focus:outline-none transition text-sm font-medium"
                                    readOnly
                                />
                                {errors.email && <small className="text-red-500 text-sm">{errors.email.message}</small>}
                                <p className="text-[10px] text-gray-400 pl-1 italic">Email không thể thay đổi để đảm bảo tính bảo mật.</p>
                            </div>
                        </div>
                    </div>

                    {/* Permissions / Role */}
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
                        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                            Vai trò & Quyền hạn
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['Admin', 'Nhân viên', 'Khách hàng'].map((role) => (
                                <button 
                                    key={role}
                                    className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                                        userData.role === role 
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm' 
                                        : 'bg-white border-gray-100 text-gray-400 hover:border-indigo-100'
                                    }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Avatar & Status */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6 flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg ring-1 ring-gray-100 relative group cursor-pointer">
                            <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-primary">{userData.name}</h3>
                            <p className="text-xs text-gray-400 font-mono tracking-tighter mt-1">{userData.id}</p>
                        </div>
                        <div className="w-full pt-4 border-t border-gray-50 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-medium">Trạng thái</span>
                                <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-green-100">Đang h.động</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-medium">Tham gia từ</span>
                                <span className="text-primary font-bold">{userData.joinDate}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-4">
                        <button className="w-full py-3.5 rounded-xl border border-red-100 text-red-500 text-sm font-bold hover:bg-red-50 transition flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            Khóa tài khoản này
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default EditUser;
