const Dashboard = () => {
    return (
        <div className="space-y-8">
            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-primary">Tổng quan</h1>
                <p className="text-sm text-gray-500 mt-1">Chào mừng bạn trở lại! Dưới đây là tình hình kinh doanh hôm nay.</p>
            </div>

            {/* 3. Overview Stats (Top Row) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stat 1 */}
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-50 flex flex-col justify-between hover:-translate-y-1 transition duration-300 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Tổng doanh thu</p>
                            <h3 className="text-2xl font-bold text-primary">2.450.000.000 ₫</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center text-green-500 font-medium bg-green-50 px-2 py-0.5 rounded-md">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            +12.5%
                        </span>
                        <span className="text-gray-500 text-xs">so với tháng trước</span>
                    </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-50 flex flex-col justify-between hover:-translate-y-1 transition duration-300 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Đơn hàng mới</p>
                            <h3 className="text-2xl font-bold text-primary">156</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center text-green-500 font-medium bg-green-50 px-2 py-0.5 rounded-md">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            +8.2%
                        </span>
                        <span className="text-gray-500 text-xs">so với tháng trước</span>
                    </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-50 flex flex-col justify-between hover:-translate-y-1 transition duration-300 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Sản phẩm đã bán</p>
                            <h3 className="text-2xl font-bold text-primary">1,248</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded-md">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                            -2.1%
                        </span>
                        <span className="text-gray-500 text-xs">so với tháng trước</span>
                    </div>
                </div>

                {/* Stat 4 */}
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-50 flex flex-col justify-between hover:-translate-y-1 transition duration-300 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Khách hàng mới</p>
                            <h3 className="text-2xl font-bold text-primary">89</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center text-green-500 font-medium bg-green-50 px-2 py-0.5 rounded-md">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            +14.5%
                        </span>
                        <span className="text-gray-500 text-xs">so với tháng trước</span>
                    </div>
                </div>
            </div>

            {/* 4. Data Visualizations (Middle Row) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-50 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-primary">Doanh thu 7 ngày qua</h3>
                        <select className="bg-gray-50 border-none text-sm outline-none rounded-lg px-3 py-1.5 text-gray-500 cursor-pointer">
                            <option>7 ngày qua</option>
                            <option>Tháng này</option>
                            <option>Năm nay</option>
                        </select>
                    </div>
                    <div className="h-72 w-full relative">
                        <canvas id="revenueChart"></canvas>
                    </div>
                </div>

                {/* Category Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-50 flex flex-col">
                    <h3 className="font-bold text-lg text-primary mb-6">Theo danh mục</h3>
                    <div className="flex-1 flex justify-center items-center relative h-48 w-full">
                        <canvas id="categoryChart"></canvas>
                        {/* Center text overlay for Doughnut */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-6">
                            <span className="text-2xl font-bold text-primary">100%</span>
                            <span className="text-xs text-gray-500">Tổng quan</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center text-sm"><span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: "#f97316"}}></span> Sofa</div>
                        <div className="flex items-center text-sm"><span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: "#fb923c"}}></span> Giường</div>
                        <div className="flex items-center text-sm"><span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: "#fdba74"}}></span> Bàn ghế</div>
                        <div className="flex items-center text-sm"><span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: "#ffedd5"}}></span> Đèn/Trang trí</div>
                    </div>
                </div>
            </div>

            {/* 5. Recent Orders Table (Bottom Section) */}
            <div className="bg-white rounded-2xl shadow-soft border border-gray-50 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                    <h3 className="font-bold text-lg text-primary">Đơn hàng gần đây</h3>
                    <a href="#" className="text-orange-500 text-sm font-medium hover:underline">Xem tất cả</a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-medium pl-6">Mã Đơn</th>
                                <th className="p-4 font-medium">Khách Hàng</th>
                                <th className="p-4 font-medium">Sản Phẩm</th>
                                <th className="p-4 font-medium">Tổng Tiền</th>
                                <th className="p-4 font-medium">Trạng Thái</th>
                                <th className="p-4 font-medium text-right pr-6">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 pl-6 font-medium text-primary">#ORD-0891</td>
                                <td className="p-4 text-gray-500 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex justify-center items-center font-bold text-xs">TA</div>
                                    Trần An
                                </td>
                                <td className="p-4 text-gray-500">Ghế bành Sakarias <span className="text-xs text-gray-400 block">+2 m...</span></td>
                                <td className="p-4 font-medium text-primary">12.500.000 ₫</td>
                                <td className="p-4">
                                    <span className="bg-orange-100 text-orange-500 px-3 py-1 rounded-full text-xs font-medium border border-orange-200">Đang xử lý</span>
                                </td>
                                <td className="p-4 text-right pr-6">
                                    <button className="text-gray-400 hover:text-orange-500 transition"><svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></button>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 pl-6 font-medium text-primary">#ORD-0890</td>
                                <td className="p-4 text-gray-500 flex items-center gap-3">
                                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" className="w-8 h-8 rounded-full object-cover" alt="User" />
                                    Lê Thị Mai
                                </td>
                                <td className="p-4 text-gray-500">Giường ngủ Minimalist</td>
                                <td className="p-4 font-medium text-primary">24.000.000 ₫</td>
                                <td className="p-4">
                                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium border border-green-200">Hoàn thành</span>
                                </td>
                                <td className="p-4 text-right pr-6">
                                    <button className="text-gray-400 hover:text-orange-500 transition"><svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></button>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 pl-6 font-medium text-primary">#ORD-0889</td>
                                <td className="p-4 text-gray-500 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex justify-center items-center font-bold text-xs">P</div>
                                    Phạm Vượng
                                </td>
                                <td className="p-4 text-gray-500">Đèn đứng hiện đại</td>
                                <td className="p-4 font-medium text-primary">1.800.000 ₫</td>
                                <td className="p-4">
                                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium border border-blue-200">Đang giao</span>
                                </td>
                                <td className="p-4 text-right pr-6">
                                    <button className="text-gray-400 hover:text-orange-500 transition"><svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></button>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 pl-6 font-medium text-primary">#ORD-0888</td>
                                <td className="p-4 text-gray-500 flex items-center gap-3">
                                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" className="w-8 h-8 rounded-full object-cover" alt="User" />
                                    Nguyễn Tâm
                                </td>
                                <td className="p-4 text-gray-500">Sofa văng nỉ cao cấp</td>
                                <td className="p-4 font-medium text-primary">15.200.000 ₫</td>
                                <td className="p-4">
                                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium border border-green-200">Hoàn thành</span>
                                </td>
                                <td className="p-4 text-right pr-6">
                                    <button className="text-gray-400 hover:text-orange-500 transition"><svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;