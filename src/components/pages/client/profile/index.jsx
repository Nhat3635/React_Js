import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import requestAPI from "../../../../api/index.jsx";

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await requestAPI({ method: "GET", url: "/users/profile" });
                setUserData(res.data.data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const getNavLinkClass = ({ isActive }) => {
        return isActive
            ? "profile-tab-btn flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-500 font-bold rounded-xl transition w-full text-left"
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
                            <h3 className="text-lg font-bold text-primary mb-1">{loading ? "Đang tải..." : userData?.full_name}</h3>
                            <p className="text-sm text-textMuted mb-8">{userData?.email || ""}</p>

                            {/* Menu Links */}
                            <nav className="w-full flex flex-col gap-2 text-left">
                                <NavLink 
                                    to="/profile" 
                                    className={({ isActive }) => {
                                        // Active if exactly /profile OR if at /profile/edit
                                        const isProfileActive = window.location.pathname === '/profile' || window.location.pathname === '/profile/edit';
                                        return getNavLinkClass({ isActive: isProfileActive });
                                    }} 
                                    preventScrollReset
                                >
                                    <svg className="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    Thông tin cá nhân
                                </NavLink>
                                <NavLink to="/profile/orders" className={getNavLinkClass} preventScrollReset>
                                    <svg className="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                    Đơn hàng của tôi
                                </NavLink>
                                <NavLink to="/profile/wishlist" className={getNavLinkClass} preventScrollReset>
                                    <svg className="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                    Danh sách yêu thích
                                </NavLink>
                                {userData?.role === 1 && (
                                <Link to="/admin" className="profile-tab-btn flex items-center gap-3 px-4 py-3 text-textMuted hover:bg-secondary hover:text-primary font-medium rounded-xl transition w-full text-left">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    Trang quản trị
                                </Link>
                                )}
                                <div className="h-px w-full bg-gray-100 my-2"></div>
                                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 font-medium rounded-xl transition w-full text-left">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                    Đăng xuất
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="lg:w-3/4 flex flex-col gap-8">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;