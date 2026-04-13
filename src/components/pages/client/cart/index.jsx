import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import requestAPI from "../../../../api";
import Toast from "../../../ui/common/Toast";

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState({});
    const [updating, setUpdating] = useState({});
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const showToast = useCallback((message, type = "success") => {
        setToast({ show: true, message, type });
    }, []);

    const closeToast = useCallback(() => {
        setToast((prev) => ({ ...prev, show: false }));
    }, []);

    // Lấy giỏ hàng từ backend
    const loadCart = async () => {
        try {
            setLoading(true);
            const response = await requestAPI({
                method: "GET",
                url: "/carts"
            });
            setCart(response?.data?.data);
        } catch (error) {
            console.error("Lỗi lấy giỏ hàng:", error);
            showToast("Lỗi tải giỏ hàng", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    // Xóa item khỏi giỏ hàng
    const handleRemoveItem = async (itemId) => {
        try {
            setDeleting((prev) => ({ ...prev, [itemId]: true }));
            
            // Optimistic update: cập nhật state ngay (không cần reload)
            const updatedCart = {
                ...cart,
                items: cart.items.filter(item => item.id !== itemId)
            };
            updatedCart.total_items = updatedCart.items.length;
            updatedCart.total_price = updatedCart.items.reduce((sum, i) => sum + parseFloat(i.total_price || 0), 0);
            
            setCart(updatedCart);
            
            // Gọi API xóa
            await requestAPI({
                method: "DELETE",
                url: `/carts/items/${itemId}`
            });
            window.dispatchEvent(new Event("cart_update"));
            
            showToast("Xóa sản phẩm thành công");
        } catch (error) {
            console.error("Lỗi xóa sản phẩm:", error);
            showToast("Lỗi xóa sản phẩm", "error");
            // Reload lại nếu có lỗi
            await loadCart();
        } finally {
            setDeleting((prev) => ({ ...prev, [itemId]: false }));
        }
    };

    // Cập nhật số lượng item
    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) {
            handleRemoveItem(itemId);
            return;
        }

        try {
            setUpdating((prev) => ({ ...prev, [itemId]: true }));
            
            // Optimistic update: cập nhật state ngay (không cần reload)
            const updatedCart = {
                ...cart,
                items: cart.items.map(item => 
                    item.id === itemId 
                        ? { 
                            ...item, 
                            quantity: newQuantity, 
                            total_price: (item.unit_price * newQuantity).toFixed(2)
                          }
                        : item
                )
            };
            
            // Tính lại tổng số items và tổng giá
            updatedCart.total_items = updatedCart.items.reduce((sum, i) => sum + i.quantity, 0);
            updatedCart.total_price = updatedCart.items.reduce((sum, i) => sum + parseFloat(i.total_price || 0), 0);
            
            setCart(updatedCart);
            
            // Gọi API cập nhật
            await requestAPI({
                method: "PUT",
                url: `/carts/items/${itemId}`,
                data: { quantity: newQuantity }
            });
            window.dispatchEvent(new Event("cart_update"));
            
            showToast("Cập nhật số lượng thành công");
        } catch (error) {
            console.error("Lỗi cập nhật số lượng:", error);
            showToast("Lỗi cập nhật số lượng", "error");
            // Reload lại nếu có lỗi
            await loadCart();
        } finally {
            setUpdating((prev) => ({ ...prev, [itemId]: false }));
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="mt-20 max-w-7xl mx-auto px-6 py-12 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-textMuted">Đang tải giỏ hàng...</p>
                </div>
            </div>
        );
    }

    // Giỏ hàng trống
    const isEmpty = !cart?.items || cart.items.length === 0;

    return (
        <div>
            <Toast show={toast.show} message={toast.message} type={toast.type} onClose={closeToast} />
            
            <main className="mt-20 max-w-7xl mx-auto px-6 py-12 md:px-12 w-full flex-grow">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary tracking-tight">Giỏ hàng của bạn</h1>
                <p className="text-textMuted mb-10 text-sm md:text-base font-medium">
                    Bạn đang có {cart?.total_items || 0} sản phẩm trong giỏ hàng
                </p>

                {isEmpty ? (
                    <div className="w-full flex flex-col items-center justify-center text-center py-20 bg-white border border-gray-100 rounded-[32px] shadow-sm">
                        <svg className="w-24 h-24 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        <p className="text-textMuted text-xl mb-8 font-medium">Giỏ hàng của bạn đang trống</p>
                        <Link to="/shop" className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition shadow-[0_8px_20px_rgb(249,115,22,0.25)] text-lg">
                            Tiếp tục mua sắm
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                        {/* Left: Cart Items List */}
                        <div className="w-full lg:w-[60%] border border-gray-200 rounded-[32px] p-6 md:p-8 bg-white flex flex-col gap-8 shadow-sm">
                            {cart?.items?.map((item, index) => (
                                <div key={item.id}>
                                    <div className="relative flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            disabled={deleting[item.id]}
                                            className="absolute -top-2 -right-2 sm:top-2 sm:right-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition cursor-pointer z-10 disabled:opacity-50"
                                            title="Xóa"
                                        >
                                            {deleting[item.id] ? (
                                                <svg className="w-5 h-5 animate-spin" fill="currentColor" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" strokeWidth="4" stroke="currentColor"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            )}
                                        </button>

                                        {/* Product Image */}
                                        <Link to={`/product-detail/${item.product_id}`} className="w-28 h-28 shrink-0 bg-[#F4F4f4] rounded-2xl p-2 flex items-center justify-center overflow-hidden hover:opacity-80 transition cursor-pointer">
                                            <img 
                                                src={item.variant_image || "https://via.placeholder.com/112"} 
                                                alt={item.product_name} 
                                                className="w-full h-full object-cover rounded-xl mix-blend-multiply" 
                                            />
                                        </Link>

                                        {/* Product Info */}
                                        <div className="flex-grow pr-10 flex flex-col self-stretch justify-center h-full">
                                            <h3 className="text-lg font-bold text-primary mb-1">
                                                <Link to={`/product-detail/${item.product_id}`} className="hover:text-orange-500 transition">
                                                    {item.product_name}
                                                </Link>
                                            </h3>
                                            {item.size_name && <p className="text-sm text-textMuted mb-1">Kích thước: {item.size_name}</p>}
                                            {item.color_name && <p className="text-sm text-textMuted mb-4">Màu sắc: {item.color_name}</p>}

                                            <div className="flex justify-between items-end mt-auto w-full">
                                                <span className="text-xl font-bold text-primary">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unit_price)}
                                                </span>
                                                
                                                {/* Quantity Selector */}
                                                <div className="flex items-center space-x-4 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-2">
                                                    <button 
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                        disabled={updating[item.id]}
                                                        className="w-5 h-5 flex items-center justify-center text-textMuted hover:text-primary transition font-bold text-xl leading-none disabled:opacity-50"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center text-primary">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                        disabled={updating[item.id]}
                                                        className="w-5 h-5 flex items-center justify-center text-textMuted hover:text-primary transition font-bold text-xl leading-none disabled:opacity-50"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {index < cart.items.length - 1 && <hr className="border-gray-100 mt-8" />}
                                </div>
                            ))}
                        </div>

                        {/* Right: Order Summary sticky sidebar */}
                        <div className="w-full lg:w-[40%]">
                            <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm lg:sticky lg:top-36 flex flex-col gap-6">
                                <h3 className="text-2xl font-bold text-primary tracking-tight">Tóm tắt đơn hàng</h3>

                                <div className="flex flex-col gap-5 text-sm md:text-base border-b border-gray-100 pb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-textMuted font-medium">Tạm tính</span>
                                        <span className="font-bold text-primary">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cart?.total_price || 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-textMuted font-medium">Giảm giá (-0%)</span>
                                        <span className="font-bold text-red-500">0 ₫</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-textMuted font-medium">Phí vận chuyển</span>
                                        <span className="font-bold text-primary">0 ₫</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xl font-bold text-primary">Tổng cộng</span>
                                    <span className="text-3xl font-black text-primary tracking-tight">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cart?.total_price || 0)}
                                    </span>
                                </div>

                                {/* Promo Code */}
                                {/* <div className="flex p-1.5 mt-4 bg-[#F4F4f4] rounded-full focus-within:ring-2 focus-within:ring-orange-500/50 transition duration-300 relative group overflow-hidden">
                                    <div className="pl-4 flex items-center text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                                    </div>
                                    <input type="text" placeholder="Thêm mã giảm giá" className="w-full pl-3 pr-4 py-3 bg-transparent border-none focus:outline-none text-sm font-medium text-primary placeholder-gray-500" />
                                    <button className="px-8 bg-black text-white text-sm font-bold rounded-full hover:bg-orange-500 transition duration-300">Áp dụng</button>
                                </div> */}

                                {/* Checkout Button */}
                                {!isEmpty && (
                                    <Link to="/checkout" className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-4 mt-4 rounded-full font-bold hover:bg-orange-600 transition duration-300 shadow-[0_8px_20px_rgb(249,115,22,0.25)] text-lg">
                                        Thanh toán ngay
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </Link>
                                )}

                                {/* Payment Methods Icons */}
                                <div className="flex justify-center items-center gap-4 mt-2 opacity-60 grayscale filter">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="MasterCard" className="h-5" />
                                    <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" className="h-5 mix-blend-multiply" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Cart;