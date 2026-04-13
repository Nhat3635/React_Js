import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stateMessage = location.state?.message;
  
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAFA] text-primary px-6 selection:bg-orange-100 selection:text-orange-600">
      <div 
        className={`max-w-2xl w-full flex flex-col items-center text-center transition-all duration-1000 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Large 404 Typography */}
        <div className="relative mb-8">
          <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-700 to-gray-400 drop-shadow-sm select-none">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-500/10 blur-[80px] -z-10 rounded-full"></div>
        </div>

        {/* Text Content */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
          Ối! Trang này không tồn tại.
        </h2>
        <p className="text-gray-500 text-sm md:text-base max-w-lg mb-10 leading-relaxed">
          {stateMessage || "Có vẻ như đường dẫn bạn đang tìm kiếm đã bị di chuyển hoặc không còn tồn tại trong không gian của SmartLiving."}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-12">
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition shadow-[0_8px_20px_rgb(249,115,22,0.25)] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Quay về Trang chủ
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-gray-200 text-primary font-bold hover:border-orange-500 hover:text-orange-500 transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            Ghé thăm Cửa hàng
          </Link>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-md relative">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Bạn đang tìm kiếm sản phẩm nào...?"
              className="w-full pl-6 pr-14 py-4 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-orange-500 bg-gray-50 hover:bg-orange-50 rounded-full transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;