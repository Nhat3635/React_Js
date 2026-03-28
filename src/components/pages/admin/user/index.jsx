import React from 'react';
import { Link } from 'react-router-dom';

const UserManagement = () => {
    const users = [
        { id: 'USR-001', name: 'Nhật Hồ', email: 'nhatho@admin.com', role: 'Admin', status: 'Hoạt động', joinDate: '01/01/2026', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100\u0026q=80' },
        { id: 'USR-002', name: 'Trần An', email: 'tranan@email.com', role: 'Khách hàng', status: 'Hoạt động', joinDate: '28/03/2026', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100\u0026q=80' },
        { id: 'USR-003', name: 'Lê Thị Mai', email: 'maile@email.com', role: 'Khách hàng', status: 'Khóa', joinDate: '27/03/2026', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100\u0026q=80' },
        { id: 'USR-004', name: 'Phạm Vượng', email: 'vuongpham@email.com', role: 'Khách hàng', status: 'Hoạt động', joinDate: '26/03/2026', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100\u0026q=80' },
        { id: 'USR-005', name: 'Nguyễn Tâm', email: 'tamnguyen@email.com', role: 'Khách hàng', status: 'Chờ xác minh', joinDate: '25/03/2026', avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100\u0026q=80' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Hoạt động': return 'bg-green-50 text-green-600 border-green-100';
            case 'Khóa': return 'bg-red-50 text-red-600 border-red-100';
            case 'Chờ xác minh': return 'bg-orange-50 text-orange-600 border-orange-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Quản lý tài khoản</h1>
                    <p className="text-sm text-gray-400 mt-1 font-medium">Danh sách toàn bộ nhân viên và khách hàng trong hệ thống.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <input 
                            type="text" 
                            className="w-64 pl-4 pr-10 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange shadow-soft outline-none transition-all" 
                            placeholder="Tên, email, số điện thoại..." 
                        />
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[24px] shadow-soft border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
                                <th className="p-5 pl-8">Tài khoản</th>
                                <th className="p-5">Email</th>
                                <th className="p-5">Vai trò</th>
                                <th className="p-5">Ngày tham gia</th>
                                <th className="p-5">Trạng thái</th>
                                <th className="p-5 pr-8 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 italic-none">
                            {users.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="p-5 pl-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                                                <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-primary group-hover:text-brandOrange transition-colors">{item.name}</span>
                                                <span className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">{item.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 text-sm text-gray-500 font-medium">{item.email}</td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                            item.role === 'Admin' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-secondary text-gray-500 border border-gray-100'
                                        }`}>
                                            {item.role}
                                        </span>
                                    </td>
                                    <td className="p-5 text-sm text-gray-400">{item.joinDate}</td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-5 pr-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to="/admin/users/edit" className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-orange-50 hover:text-brandOrange transition-all" title="Chỉnh sửa">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                            </Link>
                                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all" title="Khóa/Mở khóa">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
