import React from "react";
import { Link } from "react-router-dom";
import requestAPI from "../../../../api";
import "./style.css";

/* ================= NORMALIZE API ================= */
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
      name: item.name ?? item.title ?? "Sản phẩm chưa đặt tên",
      brand: item.brand_name ?? item.brand ?? "SmartLiving",
      category: item.category_name ?? item.category ?? "Nội thất",
      image:
        item.featured_image ??
        item.image ??
        item.thumbnail ??
        "https://placehold.co/600x600?text=PRODUCT",
      price: parsedPrice,
      rating: Number(item.rating ?? 0),
      stockStatus: item.stock_status ?? "Còn hàng",
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
      <div className="stars-inner" style={{ width: `${percentage}%` }}>
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
      </div>
    </div>
  );
};

/* ================= COMPONENT ================= */

const Shop = () => {
  const ITEMS_PER_PAGE = 9;

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

  const updateShopState = (partial) =>
    setShopState((prev) => ({ ...prev, ...partial }));

  /* ================= LOAD PRODUCTS ================= */

  React.useEffect(() => {
    const loadProducts = async () => {
      try {
        updateShopState({ isLoading: true, error: "" });

        const response = await requestAPI({
          method: "GET",
          url: "/products/list",
        });

        updateShopState({ products: normalizeProducts(response?.data) });
      } catch (err) {
        updateShopState({
          products: [],
          error: err?.message || "Không thể tải sản phẩm",
        });
      } finally {
        updateShopState({ isLoading: false });
      }
    };

    loadProducts();
  }, []);

  /* ================= FILTER DATA ================= */

  const categories = React.useMemo(() => {
    const unique = Array.from(
      new Set(shopState.products.map((p) => p.category).filter(Boolean))
    );
    return ["Tất cả", ...unique];
  }, [shopState.products]);

  const brands = React.useMemo(() => {
    return Array.from(
      new Set(shopState.products.map((p) => p.brand).filter(Boolean))
    );
  }, [shopState.products]);

  const filteredProducts = React.useMemo(() => {
    const keyword = shopState.searchTerm.toLowerCase();

    let list = shopState.products.filter((p) => {
      const matchKeyword =
        !keyword ||
        p.name.toLowerCase().includes(keyword) ||
        p.brand.toLowerCase().includes(keyword);

      const matchCategory =
        shopState.activeCategory === "Tất cả" ||
        p.category === shopState.activeCategory;

      const matchBrand =
        shopState.selectedBrands.length === 0 ||
        shopState.selectedBrands.includes(p.brand);

      const matchRating = p.rating >= shopState.minRating;

      return matchKeyword && matchCategory && matchBrand && matchRating;
    });

    if (shopState.sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (shopState.sortBy === "price-desc")
      list.sort((a, b) => b.price - a.price);
    if (shopState.sortBy === "newest")
      list.sort((a, b) => b.sortKey - a.sortKey);

    return list;
  }, [shopState]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (shopState.currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  /* ================= UI ================= */

  if (shopState.isLoading) return <h2>Loading...</h2>;
  if (shopState.error) return <h2>{shopState.error}</h2>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Cửa hàng</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedProducts.map((product) => (
          <Link
            key={product.id}
            to={`/product-detail/${product.id}`}
            className="bg-white rounded-3xl p-4 shadow hover:shadow-xl transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-56 w-full object-cover rounded-xl mb-4"
            />

            <p className="text-xs text-gray-400">
              {product.brand} / {product.category}
            </p>

            <h3 className="font-semibold text-lg">{product.name}</h3>

            <div className="my-2">{formatStars(product.rating)}</div>

            <p className="text-xl font-bold text-orange-500">
              {formatPrice(product.price)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Shop;