import { Link } from "react-router-dom";

const Cart = () => {
    return (
        <div>
            <main className="mt-20 max-w-7xl mx-auto px-6 py-12 md:px-12 w-full flex-grow">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary tracking-tight">Giỏ hàng của bạn</h1>
                <p className="text-textMuted mb-10 text-sm md:text-base font-medium">Bạn đang có 3 sản phẩm trong giỏ hàng</p>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

                    {/* Left: Cart Items List within a single bordered card */}
                    <div className="w-full lg:w-[60%] border border-gray-200 rounded-[32px] p-6 md:p-8 bg-white flex flex-col gap-8 shadow-sm">

                        {/* Item 1 */}
                        <div className="relative flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                            {/* Trash Icon Top Right Absolute on Mobile, or top right of the whole div */}
                            <button className="absolute -top-2 -right-2 sm:top-2 sm:right-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition cursor-pointer z-10" title="Xóa">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>

                            <Link to="/product-detail" className="w-28 h-28 shrink-0 bg-[#F4F4f4] rounded-2xl p-2 flex items-center justify-center overflow-hidden hover:opacity-80 transition cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300&q=80" alt="Ghế bành Sakarias" className="w-full h-full object-cover rounded-xl mix-blend-multiply" />
                            </Link>

                            <div className="flex-grow pr-10 flex flex-col self-stretch justify-center h-full">
                                <h3 className="text-lg font-bold text-primary mb-1"><Link to="/product-detail" className="hover:text-orange-500 transition">Ghế bành Sakarias</Link></h3>
                                <p className="text-sm text-textMuted mb-1">Kích thước: Nhỏ</p>
                                <p className="text-sm text-textMuted mb-4">Màu sắc: Nâu hạt dẻ</p>

                                <div className="flex justify-between items-end mt-auto w-full">
                                    <span className="text-xl font-bold text-primary">$145</span>
                                    {/* Quantity Selector Pill */}
                                    <div className="flex items-center space-x-4 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-2">
                                        <button className="w-5 h-5 flex items-center justify-center text-textMuted hover:text-primary transition font-bold text-xl leading-none">-</button>
                                        <span className="text-sm font-bold w-4 text-center text-primary">1</span>
                                        <button className="w-5 h-5 flex items-center justify-center text-textMuted hover:text-primary transition font-bold text-xl leading-none">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <hr className="border-gray-100" />

                        {/* Item 2 */}
                        <div className="relative flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                            <button className="absolute -top-2 -right-2 sm:top-2 sm:right-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition cursor-pointer z-10" title="Xóa">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>

                            <Link to="/product-detail" className="w-28 h-28 shrink-0 bg-[#F4F4f4] rounded-2xl p-2 flex items-center justify-center overflow-hidden hover:opacity-80 transition cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=300&q=80" alt="Sofa chữ L Anjay" className="w-full h-full object-cover rounded-xl mix-blend-multiply" />
                            </Link>

                            <div className="flex-grow pr-10 flex flex-col self-stretch justify-center h-full">
                                <h3 className="text-lg font-bold text-primary mb-1"><Link to="/product-detail" className="hover:text-orange-500 transition">Sofa chữ L Anjay</Link></h3>
                                <p className="text-sm text-textMuted mb-1">Kích thước: Lớn</p>
                                <p className="text-sm text-textMuted mb-4">Màu sắc: Xám khói</p>

                                <div className="flex justify-between items-end mt-auto w-full">
                                    <span className="text-xl font-bold text-primary">$180</span>
                                    <div className="flex items-center space-x-4 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-2">
                                        <button className="w-5 h-5 flex items-center justify-center text-textMuted hover:text-primary transition font-bold text-xl leading-none">-</button>
                                        <span className="text-sm font-bold w-4 text-center text-primary">1</span>
                                        <button className="w-5 h-5 flex items-center justify-center text-textMuted hover:text-primary transition font-bold text-xl leading-none">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <hr className="border-gray-100" />

                        {/* Item 3 */}
                        <div className="relative flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                            <button className="absolute -top-2 -right-2 sm:top-2 sm:right-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition cursor-pointer z-10" title="Xóa">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>

                            <Link to="/product-detail" className="w-28 h-28 shrink-0 bg-[#F4F4f4] rounded-2xl p-2 flex items-center justify-center overflow-hidden hover:opacity-80 transition cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=300&q=80" alt="Bàn trà Minimalist" className="w-full h-full object-cover rounded-xl mt-4 mix-blend-multiply" />
                            </Link>

                            <div className="flex-grow pr-10 flex flex-col self-stretch justify-center h-full">
                                <h3 className="text-lg font-bold text-primary mb-1"><Link to="/product-detail" className="hover:text-orange-500 transition">Bàn trà Minimalist</Link></h3>
                                <p className="text-sm text-textMuted mb-1">Kích thước: Vừa</p>
                                <p className="text-sm text-textMuted mb-4">Màu sắc: Trắng</p>

                                <div className="flex justify-between items-end mt-auto w-full">
                                    <span className="text-xl font-bold text-primary">$240</span>
                                    <div className="flex items-center space-x-4 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-2">
                                        <button className="w-5 h-5 flex items-center justify-center text-textMuted hover:text-primary transition font-bold text-xl leading-none">-</button>
                                        <span className="text-sm font-bold w-4 text-center text-primary">1</span>
                                        <button className="w-5 h-5 flex items-center justify-center text-textMuted hover:text-primary transition font-bold text-xl leading-none">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary sticky sidebar */}
                    <div className="w-full lg:w-[40%]">
                        <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm lg:sticky lg:top-36 flex flex-col gap-6">
                            <h3 className="text-2xl font-bold text-primary tracking-tight">Tóm tắt đơn hàng</h3>

                            <div className="flex flex-col gap-5 text-sm md:text-base border-b border-gray-100 pb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-textMuted font-medium">Tạm tính</span>
                                    <span className="font-bold text-primary">$565</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-textMuted font-medium">Giảm giá (-20%)</span>
                                    <span className="font-bold text-red-500">-$113</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-textMuted font-medium">Phí vận chuyển</span>
                                    <span className="font-bold text-primary">$15</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xl font-bold text-primary">Tổng cộng</span>
                                <span className="text-3xl font-black text-primary tracking-tight">$467</span>
                            </div>

                            {/* Promo Code */}
                            <div className="flex p-1.5 mt-4 bg-[#F4F4f4] rounded-full focus-within:ring-2 focus-within:ring-orange-500/50 transition duration-300 relative group overflow-hidden">
                                <div className="pl-4 flex items-center text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                                </div>
                                <input type="text" placeholder="Thêm mã giảm giá" className="w-full pl-3 pr-4 py-3 bg-transparent border-none focus:outline-none text-sm font-medium text-primary placeholder-gray-500" />
                                <button className="px-8 bg-black text-white text-sm font-bold rounded-full hover:bg-orange-500 transition duration-300">Áp dụng</button>
                            </div>

                            {/* Checkout Button */}
                            <Link to="/checkout" className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-4 mt-4 rounded-full font-bold hover:bg-orange-600 transition duration-300 shadow-[0_8px_20px_rgb(249,115,22,0.25)] text-lg">
                                Thanh toán ngay
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </Link>

                            {/* Payment Methods Icons */}
                            <div className="flex justify-center items-center gap-4 mt-2 opacity-60 grayscale filter">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="MasterCard" className="h-5" />
                                <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" className="h-5 mix-blend-multiply" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Cart;