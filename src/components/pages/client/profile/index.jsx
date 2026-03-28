import { useState } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
    // Quản lý Tab hiển thị
    const [activeTab, setActiveTab] = useState("info");
    // Quản lý trạng thái Modal thêm địa chỉ
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Hàm tiện hướng xử lý màu nút khi được chọn
    const getTabClass = (tabName) => {
        return activeTab === tabName
            ? "profile-tab-btn flex items-center gap-3 px-4 py-3 bg-secondary text-primary font-semibold rounded-xl transition w-full text-left"
            : "profile-tab-btn flex items-center gap-3 px-4 py-3 text-textMuted hover:bg-secondary hover:text-primary font-medium rounded-xl transition w-full text-left";
    };

    return (
        <div>
            {/* Main Content */}
            <main className="mt-20 max-w-7xl mx-auto px-6 py-16 md:px-12 w-full flex-grow relative">
                <h1 className="text-3xl md:text-4xl font-semibold mb-10 text-primary">Tài khoản của tôi</h1>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Left Sidebar Navigation */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center lg:sticky lg:top-32">
                            {/* Avatar */}
                            <div className="relative mb-4 group cursor-pointer inline-block">
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-secondary" />
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-primary mb-1">Trần Anh Thư</h3>
                            <p className="text-sm text-textMuted mb-8">Thành viên thân thiết</p>

                            {/* Menu Links */}
                            <nav className="w-full flex flex-col gap-2 text-left">
                                <button onClick={() => setActiveTab('info')} className={getTabClass('info')}>
                                    <svg className={`w-5 h-5 ${activeTab === 'info' ? 'text-orange-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    Thông tin cá nhân
                                </button>
                                <button onClick={() => setActiveTab('orders')} className={getTabClass('orders')}>
                                    <svg className={`w-5 h-5 ${activeTab === 'orders' ? 'text-orange-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                    Đơn hàng của tôi
                                </button>
                                <button onClick={() => setActiveTab('wishlist')} className={getTabClass('wishlist')}>
                                    <svg className={`w-5 h-5 ${activeTab === 'wishlist' ? 'text-orange-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                    Danh sách yêu thích
                                </button>
                                <button onClick={() => setActiveTab('addresses')} className={getTabClass('addresses')}>
                                    <svg className={`w-5 h-5 ${activeTab === 'addresses' ? 'text-orange-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                    Địa chỉ nhận hàng
                                </button>
                                <div className="h-px w-full bg-gray-100 my-2"></div>
                                <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 font-medium rounded-xl transition w-full text-left">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                    Đăng xuất
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="lg:w-3/4 flex flex-col gap-8">

                        {/* Tab 1: Personal Info */}
                        <div id="tabInfo" className={`profile-content bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100 relative ${activeTab === 'info' ? 'block' : 'hidden'}`}>
                            <h2 className="text-2xl font-bold text-primary mb-8 px-1">Chỉnh sửa thông tin cá nhân</h2>

                            <form className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-textMuted px-1">Họ và tên</label>
                                        <input type="text" defaultValue="Trần Anh Thư" className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-secondary transition text-sm" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-textMuted px-1">Số điện thoại</label>
                                        <input type="tel" defaultValue="0987 654 321" className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-secondary transition text-sm" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-textMuted px-1">Địa chỉ Email</label>
                                        <input type="email" defaultValue="anhthu.tran@example.com" className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-secondary transition text-sm" readOnly />
                                        <span className="text-xs text-green-500 px-1 font-medium mt-1">Đã xác minh</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-textMuted px-1">Ngày sinh</label>
                                        <input type="date" defaultValue="1995-10-15" className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-secondary transition text-sm text-primary" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-textMuted px-1">Giới tính</label>
                                    <div className="flex gap-6 mt-2 px-1">
                                        <label className="flex items-center cursor-pointer">
                                            <input type="radio" name="gender" className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" defaultChecked />
                                            <span className="ml-2 text-primary text-sm font-medium">Nữ</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input type="radio" name="gender" className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" />
                                            <span className="ml-2 text-primary text-sm font-medium">Nam</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input type="radio" name="gender" className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" />
                                            <span className="ml-2 text-primary text-sm font-medium">Khác</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button type="button" className="bg-orange-500 text-white px-10 py-4 rounded-xl font-bold hover:bg-primary transition duration-300 shadow-md">
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Tab 2: Recent Orders */}
                        <div id="tabOrders" className={`profile-content bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100 relative ${activeTab === 'orders' ? 'block' : 'hidden'}`}>
                            <h2 className="text-2xl font-bold text-primary mb-8 px-1">Đơn hàng gần đây</h2>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-sm text-textMuted uppercase tracking-wider">
                                            <th className="py-4 px-2 font-medium">Mã đơn hàng</th>
                                            <th className="py-4 px-2 font-medium">Ngày đặt</th>
                                            <th className="py-4 px-2 font-medium">Tổng tiền</th>
                                            <th className="py-4 px-2 font-medium">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-primary">
                                        <tr className="border-b border-gray-50 hover:bg-gray-50 transition">
                                            <td className="py-5 px-2 font-semibold">#SL-29014</td>
                                            <td className="py-5 px-2 text-textMuted">25 Th03, 2026</td>
                                            <td className="py-5 px-2 font-semibold">$911.00</td>
                                            <td className="py-5 px-2">
                                                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-blue-50 text-blue-600 font-medium text-xs">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                    Đang giao
                                                </span>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-50 hover:bg-gray-50 transition">
                                            <td className="py-5 px-2 font-semibold">#SL-28492</td>
                                            <td className="py-5 px-2 text-textMuted">10 Th12, 2025</td>
                                            <td className="py-5 px-2 font-semibold">$345.00</td>
                                            <td className="py-5 px-2">
                                                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-green-50 text-green-600 font-medium text-xs">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                    Đã hoàn thành
                                                </span>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition">
                                            <td className="py-5 px-2 font-semibold">#SL-27103</td>
                                            <td className="py-5 px-2 text-textMuted">02 Th11, 2025</td>
                                            <td className="py-5 px-2 font-semibold">$1250.00</td>
                                            <td className="py-5 px-2">
                                                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-green-50 text-green-600 font-medium text-xs">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                    Đã hoàn thành
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Tab 3: Wishlist */}
                        <div id="tabWishlist" className={`profile-content bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100 relative ${activeTab === 'wishlist' ? 'block' : 'hidden'}`}>
                            <h2 className="text-2xl font-bold text-primary mb-8 px-1">Danh sách yêu thích</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Wishlist Item 1 */}
                                <div className="flex gap-4 p-4 border border-gray-100 rounded-2xl hover:shadow-md transition bg-white">
                                    <img src="https://images.unsplash.com/photo-1592078615290-033ee584e267?w=150&q=80" alt="Sakarias Armchair" className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl bg-secondary shrink-0" />
                                    <div className="flex flex-col justify-center flex-grow">
                                        <h3 className="font-semibold text-primary text-base">Ghế bành Sakarias</h3>
                                        <div className="text-orange-500 font-bold mt-1 text-lg">$392 <span className="text-xs text-textMuted font-normal line-through ml-1">$450</span></div>
                                        <div className="mt-auto flex items-center gap-3 text-sm font-medium pt-3">
                                            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition text-xs">Thêm vào giỏ</button>
                                            <button className="text-textMuted hover:text-red-500 transition text-xs flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Wishlist Item 2 */}
                                <div className="flex gap-4 p-4 border border-gray-100 rounded-2xl hover:shadow-md transition bg-white">
                                    <img src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=150&q=80" alt="Anjay Sofa" className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl bg-secondary shrink-0" />
                                    <div className="flex flex-col justify-center flex-grow">
                                        <h3 className="font-semibold text-primary text-base">Sofa chữ L Anjay</h3>
                                        <div className="text-orange-500 font-bold mt-1 text-lg">$519</div>
                                        <div className="mt-auto flex items-center gap-3 text-sm font-medium pt-3">
                                            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition text-xs">Thêm vào giỏ</button>
                                            <button className="text-textMuted hover:text-red-500 transition text-xs flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tab 4: Addresses */}
                        <div id="tabAddresses" className={`profile-content bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100 relative ${activeTab === 'addresses' ? 'block' : 'hidden'}`}>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 px-1 gap-4">
                                <h2 className="text-2xl font-bold text-primary">Địa chỉ nhận hàng</h2>
                                <button onClick={() => setIsModalOpen(true)} className="bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white px-5 py-2.5 rounded-full text-sm font-bold transition duration-300 shadow-sm flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                    Thêm địa chỉ mới
                                </button>
                            </div>

                            <div className="flex flex-col gap-5">
                                {/* Default Address */}
                                <div className="p-6 border-2 border-orange-200 bg-orange-50/40 rounded-2xl relative shadow-sm hover:shadow-md transition">
                                    <span className="absolute top-6 right-6 bg-orange-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded inline-block">Mặc định</span>
                                    <div className="font-bold text-primary flex items-center gap-2 text-lg mb-1 pr-20">
                                        Trần Anh Thư <span className="text-sm font-normal text-gray-300">|</span> <span className="text-sm font-medium text-textMuted">0987 654 321</span>
                                    </div>
                                    <p className="text-textMuted text-sm mb-4 leading-relaxed mt-2 max-w-md">123 Đường Ba Tháng Hai, Phường Xuân Khánh,<br />Quận Ninh Kiều, TP. Cần Thơ</p>
                                    <div className="flex gap-4 text-sm font-semibold">
                                        <button className="text-orange-500 hover:text-orange-600 transition underline underline-offset-4 decoration-orange-200">Cập nhật</button>
                                    </div>
                                </div>

                                {/* Other Address */}
                                <div className="p-6 border border-gray-200 bg-white rounded-2xl relative shadow-sm hover:shadow-md transition group">
                                    <div className="font-bold text-primary flex items-center gap-2 text-lg mb-1">
                                        Trần Anh Thư <span className="text-sm font-normal text-gray-300">|</span> <span className="text-sm font-medium text-textMuted">0912 345 678</span>
                                    </div>
                                    <p className="text-textMuted text-sm mb-4 leading-relaxed mt-2 max-w-md">Khu dân cư Hưng Phú, Phường Hưng Phú,<br />Quận Cái Răng, TP. Cần Thơ</p>
                                    <div className="flex flex-wrap gap-4 text-sm font-semibold">
                                        <button className="text-primary hover:text-orange-500 transition underline underline-offset-4 decoration-gray-200 group-hover:decoration-orange-200">Cập nhật</button>
                                        <span className="text-gray-200">|</span>
                                        <button className="text-red-400 hover:text-red-500 transition underline underline-offset-4 decoration-gray-100">Xóa</button>
                                        <span className="text-gray-200">|</span>
                                        <button className="text-textMuted hover:text-orange-500 transition underline underline-offset-4 decoration-gray-100">Thiết lập mặc định</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Add Address Modal Component Simulation */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300">
                    {/* Modal Backdrop */}
                    <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>

                    {/* Modal Content */}
                    <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl relative z-10 transform transition-transform duration-300 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-primary">Thêm địa chỉ mới</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition focus:outline-none bg-gray-50 hover:bg-red-50 p-2 rounded-full">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Body Area */}
                        <div className="p-8 overflow-y-auto">
                            <form className="flex flex-col gap-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-primary px-1">Họ và tên</label>
                                        <input type="text" placeholder="Nhập họ và tên" required className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-secondary transition text-sm" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-primary px-1">Số điện thoại</label>
                                        <input type="tel" placeholder="Nhập số điện thoại" required className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-secondary transition text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-primary px-1">Tỉnh/Thành phố</label>
                                        <select required defaultValue="" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-secondary transition text-sm text-textMuted cursor-pointer">
                                            <option value="" disabled>Chọn Tỉnh/Thành phố</option>
                                            <option value="CT">Cần Thơ</option>
                                            <option value="HCM">Hồ Chí Minh</option>
                                            <option value="HN">Hà Nội</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-primary px-1">Quận/Huyện</label>
                                        <select required defaultValue="" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-secondary transition text-sm text-textMuted cursor-pointer">
                                            <option value="" disabled>Chọn Quận/Huyện</option>
                                            <option value="NK">Ninh Kiều</option>
                                            <option value="CR">Cái Răng</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-primary px-1">Phường/Xã</label>
                                    <select required defaultValue="" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-secondary transition text-sm text-textMuted cursor-pointer">
                                        <option value="" disabled>Chọn Phường/Xã</option>
                                        <option value="XK">Xuân Khánh</option>
                                        <option value="HP">Hưng Phú</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-primary px-1">Địa chỉ cụ thể</label>
                                    <textarea placeholder="Số nhà, tên đường..." required rows="2" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-secondary transition text-sm resize-none"></textarea>
                                </div>

                                {/* Checkbox Default */}
                                <div className="flex items-center mt-2 px-1">
                                    <label className="flex items-center cursor-pointer group">
                                        <input type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
                                        <span className="ml-2.5 font-medium text-sm text-textMuted group-hover:text-primary transition">Đặt làm địa chỉ mặc định</span>
                                    </label>
                                </div>
                            </form>
                        </div>

                        {/* Footer Buttons */}
                        <div className="px-8 py-6 border-t border-gray-50 flex justify-end gap-3 bg-gray-50/50">
                            <button onClick={() => setIsModalOpen(false)} type="button" className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-bold text-textMuted hover:bg-gray-100 hover:text-primary transition duration-300 shadow-sm">Hủy</button>
                            <button type="button" className="px-6 py-3 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition shadow-[0_4px_14px_0_rgb(249,115,22,0.39)]">Lưu địa chỉ</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;