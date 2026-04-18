import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import AddressSelector from "../../../ui/client/AddressSelector";
import Toast from "../../../ui/common/Toast";
import requestAPI from "../../../../api";

const Checkout = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderConfirming, setOrderConfirming] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = useCallback((message, type = "success") => {
    setToast({ show: true, message, type });
  }, []);

  const isAdminAccount = (() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const payload = jwtDecode(token);
      const role = Number(payload?.role ?? payload?.data?.role);
      return role === 1;
    } catch {
      return false;
    }
  })();

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // Load cart on component mount
  useEffect(() => {
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
        setCart(null);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  const handleCheckout = async (formData) => {
    if (isAdminAccount) {
      showToast("Tài khoản admin không thể đặt hàng.", "error");
      return;
    }

    setOrderConfirming(true);

    try {
      // Validate cart before submitting
      if (!cart?.items || cart.items.length === 0) {
        showToast("Giỏ hàng của bạn đang trống", "error");
        setOrderConfirming(false);
        return;
      }

      // Validate form fields
      if (!formData.fullName?.trim()) {
        showToast("Vui lòng nhập đủ thông tin", "error");
        setOrderConfirming(false);
        return;
      }

      if (!formData.phone?.trim()) {
        showToast("Vui lòng nhập đủ thông tin", "error");
        setOrderConfirming(false);
        return;
      }

      if (!formData.email?.trim()) {
        showToast("Vui lòng nhập đủ thông tin", "error");
        setOrderConfirming(false);
        return;
      }

      if (!formData.address?.trim()) {
        showToast("Vui lòng nhập đủ thông tin", "error");
        setOrderConfirming(false);
        return;
      }

      // Validate address fields (API v2 không có quận, chỉ cần tỉnh và phường)
      if (!formData.province_code || !formData.ward_code) {
        showToast("Vui lòng nhập đủ thông tin", "error");
        setOrderConfirming(false);
        return;
      }

      // Prepare order data matching backend requirements
      const orderData = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        province_code: parseInt(formData.province_code),
        ward_code: parseInt(formData.ward_code),
        payment_method: formData.payment || "COD",
        items: cart?.items?.map(item => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
          price_at_purchase: item.unit_price
        })) || []
      };

      console.log("📤 Sending order data:", JSON.stringify(orderData, null, 2));

      // Call create order API
      const response = await requestAPI({
        method: "POST",
        url: "/orders/create-with-address",
        data: orderData
      });

      console.log("📥 Backend response:", response);

      // Check for successful response (status 200 or 201)
      if (response?.status === 200 || response?.status === 201 || response?.data?.success) {
        // Clear giỏ hàng ở Frontend state
        setCart(null);
        
        // Gọi API clear giỏ hàng phía frontend cho an toàn
        try {
          await requestAPI({
            method: "DELETE",
            url: "/carts/clear"
          });
        } catch (e) {
          console.error("Lỗi dọn giỏ hàng từ FE:", e);
        }

        const orderId = response?.data?.data?.order_id || response?.data?.order_id;

        if (formData.payment === "EWALLET" || formData.payment === "BANK_TRANSFER") {
          try {
            // Gọi API PayOS để tạo link thanh toán
            const payosResponse = await requestAPI({
                method: "POST",
                url: "/payos/create-payment-link",
                data: { orderId }
            });
            
            if (payosResponse?.data?.data) {
                // Chuyển hướng người dùng sang trang thanh toán của PayOS
                window.location.href = payosResponse.data.data;
                return;
            } else {
                showToast("Lỗi lấy link thanh toán, vui lòng thử lại sau.", "error");
            }
          } catch (payosError) {
             console.error("Lỗi gọi PayOS API:", payosError);
             showToast("Lỗi kết nối đến cổng thanh toán", "error");
          }
        } else {
          setIsSuccessModalOpen(true);
        }
      } else {
        showToast(response?.data?.message || "Lỗi tạo đơn hàng, vui lòng thử lại", "error");
      }
    } catch (error) {
      console.error("❌ Lỗi tạo đơn hàng:", error);
      console.error("❌ Response data:", error?.response?.data);
      const errorMessage = error?.response?.data?.message || error?.message || "Lỗi tạo đơn hàng, vui lòng thử lại";
      showToast(errorMessage, "error");
    } finally {
      setOrderConfirming(false);
    }
  };

  return (
    <div>
      {/* Main Content Checkout */}
      <main className="mt-20 max-w-7xl mx-auto px-6 py-16 md:px-12 w-full flex-grow relative">
        <h1 className="text-3xl md:text-4xl font-semibold mb-10 text-primary">
          Thanh toán an toàn
        </h1>

        <div className="flex flex-col lg:flex-row gap-12 relative z-10">
          {/* Left: Shipping & Payment */}
          <div className="lg:w-2/3 flex flex-col gap-10">
            {/* Shipping Info */}
            <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                  1
                </span>
                Thông tin giao hàng
              </h2>
              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                id="checkoutForm"
                onSubmit={handleSubmit(handleCheckout)}
              >
                {!cart?.items || cart.items.length === 0 ? (
                  <div className="md:col-span-2 p-6 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                    <p className="text-yellow-700 font-medium">Giỏ hàng của bạn đang trống. <Link to="/shop" className="text-orange-500 hover:underline font-bold">Tiếp tục mua sắm</Link></p>
                  </div>
                ) : null}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-textMuted px-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    placeholder="Trần Văn A"
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-secondary transition text-sm"
                    {...register("fullName", {
                      required: {
                        value: true,
                        message: "Họ và tên không được để trống",
                      },
                    })}
                  />
                  {errors.fullName && (
                    <small className="text-red-500 text-sm">
                      {errors.fullName.message}
                    </small>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-textMuted px-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-secondary transition text-sm"
                    {...register("phone", {
                      required: {
                        value: true,
                        message: "Số điện thoại không được để trống",
                      },
                      pattern: {
                        value: /^(0|\+84)\d{9,10}$/,
                        message: "Số điện thoại không hợp lệ",
                      },
                    })}
                  />
                  {errors.phone && (
                    <small className="text-red-500 text-sm">
                      {errors.phone.message}
                    </small>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-textMuted px-1">
                    Địa chỉ Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-secondary transition text-sm"
                    {...register("email", {
                      required: {
                        value: true,
                        message: "Email không được để trống",
                      },
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email không hợp lệ",
                      },
                    })}
                  />
                  {errors.email && (
                    <small className="text-red-500 text-sm">
                      {errors.email.message}
                    </small>
                  )}
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-textMuted px-1">
                    Địa chỉ nhận hàng
                  </label>
                  <input
                    type="text"
                    placeholder="Số nhà, Tên đường, Phường/Xã"
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-secondary transition text-sm"
                    {...register("address", {
                      required: {
                        value: true,
                        message: "Địa chỉ nhận hàng không được để trống",
                      },
                    })}
                  />
                  {errors.address && (
                    <small className="text-red-500 text-sm">
                      {errors.address.message}
                    </small>
                  )}
                </div>
                <AddressSelector
                  register={register}
                  watch={watch}
                  errors={errors}
                  setValue={setValue}
                />
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                  2
                </span>
                Phương thức thanh toán
              </h2>
              <div className="flex flex-col gap-4">
                <label className="flex items-center p-4 border border-orange-500 bg-orange-50/50 rounded-xl cursor-pointer transition">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    defaultChecked
                    {...register("payment")}
                  />
                  <span className="ml-3 font-medium text-primary">
                    Thanh toán khi nhận hàng - COD
                  </span>
                </label>
                <label className="flex items-center p-4 border border-gray-200 hover:border-orange-300 hover:bg-orange-50/30 rounded-xl cursor-pointer transition">
                  <input
                    type="radio"
                    name="payment"
                    value="EWALLET"
                    className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    {...register("payment")}
                  />
                  <span className="ml-3 font-medium text-primary">
                    Chuyển khoản ngân hàng E-Wallet
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Review Order (Sticky Sidebar) */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100 lg:sticky lg:top-32 relative overflow-hidden">
              {/* Subtle background decoration */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full opacity-50 pointer-events-none"></div>

              <h3 className="text-xl font-bold text-primary mb-6 relative z-10">
                Tóm tắt đơn hàng
              </h3>

              {/* Mini Product List */}
              <div className="flex flex-col gap-4 mb-6 border-b border-gray-100 pb-6 relative z-10 max-h-64 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-6">
                    <p className="text-textMuted text-sm">Đang tải giỏ hàng...</p>
                  </div>
                ) : cart?.items && cart.items.length > 0 ? (
                  cart.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={item.variant_image || "https://via.placeholder.com/64"}
                          className="w-16 h-16 rounded-xl object-cover bg-secondary"
                          alt={item.product_name}
                        />
                        <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-sm font-semibold text-primary line-clamp-1">
                          {item.product_name}
                        </h4>
                        <p className="text-xs text-textMuted">
                          {item.color_name && `${item.color_name} `}
                          {item.size_name && `| ${item.size_name}`}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total_price || item.unit_price * item.quantity)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-textMuted text-sm">Giỏ hàng trống</p>
                  </div>
                )}
              </div>

              {/* Total calc */}
              <div className="flex flex-col gap-3 mb-6 relative z-10">
                <div className="flex justify-between text-sm">
                  <span className="text-textMuted">Tạm tính</span>
                  <span className="font-medium text-primary">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cart?.total_price || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-textMuted">Phí vận chuyển</span>
                  <span className="font-medium text-green-500">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-gray-100 pt-6 mb-8 relative z-10">
                <span className="text-lg font-bold text-primary">
                  Tổng cộng
                </span>
                <div className="text-right">
                  <span className="text-xs text-textMuted block mb-1">
                    Đã bao gồm VAT
                  </span>
                  <span className="text-2xl font-bold text-orange-500 leading-none">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cart?.total_price || 0)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                form="checkoutForm"
                disabled={
                  isAdminAccount ||
                  !cart?.items ||
                  cart.items.length === 0 ||
                  orderConfirming
                }
                className="w-full text-center bg-primary text-white py-4 rounded-xl font-bold hover:bg-orange-500 transition duration-300 shadow-md relative z-10 group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">
                  {isAdminAccount
                    ? "Tài khoản admin không thể đặt hàng"
                    : orderConfirming
                    ? "Đang xử lý..."
                    : "Đặt hàng ngay"}
                </span>
                <div className="absolute inset-0 w-0 bg-orange-500 transition-all duration-300 ease-out group-hover:w-full z-0"></div>
              </button>

              <p className="text-xs text-center text-textMuted mt-4 max-w-[250px] mx-auto relative z-10">
                {isAdminAccount ? (
                  <span className="text-red-500">Vui lòng đăng nhập bằng tài khoản khách hàng để đặt hàng</span>
                ) : cart?.items && cart.items.length === 0 ? (
                  <span className="text-red-500">Vui lòng thêm sản phẩm vào giỏ hàng</span>
                ) : (
                  "Bằng việc đặt hàng, bạn đồng ý với các Điều khoản & Chính sách của chúng tôi."
                )}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      <Toast {...toast} onClose={closeToast} />

      {/* Success Modal Overlay */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300">
          <div className="bg-white rounded-[32px] p-10 max-w-md w-[90%] text-center shadow-2xl relative z-10 animate-[scale-in_0.3s_ease-out]">
            <div className="w-20 h-20 rounded-full bg-green-100 text-green-500 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10"
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
            <h2 className="text-3xl font-bold text-primary mb-3">
              Cảm ơn bạn!
            </h2>
            <p className="text-textMuted mb-8 text-sm leading-relaxed">
              Đơn hàng của bạn đã được đặt thành công. Chúng tôi sẽ sớm liên hệ
              để xác nhận thông tin giao hàng.
            </p>
            <Link
              to="/"
              className="inline-block bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-orange-500 transition duration-300 w-full"
              onClick={() => setIsSuccessModalOpen(false)}
            >
              Về Trang Chủ
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
