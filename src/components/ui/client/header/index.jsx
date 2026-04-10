import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const searchInputRef = useRef(null);
    const location = useLocation();
    const isHomePage = location.pathname === '/' || location.pathname === '/shop' || location.pathname === '/about';

    // Tính năng: Lắng nghe sự kiện cuộn trang từ script.js cũ
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            id="mainHeader"
            className={`fixed top-0 left-0 z-50 w-full px-6 py-4 md:px-12 md:py-6 flex justify-between items-center transition-all duration-300 border-b ${(isScrolled || !isHomePage)
                    ? "bg-white/95 backdrop-blur-md border-gray-200 text-primary shadow-sm"
                    : "bg-transparent text-white border-transparent"
                }`}
        >
            {/* Brand Logo */}
            <Link to="/">
                <div className="text-2xl font-semibold tracking-wide cursor-pointer">
                    SmartLiving
                </div>
            </Link>

            {/* Navigation Menu */}
            <nav className="hidden md:flex space-x-8 font-medium items-center absolute left-1/2 -translate-x-1/2 h-full top-0">
                {/* Mega Menu Trigger */}
                <div className="relative group cursor-pointer h-full flex items-center">
                    <div className="flex items-center space-x-1 hover:text-orange-400 transition py-6">
                        <span>Nội thất</span>
                        <svg className="w-4 h-4 transform group-hover:rotate-180 transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {/* Mega Menu Dropdown */}
                    <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[840px] bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[32px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 text-primary overflow-hidden pointer-events-none group-hover:pointer-events-auto">
                        <div className="grid grid-cols-4 gap-6 p-8">
                            {/* Column 1 */}
                            <div className="flex flex-col">
                                <h4 className="font-bold text-base mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-orange-500 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                    Phòng Khách
                                </h4>
                                <ul className="space-y-3 text-sm text-textMuted">
                                    <li><Link to="/shop?keyword=Sofa%20B%E1%BA%AFng" className="hover:text-orange-500 hover:translate-x-1 inline-block transition transform duration-300">Sofa Băng</Link></li>
                                    <li><Link to="/shop?keyword=Sofa%20G%C3%B3c" className="hover:text-orange-500 hover:translate-x-1 inline-block transition transform duration-300">Sofa Góc</Link></li>
                                    <li><Link to="/shop?keyword=B%C3%A0n%20Tr%C3%A0" className="hover:text-orange-500 hover:translate-x-1 inline-block transition transform duration-300">Bàn Trà</Link></li>
                                    <li><Link to="/shop?keyword=K%E1%BB%87%20Tivi" className="hover:text-orange-500 hover:translate-x-1 inline-block transition transform duration-300">Kệ Tivi</Link></li>
                                </ul>
                            </div>
                            {/* Column 2 */}
                            <div className="flex flex-col">
                                <h4 className="font-bold text-base mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-orange-500 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                    Phòng Ngủ
                                </h4>
                                <ul className="space-y-3 text-sm text-textMuted">
                                    <li><Link to="/shop?keyword=Gi%C6%B0%E1%BB%9Dng%20Ng%E1%BB%A7" className="hover:text-orange-500 hover:translate-x-1 inline-block transition transform duration-300">Giường Ngủ</Link></li>
                                    <li><Link to="/shop?keyword=T%E1%BB%A7%20Qu%E1%BA%A7n%20%C3%81o" className="hover:text-orange-500 hover:translate-x-1 inline-block transition transform duration-300">Tủ Quần Áo</Link></li>
                                    <li><Link to="/shop?keyword=Th%E1%BA%A3m%20Tr%E1%BA%A3i%20S%C3%A0n" className="hover:text-orange-500 hover:translate-x-1 inline-block transition transform duration-300">Thảm Trải Sàn</Link></li>
                                </ul>
                            </div>
                            {/* Column 3 */}
                            <div className="flex flex-col">
                                <h4 className="font-bold text-base mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-orange-500 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                                    </svg>
                                    Phòng Ăn
                                </h4>
                                <ul className="space-y-3 text-sm text-textMuted">
                                    <li><Link to="/shop?keyword=B%C3%A0n%20%C4%82n" className="hover:text-orange-500 hover:translate-x-1 inline-block transition transform duration-300">Bàn Ăn</Link></li>
                                    <li><Link to="/shop?keyword=B%C3%A0n%20Tr%C3%A0" className="hover:text-orange-500 hover:translate-x-1 inline-block transition transform duration-300">Bàn Trà</Link></li>
                                    <li><Link to="/shop?keyword=K%E1%BB%87%20Tivi" className="hover:text-orange-500 hover:translate-x-1 inline-block transition transform duration-300">Kệ Tivi</Link></li>
                                </ul>
                            </div>
                            {/* Column 4 */}
                            <div className="flex flex-col">
                                <h4 className="font-bold text-base mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-orange-500 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Văn Phòng
                                </h4>
                                <ul className="space-y-3 text-sm text-textMuted">
                                    <li><Link to="/shop?keyword=Gh%E1%BA%BF%20L%C3%A0m%20Vi%E1%BB%87c" className="hover:text-orange-500 hover:translate-x-1 inline-block transition transform duration-300">Ghế Làm Việc</Link></li>
                                    <li><Link to="/shop?keyword=Th%E1%BA%A3m%20Tr%E1%BA%A3i%20S%C3%A0n" className="hover:text-orange-500 hover:translate-x-1 inline-block transition transform duration-300">Thảm Trải Sàn</Link></li>
                                    <li><Link to="/shop?keyword=Sofa%20B%E1%BA%AFng" className="hover:text-orange-500 hover:translate-x-1 inline-block transition transform duration-300">Sofa Băng</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Other links */}
                <Link to="/shop" className="hover:text-orange-400 transition py-6">Cửa hàng</Link>
                <Link to="/about" className="hover:text-orange-400 transition py-6">Về chúng tôi</Link>
                <Link to="/contact" className="hover:text-orange-400 transition py-6">Liên hệ</Link>
                <Link to="/blog" className="hover:text-orange-400 transition py-6">Blog</Link>
            </nav>

            {/* Actions Group */}
            <div className="flex items-center space-x-4 md:space-x-6">
                {/* Search Bar */}
                <div className="hidden md:flex items-center relative group">
                    <input
                        type="text"
                        ref={searchInputRef}
                        placeholder="Tìm kiếm..."
                        className="w-0 overflow-hidden bg-transparent border-none outline-none text-sm transition-all duration-300 placeholder-current focus:w-40 px-0 focus:px-3 focus:border-b border-current opacity-0 focus:opacity-100"
                    />
                    <button
                        className="hover:text-orange-400 transition focus:outline-none"
                        onClick={() => searchInputRef.current?.focus()}
                        aria-label="Search"
                    >
                        <svg className="w-5 h-5 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>

                {/* Cart Icon with Badge */}
                <Link to="/cart" className="relative hover:text-orange-400 transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-transparent">
                        2
                    </span>
                </Link>

                {/* Account Icon */}
                <Link to="/profile" className="hover:text-orange-400 transition hidden md:block">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </Link>

                {/* Mobile Menu */}
                <button className="md:hidden transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default Header;
