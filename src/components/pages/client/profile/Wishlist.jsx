import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import requestAPI from "../../../../api/index.jsx";
import Toast from "../../../ui/common/Toast/index.jsx";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                setLoading(true);
                const res = await requestAPI({ method: "GET", url: "/wishlist/my-wishlist" });
                setWishlist(res.data.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy wishlist:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    const handleRemoveWishlist = async (productId) => {
        try {
            await requestAPI({ method: "DELETE", url: `/wishlist/remove/${productId}` });
            setWishlist(wishlist.filter(item => item.product_id !== productId));
            setToast({ show: true, message: "Đã xóa khỏi danh sách yêu thích", type: "success" });
        } catch (error) {
            console.error("Lỗi khi xóa wishlist:", error);
            setToast({ show: true, message: "Lỗi khi xóa sản phẩm", type: "error" });
        }
    };

    const formatCurrency = (amount) => {
        return Number(amount).toLocaleString("vi-VN") + "₫";
    };

    if (loading) {
        return (
            <div id="tabWishlist" className="profile-content bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100 flex justify-center items-center py-16">
                <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div id="tabWishlist" className="profile-content bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100 relative">
            <h2 className="text-2xl font-bold text-primary mb-8 px-1">Danh sách yêu thích</h2>

            {wishlist.length === 0 ? (
                <div className="text-center py-16 text-textMuted text-sm">
                    <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    Chưa có sản phẩm nào trong danh sách yêu thích
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlist.map((item) => (
                        <div key={item.wishlist_id} className="flex gap-4 p-4 border border-gray-100 rounded-2xl hover:shadow-md transition bg-white group">
                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-secondary shrink-0 overflow-hidden relative">
                                <img 
                                    src={`http://localhost:3001/images/${item.image}`} 
                                    alt={item.product_name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                                />
                            </div>
                            <div className="flex flex-col justify-center flex-grow">
                                <h3 className="font-semibold text-primary text-base line-clamp-1">{item.product_name}</h3>
                                <div className="text-orange-500 font-bold mt-1 text-lg">{formatCurrency(item.base_price)}</div>
                                <div className="mt-auto flex items-center gap-3 text-sm font-medium pt-3">
                                    <Link to={`/product-detail/${item.product_id}`} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition text-xs">Xem chi tiết</Link>
                                    <button 
                                        onClick={() => handleRemoveWishlist(item.product_id)}
                                        className="text-textMuted hover:text-red-500 transition text-xs flex items-center gap-1"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Toast 
                show={toast.show} 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ ...toast, show: false })} 
            />
        </div>
    );
};

export default Wishlist;
