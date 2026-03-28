import { useState } from "react";
import { Link } from "react-router-dom";

const ProductDetail = () => {
    const [mainImage, setMainImage] = useState("https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&q=80");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("desc");

    const handleQuantityChange = (type) => {
        if (type === "minus" && quantity > 1) {
            setQuantity(quantity - 1);
        } else if (type === "plus") {
            setQuantity(quantity + 1);
        }
    };

    const thumbnails = [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&q=80",
        "https://images.unsplash.com/photo-1493663284031-b7e3a9032ff1?w=1000&q=80",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1000&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&q=80"
    ];

    return (
        <div>
            <main className="mt-20 max-w-7xl mx-auto px-6 py-10 md:px-12 w-full flex-grow">
                {/* Breadcrumbs */}
                <nav className="flex text-sm text-textMuted mb-8 font-medium">
                    <Link to="/" className="hover:text-orange-500 transition">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <Link to="/shop" className="hover:text-orange-500 transition">Nội thất</Link>
                    <span className="mx-2">/</span>
                    <Link to="/shop" className="hover:text-orange-500 transition">Phòng Khách</Link>
                    <span className="mx-2">/</span>
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
                                    className={`w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 shrink-0 transition duration-300 ${mainImage === thumb ? 'border-orange-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={thumb} alt={`Thumb ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Information */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider rounded-md w-max mb-4">Sản phẩm mới</span>
                        <h1 className="text-3xl md:text-5xl font-bold text-primary leading-tight mb-4 tracking-tight">Ghế Sofa Cao Cấp Minimalist</h1>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex text-orange-400 text-sm">
                                ★★★★★
                            </div>
                            <span className="text-sm text-textMuted font-medium hover:text-orange-500 transition cursor-pointer underline-offset-4 decoration-gray-300 underline">(120 đánh giá)</span>
                        </div>

                        <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-8 flex items-end tracking-tight">
                            $899.00 <span className="text-lg text-textMuted font-medium line-through ml-3 mb-1">$1,050.00</span>
                        </div>

                        <p className="text-textMuted leading-relaxed mb-8 max-w-lg text-[15px]">
                            Sự kết hợp hoàn hảo giữa phong cách thiết kế tối giản và chất liệu nỉ nhung cao cấp. Ghế sofa Minimalist mang đến không gian sống hiện đại, thanh lịch và trải nghiệm thư giãn tuyệt đối cho gia đình bạn.
                        </p>

                        {/* Variants */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                            {/* Size */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-primary">Chọn Kích Thước</label>
                                <div className="relative">
                                    <select defaultValue="medium" className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition text-sm font-medium text-primary appearance-none cursor-pointer">
                                        <option value="small">Nhỏ (1.6m)</option>
                                        <option value="medium">Vừa (2.0m)</option>
                                        <option value="large">Lớn (2.4m) +$150</option>
                                    </select>
                                    <svg className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                            {/* Color */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-primary">Chọn Màu Sắc</label>
                                <div className="relative">
                                    <select defaultValue="grey" className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition text-sm font-medium text-primary appearance-none cursor-pointer">
                                        <option value="cream">Trắng Kem</option>
                                        <option value="grey">Xám Khói</option>
                                        <option value="oak">Vàng Sồi</option>
                                        <option value="black">Đen Tuyền</option>
                                    </select>
                                    <svg className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-stretch sm:items-center">
                            {/* Quantity */}
                            <div className="flex items-center justify-between border-2 border-gray-100 rounded-xl px-4 py-3 w-32 bg-white shrink-0">
                                <button onClick={() => handleQuantityChange("minus")} className="text-gray-400 hover:text-orange-500 transition focus:outline-none"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4"></path></svg></button>
                                <input type="text" value={quantity} className="w-10 text-center text-primary font-bold outline-none bg-transparent" readOnly />
                                <button onClick={() => handleQuantityChange("plus")} className="text-gray-400 hover:text-orange-500 transition focus:outline-none"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg></button>
                            </div>
                            
                            <button className="flex-grow bg-orange-500 text-white py-4 rounded-xl font-bold text-base hover:bg-orange-600 transition duration-300 shadow-[0_8px_20px_rgb(249,115,22,0.25)] flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                Thêm vào giỏ hàng
                            </button>
                            <button className="w-14 h-14 border-2 border-gray-200 rounded-xl flex items-center justify-center text-textMuted hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition shrink-0 group">
                                <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            </button>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-textMuted font-medium border-t border-gray-100 pt-6">
                            <span className="flex items-center gap-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Còn hàng</span>
                            <span className="flex items-center gap-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> Giao hàng 2-4 ngày</span>
                        </div>
                    </div>
                </div>

                {/* Product Tabs */}
                <div className="w-full bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 md:p-12 mb-20">
                    <nav className="flex overflow-x-auto gap-8 border-b border-gray-100 mb-8 pb-4 scrollbar-hide">
                        <button 
                            onClick={() => setActiveTab("desc")}
                            className={`font-bold pb-4 px-2 whitespace-nowrap transition cursor-pointer border-b-2 ${activeTab === 'desc' ? 'text-orange-500 border-orange-500' : 'text-textMuted hover:text-primary border-transparent'}`}
                        >
                            Mô tả sản phẩm
                        </button>
                        <button 
                            onClick={() => setActiveTab("specs")}
                            className={`font-bold pb-4 px-2 whitespace-nowrap transition cursor-pointer border-b-2 ${activeTab === 'specs' ? 'text-orange-500 border-orange-500' : 'text-textMuted hover:text-primary border-transparent'}`}
                        >
                            Thông số kỹ thuật
                        </button>
                        <button 
                            onClick={() => setActiveTab("shipping")}
                            className={`font-bold pb-4 px-2 whitespace-nowrap transition cursor-pointer border-b-2 ${activeTab === 'shipping' ? 'text-orange-500 border-orange-500' : 'text-textMuted hover:text-primary border-transparent'}`}
                        >
                            Chính sách giao hàng
                        </button>
                    </nav>

                    <div className="tab-contents">
                        {/* Description */}
                        {activeTab === 'desc' && (
                            <div className="detail-content text-textMuted leading-relaxed space-y-4">
                                <p>Ghế sofa khối hộp Minimalist là hiện thân của vẻ đẹp tinh gọn, được thiết kế để trở thành điểm nhấn tĩnh lặng mà đầy sức nặng trong không gian phòng khách hiện đại. Sử dụng khung gỗ sồi nguyên khối nhập khẩu và mút xốp chống xẹp lún đa tầng, sản phẩm mang lại tư thế ngồi thoải mái tuyệt đối, bao bọc cơ thể bạn sau một ngày dài làm việc.</p>
                                <p>Chất liệu vải bọc Linen / Nỉ nhung thế hệ mới chống bám bụi và dễ dàng vệ sinh. Hệ lò xo túi độc lập giúp triệt tiêu hoàn toàn tiếng ồn, tạo sự bền bỉ lên đến 10 năm. Tone màu xám khói trung tính kết hợp cùng bất kỳ món nội thất nào cũng đem lại sự sang trọng không bao giờ lỗi thời.</p>
                                <img src="https://images.unsplash.com/photo-1540932239986-30128078f3ac?w=1200&q=80" alt="Chi tiết chất liệu" className="w-full h-80 object-cover rounded-2xl my-8" />
                                <p>Mọi đường kim mũi chỉ đều được thực hiện thủ công bởi những người thợ lành nghề với hơn 20 năm kinh nghiệm. SmartLiving tự hào mang đến sản phẩm "Made with heart" kiến tạo giá trị đích thực cho ngôi nhà của bạn.</p>
                            </div>
                        )}
                        {/* Specs */}
                        {activeTab === 'specs' && (
                            <div className="detail-content text-textMuted leading-relaxed">
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
                        {/* Shipping */}
                        {activeTab === 'shipping' && (
                            <div className="detail-content text-textMuted leading-relaxed space-y-4">
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

                {/* Reviews Section */}
                <h2 className="text-3xl font-bold text-primary mb-10 text-center tracking-tight">Đánh giá & Bình luận</h2>
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-20 bg-white p-8 md:p-12 rounded-[32px] shadow-sm border border-gray-100">
                    {/* Review Stats */}
                    <div className="w-full lg:w-1/3 flex flex-col">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="text-6xl font-bold text-primary">4.8</div>
                            <div className="flex flex-col">
                                <div className="flex text-orange-400 text-lg mb-1">★★★★★</div>
                                <span className="text-sm text-textMuted font-medium">120 bài đánh giá</span>
                            </div>
                        </div>
                        {/* Bar chart */}
                        <div className="space-y-3 mb-10 w-full">
                            <div className="flex items-center gap-3 text-sm font-medium text-textMuted"><span className="w-2 flex justify-end shrink-0">5</span> <svg className="w-3 h-3 text-orange-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-orange-400" style={{width: "85%"}}></div></div> <span className="w-8 shrink-0 text-right">85%</span></div>
                            <div className="flex items-center gap-3 text-sm font-medium text-textMuted"><span className="w-2 flex justify-end shrink-0">4</span> <svg className="w-3 h-3 text-orange-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-orange-400" style={{width: "10%"}}></div></div> <span className="w-8 shrink-0 text-right">10%</span></div>
                            <div className="flex items-center gap-3 text-sm font-medium text-textMuted"><span className="w-2 flex justify-end shrink-0">3</span> <svg className="w-3 h-3 text-orange-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-orange-400" style={{width: "3%"}}></div></div> <span className="w-8 shrink-0 text-right">3%</span></div>
                            <div className="flex items-center gap-3 text-sm font-medium text-textMuted"><span className="w-2 flex justify-end shrink-0">2</span> <svg className="w-3 h-3 text-orange-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-orange-400" style={{width: "1%"}}></div></div> <span className="w-8 shrink-0 text-right">1%</span></div>
                            <div className="flex items-center gap-3 text-sm font-medium text-textMuted"><span className="w-2 flex justify-end shrink-0">1</span> <svg className="w-3 h-3 text-orange-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-orange-400" style={{width: "1%"}}></div></div> <span className="w-8 shrink-0 text-right">1%</span></div>
                        </div>
                        
                        <hr className="border-gray-100 mb-8" />
                        <h3 className="text-xl font-bold text-primary mb-4 tracking-tight">Viết đánh giá</h3>
                        <form className="flex flex-col gap-4">
                            <div className="flex text-gray-300 text-lg cursor-pointer hover:text-orange-400 transition" id="writeStarRating">
                                ★★★★★
                            </div>
                            <textarea placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..." required rows="3" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-secondary transition text-sm resize-none"></textarea>
                            <button type="button" className="bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition duration-300 w-full sm:w-auto px-8 self-end">Gửi đánh giá</button>
                        </form>
                    </div>

                    {/* Review List */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-8">
                        {/* Comment 1 */}
                        <div className="border-b border-gray-100 pb-8">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Bang Upin" className="w-12 h-12 rounded-full object-cover" />
                                    <div>
                                        <h4 className="font-bold text-primary text-base flex items-center gap-2">Bang Upin <span className="bg-green-100 text-green-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Đã mua</span></h4>
                                        <div className="flex gap-2 items-center mt-1">
                                            <div className="text-orange-400 text-xs text-xs">★★★★★</div>
                                            <span className="text-xs text-gray-400">12 Th4, 2026</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-textMuted text-sm leading-relaxed pl-16">
                                Sofa rất êm, màu xám khói đẹp vừa in với phòng khách nhà mình. Đặc biệt vải nhung sờ rất mát tay, không bị rít hay nóng như mình tưởng. Nhân viên giao hàng nhiệt tình, lắp ráp nhanh gọn lẹ. Sẽ ủng hộ tiếp!
                            </p>
                        </div>

                        {/* Comment 2 */}
                        <div className="border-b border-gray-100 pb-8">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" alt="Ibuk Sukijan" className="w-12 h-12 rounded-full object-cover" />
                                    <div>
                                        <h4 className="font-bold text-primary text-base flex items-center gap-2">Ibuk Sukijan <span className="bg-green-100 text-green-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Đã mua</span></h4>
                                        <div className="flex gap-2 items-center mt-1">
                                            <div className="text-orange-400 text-xs">★★★★★</div>
                                            <span className="text-xs text-gray-400">28 Th3, 2026</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-textMuted text-sm leading-relaxed pl-16">
                                Kiểu dáng sang trọng, đúng phong cách minimalist mà mình đang theo đổi. Khung gỗ sồi rất chắc chắn, mình có thể cảm nhận được ngước chất lượng tốt ngay từ lần đầu tiên ngồi xuống.
                            </p>
                        </div>
                        
                        <button className="mx-auto block text-primary font-semibold hover:text-orange-500 transition underline underline-offset-4 decoration-gray-200 mt-4">Xem thêm 118 đánh giá khác</button>
                    </div>
                </div>

                {/* Related Products */}
                <h2 className="text-2xl font-bold text-primary mb-8 tracking-tight">Sản phẩm bạn có thể thích</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {/* Product 1 */}
                    <Link to="/product-detail" className="bg-white rounded-[24px] p-5 shadow-sm hover:shadow-xl transition flex flex-col group border border-gray-100 relative">
                        <span className="absolute top-8 left-8 bg-black text-white text-[10px] font-bold px-2 py-1 rounded z-10">-15%</span>
                        <div className="h-56 bg-secondary rounded-2xl mb-4 overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=600&q=80" alt="Bàn Trà Sofa" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        </div>
                        <div className="text-sm text-textMuted mb-2 uppercase tracking-wide font-medium">Bàn Trà</div>
                        <div className="text-lg font-bold text-primary mb-2 line-clamp-1">Bàn trà vân đá Minimal</div>
                        <div className="flex items-center space-x-1 mb-4 text-xs">
                            <span className="text-yellow-400">★★★★★</span>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                            <div>
                                <span className="text-xl font-bold text-orange-500">$215</span>
                            </div>
                            <button className="w-10 h-10 rounded-full bg-primary text-white flex justify-center items-center hover:bg-orange-500 transition -rotate-45 group-hover:rotate-0 duration-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
                            </button>
                        </div>
                    </Link>

                    {/* Product 2 */}
                    <Link to="/product-detail" className="bg-white rounded-[24px] p-5 shadow-sm hover:shadow-xl transition flex flex-col group border border-gray-100">
                        <div className="h-56 bg-secondary rounded-2xl mb-4 overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1616137533615-ce4e21a224f8?w=600&q=80" alt="Kệ Tivi Gỗ" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        </div>
                        <div className="text-sm text-textMuted mb-2 uppercase tracking-wide font-medium">Kệ Tivi</div>
                        <div className="text-lg font-bold text-primary mb-2 line-clamp-1">Kệ Tivi Gỗ Sồi Nga</div>
                        <div className="flex items-center space-x-1 mb-4 text-xs">
                            <span className="text-yellow-400">★★★★☆</span>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                            <div>
                                <span className="text-xl font-bold text-primary">$340</span>
                            </div>
                            <button className="w-10 h-10 rounded-full bg-primary text-white flex justify-center items-center hover:bg-orange-500 transition -rotate-45 group-hover:rotate-0 duration-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
                            </button>
                        </div>
                    </Link>

                    {/* Product 3 */}
                    <Link to="/product-detail" className="bg-white rounded-[24px] p-5 shadow-sm hover:shadow-xl transition flex flex-col group border border-gray-100">
                        <div className="h-56 bg-secondary rounded-2xl mb-4 overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=600&q=80" alt="Đèn Đứng" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        </div>
                        <div className="text-sm text-textMuted mb-2 uppercase tracking-wide font-medium">Đèn Điểm</div>
                        <div className="text-lg font-bold text-primary mb-2 line-clamp-1">Đèn Đứng Cao Cấp</div>
                        <div className="flex items-center space-x-1 mb-4 text-xs">
                            <span className="text-yellow-400">★★★★★</span>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                            <div>
                                <span className="text-xl font-bold text-primary">$120</span>
                            </div>
                            <button className="w-10 h-10 rounded-full bg-primary text-white flex justify-center items-center hover:bg-orange-500 transition -rotate-45 group-hover:rotate-0 duration-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
                            </button>
                        </div>
                    </Link>

                    {/* Product 4 */}
                    <Link to="/product-detail" className="bg-white rounded-[24px] p-5 shadow-sm hover:shadow-xl transition flex flex-col group border border-gray-100">
                        <div className="h-56 bg-secondary rounded-2xl mb-4 overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=600&q=80" alt="Ghế Thư Giãn" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        </div>
                        <div className="text-sm text-textMuted mb-2 uppercase tracking-wide font-medium">Ghế Thư Giãn</div>
                        <div className="text-lg font-bold text-primary mb-2 line-clamp-1">Ghế Bành Nyantuy</div>
                        <div className="flex items-center space-x-1 mb-4 text-xs">
                            <span className="text-yellow-400">★★★★★</span>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                            <div>
                                <span className="text-xl font-bold text-primary">$490</span>
                            </div>
                            <button className="w-10 h-10 rounded-full bg-primary text-white flex justify-center items-center hover:bg-orange-500 transition -rotate-45 group-hover:rotate-0 duration-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
                            </button>
                        </div>
                    </Link>
                </div>

            </main>
        </div>
    );
};

export default ProductDetail;