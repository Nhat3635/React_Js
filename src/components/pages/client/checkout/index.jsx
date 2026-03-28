import { useState } from "react";
import { Link } from "react-router-dom";

const Checkout = () => {
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const handleCheckout = (e) => {
        e.preventDefault();
        // Giả lập xử lý thanh toán
        setIsSuccessModalOpen(true);
    };

    return (
        <div>
            {/* Main Content Checkout */}
            <main className="mt-20 max-w-7xl mx-auto px-6 py-16 md:px-12 w-full flex-grow relative">
                <h1 className="text-3xl md:text-4xl font-semibold mb-10 text-primary">Thanh toán an toàn</h1>

                <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                    {/* Left: Shipping & Payment */}
                    <div className="lg:w-2/3 flex flex-col gap-10">
                        {/* Shipping Info */}
                        <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</span>
                                Thông tin giao hàng
                            </h2>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" id="checkoutForm">
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-sm font-medium text-textMuted px-1">Họ và tên</label>
                                    <input type="text" placeholder="Trần Văn A" required className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-secondary transition text-sm" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-textMuted px-1">Số điện thoại</label>
                                    <input type="tel" placeholder="090 123 4567" required className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-secondary transition text-sm" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-textMuted px-1">Địa chỉ Email</label>
                                    <input type="email" placeholder="email@example.com" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-secondary transition text-sm" />
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-sm font-medium text-textMuted px-1">Địa chỉ nhận hàng</label>
                                    <input type="text" placeholder="Số nhà, Tên đường, Phường/Xã" required className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-secondary transition text-sm" />
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-sm font-medium text-textMuted px-1">Tỉnh / Thành phố</label>
                                    <select defaultValue="" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-secondary transition text-sm cursor-pointer">
                                        <option value="" disabled>Chọn Tỉnh / Thành phố</option>
                                        <option>Thành phố Hồ Chí Minh</option>
                                        <option>Hà Nội</option>
                                        <option>Cần Thơ</option>
                                        <option>Đà Nẵng</option>
                                    </select>
                                </div>
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">2</span>
                                Phương thức thanh toán
                            </h2>
                            <div className="flex flex-col gap-4">
                                <label className="flex items-center p-4 border border-orange-500 bg-orange-50/50 rounded-xl cursor-pointer transition">
                                    <input type="radio" name="payment" className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" defaultChecked />
                                    <span className="ml-3 font-medium text-primary">Thanh toán khi nhận hàng - COD</span>
                                </label>
                                <label className="flex items-center p-4 border border-gray-200 hover:border-orange-300 hover:bg-orange-50/30 rounded-xl cursor-pointer transition">
                                    <input type="radio" name="payment" className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" />
                                    <span className="ml-3 font-medium text-primary flex flex-col">
                                        <span>Chuyển khoản trực tiếp (Ngân hàng)</span>
                                        <span className="text-xs text-textMuted mt-1">Thông tin tài khoản sẽ hiển thị sau khi đặt hàng</span>
                                    </span>
                                </label>
                                <label className="flex items-center p-4 border border-gray-200 hover:border-orange-300 hover:bg-orange-50/30 rounded-xl cursor-pointer transition">
                                    <input type="radio" name="payment" className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" />
                                    <span className="ml-3 font-medium text-primary">Ví điện tử MoMo / ZaloPay</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right: Review Order (Sticky Sidebar) */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100 lg:sticky lg:top-32 relative overflow-hidden">
                            {/* Subtle background decoration */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full opacity-50 pointer-events-none"></div>

                            <h3 className="text-xl font-bold text-primary mb-6 relative z-10">Tóm tắt đơn hàng</h3>

                            {/* Mini Product List */}
                            <div className="flex flex-col gap-4 mb-6 border-b border-gray-100 pb-6 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img src="https://images.unsplash.com/photo-1592078615290-033ee584e267?w=100&q=80" className="w-16 h-16 rounded-xl object-cover bg-secondary" alt="Ghế bành Sakarias" />
                                        <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">1</span>
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="text-sm font-semibold text-primary line-clamp-1">Ghế bành Sakarias</h4>
                                        <p className="text-xs text-textMuted">Nâu hạt dẻ</p>
                                    </div>
                                    <span className="text-sm font-semibold text-primary">$392</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=100&q=80" className="w-16 h-16 rounded-xl object-cover bg-secondary" alt="Sofa chữ L Anjay" />
                                        <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">1</span>
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="text-sm font-semibold text-primary line-clamp-1">Sofa chữ L Anjay</h4>
                                        <p className="text-xs text-textMuted">Ghi xám</p>
                                    </div>
                                    <span className="text-sm font-semibold text-primary">$519</span>
                                </div>
                            </div>

                            {/* Total calc */}
                            <div className="flex flex-col gap-3 mb-6 relative z-10">
                                <div className="flex justify-between text-sm">
                                    <span className="text-textMuted">Tạm tính</span>
                                    <span className="font-medium text-primary">$911.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-textMuted">Phí vận chuyển</span>
                                    <span className="font-medium text-green-500">Miễn phí</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end border-t border-gray-100 pt-6 mb-8 relative z-10">
                                <span className="text-lg font-bold text-primary">Tổng cộng</span>
                                <div className="text-right">
                                    <span className="text-xs text-textMuted block mb-1">Đã bao gồm VAT</span>
                                    <span className="text-2xl font-bold text-orange-500 leading-none">$911.00</span>
                                </div>
                            </div>

                            <button onClick={handleCheckout} className="w-full text-center bg-primary text-white py-4 rounded-xl font-bold hover:bg-orange-500 transition duration-300 shadow-md relative z-10 group overflow-hidden">
                                <span className="relative z-10">Đặt hàng ngay</span>
                                <div className="absolute inset-0 w-0 bg-orange-500 transition-all duration-300 ease-out group-hover:w-full z-0"></div>
                            </button>
                            <p className="text-xs text-center text-textMuted mt-4 max-w-[250px] mx-auto relative z-10">Bằng việc đặt hàng, bạn đồng ý với các Điều khoản & Chính sách của chúng tôi.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Success Modal Overlay */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300">
                    <div className="bg-white rounded-[32px] p-10 max-w-md w-[90%] text-center shadow-2xl relative z-10 animate-[scale-in_0.3s_ease-out]">
                        <div className="w-20 h-20 rounded-full bg-green-100 text-green-500 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h2 className="text-3xl font-bold text-primary mb-3">Cảm ơn bạn!</h2>
                        <p className="text-textMuted mb-8 text-sm leading-relaxed">Đơn hàng của bạn đã được đặt thành công. Chúng tôi sẽ sớm liên hệ để xác nhận thông tin giao hàng.</p>
                        <Link to="/" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-orange-500 transition duration-300 w-full" onClick={() => setIsSuccessModalOpen(false)}>Về Trang Chủ</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
