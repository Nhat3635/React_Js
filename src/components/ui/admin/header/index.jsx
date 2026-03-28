const AdminHeader = () => {
    return (
        <header className="h-20 glass-panel flex items-center justify-between px-8 z-10 sticky top-0 border-b border-gray-100/50">
            {/* Search */}
            <div className="relative w-96 group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input 
                    type="text" 
                    className="bg-white/50 border border-gray-200 text-sm rounded-full focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 block w-full pl-11 p-2.5 transition-all outline-none backdrop-blur-sm" 
                    placeholder="Tìm kiếm đơn hàng, khách hàng..." 
                />
            </div>

            {/* Profile & Notifications */}
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:text-orange-500 transition-colors rounded-full hover:bg-gray-100">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-orange-500 border-2 border-white rounded-full"></span>
                </button>
                
                <div className="h-8 w-px bg-gray-200"></div>

                {/* Profile */}
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-semibold text-primary group-hover:text-orange-500 transition-colors">Admin: Nhật Hồ</div>
                        <div className="text-xs text-gray-500">Quản lý Cấp cao</div>
                    </div>
                    <img className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Admin Profile" />
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;