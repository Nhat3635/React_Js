import { useState } from "react";
import { Link } from "react-router-dom";
import requestAPI from "../../../../api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await requestAPI({
                method: "POST",
                url: "/users/forgot-password",
                data: { email },
            });

            if (response?.status === 200) {
                setIsSubmitted(true);
            }
        } catch (error) {
            setError(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <main className="mt-20 flex-grow flex items-center justify-center p-6 md:py-16">
                <div className="w-full max-w-md bg-white rounded-[32px] box-shadow-soft border border-gray-100 shadow-[0_20px_50px_rgb(0,0,0,0.08)] overflow-hidden">
                    <div className="p-8 md:p-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2 tracking-tight text-center">
                            Quên mật khẩu
                        </h2>
                        <p className="text-textMuted mb-8 text-sm md:text-base text-center">
                            Nhập địa chỉ email của bạn để nhận hướng dẫn đặt lại mật khẩu
                        </p>

                        {!isSubmitted ? (
                            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-primary px-1">
                                        Địa chỉ Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="example@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-secondary transition text-sm"
                                        required
                                    />
                                    {error && (
                                        <small className="text-red-500 text-sm">{error}</small>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-orange-500 text-white py-3 mt-2 rounded-xl font-bold text-sm hover:bg-orange-600 transition duration-300 shadow-[0_8px_20px_rgb(249,115,22,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Đang gửi..." : "Gửi hướng dẫn"}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-primary mb-2">Email đã được gửi!</h3>
                                <p className="text-textMuted text-sm mb-6">
                                    Chúng tôi đã gửi mã đặt lại mật khẩu đến email của bạn.
                                    Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn.
                                </p>
                                <Link
                                    to="/reset-password"
                                    className="inline-block bg-orange-500 text-white px-6 py-2 rounded-xl font-semibold text-sm hover:bg-orange-600 transition duration-300 shadow-[0_4px_14px_rgb(249,115,22,0.25)] mr-4"
                                >
                                    Đặt lại mật khẩu
                                </Link>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-orange-500 font-semibold hover:text-orange-600 transition underline underline-offset-2"
                                >
                                    Gửi lại email
                                </button>
                            </div>
                        )}

                        <div className="mt-6 text-center">
                            <Link
                                to="/login"
                                className="text-orange-500 font-semibold hover:text-orange-600 transition decoration-orange-200"
                            >
                                ← Quay lại đăng nhập
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ForgotPassword;