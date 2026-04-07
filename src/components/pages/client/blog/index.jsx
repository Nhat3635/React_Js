import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BlogListing = () => {
    const [searchTerm, setSearchTerm] = useState("");

    // Mock data based on the requirements
    const blogs = [
        {
            id: 1,
            title: "10 Cách Tối Ưu Không Gian Phòng Khách Nhỏ",
            category: "Mẹo nội thất",
            excerpt: "Biến phòng khách chật hẹp trở nên rộng rãi và thoáng đãng hơn với những mẹo sắp xếp nội thất thông minh này...",
            author: "Nguyễn Văn An",
            date: "20/05/2024",
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 2,
            title: "Xu Hướng Nội Thất Tối Giản Năm 2024",
            category: "Xu hướng",
            excerpt: "Khám phá những phong cách thiết kế đang lên ngôi trong năm nay, từ màu sắc trung tính đến vật liệu bền vững...",
            author: "Trần Thị Bình",
            date: "18/05/2024",
            image: "https://images.unsplash.com/photo-1598928506311-c55f43f22876?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 3,
            title: "Bí Quyết Chọn Đèn Trang Trí Cho Phòng Ngủ",
            category: "Trang trí",
            excerpt: "Ánh sáng đóng vai trò quan trọng trong việc tạo nên không gian thư giãn. Hãy cùng tìm hiểu cách chọn đèn phù hợp...",
            author: "Lê Hoàng Nam",
            date: "15/05/2024",
            image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 4,
            title: "Sử Dụng Màu Sắc Để Tạo Điểm Nhấn Cho Căn Hộ",
            category: "Mẹo nội thất",
            excerpt: "Không cần thay đổi toàn bộ nội thất, chỉ một chút thay đổi về màu sắc cũng có thể làm mới không gian sống của bạn...",
            author: "Phạm Minh Đức",
            date: "12/05/2024",
            image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 5,
            title: "Cây Xanh Trong Nhà: Lợi Ích Và Cách Chăm Sóc",
            category: "Lối sống",
            excerpt: "Mang thiên nhiên vào nhà không chỉ làm đẹp không gian mà còn cải thiện sức khỏe tinh thần của các thành viên trong gia đình...",
            author: "Hoàng Thanh Thủy",
            date: "10/05/2024",
            image: "https://images.unsplash.com/photo-1540932239986-30128078f3ac?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 6,
            title: "Vật Liệu Gỗ Tự Nhiên Trong Thiết Kế Hiện Đại",
            category: "Vật liệu",
            excerpt: "Gỗ luôn là lựa chọn hàng đầu cho sự sang trọng. Tại sao gỗ tự nhiên vẫn giữ vững vị thế của mình qua nhiều thập kỷ?",
            author: "Đặng Văn Hùng",
            date: "08/05/2024",
            image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=800"
        }
    ];

    return (
        <main className="bg-secondary min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1920" 
                        alt="Blog Hero" 
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-secondary"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-semibold text-primary mb-6 tracking-tight">
                        Cảm hứng không gian sống
                    </h1>
                    <div className="relative max-w-xl mx-auto">
                        <div className="flex items-center bg-white/70 backdrop-blur-md rounded-full shadow-soft border border-white/50 p-1.5 transition-all focus-within:shadow-lg focus-within:bg-white/90">
                            <input 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm bài viết..."
                                className="flex-grow bg-transparent px-6 py-2.5 text-primary focus:outline-none placeholder-textMuted"
                            />
                            <button className="bg-brandOrange text-white p-2.5 rounded-full hover:bg-orange-600 transition shadow-md">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {blogs.map((blog) => (
                        <article 
                            key={blog.id} 
                            className="bg-white rounded-[2rem] overflow-hidden shadow-soft border border-gray-100 hover:shadow-xl transition-all duration-500 group flex flex-col h-full"
                        >
                            <Link to={`/blog-detail/${blog.id}`} className="block relative h-64 overflow-hidden">
                                <img 
                                    src={blog.image} 
                                    alt={blog.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                />
                                <div className="absolute top-5 left-5">
                                    <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-brandOrange uppercase tracking-wider shadow-sm border border-white/50">
                                        {blog.category}
                                    </span>
                                </div>
                            </Link>

                            <div className="p-8 flex flex-col flex-grow">
                                <Link to={`/blog-detail/${blog.id}`}>
                                    <h2 className="text-2xl font-semibold text-primary mb-4 group-hover:text-brandOrange transition-colors line-clamp-2">
                                        {blog.title}
                                    </h2>
                                </Link>
                                <p className="text-textMuted mb-6 line-clamp-3 leading-relaxed">
                                    {blog.excerpt}
                                </p>
                                
                                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brandLight flex items-center justify-center text-brandOrange font-bold text-xs border border-orange-100">
                                            {blog.author.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-primary">{blog.author}</p>
                                            <p className="text-[10px] text-textMuted">{blog.date}</p>
                                        </div>
                                    </div>

                                    <Link 
                                        to={`/blog-detail/${blog.id}`} 
                                        className="flex items-center gap-2 text-sm font-bold text-brandOrange hover:gap-3 transition-all"
                                    >
                                        Đọc thêm
                                        <span>→</span>
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-20 flex items-center justify-center gap-4">
                    <button className="px-8 py-3 rounded-full border border-gray-200 text-sm font-semibold text-textMuted hover:bg-white hover:text-brandOrange hover:border-brandOrange transition-all shadow-sm">
                        Trang trước
                    </button>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-full bg-brandOrange text-white text-sm font-semibold shadow-md">1</button>
                        <button className="w-10 h-10 rounded-full bg-white border border-gray-100 text-primary text-sm font-semibold hover:border-brandOrange transition-all shadow-sm">2</button>
                        <button className="w-10 h-10 rounded-full bg-white border border-gray-100 text-primary text-sm font-semibold hover:border-brandOrange transition-all shadow-sm">3</button>
                    </div>
                    <button className="px-8 py-3 rounded-full border border-gray-200 text-sm font-semibold text-textMuted hover:bg-white hover:text-brandOrange hover:border-brandOrange transition-all shadow-sm">
                        Trang sau
                    </button>
                </div>
            </section>
        </main>
    );
};

export default BlogListing;
