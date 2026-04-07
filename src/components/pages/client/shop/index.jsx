import { Link } from "react-router-dom";

const Shop = () => {
    return (
        <div>
            <section className="bg-primary text-white py-16 px-6 md:px-12 flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight">Trọn Bộ Nội Thất</h1>
                <p className="text-sm text-gray-300 font-light flex items-center space-x-2">
                    <Link to="/" className="hover:text-orange-400 transition">Trang chủ</Link>
                    <span>/</span>
                    <span className="text-orange-400">Cửa hàng</span>
                </p>
            </section>

            {/* Main Content */}
            <section className="max-w-7xl mx-auto px-6 py-16 md:px-12 flex flex-col md:flex-row gap-12 relative w-full">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-1/4 md:sticky md:top-32 h-max space-y-8 pr-4">
                    {/* Category Filter */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">Danh mục</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center"><input type="checkbox" id="cat-chair" className="filter-checkbox w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" /><label htmlFor="cat-chair" className="ml-3 text-sm text-textMuted cursor-pointer hover:text-primary transition font-medium">Ghế & Sofa</label></li>
                            <li className="flex items-center"><input type="checkbox" id="cat-bed" className="filter-checkbox w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" /><label htmlFor="cat-bed" className="ml-3 text-sm text-textMuted cursor-pointer hover:text-primary transition font-medium">Giường ngủ</label></li>
                            <li className="flex items-center"><input type="checkbox" id="cat-lamp" className="filter-checkbox w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" /><label htmlFor="cat-lamp" className="ml-3 text-sm text-textMuted cursor-pointer hover:text-primary transition font-medium">Đèn trang trí</label></li>
                            <li className="flex items-center"><input type="checkbox" id="cat-table" className="filter-checkbox w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" /><label htmlFor="cat-table" className="ml-3 text-sm text-textMuted cursor-pointer hover:text-primary transition font-medium">Bàn làm việc</label></li>
                        </ul>
                    </div>

                    {/* Brand Filter */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">Thương hiệu</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {['IKEA', 'Ashley Furniture', 'Home Pro', 'Nội thất Xinh'].map(brand => (
                                <div key={brand} className="flex items-center group">
                                    <input type="checkbox" id={`brand-${brand}`} className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer" />
                                    <label htmlFor={`brand-${brand}`} className="ml-3 text-sm text-textMuted group-hover:text-primary transition cursor-pointer font-medium italic">{brand}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">Khoảng giá (₫)</h3>
                        <div className="flex items-center justify-between text-xs font-bold text-primary mb-2">
                            <span>0đ</span>
                            <span id="priceDisplay" className="text-orange-500">50.000.000đ</span>
                        </div>
                        <input type="range" min="0" max="50000000" defaultValue="50000000" id="priceRange" className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500 transition-all" />
                    </div>

                    {/* Colors */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">Màu sắc</h3>
                        <div className="flex gap-3">
                            <button className="color-filter w-6 h-6 rounded-full bg-black ring-2 ring-transparent focus:ring-gray-400" data-color="black" title="Đen"></button>
                            <button className="color-filter w-6 h-6 rounded-full bg-[#eaddcf] ring-2 ring-transparent focus:ring-gray-400 border border-gray-200" data-color="beige" title="Màu Be"></button>
                            <button className="color-filter w-6 h-6 rounded-full bg-[#773f1a] ring-2 ring-transparent focus:ring-gray-400" data-color="walnut" title="Gỗ Óc Chó"></button>
                            <button className="color-filter w-6 h-6 rounded-full bg-white ring-2 ring-transparent focus:ring-gray-400 border border-gray-300" data-color="white" title="Trắng"></button>
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">Đánh giá</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center"><input type="checkbox" id="rating-5" className="filter-checkbox w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" /><label htmlFor="rating-5" className="ml-3 text-sm text-yellow-400 cursor-pointer">★★★★★</label></li>
                            <li className="flex items-center"><input type="checkbox" id="rating-4" className="filter-checkbox w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" /><label htmlFor="rating-4" className="ml-3 text-sm text-yellow-400 cursor-pointer">★★★★☆ <span className="text-textMuted text-xs ml-1">Trở lên</span></label></li>
                            <li className="flex items-center"><input type="checkbox" id="rating-3" className="filter-checkbox w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" /><label htmlFor="rating-3" className="ml-3 text-sm text-yellow-400 cursor-pointer">★★★☆☆ <span className="text-textMuted text-xs ml-1">Trở lên</span></label></li>
                        </ul>
                    </div>
                </aside>

                {/* Product Grid Column */}
                <main className="w-full md:w-3/4">
                    {/* Top Controls */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200 gap-4">
                        <p className="text-sm text-textMuted">Đang hiển thị 1-9 trong số 36 sản phẩm</p>
                        <div className="flex items-center space-x-2">
                            <label htmlFor="sortDropdown" className="text-sm text-primary font-medium">Sắp xếp theo:</label>
                            <select id="sortDropdown" className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white text-textMuted focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer">
                                <option>Mới nhất</option>
                                <option>Giá: Thấp đến Cao</option>
                                <option>Giá: Cao xuống Thấp</option>
                                <option>Phổ biến nhất</option>
                            </select>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Product 1 */}
                        <div className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition flex flex-col group border border-gray-100 relative">
                            <Link to="/product-detail" className="h-56 bg-accent rounded-2xl mb-4 overflow-hidden relative block cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&q=80" alt="Sakarias Armchair" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300"></div>
                            </Link>
                            <div className="text-xs text-textMuted mb-1 uppercase tracking-wider font-bold italic">IKEA / Ghế</div>
                            <div className="text-lg font-semibold text-primary mb-1">Ghế Bành Sakarias</div>
                            <div className="flex items-center space-x-1 mb-3 text-xs text-yellow-400">★★★★★</div>
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 uppercase font-bold">Giá từ</span>
                                    <span className="text-lg font-extrabold text-primary">3.500.000đ</span>
                                </div>
                                <button className="w-10 h-10 rounded-full bg-primary text-white flex justify-center items-center hover:bg-orange-500 transition add-to-cart shadow-lg">+</button>
                            </div>
                        </div>
                        {/* Product 2 */}
                        <div className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition flex flex-col group border border-gray-100 relative">
                            <Link to="/product-detail" className="h-56 bg-accent rounded-2xl mb-4 overflow-hidden relative block cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80" alt="Baltsar Chair" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300"></div>
                            </Link>
                            <div className="text-xs text-textMuted mb-1 uppercase tracking-wider font-bold italic">Ashley / Ghế</div>
                            <div className="text-lg font-semibold text-primary mb-1">Ghế Baltsar Grey</div>
                            <div className="flex items-center space-x-1 mb-3 text-xs text-yellow-400">★★★★☆</div>
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 uppercase font-bold">Giá từ</span>
                                    <span className="text-lg font-extrabold text-primary">1.290.000đ</span>
                                </div>
                                <button className="w-10 h-10 rounded-full bg-primary text-white flex justify-center items-center hover:bg-orange-500 transition add-to-cart shadow-lg">+</button>
                            </div>
                        </div>
                         {/* Product 3 */}
                         <div className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition flex flex-col group border border-gray-100 relative">
                            <Link to="/product-detail" className="h-56 bg-accent rounded-2xl mb-4 overflow-hidden relative block cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&q=80" alt="Anjay Sofa" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300"></div>
                            </Link>
                            <div className="text-xs text-textMuted mb-1 uppercase tracking-wider font-bold italic">Home Pro / Sofa</div>
                            <div className="text-lg font-semibold text-primary mb-1">Sofa Góc Anjay</div>
                            <div className="flex items-center space-x-1 mb-3 text-xs text-yellow-400">★★★★★</div>
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 uppercase font-bold">Giá từ</span>
                                    <span className="text-lg font-extrabold text-primary">12.800.000đ</span>
                                </div>
                                <button className="w-10 h-10 rounded-full bg-primary text-white flex justify-center items-center hover:bg-orange-500 transition add-to-cart shadow-lg">+</button>
                            </div>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center space-x-2 mt-16 pt-8 border-t border-gray-100">
                        <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 hover:border-orange-500 transition text-textMuted text-sm font-medium opacity-50 cursor-not-allowed">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        </button>
                        <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-md">1</button>
                        <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 hover:border-orange-500 transition text-textMuted text-sm font-medium">2</button>
                        <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 hover:border-orange-500 transition text-textMuted text-sm font-medium">3</button>
                        <span className="text-gray-400 px-2">...</span>
                        <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 hover:border-orange-500 transition text-textMuted text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        </button>
                    </div>
                </main>
            </section>
        </div>
    )
}
export default Shop;