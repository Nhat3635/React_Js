import { useState } from 'react';

const Contact = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div>
            {/* 1. Header Section */}
            <section className="bg-primary text-white py-24 px-6 md:px-12 flex flex-col items-center justify-center text-center mt-[88px] relative overflow-hidden">
                <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight relative z-10">Liên Hệ Với Chúng Tôi</h1>
                <p className="text-sm md:text-lg text-gray-300 font-light flex items-center space-x-2 relative z-10 max-w-2xl">Chúng tôi luôn sẵn sàng lắng nghe ý kiến phản hồi và hỗ trợ bạn kiến tạo không gian sống mơ ước.</p>
            </section>

            {/* 2. Contact Information & Form */}
            <section className="max-w-7xl mx-auto px-6 py-24 md:px-12 flex flex-col lg:flex-row gap-16">
                {/* Left details */}
                <div className="lg:w-1/3 flex flex-col gap-8">
                    <h2 className="text-3xl font-semibold text-primary">Thông tin liên hệ</h2>
                    <div className="space-y-6 text-textMuted text-base">
                        <p className="flex items-start gap-4">
                            <svg className="w-6 h-6 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <span><strong>Địa chỉ:</strong><br />123 Đường Ba Tháng Hai, Ninh Kiều, Cần Thơ.</span>
                        </p>
                        <p className="flex items-start gap-4">
                            <svg className="w-6 h-6 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            <span><strong>Hotline:</strong><br />1900 1234 (8:00 - 21:00)</span>
                        </p>
                        <p className="flex items-start gap-4">
                            <svg className="w-6 h-6 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            <span><strong>Email:</strong><br />support@smartliving.vn</span>
                        </p>
                    </div>
                    {/* Social Icons */}
                    <div className="flex gap-4 mt-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-primary hover:bg-orange-500 hover:text-white transition duration-300 shadow-sm border border-gray-200" title="Facebook">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-primary hover:bg-orange-500 hover:text-white transition duration-300 shadow-sm border border-gray-200" title="Instagram">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-primary hover:bg-orange-500 hover:text-white transition duration-300 shadow-sm border border-gray-200" title="LinkedIn">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        </a>
                    </div>
                </div>

                {/* Right Form */}
                <div className="lg:w-2/3 bg-white p-8 md:p-12 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 relative">
                    <h3 className="text-2xl font-bold text-primary mb-8 px-1">Gửi tin nhắn cho chúng tôi</h3>
                    <form id="contactForm" className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="text-sm font-medium text-textMuted px-1">Họ và tên</label>
                                <input type="text" id="name" required className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-gray-50/50 transition" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="text-sm font-medium text-textMuted px-1">Địa chỉ Email</label>
                                <input type="email" id="email" required className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-gray-50/50 transition" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="phone" className="text-sm font-medium text-textMuted px-1">Số điện thoại</label>
                            <input type="tel" id="phone" className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-gray-50/50 transition" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="message" className="text-sm font-medium text-textMuted px-1">Nội dung tin nhắn</label>
                            <textarea id="message" rows="5" required className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-gray-50/50 transition resize-none"></textarea>
                        </div>
                        <button type="submit" className="w-full md:w-auto self-start bg-orange-500/90 backdrop-blur-md text-white px-10 py-4 mt-2 rounded-xl font-bold hover:bg-orange-600 transition duration-300 shadow-xl group flex items-center justify-center gap-2">
                            <span>Gửi tin nhắn</span>
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </button>
                        <div id="formSuccessMessage" className="hidden mt-4 p-4 rounded-xl bg-green-50 text-green-600 text-sm font-semibold border border-green-200 relative overflow-hidden flex items-center gap-3 animate-pulse">
                            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>Gửi thành công! Đội ngũ tư vấn sẽ liên hệ với bạn trong thời gian sớm nhất.</span>
                        </div>
                    </form>
                </div>
            </section>

            {/* 3. Interactive Map */}
            <section className="w-full max-w-7xl mx-auto px-6 md:px-12 mb-24">
                <div className="w-full h-[400px] md:h-[500px] rounded-[32px] overflow-hidden shadow-xl border border-gray-100 group">
                    <iframe className="w-full h-full grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition duration-700 pointer-events-none md:pointer-events-auto" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.8415184420417!2d105.7680403759755!3d10.029933690076864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0883d2192b0f1%3A0x4c90a391d232ccce!2sCan%20Tho!5e0!3m2!1sen!2s!4v1711548545812!5m2!1sen!2s" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </section>

            {/* 4. FAQ Section */}
            <section className="bg-white py-24 px-6 md:px-12 border-t border-gray-100">
                <div className="max-w-3xl mx-auto flex flex-col gap-10">
                    <h2 className="text-3xl md:text-4xl font-semibold text-primary text-center mb-2">Câu hỏi thường gặp</h2>

                    <div className="flex flex-col gap-4">
                        {/* FAQ 1 */}
                        <div className="faq-item border border-gray-200/60 rounded-2xl overflow-hidden bg-secondary hover:shadow-md transition duration-300">
                            <button onClick={() => toggleFaq(1)} className="faq-btn w-full px-6 py-5 text-left flex justify-between items-center font-medium text-primary hover:bg-white transition focus:outline-none">
                                <span>1. Chính sách giao hàng của SmartLiving như thế nào?</span>
                                <svg className={`w-5 h-5 transform transition-transform duration-300 shrink-0 text-orange-500 ${openFaq === 1 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            <div className={`faq-content overflow-hidden transition-all duration-300 bg-white ${openFaq === 1 ? 'max-h-40' : 'max-h-0'}`}>
                                <p className="px-6 py-5 text-textMuted text-sm leading-relaxed border-t border-gray-100">Chúng tôi miễn phí giao hàng cho mọi đơn hàng trong nội thành Cần Thơ, TP.HCM & Hà Nội. Quá trình vận chuyển đảm bảo an toàn tối đa với phương thức đóng gói chống trầy xước chuyên dụng.</p>
                            </div>
                        </div>
                        {/* FAQ 2 */}
                        <div className="faq-item border border-gray-200/60 rounded-2xl overflow-hidden bg-secondary hover:shadow-md transition duration-300">
                            <button onClick={() => toggleFaq(2)} className="faq-btn w-full px-6 py-5 text-left flex justify-between items-center font-medium text-primary hover:bg-white transition focus:outline-none">
                                <span>2. Các sản phẩm nội thất có được bảo hành không?</span>
                                <svg className={`w-5 h-5 transform transition-transform duration-300 shrink-0 text-orange-500 ${openFaq === 2 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            <div className={`faq-content overflow-hidden transition-all duration-300 bg-white ${openFaq === 2 ? 'max-h-40' : 'max-h-0'}`}>
                                <p className="px-6 py-5 text-textMuted text-sm leading-relaxed border-t border-gray-100">Có, tất cả sản phẩm nội thất như Sofa, Đèn, Giường gỗ đều được bảo hành tiêu chuẩn từ 1 đến 5 năm, linh hoạt tùy thuộc vào nhóm vật liệu chế tác.</p>
                            </div>
                        </div>
                        {/* FAQ 3 */}
                        <div className="faq-item border border-gray-200/60 rounded-2xl overflow-hidden bg-secondary hover:shadow-md transition duration-300">
                            <button onClick={() => toggleFaq(3)} className="faq-btn w-full px-6 py-5 text-left flex justify-between items-center font-medium text-primary hover:bg-white transition focus:outline-none">
                                <span>3. Hệ thống cửa hàng SmartLiving nằm ở đâu?</span>
                                <svg className={`w-5 h-5 transform transition-transform duration-300 shrink-0 text-orange-500 ${openFaq === 3 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            <div className={`faq-content overflow-hidden transition-all duration-300 bg-white ${openFaq === 3 ? 'max-h-40' : 'max-h-0'}`}>
                                <p className="px-6 py-5 text-textMuted text-sm leading-relaxed border-t border-gray-100">Hiện tại chúng tôi có 5 Flagship store trên toàn quốc. Showroom lớn nhất nằm tại Ninh Kiều (Cần Thơ) và các chi nhánh khu mua sắm lớn tại Quận 1 và Quận 7 (TP.HCM).</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;