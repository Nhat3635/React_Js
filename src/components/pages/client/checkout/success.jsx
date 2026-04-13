import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import requestAPI from "../../../../api";

const CheckoutSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const orderCode = searchParams.get("orderCode");
    const status = searchParams.get("status");
    const cancel = searchParams.get("cancel");
    const code = searchParams.get("code");
    const id = searchParams.get("id");

    const syncPayload = useMemo(() => ({
        orderId,
        orderCode,
        status,
        cancel,
        code,
        payosLinkId: id,
    }), [orderId, orderCode, status, cancel, code, id]);

    useEffect(() => {
        if (!orderId && !orderCode) return;

        const syncStatus = async () => {
            try {
                await requestAPI({
                    method: "POST",
                    url: "/orders/payos/return-sync",
                    data: syncPayload,
                });
            } catch (error) {
                console.error("Lỗi đồng bộ trạng thái đơn hàng khi PayOS trả về thành công:", error);
            }
        };

        syncStatus();
    }, [orderId, orderCode, syncPayload]);

    return (
        <div className="min-h-[60vh] mt-20 max-w-3xl mx-auto px-6 py-16 w-full flex-grow flex items-center justify-center">
            <div className="bg-white rounded-[32px] p-10 w-full text-center shadow-xl border border-gray-100 relative z-10 animate-[scale-in_0.3s_ease-out]">
                <div className="w-24 h-24 rounded-full bg-green-100 text-green-500 flex items-center justify-center mx-auto mb-8">
                    <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                    >
                        <path d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                    Thanh toán thành công!
                </h1>
                <p className="text-textMuted mb-2 text-lg">
                    Đơn hàng <span className="font-bold text-primary">#{orderId}</span> của bạn đã được thanh toán thông qua tự động PayOS.
                </p>
                <p className="text-textMuted mb-10 text-sm md:text-base leading-relaxed">
                    Hệ thống sẽ sớm cập nhật trạng thái đơn hàng. Chúng tôi sẽ xử lý và giao hàng cho bạn trong thời gian sớm nhất! Cảm ơn bạn đã mua sắm tại SmartLiving.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/user/orders"
                        className="inline-block bg-secondary text-primary px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition duration-300"
                    >
                        Xem đơn hàng
                    </Link>
                    <Link
                        to="/"
                        className="inline-block bg-orange-500 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition duration-300 shadow-[0_8px_20px_rgb(249,115,22,0.25)]"
                    >
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSuccess;
