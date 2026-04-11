import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import requestAPI from "../../../../api";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [isChecking, setIsChecking] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = useForm();

  const navigate = useNavigate();
  const watchedFields = watch();

  // Check email exists
  const onEmailBlur = async () => {
    const email = getValues("email");
    if (!email) return;

    setIsChecking(true);
    try {
      const response = await requestAPI({
        method: "POST",
        url: "/users/check-email",
        data: { email },
      });
      // If response is successful without error, email is available
      setServerErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    } catch (error) {
      const errorData = error?.response?.data;
      const errorMessage = errorData?.message || "Email đã tồn tại!";
      if (errorMessage.includes("Email") || errorMessage.includes("email")) {
        setServerErrors((prev) => ({
          ...prev,
          email: errorMessage,
        }));
      }
    } finally {
      setIsChecking(false);
    }
  };

  const onRegister = async (data) => {
    // Clear server errors when submitting
    setServerErrors({});

    const payload = {
      username: data.username,
      password: data.password,
      email: data.email,
      role: 0,
    };
    
    // Only add full_name if it's provided
    if (data.full_name) {
      payload.full_name = data.full_name;
    }

    try {
      const response = await requestAPI({
        method: "POST",
        url: "/users/register",
        data: payload,
      });

      if (response?.status === 201 || response?.status === 200) {
        // Navigate to login with success message
        navigate("/login", {
          state: {
            message: "Đăng ký thành công! Vui lòng đăng nhập",
            type: "success",
          },
        });
      }
    } catch (error) {
      const errorData = error?.response?.data;
      const errorMessage = errorData?.message || errorData?.error || error.message;
      
      // Handle field-specific errors from server
      if (errorData?.errors && typeof errorData.errors === 'object') {
        setServerErrors(errorData.errors);
      } else if (errorMessage) {
        // Map error messages to specific fields
        const newErrors = {};
        
        if (errorMessage.includes('Email') || errorMessage.includes('email')) {
          newErrors.email = errorMessage;
        } else if (errorMessage.includes('Username') || errorMessage.includes('username')) {
          newErrors.username = errorMessage;
        } else if (errorMessage.includes('Password') || errorMessage.includes('password')) {
          newErrors.password = errorMessage;
        } else {
          newErrors.general = errorMessage;
        }
        
        setServerErrors(newErrors);
      }
    }
  };

  return (
    <div>
      <main className="mt-20 flex-grow flex items-center justify-center p-6 md:py-16">
        <div className="w-full max-w-4xl bg-white rounded-[32px] box-shadow-soft border border-gray-100 shadow-[0_20px_50px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row lg:min-h-[600px]">
          {/* Left Side: Image Visual */}
          <div className="hidden lg:flex flex-col relative w-1/2 p-12 overflow-hidden bg-primary justify-end">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80')",
              }}
            ></div>
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Inner Text */}
            <div className="relative z-10 w-full mb-4">
              <p className="text-3xl lg:text-4xl text-white font-medium leading-[1.3] mb-8 max-w-sm">
                "Kiến tạo không gian,
                <br />
                dựng xây tổ ấm."
              </p>
              <div className="flex gap-2">
                <div className="w-3 h-1 bg-white/40 rounded-full hover:bg-white/70 transition cursor-pointer"></div>
                <div className="w-8 h-1 bg-white rounded-full"></div>
                <div className="w-3 h-1 bg-white/40 rounded-full hover:bg-white/70 transition cursor-pointer"></div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 md:p-10 lg:p-12 bg-white relative">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2 tracking-tight">
              Tạo tài khoản mới
            </h2>
            <p className="text-textMuted mb-6 text-sm md:text-base">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-orange-500 font-semibold hover:text-orange-600 transition underline underline-offset-2 decoration-orange-200"
              >
                Đăng nhập
              </Link>
            </p>

            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onRegister)}
            >
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary px-1">
                  Tên đăng nhập
                </label>
                <input
                  {...register("username", {
                    required: {
                      value: true,
                      message: "Tên đăng nhập không được để trống",
                    },
                    minLength: {
                      value: 3,
                      message: "Tên đăng nhập phải có ít nhất 3 ký tự",
                    },
                    maxLength: {
                      value: 100,
                      message: "Tên đăng nhập tối đa 100 ký tự",
                    },
                  })}
                  type="text"
                  placeholder="Tên người dùng"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-secondary transition text-sm"
                />
                {errors.username && (
                  <small className="text-red-500 text-sm">
                    {errors.username.message}
                  </small>
                )}
                {serverErrors.username && (
                  <small className="text-red-500 text-sm">
                    {serverErrors.username}
                  </small>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary px-1">
                  Họ và tên
                </label>
                <input
                  {...register("full_name", {
                    required: {
                      value: true,
                      message: "Họ và tên không được để trống",
                    },
                    minLength: {
                      value: 6,
                      message: "Họ và tên phải có ít nhất 6 ký tự",
                    },
                    maxLength: {
                      value: 255,
                      message: "Họ và tên tối đa 255 ký tự",
                    },
                  })}
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-secondary transition text-sm"
                />
                {errors.full_name && (
                  <small className="text-red-500 text-sm">
                    {errors.full_name.message}
                  </small>
                )}
                {serverErrors.full_name && (
                  <small className="text-red-500 text-sm">
                    {serverErrors.full_name}
                  </small>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary px-1">
                  Địa chỉ Email
                </label>
                <input
                  {...register("email", {
                    required: {
                      value: true,
                      message: "Email không được để trống",
                    },
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email không hợp lệ",
                    },
                    maxLength: {
                      value: 150,
                      message: "Email tối đa 150 ký tự",
                    },
                  })}
                  onBlur={onEmailBlur}
                  type="email"
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-secondary transition text-sm"
                />
                {errors.email && (
                  <small className="text-red-500 text-sm">
                    {errors.email.message}
                  </small>
                )}
                {serverErrors.email && (
                  <small className="text-red-500 text-sm">
                    {serverErrors.email}
                  </small>
                )}
              </div>
              <div className="flex flex-col gap-2 relative">
                <label className="text-sm font-semibold text-primary px-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    {...register("password", {
                      required: {
                        value: true,
                        message: "Mật khẩu không được để trống",
                      },
                      minLength: {
                        value: 8,
                        message: "Mật khẩu phải có ít nhất 8 ký tự",
                      },
                      maxLength: {
                        value: 255,
                        message: "Mật khẩu tối đa 255 ký tự",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    id="registerPassword"
                    placeholder="Ít nhất 8 ký tự"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-secondary transition text-sm pr-12"
                  />
                  {errors.password && (
                    <small className="text-red-500 text-sm">
                      {errors.password.message}
                    </small>
                  )}
                  {serverErrors.password && (
                    <small className="text-red-500 text-sm">
                      {serverErrors.password}
                    </small>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition focus:outline-none"
                  >
                    {!showPassword ? (
                      /* Eye Icon */
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        ></path>
                      </svg>
                    ) : (
                      /* Eye Slash Icon */
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        ></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex flex-col mt-1 px-1">
                <label className="flex items-start cursor-pointer group">
                  <input
                    {...register("terms", {
                      required: "Bạn phải đồng ý với điều khoản",
                    })}
                    type="checkbox"
                    className="w-4 h-4 mt-0.5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 shrink-0"
                  />

                  <span className="ml-3 text-sm text-textMuted leading-tight group-hover:text-primary transition">
                    Tôi đồng ý với các{" "}
                    <Link
                      to="#"
                      className="font-semibold text-primary underline underline-offset-2"
                    >
                      Điều khoản
                    </Link>{" "}
                    &{" "}
                    <Link
                      to="#"
                      className="font-semibold text-primary underline underline-offset-2"
                    >
                      Điều kiện
                    </Link>{" "}
                    của SmartLiving.
                  </span>
                </label>

                {errors.terms && (
                  <small className="text-red-500 text-sm mt-1 ml-7">
                    {errors.terms.message}
                  </small>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 mt-2 rounded-xl font-bold text-sm hover:bg-orange-600 transition duration-300 shadow-[0_8px_20px_rgb(249,115,22,0.25)]"
              >
                Đăng ký
              </button>
            </form>

            <div className="my-6 flex items-center gap-4 text-sm font-medium text-gray-300 before:flex-1 before:border-t before:border-gray-200 after:flex-1 after:border-t after:border-gray-200">
              Hoặc đăng ký bằng
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-primary hover:bg-gray-50 hover:border-gray-300 transition shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-primary hover:bg-gray-50 hover:border-gray-300 transition shadow-sm">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.05 13.6c-.02-2.3 1.9-3.4 1.98-3.46-1.07-1.57-2.73-1.78-3.33-1.81-1.42-.14-2.76.84-3.49.84-.71 0-1.8-.82-2.96-.8-1.5.02-2.89.87-3.66 2.21-1.56 2.7-.4 6.7 1.12 8.86.74 1.06 1.6 2.23 2.74 2.19 1.1-.04 1.54-.71 2.87-.71 1.33 0 1.75.71 2.89.69 1.16-.02 1.9-.107 2.61-2.12.78-1.14 1.1-2.25 1.12-2.31-.02-.01-2.14-.82-2.16-3.21l.01-.01zM14.65 7.42c.6-.72.99-1.74.88-2.75-.87.03-1.95.58-2.57 1.3-.55.63-1 1.68-.88 2.68.96.07 1.96-.5 2.57-1.23z" />
                </svg>
                Apple
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
