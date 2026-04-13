import { Link, useSearchParams } from "react-router-dom";

const CheckoutCancel = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <div className="min-h-[60vh] mt-20 max-w-3xl mx-auto px-6 py-16 w-full flex-grow flex items-center justify-center">
            <div className="bg-white rounded-[32px] p-10 w-full text-center shadow-xl border border-gray-100 relative z-10 animate-[scale-in_0.3s_ease-out]">
                <div className="w-24 h-24 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-8">
                    <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                    >
                        <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                    Thanh toán đã bị hủy
                </h1>
                <p className="text-textMuted mb-2 text-lg">
                    Bạn đã hủy giao dịch thanh toán trực tuyến cho đơn hàng <span className="font-bold text-primary">#{orderId}</span>.
                </p>
                <p className="text-textMuted mb-10 text-sm md:text-base leading-relaxed">
                    Đơn hàng của bạn hiện đang ở trạng thái chờ thanh toán. Bạn có thể tiến hành thanh toán lại trong phần quản lý đơn hàng.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to={`/user/orders`}
                        className="inline-block bg-secondary text-primary px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition duration-300"
                    >
                        Quản lý đơn hàng
                    </Link>
                    <Link
                        to="/"
                        className="inline-block bg-orange-500 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition duration-300 shadow-[0_8px_20px_rgb(249,115,22,0.25)]"
                    >
                        Trở về Trang Chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CheckoutCancel;
