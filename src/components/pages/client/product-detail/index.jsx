import { useState } from "react";
import { Link } from "react-router-dom";

const INITIAL_REVIEWS = [
    {
        id: 1,
        name: "Bang Upin",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
        rating: 5,
        date: "12 Th4, 2026",
        comment: "Sofa rất êm, màu xám khói đẹp vừa in với phòng khách nhà mình. Đặc biệt vải nhung sờ rất mát tay, không bị rít hay nóng như mình tưởng. Nhân viên giao hàng nhiệt tình, lắp ráp nhanh gọn lẹ. Sẽ ủng hộ tiếp!",
        verified: true,
    },
    {
        id: 2,
        name: "Ibuk Sukijan",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
        rating: 5,
        date: "28 Th3, 2026",
        comment: "Kiểu dáng sang trọng, đúng phong cách minimalist mà mình đang theo đuổi. Khung gỗ sồi rất chắc chắn, mình có thể cảm nhận được sức chất lượng tốt ngay từ lần đầu tiên ngồi xuống.",
        verified: true,
    },
];

const StarPicker = ({ value, hovered, onHover, onLeave, onClick }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
            <button
                key={star}
                type="button"
                onMouseEnter={() => onHover(star)}
                onMouseLeave={onLeave}
                onClick={() => onClick(star)}
                className="text-2xl focus:outline-none transition-transform hover:scale-110"
                aria-label={`${star} sao`}
            >
                <span className={(hovered || value) >= star ? "text-orange-400" : "text-gray-300"}>★</span>
            </button>
        ))}
    </div>
);

const StarDisplay = ({ rating, size = "text-sm" }) => (
    <span className={`${size} text-orange-400`}>
        {[1, 2, 3, 4, 5].map(s => (
            <span key={s}>{s <= Math.round(rating) ? "★" : "☆"}</span>
        ))}
    </span>
);

const ProductDetail = () => {
    const [mainImage, setMainImage] = useState("https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&q=80");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("desc");

    // Reviews state
    const [reviews, setReviews] = useState(INITIAL_REVIEWS);
    const [reviewerName, setReviewerName] = useState("");
    const [reviewRating, setReviewRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const thumbnails = [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&q=80",
        "https://images.unsplash.com/photo-1493663284031-b7e3a9032ff1?w=1000&q=80",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1000&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&q=80",
    ];

    const handleQuantityChange = (type) => {
        if (type === "minus" && quantity > 1) setQuantity(q => q - 1);
        else if (type === "plus") setQuantity(q => q + 1);
    };

    // Calculate average rating
    const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length,
        pct: reviews.length > 0 ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0,
    }));

    const validateForm = () => {
        const errors = {};
        if (!reviewerName.trim()) errors.name = "Vui lòng nhập tên của bạn.";
        if (reviewRating === 0) errors.rating = "Vui lòng chọn số sao đánh giá.";
        if (!reviewComment.trim()) errors.comment = "Vui lòng nhập nội dung đánh giá.";
        else if (reviewComment.trim().length < 10) errors.comment = "Đánh giá cần ít nhất 10 ký tự.";
        return errors;
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        const newReview = {
            id: Date.now(),
            name: reviewerName.trim(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewerName.trim())}&background=f97316&color=fff&size=100`,
            rating: reviewRating,
            date: new Date().toLocaleDateString("vi-VN", { day: "numeric", month: "numeric", year: "numeric" }),
            comment: reviewComment.trim(),
            verified: false,
        };
        setReviews(prev => [newReview, ...prev]);
        setReviewerName("");
        setReviewRating(0);
        setHoveredRating(0);
        setReviewComment("");
        setFormErrors({});
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 4000);
    };

    return (
        <div>
            <main className="mt-20 max-w-7xl mx-auto px-6 py-10 md:px-12 w-full flex-grow">
                {/* Breadcrumbs */}
                <nav className="flex text-sm text-textMuted mb-8 font-medium flex-wrap gap-1">
                    <Link to="/" className="hover:text-orange-500 transition">Trang chủ</Link>
                    <span className="mx-1">/</span>
                    <Link to="/shop" className="hover:text-orange-500 transition">Nội thất</Link>
                    <span className="mx-1">/</span>
                    <span className="text-primary">Ghế Sofa Cao Cấp Minimalist</span>
                </nav>

                {/* Product Hero Section */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-20">
                    {/* Left: Gallery */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        <div className="w-full h-[400px] md:h-[600px] bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
                            <img src={mainImage} alt="Ghế Sofa Cao Cấp Minimalist" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-zoom-in" />
                        </div>
                        {/* Thumbnails */}
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {thumbnails.map((thumb, index) => (
                                <button
                                    key={index}
                                    onClick={() => setMainImage(thumb)}
                                    className={`w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 shrink-0 transition duration-300 ${mainImage === thumb ? "border-orange-500 opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}
                                >
                                    <img src={thumb} alt={`Ảnh ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Information */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider rounded-md w-max mb-4">Sản phẩm mới</span>
                        <h1 className="text-3xl md:text-5xl font-bold text-primary leading-tight mb-4 tracking-tight">Ghế Sofa Cao Cấp Minimalist</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <StarDisplay rating={avgRating} size="text-lg" />
                            <span className="text-sm text-textMuted font-medium">
                                {avgRating.toFixed(1)} / 5.0 ({reviews.length} đánh giá)
                            </span>
                        </div>

                        <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-8 flex items-end tracking-tight">
                            $899.00 <span className="text-lg text-textMuted font-medium line-through ml-3 mb-1">$1,050.00</span>
                        </div>

                        <p className="text-textMuted leading-relaxed mb-8 max-w-lg text-[15px]">
                            Sự kết hợp hoàn hảo giữa phong cách thiết kế tối giản và chất liệu nỉ nhung cao cấp. Ghế sofa Minimalist mang đến không gian sống hiện đại, thanh lịch và trải nghiệm thư giãn tuyệt đối cho gia đình bạn.
                        </p>

                        {/* Variants */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-primary">Chọn Kích Thước</label>
                                <div className="relative">
                                    <select defaultValue="medium" className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition text-sm font-medium text-primary appearance-none cursor-pointer">
                                        <option value="small">Nhỏ (1.6m)</option>
                                        <option value="medium">Vừa (2.0m)</option>
                                        <option value="large">Lớn (2.4m) +$150</option>
                                    </select>
                                    <svg className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-primary">Chọn Màu Sắc</label>
                                <div className="relative">
                                    <select defaultValue="grey" className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition text-sm font-medium text-primary appearance-none cursor-pointer">
                                        <option value="cream">Trắng Kem</option>
                                        <option value="grey">Xám Khói</option>
                                        <option value="oak">Vàng Sồi</option>
                                        <option value="black">Đen Tuyền</option>
                                    </select>
                                    <svg className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-stretch sm:items-center">
                            <div className="flex items-center justify-between border-2 border-gray-100 rounded-xl px-4 py-3 w-32 bg-white shrink-0">
                                <button onClick={() => handleQuantityChange("minus")} className="text-gray-400 hover:text-orange-500 transition focus:outline-none"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" /></svg></button>
                                <input type="text" value={quantity} className="w-10 text-center text-primary font-bold outline-none bg-transparent" readOnly />
                                <button onClick={() => handleQuantityChange("plus")} className="text-gray-400 hover:text-orange-500 transition focus:outline-none"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg></button>
                            </div>
                            <button className="flex-grow bg-orange-500 text-white py-4 rounded-xl font-bold text-base hover:bg-orange-600 transition duration-300 shadow-[0_8px_20px_rgb(249,115,22,0.25)] flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                Thêm vào giỏ hàng
                            </button>
                            <button className="w-14 h-14 border-2 border-gray-200 rounded-xl flex items-center justify-center text-textMuted hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition shrink-0 group">
                                <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            </button>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-textMuted font-medium border-t border-gray-100 pt-6">
                            <span className="flex items-center gap-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Còn hàng</span>
                            <span className="flex items-center gap-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> Giao hàng 2-4 ngày</span>
                        </div>
                    </div>
                </div>

                {/* Product Tabs */}
                <div className="w-full bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 md:p-12 mb-20">
                    <nav className="flex overflow-x-auto gap-8 border-b border-gray-100 mb-8 pb-4 scrollbar-hide">
                        {[
                            { key: "desc", label: "Mô tả sản phẩm" },
                            { key: "specs", label: "Thông số kỹ thuật" },
                            { key: "shipping", label: "Chính sách giao hàng" },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`font-bold pb-4 px-2 whitespace-nowrap transition cursor-pointer border-b-2 ${activeTab === tab.key ? "text-orange-500 border-orange-500" : "text-textMuted hover:text-primary border-transparent"}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    <div>
                        {activeTab === "desc" && (
                            <div className="text-textMuted leading-relaxed space-y-4">
                                <p>Ghế sofa khối hộp Minimalist là hiện thân của vẻ đẹp tinh gọn, được thiết kế để trở thành điểm nhấn tĩnh lặng mà đầy sức nặng trong không gian phòng khách hiện đại. Sử dụng khung gỗ sồi nguyên khối nhập khẩu và mút xốp chống xẹp lún đa tầng, sản phẩm mang lại tư thế ngồi thoải mái tuyệt đối, bao bọc cơ thể bạn sau một ngày dài làm việc.</p>
                                <p>Chất liệu vải bọc Linen / Nỉ nhung thế hệ mới chống bám bụi và dễ dàng vệ sinh. Hệ lò xo túi độc lập giúp triệt tiêu hoàn toàn tiếng ồn, tạo sự bền bỉ lên đến 10 năm. Tone màu xám khói trung tính kết hợp cùng bất kỳ món nội thất nào cũng đem lại sự sang trọng không bao giờ lỗi thời.</p>
                                <img src="https://images.unsplash.com/photo-1540932239986-30128078f3ac?w=1200&q=80" alt="Chi tiết chất liệu" className="w-full h-80 object-cover rounded-2xl my-8" />
                                <p>Mọi đường kim mũi chỉ đều được thực hiện thủ công bởi những người thợ lành nghề với hơn 20 năm kinh nghiệm. SmartLiving tự hào mang đến sản phẩm "Made with heart" kiến tạo giá trị đích thực cho ngôi nhà của bạn.</p>
                            </div>
                        )}
                        {activeTab === "specs" && (
                            <div className="text-textMuted leading-relaxed">
                                <table className="w-full text-sm text-left border-collapse">
                                    <tbody>
                                        <tr className="border-b border-gray-100"><td className="py-4 font-semibold text-primary w-1/3">Kích thước (D x R x C)</td><td className="py-4">2000mm x 900mm x 850mm</td></tr>
                                        <tr className="border-b border-gray-100"><td className="py-4 font-semibold text-primary">Chất liệu bọc</td><td className="py-4">Nỉ nhung Hàn Quốc chống bám bụi, trượt nước nhẹ</td></tr>
                                        <tr className="border-b border-gray-100"><td className="py-4 font-semibold text-primary">Chất liệu khung</td><td className="py-4">Gỗ sồi Nga (Oak) sấy khô, chống mối mọt</td></tr>
                                        <tr className="border-b border-gray-100"><td className="py-4 font-semibold text-primary">Nệm ngồi</td><td className="py-4">Mút D40 kết hợp cao su non 3cm và lò xo cối</td></tr>
                                        <tr><td className="py-4 font-semibold text-primary">Bảo hành</td><td className="py-4">Vải bọc 1 năm, Nệm xốp 3 năm, Khung gỗ 10 năm</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {activeTab === "shipping" && (
                            <div className="text-textMuted leading-relaxed space-y-4">
                                <h4 className="text-primary font-bold text-lg mb-2">Vận chuyển toàn quốc</h4>
                                <ul className="list-disc pl-5 space-y-2 mb-6">
                                    <li>Freeship nội thành bán kính 15km đối với đơn hàng từ $500.</li>
                                    <li>Giao hàng ngoại tỉnh từ 3-5 ngày làm việc qua đối tác vận chuyển chuyên dụng cho nội thất lớn.</li>
                                    <li>Đội ngũ kỹ thuật hỗ trợ lắp ráp tận nhà miễn phí.</li>
                                </ul>
                                <h4 className="text-primary font-bold text-lg mb-2">Chính sách trả hàng</h4>
                                <p>Hỗ trợ 1 đổi 1 trong vòng 7 ngày nếu lỗi từ nhà sản xuất. Sản phẩm trả về phải còn nguyên tem mác, không bị rách, ố bẩn do tác động vật lý của người sử dụng.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews & Comments Section */}
                <h2 className="text-3xl font-bold text-primary mb-10 text-center tracking-tight">Đánh giá &amp; Bình luận</h2>
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-20 bg-white p-8 md:p-12 rounded-[32px] shadow-sm border border-gray-100">
                    {/* Review Stats + Write Form */}
                    <div className="w-full lg:w-1/3 flex flex-col">
                        {/* Summary */}
                        <div className="flex items-center gap-6 mb-8">
                            <div className="text-6xl font-bold text-primary">{avgRating.toFixed(1)}</div>
                            <div className="flex flex-col">
                                <StarDisplay rating={avgRating} size="text-xl" />
                                <span className="text-sm text-textMuted font-medium mt-1">{reviews.length} bài đánh giá</span>
                            </div>
                        </div>

                        {/* Bar chart */}
                        <div className="space-y-3 mb-10 w-full">
                            {ratingCounts.map(({ star, count, pct }) => (
                                <div key={star} className="flex items-center gap-3 text-sm font-medium text-textMuted">
                                    <span className="w-3 text-right shrink-0">{star}</span>
                                    <svg className="w-3 h-3 text-orange-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-400 transition-all duration-500" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="w-8 shrink-0 text-right">{pct}%</span>
                                </div>
                            ))}
                        </div>

                        <hr className="border-gray-100 mb-8" />

                        {/* Write Review Form */}
                        <h3 className="text-xl font-bold text-primary mb-4 tracking-tight">Viết đánh giá</h3>

                        {submitSuccess && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium flex items-center gap-2">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                Cảm ơn bạn đã gửi đánh giá!
                            </div>
                        )}

                        <form onSubmit={handleSubmitReview} noValidate className="flex flex-col gap-4">
                            {/* Name field */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-primary">Tên của bạn <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={reviewerName}
                                    onChange={e => setReviewerName(e.target.value)}
                                    placeholder="Nhập tên của bạn..."
                                    className={`w-full px-4 py-3 rounded-xl border ${formErrors.name ? "border-red-400 focus:ring-red-400/50" : "border-gray-200 focus:ring-orange-500/50"} focus:outline-none focus:ring-2 bg-secondary transition text-sm`}
                                />
                                {formErrors.name && <p className="text-red-500 text-xs mt-0.5">{formErrors.name}</p>}
                            </div>

                            {/* Star Rating */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-primary">Số sao <span className="text-red-500">*</span></label>
                                <StarPicker
                                    value={reviewRating}
                                    hovered={hoveredRating}
                                    onHover={setHoveredRating}
                                    onLeave={() => setHoveredRating(0)}
                                    onClick={star => { setReviewRating(star); setFormErrors(prev => ({ ...prev, rating: undefined })); }}
                                />
                                {formErrors.rating && <p className="text-red-500 text-xs mt-0.5">{formErrors.rating}</p>}
                            </div>

                            {/* Comment */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-primary">Nội dung <span className="text-red-500">*</span></label>
                                <textarea
                                    value={reviewComment}
                                    onChange={e => setReviewComment(e.target.value)}
                                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                                    rows="4"
                                    className={`w-full px-4 py-3 rounded-xl border ${formErrors.comment ? "border-red-400 focus:ring-red-400/50" : "border-gray-200 focus:ring-orange-500/50"} focus:outline-none focus:ring-2 bg-secondary transition text-sm resize-none`}
                                />
                                {formErrors.comment && <p className="text-red-500 text-xs mt-0.5">{formErrors.comment}</p>}
                            </div>

                            <button
                                type="submit"
                                className="bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-orange-500 transition duration-300 w-full sm:w-auto px-8 self-end"
                            >
                                Gửi đánh giá
                            </button>
                        </form>
                    </div>

                    {/* Review List */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-8">
                        {reviews.length === 0 ? (
                            <p className="text-textMuted text-sm text-center py-8">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                        ) : (
                            reviews.map(review => (
                                <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                                            <div>
                                                <h4 className="font-bold text-primary text-base flex items-center gap-2 flex-wrap">
                                                    {review.name}
                                                    {review.verified && (
                                                        <span className="bg-green-100 text-green-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                            Đã mua
                                                        </span>
                                                    )}
                                                </h4>
                                                <div className="flex gap-2 items-center mt-1">
                                                    <StarDisplay rating={review.rating} size="text-xs" />
                                                    <span className="text-xs text-gray-400">{review.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-textMuted text-sm leading-relaxed pl-16">{review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <h2 className="text-2xl font-bold text-primary mb-8 tracking-tight">Sản phẩm bạn có thể thích</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {[
                        { to: "/product-detail/4", img: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=600&q=80", cat: "Bàn Trà", name: "Bàn trà vân đá Minimal", rating: 5, price: "$215", badge: "-15%" },
                        { to: "/product-detail/8", img: "https://images.unsplash.com/photo-1616137533615-ce4e21a224f8?w=600&q=80", cat: "Kệ Tivi", name: "Kệ Tivi Gỗ Sồi Nga", rating: 4, price: "$340" },
                        { to: "/product-detail/7", img: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=600&q=80", cat: "Đèn Điểm", name: "Đèn Đứng Cao Cấp", rating: 5, price: "$120" },
                        { to: "/product-detail/1", img: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=600&q=80", cat: "Ghế Thư Giãn", name: "Ghế Bành Nyantuy", rating: 5, price: "$490" },
                    ].map((item, i) => (
                        <Link key={i} to={item.to} className="bg-white rounded-[24px] p-5 shadow-sm hover:shadow-xl transition flex flex-col group border border-gray-100 relative">
                            {item.badge && <span className="absolute top-8 left-8 bg-black text-white text-[10px] font-bold px-2 py-1 rounded z-10">{item.badge}</span>}
                            <div className="h-56 bg-secondary rounded-2xl mb-4 overflow-hidden relative">
                                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                            </div>
                            <div className="text-sm text-textMuted mb-2 uppercase tracking-wide font-medium">{item.cat}</div>
                            <div className="text-lg font-bold text-primary mb-2 line-clamp-1">{item.name}</div>
                            <div className="flex items-center space-x-1 mb-4 text-xs">
                                <StarDisplay rating={item.rating} size="text-xs" />
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-xl font-bold text-orange-500">{item.price}</span>
                                <span className="w-10 h-10 rounded-full bg-primary text-white flex justify-center items-center hover:bg-orange-500 transition -rotate-45 group-hover:rotate-0 duration-300">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ProductDetail;
