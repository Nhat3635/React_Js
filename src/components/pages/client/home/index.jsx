import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import requestAPI from "../../../../api";
import "./style.css";

const normalizeHomeProducts = (payload) => {
  const rawItems = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];

  return rawItems.map((item, index) => {
    const priceValue =
      item.base_price ??
      item.price ??
      item.selling_price ??
      item.sale_price ??
      item.current_price ??
      0;

    return {
      id: item.id ?? item._id ?? index,
      name: item.name ?? item.title ?? item.product_name ?? "Sản phẩm",
      category:
        item.category_name ??
        item.category ??
        item.category_title ??
        "Nội thất",
      image:
        item.featured_image ??
        item.image ??
        item.thumbnail ??
        "https://placehold.co/600x600?text=PRODUCT",
      price: Number(String(priceValue).replace(/[^\d]/g, "")) || 0,
      rating: Number(item.rating ?? item.review_score ?? 0),
    };
  });
};

const formatPrice = (price = 0) => {
  if (!price) return "Liên hệ";
  return `${price.toLocaleString("vi-VN")}đ`;
};

const formatStars = (rating = 0) => {
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
  const percentage = (safeRating / 5) * 100;

  return (
    <div className="star-rating">
      <div className="stars-outer">
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
      </div>
      <div
        className="stars-inner"
        style={{ width: `${percentage}%` }}
      >
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
      </div>
    </div>
  );
};

const Home = () => {
  const [homeState, setHomeState] = useState({
    activeCategory: "chair",
    products: [],
    isLoadingProducts: true,
    productError: "",
  });

  const categories = [
    { id: "chair", name: "Ghế" },
    { id: "beds", name: "Giường" },
    { id: "sofa", name: "Sofa" },
    { id: "lamp", name: "Đèn" },
  ];

  const updateHomeState = React.useCallback((partialState) => {
    setHomeState((prev) => ({ ...prev, ...partialState }));
  }, []);

  const productCarouselRef = useRef(null);
  const testiCarouselRef = useRef(null);
  const scrollAmount = 350;

  const scrollProducts = (direction) => {
    if (productCarouselRef.current) {
      productCarouselRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollTestimonials = (direction) => {
    if (testiCarouselRef.current) {
      testiCarouselRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth",
      });
    }
  };

  React.useEffect(() => {
    loadHomeProducts();
  }, [updateHomeState]);

  const loadHomeProducts = async () => {
    try {
      updateHomeState({ isLoadingProducts: true, productError: "" });
        console.log("Fetching products for home page...");
      const response = await requestAPI({
        method: "GET",
        url: "/products/list",
      });

      updateHomeState({ products: normalizeHomeProducts(response?.data) });
    } catch (error) {
      updateHomeState({
        products: [],
        productError: error?.message || "Không tải được sản phẩm",
      });
    } finally {
      updateHomeState({ isLoadingProducts: false });
    }
  };

  const categoryKeywords = React.useMemo(
    () => ({
      chair: ["ghế", "chair"],
      beds: ["giường", "bed"],
      sofa: ["sofa"],
      lamp: ["đèn", "lamp", "light"],
    }),
    [],
  );

  const filteredBestSellingProducts = React.useMemo(() => {
    const keywords = categoryKeywords[homeState.activeCategory] || [];
    const source = Array.isArray(homeState.products) ? homeState.products : [];

    const matched = source.filter((item) => {
      const text = `${item.name} ${item.category}`.toLowerCase();
      return keywords.some((keyword) => text.includes(keyword));
    });

    return (matched.length > 0 ? matched : source).slice(0, 8);
  }, [categoryKeywords, homeState.activeCategory, homeState.products]);

  return (
    <main>
      {/* 1. Hero Content & Background Image (Lưu ý Header đã được tách ra ngoài nên chỉ còn phần hình nền) */}
      <div className="relative w-full h-[700px] md:h-[800px] bg-primary overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Modern Minimalist Living Room"
            className="w-full h-full object-cover opacity-90 hero-image-zoom"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 max-w-7xl mx-auto pt-20">
          <h1 className="text-5xl md:text-7xl font-semibold leading-tight mb-6 text-white max-w-4xl tracking-tight">
            Làm Cho Không Gian Của Bạn Tối Giản & Hiện Đại Hơn
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl font-light">
            Biến căn phòng của bạn với SmartLiving trở nên tối giản và hiện đại
            hơn một cách dễ dàng và nhanh chóng.
          </p>

          {/* Search Bar */}
          <div className="flex items-center w-full max-w-lg bg-white/20 backdrop-blur-md rounded-full shadow-lg p-2 border border-white/30 transition hover:bg-white/30">
            <input
              type="text"
              placeholder="Tìm kiếm nội thất"
              className="flex-grow px-6 py-3 text-white focus:outline-none placeholder-gray-200 bg-transparent text-sm md:text-base"
            />
            <button className="bg-orange-500 text-white w-12 h-12 rounded-full flex justify-center items-center hover:bg-orange-600 transition shadow-md flex-shrink-0">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Hotspots */}
        <div className="absolute z-20 bottom-1/4 left-1/3 hotspot-container cursor-pointer group">
          <div className="w-5 h-5 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center relative shadow-lg">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping"></span>
            <div className="absolute w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
          </div>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-primary text-xs font-semibold px-3 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Sofa nhung cam
          </div>
        </div>
        <div className="absolute z-20 top-[40%] right-[30%] hotspot-container cursor-pointer group">
          <div className="w-5 h-5 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center relative shadow-lg">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping"></span>
            <div className="absolute w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
          </div>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-primary text-xs font-semibold px-3 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Đèn đứng hiện đại
          </div>
        </div>
      </div>

      {/* 2. Best Selling Product Section */}
      <section className="bg-secondary py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-6 md:mb-0">
            Sản phẩm bán chạy nhất
          </h2>
          <div className="flex space-x-2 md:space-x-8 overflow-x-auto bg-gray-100 p-2 border border-gray-200 rounded-full category-filters">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateHomeState({ activeCategory: cat.id })}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  homeState.activeCategory === cat.id
                    ? "bg-white shadow-sm text-primary"
                    : "text-textMuted hover:text-primary bg-transparent"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          {/* Products Carousel */}
          <div
            ref={productCarouselRef}
            className="flex gap-8 overflow-x-hidden scroll-smooth py-4 product-carousel"
          >
            {homeState.isLoadingProducts && (
              <div className="w-full text-center py-10 text-textMuted">
                Đang tải sản phẩm...
              </div>
            )}

            {!homeState.isLoadingProducts && homeState.productError && (
              <div className="w-full text-center py-10 text-red-500">
                {homeState.productError}
              </div>
            )}

            {!homeState.isLoadingProducts &&
              !homeState.productError &&
              filteredBestSellingProducts.length === 0 && (
                <div className="w-full text-center py-10 text-textMuted">
                  Chưa có sản phẩm để hiển thị.
                </div>
              )}

            {!homeState.isLoadingProducts &&
              !homeState.productError &&
              filteredBestSellingProducts.map((product) => (
                <div
                  key={product.id}
                  className="min-w-[280px] md:min-w-[320px] bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition flex flex-col group border border-gray-100"
                >
                    <Link
                      to={`/product-detail/${product.id}`}
                      className="block"
                    >
                      <div className="h-64 bg-accent rounded-2xl mb-6 overflow-hidden relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>
                    </Link>
                  <div className="text-sm text-textMuted mb-2 uppercase tracking-wider font-medium">
                    {product.category}
                  </div>
                  <Link
                    to={`/product-detail/${product.id}`}
                    className="text-xl font-semibold text-primary mb-2 line-clamp-2 hover:text-orange-500 transition"
                  >
                    {product.name}
                  </Link>
                  {Number(product.rating || 0) > 0 && (
                    <div className="flex items-center space-x-1 mb-4">
                      <span className="text-yellow-400">
                        {formatStars(product.rating)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    <button className="w-10 h-10 rounded-full bg-primary text-white flex justify-center items-center hover:bg-black transition add-to-cart group-hover:rotate-90 duration-300">
                      +
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Arrows */}
          <button
            onClick={() => scrollProducts(-1)}
            className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-white text-primary w-12 h-12 rounded-full shadow-lg items-center justify-center hover:bg-gray-50 z-10 border border-gray-100 text-xl hidden md:flex"
          >
            ←
          </button>
          <button
            onClick={() => scrollProducts(1)}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-white text-primary w-12 h-12 rounded-full shadow-lg items-center justify-center hover:bg-gray-50 z-10 border border-gray-100 text-xl hidden md:flex"
          >
            →
          </button>
        </div>
      </section>

      {/* 3. Experiences Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:px-12 flex flex-col md:flex-row items-center gap-16 relative">
        <div className="md:w-1/2 relative w-full h-[500px] md:h-[600px] group">
          <div className="absolute -inset-4 bg-orange-50 rounded-[40px] transform -rotate-3 transition duration-500 group-hover:rotate-0"></div>
          <img
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Beautiful Experience Interior"
            className="w-full h-full object-cover rounded-[32px] shadow-2xl relative z-10 transition duration-500 group-hover:scale-[1.02]"
          />
        </div>
        <div className="md:w-1/2 flex flex-col items-start gap-6 z-10">
          <h4 className="text-orange-500 uppercase tracking-widest font-bold text-sm">
            Trải nghiệm
          </h4>
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-primary">
            Chúng Tôi Mang Đến Trải Nghiệm Tuyệt Vời Nhất
          </h2>
          <p className="text-textMuted text-lg leading-relaxed">
            Bạn không cần phải lo lắng về kết quả vì tất cả những không gian này
            đều được thực hiện bởi những chuyên gia trong lĩnh vực, với phong
            cách thanh lịch, hiện đại cùng chất liệu đạt chuẩn cao cấp.
          </p>
          <a
            href="#"
            className="inline-flex items-center space-x-2 text-primary font-semibold mt-4 hover:text-orange-500 transition group items-center"
          >
            <span>Xem thêm</span>
            <span className="text-orange-500 transform group-hover:translate-x-1 transition duration-300">
              →
            </span>
          </a>
        </div>
      </section>

      {/* 4. Materials Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:px-12 flex flex-col md:flex-row-reverse items-center gap-16">
        <div className="md:w-1/2 flex h-[500px] md:h-[600px] gap-4">
          <div className="w-[55%] h-full">
            <img
              src="https://images.unsplash.com/photo-1540932239986-30128078f3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              alt="Material Detail 1"
              className="w-full h-full object-cover rounded-[32px] shadow-lg hover:scale-[1.02] transition duration-500 cursor-pointer object-left-bottom"
            />
          </div>
          <div className="w-[45%] flex flex-col gap-4 h-full">
            <img
              src="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              alt="Material Detail 2"
              className="w-full h-[45%] object-cover rounded-[32px] shadow-lg hover:scale-[1.02] transition duration-500 cursor-pointer"
            />
            <img
              src="https://images.unsplash.com/photo-1538688423619-a81d3f23454b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              alt="Material Detail 3"
              className="w-full h-[55%] object-cover rounded-[32px] shadow-lg hover:scale-[1.02] transition duration-500 cursor-pointer mt-auto"
            />
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col items-start gap-6">
          <h4 className="text-orange-500 uppercase tracking-widest font-bold text-sm">
            Vật liệu
          </h4>
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-primary">
            Vật Liệu Cao Cấp Cho Nội Thất Của Bạn
          </h2>
          <p className="text-textMuted text-lg leading-relaxed">
            SmartLiving luôn nghiêm túc trong việc thiết kế nội thất cho môi
            trường sống của bạn, sử dụng vật liệu nhập khẩu đắt tiền và nổi
            tiếng nhưng mang đến mức giá vô cùng hợp lý.
          </p>
          <a
            href="#"
            className="inline-flex items-center space-x-2 text-primary font-semibold mt-4 hover:text-orange-500 transition group items-center"
          >
            <span>Xem thêm</span>
            <span className="text-orange-500 transform group-hover:translate-x-1 transition duration-300">
              →
            </span>
          </a>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section className="bg-primary/5 py-24 px-6 md:px-12 overflow-hidden relative">
        <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
          <h4 className="text-orange-400 uppercase tracking-widest font-bold text-sm mb-4">
            Đánh giá
          </h4>
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-primary">
            Khách Hàng Nói Gì Về Chúng Tôi
          </h2>
        </div>

        <div className="max-w-7xl mx-auto relative px-4 md:px-12 z-10">
          <div
            ref={testiCarouselRef}
            className="flex gap-6 overflow-x-hidden scroll-smooth testimonial-carousel snap-x snap-mandatory py-4 px-2"
          >
            {/* Card 1 */}
            <div className="w-full md:w-[calc(33.333%-1rem)] shrink-0 snap-center relative h-[450px] rounded-xl overflow-hidden shadow-lg border border-gray-100/50 hover:shadow-2xl transition duration-500">
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Review 1 Interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-6 shadow-xl text-center flex flex-col items-center pt-8 hover:-translate-y-1 transition duration-500">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                  alt="Reviewer 1"
                  className="w-14 h-14 rounded-full border-[3px] border-white shadow-md absolute -top-7 left-1/2 -translate-x-1/2 object-cover bg-white"
                />
                <h4 className="font-bold text-primary text-base">Bang Upin</h4>
                <p className="text-[10px] text-textMuted mb-3">
                  Người kinh doanh nhỏ
                </p>
                <p className="text-[11px] text-textMuted mb-2 leading-relaxed px-2">
                  "Cảm ơn rất nhiều, không gian của tôi giờ đây trông sang trọng
                  và đắt tiền hơn hẳn."
                </p>
                <div className="flex space-x-1 text-orange-400 text-xs mt-auto">
                  ★★★★★
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="w-full md:w-[calc(33.333%-1rem)] shrink-0 snap-center relative h-[450px] rounded-xl overflow-hidden shadow-lg border border-gray-100/50 hover:shadow-2xl transition duration-500">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Review 2 Interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-6 shadow-xl text-center flex flex-col items-center pt-8 hover:-translate-y-1 transition duration-500">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                  alt="Reviewer 2"
                  className="w-14 h-14 rounded-full border-[3px] border-white shadow-md absolute -top-7 left-1/2 -translate-x-1/2 object-cover bg-white"
                />
                <h4 className="font-bold text-primary text-base">
                  Ibuk Sukijan
                </h4>
                <p className="text-[10px] text-textMuted mb-3">Nội trợ</p>
                <p className="text-[11px] text-textMuted mb-2 leading-relaxed px-2">
                  "Cảm ơn SmartLiving, tôi không hề hối hận khi ở căn hộ vì các
                  món đồ trông rất thanh lịch!"
                </p>
                <div className="flex space-x-1 text-orange-400 text-xs mt-auto">
                  ★★★★★
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="w-full md:w-[calc(33.333%-1rem)] shrink-0 snap-center relative h-[450px] rounded-xl overflow-hidden shadow-lg border border-gray-100/50 hover:shadow-2xl transition duration-500">
              <img
                src="https://images.unsplash.com/photo-1598928506311-c55f43f22876?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Review 3 Interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-6 shadow-xl text-center flex flex-col items-center pt-8 hover:-translate-y-1 transition duration-500">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                  alt="Reviewer 3"
                  className="w-14 h-14 rounded-full border-[3px] border-white shadow-md absolute -top-7 left-1/2 -translate-x-1/2 object-cover bg-white"
                />
                <h4 className="font-bold text-primary text-base">Mpok Ina</h4>
                <p className="text-[10px] text-textMuted mb-3">
                  Nhân viên văn phòng
                </p>
                <p className="text-[11px] text-textMuted mb-2 leading-relaxed px-2">
                  "Giá cả rất phải chăng cho ngân sách không quá lớn của tôi.
                  Giao hàng vô cùng an toàn và cẩn thận."
                </p>
                <div className="flex space-x-1 text-orange-400 text-xs mt-auto">
                  ★★★★★
                </div>
              </div>
            </div>
            <div className="w-full md:w-[calc(33.333%-1rem)] shrink-0 snap-center relative h-[450px] rounded-xl overflow-hidden shadow-lg border border-gray-100/50 hover:shadow-2xl transition duration-500">
              <img
                src="https://images.unsplash.com/photo-1598928506311-c55f43f22876?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Review 3 Interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-6 shadow-xl text-center flex flex-col items-center pt-8 hover:-translate-y-1 transition duration-500">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                  alt="Reviewer 3"
                  className="w-14 h-14 rounded-full border-[3px] border-white shadow-md absolute -top-7 left-1/2 -translate-x-1/2 object-cover bg-white"
                />
                <h4 className="font-bold text-primary text-base">Mpok Ina</h4>
                <p className="text-[10px] text-textMuted mb-3">
                  Nhân viên văn phòng
                </p>
                <p className="text-[11px] text-textMuted mb-2 leading-relaxed px-2">
                  "Giá cả rất phải chăng cho ngân sách không quá lớn của tôi.
                  Giao hàng vô cùng an toàn và cẩn thận."
                </p>
                <div className="flex space-x-1 text-orange-400 text-xs mt-auto">
                  ★★★★★
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => scrollTestimonials(-1)}
            className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 bg-white text-primary w-10 h-10 rounded-full shadow-lg items-center justify-center hover:bg-orange-50 hover:text-orange-500 transition z-10 text-xl hidden md:flex font-light border border-gray-100"
          >
            ←
          </button>
          <button
            onClick={() => scrollTestimonials(1)}
            className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 bg-white text-primary w-10 h-10 rounded-full shadow-lg items-center justify-center hover:bg-orange-50 hover:text-orange-500 transition z-10 text-xl hidden md:flex font-light border border-gray-100"
          >
            →
          </button>
        </div>
      </section>
    </main>
  );
};

export default Home;
