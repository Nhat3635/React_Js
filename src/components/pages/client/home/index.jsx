import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
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
    const priceValue = item.base_price ?? item.price ?? 0;
    return {
      id: item.id ?? index,
      name: item.name ?? "Sản phẩm không tên",
      category_id: item.category_id,
      category_name: item.category_name ?? "Nội thất",
      image: item.image
        ? `http://localhost:3000/uploads/products/${item.image}`
        : "https://placehold.co/600x600?text=NO+IMAGE",
      price: Number(priceValue) || 0,
      rating: Number(item.rating ?? 0),
      status: item.status,
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
    <div className="flex items-center space-x-1">
      <div className="relative inline-block text-lg">
        <div className="flex text-gray-200">
          {[...Array(5)].map((_, i) => (
            <i key={i} className="bi bi-star-fill"></i>
          ))}
        </div>
        <div
          className="flex text-yellow-400 absolute top-0 left-0 overflow-hidden whitespace-nowrap"
          style={{ width: `${percentage}%` }}
        >
          {[...Array(5)].map((_, i) => (
            <i key={i} className="bi bi-star-fill"></i>
          ))}
        </div>
      </div>
      <span className="text-xs text-gray-400 ml-1">({safeRating})</span>
    </div>
  );
};

const Home = () => {
  const [homeState, setHomeState] = useState({
    activeCategory: null,
    categories: [],
    products: [],
    isLoadingProducts: true,
    isLoadingCategories: true,
    productError: "",
  });

  const productCarouselRef = useRef(null);
  const scrollAmount = 350;

  const updateHomeState = useCallback((partialState) => {
    setHomeState((prev) => ({ ...prev, ...partialState }));
  }, []);

const loadData = async () => {
    try {
      updateHomeState({ isLoadingProducts: true, isLoadingCategories: true });

      // 1. Lấy danh mục
      const catRes = await requestAPI({
        method: "GET",
        url: "/categories/list",
      });
      
      console.log("Dữ liệu category từ API:", catRes); // Debug để xem cấu trúc thật

      // Kiểm tra kỹ cấu trúc: Nếu catRes.data.data là mảng thì lấy, không thì thử catRes.data, cuối cùng là mảng rỗng
      let fetchedCategories = [];
      if (Array.isArray(catRes?.data)) {
        fetchedCategories = catRes.data;
      } else if (Array.isArray(catRes?.data?.data)) {
        fetchedCategories = catRes.data.data;
      }

      // 2. Lấy sản phẩm
      const prodRes = await requestAPI({
        method: "GET",
        url: "/products/list",
      });
      const allProducts = normalizeHomeProducts(prodRes?.data);

      updateHomeState({
        categories: fetchedCategories,
        // Set danh mục mặc định là ID của phần tử đầu tiên nếu có
        activeCategory: fetchedCategories.length > 0 ? fetchedCategories[0].id : null,
        products: allProducts.filter((p) => p.status === 1),
      });
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
      updateHomeState({
        products: [],
        categories: [],
        productError: "Không thể kết nối đến máy chủ",
      });
    } finally {
      updateHomeState({ isLoadingProducts: false, isLoadingCategories: false });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!homeState.activeCategory || !Array.isArray(homeState.products)) return [];
    
    const matched = homeState.products.filter(
      (item) => Number(item.category_id) === Number(homeState.activeCategory)
    );
    return matched.length > 0 ? matched.slice(0, 8) : [];
  }, [homeState.activeCategory, homeState.products]);

  const scroll = (direction) => {
    if (productCarouselRef.current) {
      productCarouselRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[700px] md:h-[800px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1920&q=80"
            className="w-full h-full object-cover hero-image-zoom"
            alt="Banner"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 pt-20">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Nội Thất Tối Giản & Hiện Đại
          </h1>
          <p className="text-gray-200 text-lg md:text-xl mb-10 max-w-2xl font-light">
            Nâng tầm không gian sống cùng SmartLiving - Nơi hội tụ tinh hoa
            thiết kế.
          </p>
          <div className="flex items-center w-full max-w-lg bg-white/20 backdrop-blur-md rounded-full p-2 border border-white/30">
            <input
              type="text"
              placeholder="Tìm kiếm nội thất..."
              className="flex-grow px-6 bg-transparent text-white focus:outline-none placeholder-white/70"
            />
            <button className="bg-orange-500 text-white w-12 h-12 rounded-full flex justify-center items-center hover:bg-orange-600 transition">
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
      </section>

      {/* 2. BEST SELLING SECTION */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto bg-secondary/30 rounded-[64px] my-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-md">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Sản phẩm bán chạy
            </h2>
            <p className="text-gray-500">
              Những thiết kế được yêu thích nhất bởi khách hàng của SmartLiving
              trong tháng này.
            </p>
          </div>

          <div className="flex space-x-2 bg-gray-100 p-1.5 rounded-full border border-gray-200 overflow-x-auto no-scrollbar">
            {homeState.isLoadingCategories ? (
              <div className="px-8 py-2.5 text-gray-400">Đang tải...</div>
            ) : Array.isArray(homeState.categories) && homeState.categories.length > 0 ? (
              homeState.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateHomeState({ activeCategory: cat.id })}
                  className={`px-8 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    homeState.activeCategory === cat.id
                      ? "bg-white text-primary shadow-md"
                      : "text-gray-500 hover:text-primary"
                  }`}
                >
                  {cat.name}
                </button>
              ))
            ) : (
              <div className="px-8 py-2.5 text-gray-400 text-sm">Không có danh mục</div>
            )}
          </div>
        </div>

        <div className="relative group">
          <div
            ref={productCarouselRef}
            className="flex gap-8 overflow-x-hidden scroll-smooth py-6"
          >
            {homeState.isLoadingProducts ? (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="min-w-[300px] h-[450px] bg-gray-200 animate-pulse rounded-3xl"
                ></div>
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="min-w-[300px] md:min-w-[340px] bg-white rounded-[32px] p-6 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 flex flex-col group/card"
                >
                  <Link
                    to={`/product-detail/${product.id}`}
                    className="relative h-72 bg-accent rounded-2xl mb-6 overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                      New Arrival
                    </div>
                  </Link>

                  <div className="flex flex-col flex-grow">
                    <span className="text-xs text-orange-500 font-bold uppercase tracking-widest mb-2">
                      {product.category_name}
                    </span>
                    <Link
                      to={`/product-detail/${product.id}`}
                      className="text-xl font-bold text-primary mb-3 line-clamp-1 hover:text-orange-500 transition"
                    >
                      {product.name}
                    </Link>
                    <div className="mb-4">{formatStars(product.rating)}</div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <span className="text-2xl font-black text-primary">
                        {formatPrice(product.price)}
                      </span>
                      <button className="w-12 h-12 rounded-2xl bg-primary text-white flex justify-center items-center hover:bg-orange-500 transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-orange-500/40 group-hover/card:rotate-90">
                        <i className="bi bi-plus-lg text-xl"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-20 text-gray-400 italic">
                Hiện chưa có sản phẩm nào trong danh mục này.
              </div>
            )}
          </div>

          <button
            onClick={() => scroll(-1)}
            className="absolute -left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-xl flex justify-center items-center text-primary hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10 border border-gray-100"
          >
            <i className="bi bi-chevron-left text-xl"></i>
          </button>
          <button
            onClick={() => scroll(1)}
            className="absolute -right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-xl flex justify-center items-center text-primary hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10 border border-gray-100"
          >
            <i className="bi bi-chevron-right text-xl"></i>
          </button>
        </div>
      </section>

      {/* 3. EXPERIENCES & MATERIALS */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-orange-100 rounded-[40px] -rotate-3"></div>
          <img
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80"
            className="relative z-10 rounded-[32px] shadow-2xl"
            alt="Experience"
          />
        </div>
        <div className="space-y-6">
          <h4 className="text-orange-500 font-bold uppercase tracking-widest text-sm">
            Trải nghiệm
          </h4>
          <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
            Chúng tôi mang đến không gian sống hoàn hảo
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Đội ngũ chuyên gia từ SmartLiving luôn sẵn sàng biến ý tưởng của bạn
            thành hiện thực với những vật liệu cao cấp nhất.
          </p>
          <button className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-black transition-all">
            Tìm hiểu thêm
          </button>
        </div>
      </section>

      {/* 4. Materials Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:px-12 flex flex-col md:flex-row-reverse items-center gap-16">
        <div className="md:w-1/2 flex h-[500px] md:h-[600px] gap-4">
          <div className="w-[55%] h-full">
            <img
              src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=1000"
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
          <div className="flex gap-6 overflow-x-hidden scroll-smooth testimonial-carousel snap-x snap-mandatory py-4 px-2">
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
          </div>

          <button className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 bg-white text-primary w-10 h-10 rounded-full shadow-lg items-center justify-center hover:bg-orange-50 hover:text-orange-500 transition z-10 text-xl hidden md:flex font-light border border-gray-100">
            ←
          </button>
          <button className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 bg-white text-primary w-10 h-10 rounded-full shadow-lg items-center justify-center hover:bg-orange-50 hover:text-orange-500 transition z-10 text-xl hidden md:flex font-light border border-gray-100">
            →
          </button>
        </div>
      </section>
    </main>
  );
};

export default Home;