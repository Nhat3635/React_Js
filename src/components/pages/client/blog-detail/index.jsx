import React from 'react';
import { Link, useParams } from 'react-router-dom';

const BlogDetail = () => {
    const { id } = useParams();

    // Mock data for detail based on the requirements
    const blog = {
        title: "10 Cách Tối Ưu Không Gian Phòng Khách Nhỏ",
        category: "Mẹo nội thất",
        content: `
            Phòng khách không chỉ là nơi sinh hoạt chung của cả gia đình mà còn là bộ mặt của ngôi nhà. Tuy nhiên, việc sở hữu một phòng khách nhỏ đôi khi khiến gia chủ cảm thấy bế tắc trong việc sắp xếp và trang trí. Đừng lo lắng, SmartLiving sẽ gợi ý cho bạn 10 cách đơn giản nhưng cực kỳ hiệu quả để biến phòng khách nhỏ trở nên rộng rãi và sang trọng bất ngờ.

            Sử dụng bảng màu trung tính nhẹ nhàng như trắng, xám nhạt hoặc be giúp phản chiếu ánh sáng tự nhiên tốt hơn. Đây là bí quyết hàng đầu để "đánh lừa" thị giác, tạo cảm giác không gian mở và thoáng đãng. Bên cạnh đó, các vật liệu bằng kính hoặc gương cũng là trợ thủ đắc lực trong việc mở rộng diện tích căn phòng một cách tuyệt đối.

            Thay vì sử dụng một chiếc đèn chùm cồng kềnh ngay giữa phòng, hãy tận dụng ánh sáng tự nhiên càng nhiều càng tốt. Cửa sổ lớn với rèm voan mỏng trắng mờ sẽ giúp nguồn sáng len lỏi vào từng ngóc ngách, xua tan đi sự bí bách và ngột ngạt. Nếu căn phòng thiếu sáng tự nhiên, hãy bố trí các dải đèn LED ẩn tường hoặc đèn đứng mảnh mai ở các góc tối.

            Một sai lầm thường gặp ở các căn hộ nhỏ là sử dụng quá nhiều đồ nội thất rời rạc, làm vỡ vụn không gian. Hãy cân nhắc các món đồ "2 trong 1" như sofa có ngăn chứa đồ bên dưới, bàn trà tích hợp kệ sách hoặc kệ tivi treo tường thanh thoát. Khi tối giản hóa được số lượng đồ vật, bạn sẽ thấy căn phòng của mình tự động trở nên ngăn nắp và thư thái hơn bao giờ hết.`,
        author: "Nguyễn Văn An",
        date: "20 Tháng 5, 2024",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200",
        authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    };

    const relatedPosts = [
        {
            id: 2,
            title: "Xu Hướng Nội Thất Tối Giản Năm 2024",
            image: "https://images.unsplash.com/photo-1598928506311-c55f43f22876?auto=format&fit=crop&q=80&w=400",
            date: "18 Tháng 5, 2024"
        },
        {
            id: 3,
            title: "Bí Quyết Chọn Đèn Trang Trí Cho Phòng Ngủ",
            image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=400",
            date: "15 Tháng 5, 2024"
        },
        {
            id: 4,
            title: "Sử Dụng Màu Sắc Để Tạo Điểm Nhấn Cho Căn Hộ",
            image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=400",
            date: "12 Tháng 5, 2024"
        }
    ];

    return (
        <main className="bg-secondary min-h-screen">
            {/* Header / Hero Image */}
            <div className="w-full h-[500px] relative overflow-hidden">
                <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 text-white">
                    <span className="bg-brandOrange px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                        {blog.category}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
                        {blog.title}
                    </h1>
                </div>
            </div>

            {/* Content Area */}
            <div className="mt-10 max-w-4xl mx-auto px-6 -mt-20 relative z-10">
                <div className="bg-white rounded-t-[3rem] p-8 md:p-14 shadow-glass border border-gray-100">
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center justify-between gap-6 pb-10 border-b border-gray-100 mb-12">
                        <div className="flex items-center gap-4">
                            <img 
                                src={blog.authorImage} 
                                alt={blog.author} 
                                className="w-12 h-12 rounded-full object-cover border-2 border-brandLight shadow-sm"
                            />
                            <div>
                                <p className="text-xs text-textMuted uppercase font-bold tracking-widest">Đăng bởi</p>
                                <p className="text-primary font-semibold">{blog.author}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-textMuted uppercase font-bold tracking-widest">Ngày đăng</p>
                            <p className="text-primary font-semibold">{blog.date}</p>
                        </div>
                    </div>

                    {/* Body Text */}
                    <article className="prose prose-lg prose-gray max-w-none">
                        {blog.content.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="text-primary/80 leading-[1.8] text-lg mb-8 font-light tracking-wide">
                                {paragraph}
                            </p>
                        ))}

                        {/* Optional blockquote/highlight */}
                        <blockquote className="border-l-4 border-brandOrange pl-8 my-12 py-4 bg-brandLight/30 italic text-xl text-primary font-medium rounded-r-2xl">
                            "Không gian sống chính là nơi phản chiếu tâm hồn bạn. Hãy chăm chút cho từng ngóc ngách để mỗi khi trở về, bạn luôn cảm thấy được vỗ về và tái tạo năng lượng."
                        </blockquote>

                        <p className="text-primary/80 leading-[1.8] text-lg mb-8 font-light">
                            Tại SmartLiving, chúng tôi luôn nỗ lực mang đến những giải pháp tối ưu cho không gian sống của bạn. Hy vọng qua bài viết này, bạn đã tìm được nguồn cảm hứng để làm mới ngôi nhà thân yêu của mình. Đừng ngần ngại liên hệ với chúng tôi nếu bạn cần tư vấn chi tiết hơn về các sản phẩm nội thất hiện đại.
                        </p>
                    </article>

                    {/* Tags / Share */}
                    <div className="mt-16 pt-10 border-t border-gray-100 flex flex-wrap items-center justify-between gap-6">
                        <div className="flex gap-2">
                            <span className="px-5 py-2 bg-secondary rounded-full text-xs font-semibold text-textMuted border border-gray-100 hover:border-brandOrange hover:text-brandOrange transition-all cursor-pointer">#Interior</span>
                            <span className="px-5 py-2 bg-secondary rounded-full text-xs font-semibold text-textMuted border border-gray-100 hover:border-brandOrange hover:text-brandOrange transition-all cursor-pointer">#SmartLiving</span>
                            <span className="px-5 py-2 bg-secondary rounded-full text-xs font-semibold text-textMuted border border-gray-100 hover:border-brandOrange hover:text-brandOrange transition-all cursor-pointer">#Minimalist</span>
                        </div>
                        <div className="flex items-center gap-4 text-textMuted">
                            <span className="text-xs font-bold uppercase tracking-widest">Chia sẻ:</span>
                            <div className="flex gap-4">
                                <button className="hover:text-brandOrange transition-colors">FB</button>
                                <button className="hover:text-brandOrange transition-colors">TW</button>
                                <button className="hover:text-brandOrange transition-colors">INS</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Posts */}
                <div className="mt-24 pb-20">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-semibold text-primary after:content-[''] after:block after:w-12 after:h-1 after:bg-brandOrange after:mt-2">
                            Bài viết liên quan
                        </h3>
                        <Link to="/blog" className="text-sm font-bold text-brandOrange hover:underline italic">
                            Xem tất cả bài viết →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {relatedPosts.map((post) => (
                            <Link 
                                key={post.id} 
                                to={`/blog-detail/${post.id}`}
                                className="group flex flex-row md:flex-col lg:flex-row gap-4 bg-white p-4 rounded-[2rem] border border-gray-100/50 shadow-soft hover:shadow-lg transition-all items-center"
                            >
                                <div className="w-24 h-24 md:w-full md:h-48 lg:w-24 lg:h-24 overflow-hidden rounded-2xl shrink-0">
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="flex flex-col justify-center overflow-hidden">
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-brandOrange mb-1">{post.date}</p>
                                    <h4 className="text-sm font-semibold text-primary group-hover:text-brandOrange transition-colors line-clamp-2 leading-snug">
                                        {post.title}
                                    </h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default BlogDetail;
