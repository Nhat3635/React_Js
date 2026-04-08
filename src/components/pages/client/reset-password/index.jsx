import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import requestAPI from "../../../../api";

const ResetPassword = () => {
    const [resetCode, setResetCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        if (password.length < 8) {
            setError("Mật khẩu phải có ít nhất 8 ký tự");
            return;
        }

        setLoading(true);

        try {
            const response = await requestAPI({
                method: "POST",
                url: "/users/reset-password",
                data: { resetCode, password },
            });

            if (response?.status === 200) {
                setSuccess(true);
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (error) {
            setError(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div>
                <main className="mt-20 flex-grow flex items-center justify-center p-6 md:py-16">
                    <div className="w-full max-w-md bg-white rounded-[32px] box-shadow-soft border border-gray-100 shadow-[0_20px_50px_rgb(0,0,0,0.08)] overflow-hidden">
                        <div className="p-8 md:p-10 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-primary mb-2">Đặt lại mật khẩu thành công!</h3>
                            <p className="text-textMuted text-sm mb-6">
                                Mật khẩu của bạn đã được cập nhật. Bạn sẽ được chuyển hướng đến trang đăng nhập...
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div>
            <main className="mt-20 flex-grow flex items-center justify-center p-6 md:py-16">
                <div className="w-full max-w-md bg-white rounded-[32px] box-shadow-soft border border-gray-100 shadow-[0_20px_50px_rgb(0,0,0,0.08)] overflow-hidden">
                    <div className="p-8 md:p-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2 tracking-tight text-center">
                            Đặt lại mật khẩu
                        </h2>
                        <p className="text-textMuted mb-8 text-sm md:text-base text-center">
                            Nhập mã xác nhận và mật khẩu mới
                        </p>

                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-primary px-1">
                                    Mã xác nhận
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập mã 6 chữ số"
                                    value={resetCode}
                                    onChange={(e) => setResetCode(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-secondary transition text-sm"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2 relative">
                                <label className="text-sm font-semibold text-primary px-1">
                                    Mật khẩu mới
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Ít nhất 8 ký tự"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-secondary transition text-sm pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition focus:outline-none"
                                    >
                                        {!showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-primary px-1">
                                    Xác nhận mật khẩu
                                </label>
                                <input
                                    type="password"
                                    placeholder="Nhập lại mật khẩu"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-secondary transition text-sm"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-orange-500 text-white py-3 mt-2 rounded-xl font-bold text-sm hover:bg-orange-600 transition duration-300 shadow-[0_8px_20px_rgb(249,115,22,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link
                                to="/login"
                                className="text-orange-500 font-semibold hover:text-orange-600 transition underline underline-offset-2 decoration-orange-200"
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

export default ResetPassword;