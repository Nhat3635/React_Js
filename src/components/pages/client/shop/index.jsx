import React from "react";
import { Link, useLocation } from "react-router-dom";
import requestAPI from "../../../../api";
import "./style.css";

const normalizeProducts = (payload) => {
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

    const parsedPrice = Number(String(priceValue).replace(/[^\d]/g, "")) || 0;

    return {
      id: item.id ?? item._id ?? index,
      name:
        item.name ?? item.title ?? item.product_name ?? "Sản phẩm chưa đặt tên",
      brand:
        item.brand_name ?? item.brand ?? item.manufacturer ?? "SmartLiving",
      category:
        item.category_name ??
        item.category ??
        item.category_title ??
        "Nội thất",
      image:
        item.featured_image ??
        item.image ??
        item.thumbnail ??
        item.avatar ??
        "https://placehold.co/600x600?text=PRODUCT",
      price: parsedPrice,
      rating: Number(item.rating ?? item.review_score ?? 0),
      stockStatus: item.stock_status ?? item.status ?? "Còn hàng",
      sortKey: item.created_at ? new Date(item.created_at).getTime() : 0,
    };
  });
};

const formatPrice = (price) => {
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

const Shop = () => {
  const ITEMS_PER_PAGE = 9;
  const location = useLocation();

  const [shopState, setShopState] = React.useState({
    products: [],
    searchTerm: "",
    activeCategory: "Tất cả",
    selectedBrands: [],
    minRating: 0,
    sortBy: "newest",
    currentPage: 1,
    isLoading: true,
    error: "",
  });

  const updateShopState = React.useCallback((partialState) => {
    setShopState((prev) => ({ ...prev, ...partialState }));
  }, []);

  React.useEffect(() => {
    loadProducts();
  }, []);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get("keyword") || "";

    updateShopState({
      searchTerm: "",
      activeCategory: categoryFromUrl || "Tất cả",
      selectedBrands: [],
      minRating: 0,
      currentPage: 1,
    });
  }, [location.search, updateShopState]);

  React.useEffect(() => {
    updateShopState({ currentPage: 1 });
  }, [
    shopState.searchTerm,
    shopState.activeCategory,
    shopState.selectedBrands,
    shopState.minRating,
    shopState.sortBy,
    updateShopState,
  ]);

  const loadProducts = async () => {
    try {
      updateShopState({ isLoading: true, error: "" });
        console.log("Fetching products from API...");
      const response = await requestAPI({
        method: "GET",
        url: "/products/list",
      });

      updateShopState({ products: normalizeProducts(response?.data) });
    } catch (err) {
      updateShopState({
        products: [],
        error: err?.message || "Không thể tải danh sách sản phẩm",
      });
    } finally {
      updateShopState({ isLoading: false });
    }
  };

  const categories = React.useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        (Array.isArray(shopState.products) ? shopState.products : [])
          .map((item) => item.category)
          .filter(Boolean),
      ),
    );

    return ["Tất cả", ...uniqueCategories];
  }, [shopState.products]);

  const availableBrands = React.useMemo(() => {
    return Array.from(
      new Set(
        (Array.isArray(shopState.products) ? shopState.products : [])
          .map((item) => item.brand)
          .filter((brand) => brand && String(brand).trim().length > 0),
      ),
    ).slice(0, 10);
  }, [shopState.products]);

  const filteredProducts = React.useMemo(() => {
    const keyword = shopState.searchTerm.trim().toLowerCase();

    const filtered = (
      Array.isArray(shopState.products) ? shopState.products : []
    ).filter((item) => {
      const matchesKeyword =
        !keyword ||
        String(item.name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.brand || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.category || "")
          .toLowerCase()
          .includes(keyword);

      const matchesCategory =
        shopState.activeCategory === "Tất cả" ||
        String(item.category || "") === shopState.activeCategory;

      const matchesBrand =
        shopState.selectedBrands.length === 0 ||
        shopState.selectedBrands.includes(String(item.brand || ""));

      const matchesRating =
        (Number(item.rating) || 0) >= (Number(shopState.minRating) || 0);

      return matchesKeyword && matchesCategory && matchesBrand && matchesRating;
    });

    return [...filtered].sort((left, right) => {
      if (shopState.sortBy === "price-asc")
        return (left.price || 0) - (right.price || 0);
      if (shopState.sortBy === "price-desc")
        return (right.price || 0) - (left.price || 0);
      return (right.sortKey || 0) - (left.sortKey || 0);
    });
  }, [
    shopState.activeCategory,
    shopState.minRating,
    shopState.products,
    shopState.searchTerm,
    shopState.selectedBrands,
    shopState.sortBy,
  ]);

  const totalPages = React.useMemo(() => {
    return Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  }, [filteredProducts.length]);

  const paginatedProducts = React.useMemo(() => {
    const startIndex = (shopState.currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, shopState.currentPage]);

  const onSortChange = React.useCallback(
    function (event) {
      updateShopState({ sortBy: event.target.value });
    },
    [updateShopState],
  );

  const onSearchTermChange = React.useCallback(
    function (event) {
      updateShopState({ searchTerm: event.target.value });
    },
    [updateShopState],
  );

  const onCategoryChange = React.useCallback(
    function (event) {
      updateShopState({ activeCategory: event.target.value });
    },
    [updateShopState],
  );

  const onBrandChange = React.useCallback(function (event) {
    const brand = event.target.value;
    const checked = event.target.checked;

    setShopState((prev) => {
      const nextBrands = checked
        ? Array.from(new Set([...prev.selectedBrands, brand]))
        : prev.selectedBrands.filter((item) => item !== brand);

      return { ...prev, selectedBrands: nextBrands };
    });
  }, []);

  const onRatingChange = React.useCallback(
    function (event) {
      updateShopState({ minRating: Number(event.target.value) || 0 });
    },
    [updateShopState],
  );

  const onPageChange = React.useCallback(
    function (event) {
      const page = parseInt(event.currentTarget.dataset.page || "1", 10);
      if (page >= 1 && page <= totalPages) {
        updateShopState({ currentPage: page });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [totalPages, updateShopState],
  );

  const categoryFilterItems = categories.map(function (category) {
    const categoryId = `cat-${String(category)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}`;

    return (
      <li key={category} className="flex items-center">
        <input
          type="radio"
          name="shop-category"
          id={categoryId}
          value={category}
          checked={shopState.activeCategory === category}
          onChange={onCategoryChange}
          className="filter-checkbox w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
        />
        <label
          htmlFor={categoryId}
          className="ml-3 text-sm text-textMuted cursor-pointer hover:text-primary transition font-medium"
        >
          {category}
        </label>
      </li>
    );
  });

  const brandFilterItems = availableBrands.map(function (brand) {
    const brandId = `brand-${String(brand)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}`;

    return (
      <div key={brand} className="flex items-center group">
        <input
          type="checkbox"
          id={brandId}
          value={brand}
          checked={shopState.selectedBrands.includes(brand)}
          onChange={onBrandChange}
          className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
        />
        <label
          htmlFor={brandId}
          className="ml-3 text-sm text-textMuted group-hover:text-primary transition cursor-pointer font-medium italic"
        >
          {brand}
        </label>
      </div>
    );
  });

  const skeletonCards = Array.from({ length: 6 }, function (_, index) {
    return (
      <div
        key={index}
        className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 animate-pulse"
      >
        <div className="h-56 bg-gray-100 rounded-2xl mb-4" />
        <div className="h-3 w-24 bg-gray-100 rounded mb-3" />
        <div className="h-5 w-3/4 bg-gray-100 rounded mb-3" />
        <div className="h-4 w-20 bg-gray-100 rounded mb-6" />
        <div className="flex items-center justify-between mt-auto">
          <div className="h-8 w-28 bg-gray-100 rounded" />
          <div className="w-10 h-10 bg-gray-100 rounded-full" />
        </div>
      </div>
    );
  });

  const productCards = paginatedProducts.map(function (product) {
    return (
      <div
        key={product.id}
        className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition flex flex-col group border border-gray-100 relative"
      >
        <Link
          to={`/product-detail/${product.id}`}
          className="h-56 bg-accent rounded-2xl mb-4 overflow-hidden relative block cursor-pointer"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300"></div>
        </Link>
        <div className="text-xs text-textMuted mb-1 uppercase tracking-wider font-bold italic">
          {product.brand} / {product.category}
        </div>
        <Link
          to={`/product-detail/${product.id}`}
          className="text-lg font-semibold text-primary mb-1 hover:text-orange-500 transition"
        >
          {product.name}
        </Link>
        {Number(product.rating || 0) > 0 && (
          <div className="flex items-center space-x-1 mb-3 text-xs text-yellow-400">
            {formatStars(product.rating)}
          </div>
        )}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold">
              Giá từ
            </span>
            <span className="text-lg font-extrabold text-primary">
              {formatPrice(product.price)}
            </span>
          </div>
          <button className="w-10 h-10 rounded-full bg-primary text-white flex justify-center items-center hover:bg-orange-500 transition add-to-cart shadow-lg">
            +
          </button>
        </div>
      </div>
    );
  });

  const visiblePages = [];
  const startPage = Math.max(1, shopState.currentPage - 1);
  const endPage = Math.min(totalPages, shopState.currentPage + 1);
  for (let page = startPage; page <= endPage; page += 1) {
    visiblePages.push(page);
  }

  const paginationButtons = visiblePages.map(function (page) {
    return (
      <button
        key={page}
        onClick={onPageChange}
        data-page={page}
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition ${
          shopState.currentPage === page
            ? "bg-primary text-white shadow-md"
            : "border border-gray-200 text-textMuted hover:bg-orange-50 hover:text-orange-500 hover:border-orange-500"
        }`}
      >
        {page}
      </button>
    );
  });

  return (
    <div>
      <section className="bg-primary text-white py-16 px-6 md:px-12 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight">
          Trọn Bộ Nội Thất
        </h1>
        <p className="text-sm text-gray-300 font-light flex items-center space-x-2">
          <Link to="/" className="hover:text-orange-400 transition">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-orange-400">Cửa hàng</span>
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 md:px-12 flex flex-col md:flex-row gap-12 relative w-full">
        <aside className="w-full md:w-1/4 md:sticky md:top-32 h-max space-y-8 pr-4">
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">
              Danh mục
            </h3>
            <ul className="space-y-3">{categoryFilterItems}</ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">
              Thương hiệu
            </h3>

            <div className="grid grid-cols-1 gap-3">{brandFilterItems}</div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">
              Màu sắc
            </h3>
            <div className="flex gap-3">
              <button
                className="color-filter w-6 h-6 rounded-full bg-black ring-2 ring-transparent focus:ring-gray-400"
                data-color="black"
                title="Đen"
              ></button>
              <button
                className="color-filter w-6 h-6 rounded-full bg-[#eaddcf] ring-2 ring-transparent focus:ring-gray-400 border border-gray-200"
                data-color="beige"
                title="Màu Be"
              ></button>
              <button
                className="color-filter w-6 h-6 rounded-full bg-[#773f1a] ring-2 ring-transparent focus:ring-gray-400"
                data-color="walnut"
                title="Gỗ Óc Chó"
              ></button>
              <button
                className="color-filter w-6 h-6 rounded-full bg-white ring-2 ring-transparent focus:ring-gray-400 border border-gray-300"
                data-color="white"
                title="Trắng"
              ></button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">
              Đánh giá
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <input
                  type="radio"
                  name="shop-rating"
                  id="rating-all"
                  value="0"
                  checked={shopState.minRating === 0}
                  onChange={onRatingChange}
                  className="filter-checkbox w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <label
                  htmlFor="rating-all"
                  className="ml-3 text-sm text-textMuted cursor-pointer"
                >
                  Tất cả
                </label>
              </li>
              <li className="flex items-center">
                <input
                  type="radio"
                  name="shop-rating"
                  id="rating-5"
                  value="5"
                  checked={shopState.minRating === 5}
                  onChange={onRatingChange}
                  className="filter-checkbox w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <label
                  htmlFor="rating-5"
                  className="ml-3 text-sm text-yellow-400 cursor-pointer"
                >
                  ★★★★★
                </label>
              </li>
              <li className="flex items-center">
                <input
                  type="radio"
                  name="shop-rating"
                  id="rating-4"
                  value="4"
                  checked={shopState.minRating === 4}
                  onChange={onRatingChange}
                  className="filter-checkbox w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <label
                  htmlFor="rating-4"
                  className="ml-3 text-sm text-yellow-400 cursor-pointer"
                >
                  ★★★★☆{" "}
                  <span className="text-textMuted text-xs ml-1">Trở lên</span>
                </label>
              </li>
              <li className="flex items-center">
                <input
                  type="radio"
                  name="shop-rating"
                  id="rating-3"
                  value="3"
                  checked={shopState.minRating === 3}
                  onChange={onRatingChange}
                  className="filter-checkbox w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <label
                  htmlFor="rating-3"
                  className="ml-3 text-sm text-yellow-400 cursor-pointer"
                >
                  ★★★☆☆{" "}
                  <span className="text-textMuted text-xs ml-1">Trở lên</span>
                </label>
              </li>
            </ul>
          </div>
        </aside>

        <main className="w-full md:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200 gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-textMuted">
                {shopState.isLoading
                  ? "Đang tải sản phẩm..."
                  : `Đang hiển thị ${filteredProducts.length} trong số ${shopState.products.length} sản phẩm`}
              </p>
              <input
                type="text"
                value={shopState.searchTerm}
                onChange={onSearchTermChange}
                placeholder="Tìm kiếm sản phẩm, thương hiệu, danh mục..."
                className="w-full sm:w-96 border border-gray-300 rounded-md px-3 py-2 bg-white text-textMuted focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label
                htmlFor="sortDropdown"
                className="text-sm text-primary font-medium"
              >
                Sắp xếp theo:
              </label>
              <select
                id="sortDropdown"
                value={shopState.sortBy}
                onChange={onSortChange}
                className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white text-textMuted focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao xuống Thấp</option>
              </select>
            </div>
          </div>

          {shopState.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">{skeletonCards}</div>
          ) : shopState.error ? (
            <div className="rounded-3xl border border-red-100 bg-red-50 px-6 py-5 text-sm text-red-600">
              {shopState.error}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white px-6 py-12 text-center text-sm text-textMuted">
              Không có sản phẩm phù hợp với bộ lọc hiện tại.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {productCards}
              </div>

              <div className="flex justify-center items-center space-x-2 mt-16 pt-8 border-t border-gray-100">
                <button
                  onClick={onPageChange}
                  data-page={shopState.currentPage - 1}
                  disabled={shopState.currentPage === 1}
                  className={`w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center transition text-sm font-medium ${
                    shopState.currentPage === 1
                      ? "opacity-50 cursor-not-allowed text-textMuted"
                      : "hover:bg-orange-50 hover:text-orange-500 hover:border-orange-500 text-textMuted"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M15 19l-7-7 7-7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </button>

                {paginationButtons}

                {totalPages > 3 && shopState.currentPage < totalPages - 1 && (
                  <span className="text-gray-400 px-2">...</span>
                )}

                <button
                  onClick={onPageChange}
                  data-page={shopState.currentPage + 1}
                  disabled={shopState.currentPage === totalPages}
                  className={`w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center transition text-sm font-medium ${
                    shopState.currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed text-textMuted"
                      : "hover:bg-orange-50 hover:text-orange-500 hover:border-orange-500 text-textMuted"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 5l7 7-7 7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </button>
              </div>
            </>
          )}
        </main>
      </section>
    </div>
  );
};

export default Shop;
