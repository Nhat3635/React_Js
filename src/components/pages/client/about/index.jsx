import { Link } from "react-router-dom";

const About = () => {
    return (
        <div>
            {/* 1. Hero Section */}
            <section className="relative w-full h-[60vh] md:h-[70vh] bg-primary overflow-hidden flex items-center justify-center text-center">
                <div className="absolute inset-0 w-full h-full">
                    <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80" alt="Bright modern architectural space" className="w-full h-full object-cover opacity-80 hero-image-zoom" />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
                <div className="relative z-10 px-6 max-w-4xl mx-auto mt-16">
                    <h1 className="text-5xl md:text-6xl font-semibold leading-tight mb-6 text-white tracking-tight">Về SmartLiving</h1>
                    <p className="text-lg md:text-xl text-gray-200 font-light leading-relaxed">Kiến tạo không gian sống tối giản, hiện đại và tinh tế.</p>
                </div>
            </section>

            {/* 2. Brand Story Section */}
            <section className="max-w-7xl mx-auto px-6 py-24 md:px-12 flex flex-col md:flex-row items-center gap-16">
                <div className="md:w-1/2 w-full h-[500px] rounded-3xl overflow-hidden relative group shadow-lg">
                    <img src="https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=1000&q=80" alt="Designer working craftsmanship" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="md:w-1/2 flex flex-col items-start gap-6">
                    <h4 className="text-orange-500 uppercase tracking-widest font-bold text-sm">Câu chuyện thương hiệu</h4>
                    <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-primary">Câu chuyện của chúng tôi</h2>
                    <div className="text-textMuted text-base md:text-lg leading-relaxed space-y-4">
                        <p>Khởi nguồn từ niềm đam mê đem lại sự tiện nghi nhưng vô cùng thẩm mỹ cho tổ ấm, SmartLiving được ra mắt cùng sứ mệnh: Đưa những sản phẩm nội thất tối giản, chất lượng cao tiếp cận gần hơn với mọi gia đình Việt Nam kể từ năm 2024.</p>
                        <p>Chúng tôi không chỉ đơn thuần bán đồ nội thất; chúng tôi thiết kế và trao gửi một phong cách sống. Sự kết hợp hoàn hảo giữa vật liệu tự nhiên tinh tuyển và sự khéo léo của những bàn tay thợ lành nghề đã tạo nên nét độc bản cho từng sản phẩm mang tên SmartLiving.</p>
                        <p>Từng chi tiết nhỏ gọn đều được tính toán tỉ mỉ để hòa quyện trọn vẹn vào không gian đương đại của bạn, góp phần nâng tầm nghệ thuật bài trí trong chính ngôi nhà của mình.</p>
                    </div>
                </div>
            </section>

            {/* 3. Core Values */}
            <section className="bg-white py-24 px-6 md:px-12">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <h4 className="text-orange-500 uppercase tracking-widest font-bold text-sm mb-4">Trụ cột của SmartLiving</h4>
                    <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-primary">Giá trị cốt lõi</h2>
                </div>
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    {/* Item 1 */}
                    <div className="p-8 rounded-3xl bg-secondary hover:bg-white hover:shadow-xl transition duration-300 border border-transparent hover:border-gray-100 group">
                        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500 group-hover:text-white transition duration-300 text-orange-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-3">Chất lượng thượng hạng</h3>
                        <p className="text-textMuted text-sm leading-relaxed">Chúng tôi đặc biệt chú trọng khâu kiểm soát đầu vào của gỗ, vải và da nhập khẩu. Chỉ những chất liệu bền đẹp đạt tiêu chuẩn mới được đưa vào chế tác, đảm bảo tính bền vững lâu dài.</p>
                    </div>
                    {/* Item 2 */}
                    <div className="p-8 rounded-3xl bg-secondary hover:bg-white hover:shadow-xl transition duration-300 border border-transparent hover:border-gray-100 group">
                        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500 group-hover:text-white transition duration-300 text-orange-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-3">Thiết kế tối giản</h3>
                        <p className="text-textMuted text-sm leading-relaxed">Loại bỏ đi những đường nét dư thừa không đáng có, thiết kế SmartLiving tôn vinh vẻ đẹp của sự tĩnh lặng và tính thẩm mỹ sang trọng vượt ngưỡng thời gian (Quiet Luxury).</p>
                    </div>
                    {/* Item 3 */}
                    <div className="p-8 rounded-3xl bg-secondary hover:bg-white hover:shadow-xl transition duration-300 border border-transparent hover:border-gray-100 group">
                        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500 group-hover:text-white transition duration-300 text-orange-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-3">Vì khách hàng</h3>
                        <p className="text-textMuted text-sm leading-relaxed">Chúng tôi mang tư duy đặt dịch vụ lấy khách hàng làm trọng tâm. Mọi nhu cầu trước, trong và sau mua đều được đội ngũ tư vấn hỗ trợ nhiệt tình, ân cần và chu đáo nhất.</p>
                    </div>
                </div>
            </section>

            {/* 4. Leadership Team */}
            <section className="max-w-7xl mx-auto px-6 py-24 md:px-12">
                <div className="text-center mb-16">
                    <h4 className="text-orange-500 uppercase tracking-widest font-bold text-sm mb-4">Gặp gỡ chúng tôi</h4>
                    <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-primary">Đội ngũ của chúng tôi</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Member 1 */}
                    <div className="group text-center">
                        <div className="w-full h-[320px] rounded-3xl overflow-hidden mb-6 relative shadow-md">
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" alt="Đỗ Thái Bảo" className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                        </div>
                        <h3 className="text-lg font-bold text-primary">Đỗ Thái Bảo</h3>
                        <p className="text-textMuted text-sm mt-1">Giám đốc điều hành</p>
                    </div>
                    {/* Member 2 */}
                    <div className="group text-center">
                        <div className="w-full h-[320px] rounded-3xl overflow-hidden mb-6 relative shadow-md">
                            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" alt="Trần Như Quỳnh" className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                        </div>
                        <h3 className="text-lg font-bold text-primary">Trần Như Quỳnh</h3>
                        <p className="text-textMuted text-sm mt-1">Giám đốc thiết kế</p>
                    </div>
                    {/* Member 3 */}
                    <div className="group text-center">
                        <div className="w-full h-[320px] rounded-3xl overflow-hidden mb-6 relative shadow-md">
                            <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80" alt="Nguyễn Tuấn Dũng" className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                        </div>
                        <h3 className="text-lg font-bold text-primary">Nguyễn Tuấn Dũng</h3>
                        <p className="text-textMuted text-sm mt-1">Trưởng phòng kinh doanh</p>
                    </div>
                    {/* Member 4 */}
                    <div className="group text-center">
                        <div className="w-full h-[320px] rounded-3xl overflow-hidden mb-6 relative shadow-md">
                            <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" alt="Lê Hoàng Lan" className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                        </div>
                        <h3 className="text-lg font-bold text-primary">Lê Hoàng Lan</h3>
                        <p className="text-textMuted text-sm mt-1">Chuyên viên nội thất</p>
                    </div>
                </div>
            </section>

            {/* 5. Achievements/Numbers */}
            <section className="bg-primary text-white py-24 px-6 md:px-12 w-full text-center relative overflow-hidden">
                <h2 className="relative z-10 text-3xl font-light tracking-wide text-gray-300 mb-16 uppercase">Con số ấn tượng</h2>
                <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <h3 className="text-6xl md:text-7xl font-bold text-orange-500 mb-4">1000+</h3>
                        <p className="text-lg text-gray-200 uppercase tracking-widest font-medium">Khách hàng tin dùng</p>
                    </div>
                    <div>
                        <h3 className="text-6xl md:text-7xl font-bold text-orange-500 mb-4">50+</h3>
                        <p className="text-lg text-gray-200 uppercase tracking-widest font-medium">Đối tác chiến lược</p>
                    </div>
                    <div>
                        <h3 className="text-6xl md:text-7xl font-bold text-orange-500 mb-4">5</h3>
                        <p className="text-lg text-gray-200 uppercase tracking-widest font-medium">Cửa hàng toàn quốc</p>
                    </div>
                </div>
            </section>

            {/* 6. Call to Action (CTA) */}
            <section className="max-w-5xl mx-auto px-6 py-24 text-center">
                <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-primary mb-8">Sẵn sàng làm mới không gian của bạn?</h2>
                <Link to="/shop" className="inline-flex items-center justify-center bg-orange-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-black transition duration-300 shadow-xl group">
                    Khám phá bộ sưu tập
                    <span className="ml-2 transform group-hover:translate-x-1 transition duration-300">→</span>
                </Link>
            </section>
        </div>
    )
}
export default About;