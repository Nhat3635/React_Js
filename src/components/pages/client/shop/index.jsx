import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const ALL_PRODUCTS = [
    { id: 1, name: "Ghế Bành Sakarias", brand: "IKEA", category: "chair", price: 3500000, rating: 5, color: "beige", image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&q=80", isNew: true },
    { id: 2, name: "Ghế Baltsar Grey", brand: "Ashley Furniture", category: "chair", price: 1290000, rating: 4, color: "black", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80", isNew: false },
    { id: 3, name: "Sofa Góc Anjay", brand: "Home Pro", category: "chair", price: 12800000, rating: 5, color: "beige", image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&q=80", isNew: true },
    { id: 4, name: "Giường Gỗ Sồi Premium", brand: "Nội thất Xinh", category: "bed", price: 8500000, rating: 5, color: "walnut", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", isNew: false },
    { id: 5, name: "Giường Platform Modern", brand: "IKEA", category: "bed", price: 5200000, rating: 4, color: "white", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80", isNew: true },
    { id: 6, name: "Đèn Trần Scandinavian", brand: "Ashley Furniture", category: "lamp", price: 950000, rating: 4, color: "white", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80", isNew: false },
    { id: 7, name: "Đèn Đứng Arc Gold", brand: "Home Pro", category: "lamp", price: 2100000, rating: 5, color: "beige", image: "https://images.unsplash.com/photo-1513506003901-1e6a35c54e4f?w=600&q=80", isNew: true },
    { id: 8, name: "Bàn Làm Việc Walnut", brand: "Nội thất Xinh", category: "table", price: 4800000, rating: 5, color: "walnut", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80", isNew: false },
    { id: 9, name: "Bàn Đứng Điều Chỉnh Chiều Cao", brand: "IKEA", category: "table", price: 6900000, rating: 4, color: "black", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80", isNew: true },
    { id: 10, name: "Sofa Góc Chữ L Luxury", brand: "Ashley Furniture", category: "chair", price: 22000000, rating: 5, color: "beige", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80", isNew: true },
    { id: 11, name: "Đèn Bàn Làm Việc LED", brand: "Home Pro", category: "lamp", price: 450000, rating: 3, color: "white", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80", isNew: false },
    { id: 12, name: "Giường Ngủ Nệm Gắn Liền", brand: "Ashley Furniture", category: "bed", price: 15000000, rating: 5, color: "beige", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80", isNew: false },
];

const CATEGORIES = [
    { value: "chair", label: "Ghế & Sofa" },
    { value: "bed", label: "Giường ngủ" },
    { value: "lamp", label: "Đèn trang trí" },
    { value: "table", label: "Bàn làm việc" },
];

const BRANDS = ["IKEA", "Ashley Furniture", "Home Pro", "Nội thất Xinh"];

const COLORS = [
    { value: "black", bg: "bg-black", title: "Đen" },
    { value: "beige", bg: "bg-[#eaddcf] border border-gray-200", title: "Màu Be" },
    { value: "walnut", bg: "bg-[#773f1a]", title: "Gỗ Óc Chó" },
    { value: "white", bg: "bg-white border border-gray-300", title: "Trắng" },
];

const ITEMS_PER_PAGE = 6;

const StarDisplay = ({ rating }) => (
    <span className="text-yellow-400 text-xs">
        {[1, 2, 3, 4, 5].map(s => (
            <span key={s}>{s <= rating ? "★" : "☆"}</span>
        ))}
    </span>
);

const Shop = () => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [maxPrice, setMaxPrice] = useState(50000000);
    const [selectedColors, setSelectedColors] = useState([]);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);

    const toggleFilter = (value, setter, list) => {
        setter(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
        setCurrentPage(1);
    };

    const handleRatingFilter = (rating, checked) => {
        setMinRating(checked ? rating : 0);
        setCurrentPage(1);
    };

    const handlePriceChange = (e) => {
        setMaxPrice(Number(e.target.value));
        setCurrentPage(1);
    };

    const filteredAndSorted = useMemo(() => {
        let result = ALL_PRODUCTS.filter(p => {
            if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
            if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
            if (p.price > maxPrice) return false;
            if (selectedColors.length > 0 && !selectedColors.includes(p.color)) return false;
            if (p.rating < minRating) return false;
            return true;
        });

        if (sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
        else if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
        else if (sortBy === "popular") result = [...result].sort((a, b) => b.rating - a.rating);
        else result = [...result].sort((a, b) => b.id - a.id);

        return result;
    }, [selectedCategories, selectedBrands, maxPrice, selectedColors, minRating, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedProducts = filteredAndSorted.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

    const formatPrice = (price) =>
        price.toLocaleString("vi-VN") + "đ";

    const startItem = filteredAndSorted.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(safePage * ITEMS_PER_PAGE, filteredAndSorted.length);

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
                            {CATEGORIES.map(cat => (
                                <li key={cat.value} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`cat-${cat.value}`}
                                        checked={selectedCategories.includes(cat.value)}
                                        onChange={e => toggleFilter(cat.value, setSelectedCategories, selectedCategories)}
                                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                                    />
                                    <label htmlFor={`cat-${cat.value}`} className="ml-3 text-sm text-textMuted cursor-pointer hover:text-primary transition font-medium">{cat.label}</label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Brand Filter */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">Thương hiệu</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {BRANDS.map(brand => (
                                <div key={brand} className="flex items-center group">
                                    <input
                                        type="checkbox"
                                        id={`brand-${brand}`}
                                        checked={selectedBrands.includes(brand)}
                                        onChange={() => toggleFilter(brand, setSelectedBrands, selectedBrands)}
                                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                                    />
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
                            <span className="text-orange-500">{formatPrice(maxPrice)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="50000000"
                            step="500000"
                            value={maxPrice}
                            onChange={handlePriceChange}
                            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500 transition-all"
                        />
                    </div>

                    {/* Colors */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">Màu sắc</h3>
                        <div className="flex gap-3">
                            {COLORS.map(c => (
                                <button
                                    key={c.value}
                                    onClick={() => toggleFilter(c.value, setSelectedColors, selectedColors)}
                                    className={`w-6 h-6 rounded-full ${c.bg} transition ${selectedColors.includes(c.value) ? "ring-2 ring-orange-500 ring-offset-1" : "ring-2 ring-transparent"}`}
                                    title={c.title}
                                    aria-pressed={selectedColors.includes(c.value)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">Đánh giá</h3>
                        <ul className="space-y-3">
                            {[5, 4, 3].map(r => (
                                <li key={r} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`rating-${r}`}
                                        checked={minRating === r}
                                        onChange={e => handleRatingFilter(r, e.target.checked)}
                                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                                    />
                                    <label htmlFor={`rating-${r}`} className="ml-3 text-sm text-yellow-400 cursor-pointer flex items-center gap-1">
                                        <StarDisplay rating={r} />
                                        {r < 5 && <span className="text-textMuted text-xs">Trở lên</span>}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Reset Filters */}
                    {(selectedCategories.length > 0 || selectedBrands.length > 0 || selectedColors.length > 0 || minRating > 0 || maxPrice < 50000000) && (
                        <button
                            onClick={() => {
                                setSelectedCategories([]);
                                setSelectedBrands([]);
                                setSelectedColors([]);
                                setMinRating(0);
                                setMaxPrice(50000000);
                                setCurrentPage(1);
                            }}
                            className="w-full py-2 text-sm text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-50 transition font-semibold"
                        >
                            Xóa bộ lọc
                        </button>
                    )}
                </aside>

                {/* Product Grid Column */}
                <main className="w-full md:w-3/4">
                    {/* Top Controls */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200 gap-4">
                        <p className="text-sm text-textMuted">
                            {filteredAndSorted.length === 0
                                ? "Không tìm thấy sản phẩm phù hợp"
                                : `Đang hiển thị ${startItem}–${endItem} trong số ${filteredAndSorted.length} sản phẩm`}
                        </p>
                        <div className="flex items-center space-x-2">
                            <label htmlFor="sortDropdown" className="text-sm text-primary font-medium">Sắp xếp theo:</label>
                            <select
                                id="sortDropdown"
                                value={sortBy}
                                onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
                                className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white text-textMuted focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="price-asc">Giá: Thấp đến Cao</option>
                                <option value="price-desc">Giá: Cao xuống Thấp</option>
                                <option value="popular">Phổ biến nhất</option>
                            </select>
                        </div>
                    </div>

                    {/* Grid */}
                    {paginatedProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-textMuted">
                            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-lg font-semibold mb-1">Không có sản phẩm phù hợp</p>
                            <p className="text-sm">Hãy thử điều chỉnh bộ lọc của bạn</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginatedProducts.map(product => (
                                <div key={product.id} className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition flex flex-col group border border-gray-100 relative">
                                    {product.isNew && (
                                        <span className="absolute top-7 left-7 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">Mới</span>
                                    )}
                                    <Link to={`/product-detail/${product.id}`} className="h-56 bg-accent rounded-2xl mb-4 overflow-hidden relative block cursor-pointer">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300"></div>
                                    </Link>
                                    <div className="text-xs text-textMuted mb-1 uppercase tracking-wider font-bold italic">{product.brand} / {CATEGORIES.find(c => c.value === product.category)?.label}</div>
                                    <div className="text-lg font-semibold text-primary mb-1">{product.name}</div>
                                    <div className="flex items-center space-x-1 mb-3">
                                        <StarDisplay rating={product.rating} />
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Giá từ</span>
                                            <span className="text-lg font-extrabold text-primary">{formatPrice(product.price)}</span>
                                        </div>
                                        <Link
                                            to={`/product-detail/${product.id}`}
                                            className="w-10 h-10 rounded-full bg-primary text-white flex justify-center items-center hover:bg-orange-500 transition shadow-lg"
                                            title="Xem chi tiết"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-16 pt-8 border-t border-gray-100">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={safePage === 1}
                                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 hover:border-orange-500 transition text-textMuted text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition ${safePage === page ? "bg-primary text-white shadow-md" : "border border-gray-200 text-textMuted hover:bg-orange-50 hover:text-orange-500 hover:border-orange-500"}`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={safePage === totalPages}
                                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 hover:border-orange-500 transition text-textMuted text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                        </div>
                    )}
                </main>
            </section>
        </div>
    );
};

export default Shop;
