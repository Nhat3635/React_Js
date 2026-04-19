import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import requestAPI from "../../../../api";
import "./style.css";

// Helpers

const formatPrice = (price) =>
  price ? `${price.toLocaleString("vi-VN")}đ` : "Liên hệ";

const parseMoney = (value) =>
  Number(String(value ?? 0).replace(/[^\d]/g, "")) || 0;

const toArray = (payload) =>
  Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];

const normalizeProducts = (data) =>
  toArray(data)
    .filter((item) => Number(item?.status) === 1)
    .map((item, i) => ({
      id: item.id ?? i,
      name: item.name ?? "Sản phẩm chưa đặt tên",
      brand: item.brand_name ?? "SmartLiving",
      category: item.category_name ?? "Nội thất",
      image:
        item.featured_image ??
        item.image ??
        "https://placehold.co/600x600?text=PRODUCT",
      price: parseMoney(item.base_price),
      rating: Number(item.rating_avg ?? 0),
      sortKey: item.created_at ? new Date(item.created_at).getTime() : 0,
    }));

// StarRating

const StarRating = ({ rating = 0 }) => {
  const stars = Array(5).fill(<i className="bi bi-star-fill" />);
  return (
    <div className="star-rating">
      <div className="stars-outer">{stars}</div>
      <div
        className="stars-inner"
        style={{ width: `${(Math.min(5, Math.max(0, rating)) / 5) * 100}%` }}
      >
        {stars}
      </div>
    </div>
  );
};

// Skeleton

const SkeletonCards = () =>
  Array.from({ length: 6 }, (_, i) => (
    <div
      key={i}
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
  ));

// Constants

const RATING_OPTIONS = [
  { value: 0, label: "Tất cả" },
  { value: 5, label: "★★★★★" },
  { value: 4, label: "★★★★☆", suffix: "Trở lên" },
  { value: 3, label: "★★★☆☆", suffix: "Trở lên" },
];

// Component

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL là nguồn sự thật duy nhất cho tất cả filter
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 9;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "Tất cả";
  const brands = searchParams.get("brand")
    ? searchParams.get("brand").split(",")
    : [];
  const rating = Number(searchParams.get("rating")) || 0;
  const sortBy = searchParams.get("sort") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState(search);

  // Cập nhật URL — source of truth cho toàn bộ filter
  const setParam = (patch, nextPage = 1) => {
    setSearchParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        p.set("page", nextPage);

        const s = "search" in patch ? patch.search : search;
        const c = "category" in patch ? patch.category : category;
        const b = "brands" in patch ? patch.brands : brands;
        const r = "rating" in patch ? patch.rating : rating;
        const o = "sort" in patch ? patch.sort : sortBy;

        s.trim() ? p.set("search", s.trim()) : p.delete("search");
        c !== "Tất cả" ? p.set("category", c) : p.delete("category");
        b.length ? p.set("brand", b.join(",")) : p.delete("brand");
        r > 0 ? p.set("rating", r) : p.delete("rating");
        o !== "" ? p.set("sort", o) : p.delete("sort");

        return p;
      },
      { replace: true },
    );
  };

  // Fetch API — truyền đầy đủ tất cả filter lên server
  useEffect(() => {
    fetchData();
  }, [page, limit, search, category, rating, sortBy, brands.join(",")]);

  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page, limit });
      if (search) params.set("search", search);
      if (category !== "Tất cả") params.set("category", category);
      if (brands.length) params.set("brand", brands.join(","));
      if (rating > 0) params.set("rating", rating);
      if (sortBy) params.set("sort", sortBy);

      const [productsRes, brandsRes, categoriesRes] = await Promise.all([
        requestAPI({ method: "GET", url: `/products/list?status=1&${params}` }),
        requestAPI({ method: "GET", url: "/brands/list?status=1" }),
        requestAPI({ method: "GET", url: "/categories/list?status=1" }),
      ]);

      setProducts(normalizeProducts(productsRes?.data));
      setTotalCount(Number(productsRes?.data?.total_count ?? 0));
      setAllBrands([
        ...new Set(
          toArray(brandsRes?.data)
            .map((b) => b?.name || b?.brand_name)
            .filter(Boolean),
        ),
      ]);
      setCategories([
        ...new Set(
          toArray(categoriesRes?.data)
            .map((c) => c?.name || c?.category_name)
            .filter(Boolean),
        ),
      ]);
    } catch (err) {
      setError(err?.message || "Không thể tải sản phẩm");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };
  // thêm rating, sortBy, brands vào dependency

  // Giữ input đồng bộ khi URL thay đổi từ bên ngoài (header/back/forward)
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Debounce để tránh giật/dup khi gõ và giảm số lần cập nhật URL
  useEffect(() => {
    if (searchInput === search) return;

    const timer = setTimeout(() => {
      setParam({ search: searchInput });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, search]);

  // Server đã lọc hết rồi, client không cần filter lại
  const filteredProducts = useMemo(() => products, [products]);

  const categoryList = useMemo(() => ["Tất cả", ...categories], [categories]);
  const brandList = useMemo(() => allBrands.slice(0, 10), [allBrands]);
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const currentCount = filteredProducts.length;
  const pageStart = currentCount > 0 ? (page - 1) * limit + 1 : 0;
  const pageEnd = currentCount > 0 ? pageStart + currentCount - 1 : 0;
  const visiblePages = Array.from(
    { length: Math.min(totalPages, 3) },
    (_, i) => Math.max(1, Math.min(page - 1, totalPages - 2)) + i,
  );
  const changePage = (next) => {
    if (next >= 1 && next <= totalPages) {
      setParam({}, next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBrandChange = React.useCallback(
    (b, checked) => {
      setParam({
        brands: checked
          ? [...new Set([...brands, b])]
          : brands.filter((x) => x !== b),
      });
    },
    [brands, setParam],
  );

  // JSX

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
        {/* ── Sidebar lọc ── */}
        <aside className="w-full md:w-1/4 md:sticky md:top-32 h-max space-y-8 pr-4">
          {/* Danh mục */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">
              Danh mục
            </h3>
            <ul className="space-y-3">
              {categoryList.map((cat) => (
                <li key={cat} className="flex items-center">
                  <input
                    type="radio"
                    name="shop-category"
                    id={`cat-${cat}`}
                    value={cat}
                    checked={category === cat}
                    onChange={(e) => setParam({ category: e.target.value })}
                    className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                  />
                  <label
                    htmlFor={`cat-${cat}`}
                    className="ml-3 text-sm text-textMuted cursor-pointer hover:text-primary transition font-medium"
                  >
                    {cat}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Thương hiệu */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">
              Thương hiệu
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {brandList.map((b) => (
                <div key={b} className="flex items-center group">
                  <input
                    type="checkbox"
                    id={`brand-${b}`}
                    value={b}
                    checked={brands.includes(b)}
                    onChange={(e) => handleBrandChange(b, e.target.checked)}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                  />
                  <label
                    htmlFor={`brand-${b}`}
                    className="ml-3 text-sm text-textMuted group-hover:text-primary transition cursor-pointer font-medium italic"
                  >
                    {b}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Đánh giá */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">
              Đánh giá
            </h3>
            <ul className="space-y-3">
              {RATING_OPTIONS.map(({ value, label, suffix }) => (
                <li key={value} className="flex items-center">
                  <input
                    type="radio"
                    name="shop-rating"
                    id={`rating-${value}`}
                    value={value}
                    checked={rating === value}
                    onChange={() => setParam({ rating: value })}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label
                    htmlFor={`rating-${value}`}
                    className={`ml-3 text-sm cursor-pointer ${value === 0 ? "text-textMuted" : "text-yellow-400"}`}
                  >
                    {label}{" "}
                    {suffix && (
                      <span className="text-textMuted text-xs ml-1">
                        {suffix}
                      </span>
                    )}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* ── Nội dung chính ── */}
        <main className="w-full md:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200 gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-textMuted">
                {isLoading
                  ? "Đang tải sản phẩm..."
                  : `Hiển thị ${pageEnd}/${totalCount} sản phẩm`}
              </p>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
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
                value={sortBy}
                onChange={(e) => setParam({ sort: e.target.value })}
                className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white text-textMuted focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
              >
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao xuống Thấp</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <SkeletonCards />
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-100 bg-red-50 px-6 py-5 text-sm text-red-600">
              {error}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white px-6 py-12 text-center text-sm text-textMuted">
              Không có sản phẩm phù hợp với bộ lọc hiện tại.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition flex flex-col group border border-gray-100 relative"
                  >
                    <Link
                      to={`/product-detail/${product.id}`}
                      className="h-56 bg-accent rounded-2xl mb-4 overflow-hidden relative block"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300" />
                    </Link>
                    <div className="text-xs text-textMuted mb-1 uppercase tracking-wider font-bold italic">
                      {product.brand} / {product.category}
                    </div>
                    <Link
                      to={`/product-detail/${product.id}`}
                      className="text-lg font-semibold text-primary mb-1 hover:text-orange-500 transition line-clamp-2"
                    >
                      {product.name}
                    </Link>
                    {product.rating > 0 && (
                      <div className="flex items-center space-x-1 mb-3 text-xs text-yellow-400">
                        <StarRating rating={product.rating} />
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
                      <Link
                        to={`/product-detail/${product.id}`}
                        className="w-10 h-10 rounded-full bg-primary text-white flex justify-center items-center hover:bg-orange-500 transition -rotate-45 group-hover:rotate-0 duration-300"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-16 pt-8 border-t border-gray-100">
                  <button
                    onClick={() => changePage(page - 1)}
                    disabled={page === 1}
                    className={`w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center transition text-sm font-medium ${page === 1 ? "opacity-50 cursor-not-allowed text-textMuted" : "hover:bg-orange-50 hover:text-orange-500 hover:border-orange-500 text-textMuted"}`}
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
                      />
                    </svg>
                  </button>

                  {visiblePages.map((p) => (
                    <button
                      key={p}
                      onClick={() => changePage(p)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition ${page === p ? "bg-primary text-white shadow-md" : "border border-gray-200 text-textMuted hover:bg-orange-50 hover:text-orange-500 hover:border-orange-500"}`}
                    >
                      {p}
                    </button>
                  ))}

                  {totalPages > 3 && page < totalPages - 1 && (
                    <span className="text-gray-400 px-2">...</span>
                  )}

                  <button
                    onClick={() => changePage(page + 1)}
                    disabled={page === totalPages}
                    className={`w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center transition text-sm font-medium ${page === totalPages ? "opacity-50 cursor-not-allowed text-textMuted" : "hover:bg-orange-50 hover:text-orange-500 hover:border-orange-500 text-textMuted"}`}
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
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </section>
    </div>
  );
};

export default Shop;
