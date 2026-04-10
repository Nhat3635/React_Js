import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import requestAPI from "../../../../api";
import "./style.css";

// Ảnh mặc định nếu không có ảnh sản phẩm
const ANH_MAC_DINH = "https://placehold.co/600x600?text=PRODUCT";

const SIZE_MAP = {
  "16": "Nhỏ (1.6m)",
  "20": "Vừa (2.0m)",
  "24": "Lớn (2.4m)",
  "28": "Siêu lớn (2.8m)",
};

const COLOR_MAP = {
  WHITE: "Trắng Kem",
  GREY: "Xám Khói",
  GOLD: "Vàng Sồi",
  BLACK: "Đen Tuyền",
  PINK: "Hồng",
};

// Hàm định dạng tiền tệ
function FormPrice(value) {
  return `${Number(value || 0).toLocaleString("vi-VN")} đ`;
}

function FormRating({ rating }) {
  const percent = (Math.min(5, Math.max(0, rating)) / 5) * 100;

  return (
    <div className="star-rating">
      <div className="stars-outer">
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
      </div>
      <div className="stars-inner" style={{ width: `${percent}%` }}>
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
      </div>
    </div>
  );
}

function formatReviewDate(value) {
  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function resolveReviewAuthorName(reviewItem) {
  return (
    reviewItem?.username ||
    reviewItem?.user_name ||
    reviewItem?.name ||
    "Khách hàng"
  );
}

function parseVariantData(variantItem) {
  const summary = variantItem?.attribute_summary || "";
  let color = "";
  let size = "";

  if (summary.includes("Màu sắc:")) {
    color = summary.split("Màu sắc:")[1]?.split(",")[0]?.trim() || "";
  }
  if (summary.includes("Kích thước:")) {
    size = summary.split("Kích thước:")[1]?.trim() || "";
  }

  if ((!color || !size) && variantItem?.sku) {
    const skuParts = String(variantItem.sku).split("-");
    const colorCode = skuParts[1] || "";
    const sizeCode = skuParts[2] || "";

    if (!color) {
      color = COLOR_MAP[colorCode] || colorCode;
    }
    if (!size) {
      size = SIZE_MAP[sizeCode] || sizeCode;
    }
  }

  return {
    id: variantItem?.id,
    sku: variantItem?.sku || "",
    price: Number(String(variantItem?.price || 0).replace(/[^\d]/g, "")) || 0,
    stock_quantity: Number(variantItem?.stock_quantity || 0),
    color,
    size,
  };
}

const ProductDetail = () => {
  const { id } = useParams();

  const [state, setState] = useState({
    productInfo: {
      name: "Ghế Sofa Cao Cấp Minimalist",
      category: "Phòng Khách",
      price: 899000,
      oldPrice: 1050000,
      description: "Chưa cập nhật",
      rating: 5,
      reviewCount: 0,
    },
    images: {
      main: ANH_MAC_DINH,
      gallery: [ANH_MAC_DINH],
    },
    selections: {
      quantity: 1,
      size: "medium",
      color: "grey",
      activeTab: "desc",
    },
    tabDetails: {
      descriptions: [],
      specifications: [],
      shippingPolicy: [],
    },
    reviews: {
      items: [],
      rating: 5,
      content: "",
      message: "",
      isSubmitting: false,
      showAll: false,
    },
    relatedProducts: [],
    variants: [],
    loading: {
      isLoading: false,
      error: "",
    },
  });

  const {
    productInfo,
    images,
    selections,
    tabDetails,
    reviews,
    relatedProducts,
    variants,
    loading,
  } = state;

  const productName = productInfo.name;
  const categoryName = productInfo.category;
  const price = productInfo.price;
  const oldPrice = productInfo.oldPrice;
  const description = productInfo.description;
  const productRating = productInfo.rating;
  const reviewCount = productInfo.reviewCount;

  const mainImage = images.main;
  const galleryImages = images.gallery;

  const quantity = selections.quantity;
  const selectedSize = selections.size;
  const selectedColor = selections.color;
  const activeTab = selections.activeTab;

  const descriptionLines = tabDetails.descriptions;
  const specifications = tabDetails.specifications;
  const shippingPolicy = tabDetails.shippingPolicy;

  const reviewList = reviews.items;
  const reviewRating = reviews.rating;
  const reviewContent = reviews.content;
  const reviewMessage = reviews.message;
  const isSubmittingReview = reviews.isSubmitting;
  const showAllReviews = reviews.showAll;

  const relatedProductList = relatedProducts;
  const variantList = variants;
  const isLoading = loading.isLoading;
  const errorMessage = loading.error;

  const selectedVariant = variantList.find(
    (item) => item.size === selectedSize && item.color === selectedColor,
  );
  const selectedStock = selectedVariant ? selectedVariant.stock_quantity : 0;
  const isOutOfStock = !selectedVariant || selectedStock <= 0;
  const currentPrice = selectedVariant ? selectedVariant.price : price;

  const sizeOptions = Array.from(
    new Set(variantList.map((item) => item.size).filter(Boolean)),
  );
  const colorOptions = Array.from(
    new Set(variantList.map((item) => item.color).filter(Boolean)),
  );

  function updateProductInfo(partialInfo) {
    setState((previous) => ({
      ...previous,
      productInfo: { ...previous.productInfo, ...partialInfo },
    }));
  }

  function updateImages(partialImages) {
    setState((previous) => ({
      ...previous,
      images: { ...previous.images, ...partialImages },
    }));
  }

  function updateSelections(partialSelections) {
    setState((previous) => ({
      ...previous,
      selections: { ...previous.selections, ...partialSelections },
    }));
  }

  function updateTabDetails(partialTabDetails) {
    setState((previous) => ({
      ...previous,
      tabDetails: { ...previous.tabDetails, ...partialTabDetails },
    }));
  }

  function updateReviews(partialReviews) {
    setState((previous) => ({
      ...previous,
      reviews:
        typeof partialReviews === "function"
          ? partialReviews(previous.reviews)
          : { ...previous.reviews, ...partialReviews },
    }));
  }

  function updateRelatedProducts(items) {
    setState((previous) => ({
      ...previous,
      relatedProducts: items,
    }));
  }

  function updateVariants(items) {
    setState((previous) => ({
      ...previous,
      variants: items,
    }));
  }

  function updateLoading(partialLoading) {
    setState((previous) => ({
      ...previous,
      loading: { ...previous.loading, ...partialLoading },
    }));
  }

  function handleThumbnailClick(image) {
    updateImages({ main: image });
  }

  function handleSizeChange(event) {
    updateSelections({ size: event.target.value, quantity: 1 });
  }

  function handleColorChange(event) {
    updateSelections({ color: event.target.value, quantity: 1 });
  }

  function handleDecreaseQuantity() {
    updateSelections({ quantity: Math.max(1, quantity - 1) });
  }

  function handleIncreaseQuantity() {
    updateSelections({ quantity: quantity + 1 });
  }

  function handleTabChange(tabKey) {
    updateSelections({ activeTab: tabKey });
  }

  function handleReviewRatingChange(star) {
    updateReviews({ rating: star });
  }

  function handleReviewContentChange(event) {
    updateReviews({ content: event.target.value });
  }

  function handleShowAllReviews() {
    updateReviews({ showAll: true });
  }

  function handleCollapseReviews() {
    updateReviews({ showAll: false });
  }

  async function loadProductData() {
    updateLoading({ isLoading: true, error: "" });
    try {
      const response = await requestAPI({
        method: "GET",
        url: `/products/${id}`,
      });
      const product = response?.data?.data || response?.data || {};
      console.log("Chi tiết sản phẩm:", product);
      const imageGallery = Array.isArray(product.images)
        ? product.images
        : Array.isArray(product.gallery)
          ? product.gallery
          : [product.featured_image || product.image || ANH_MAC_DINH];
      const firstImage = imageGallery[0] || ANH_MAC_DINH;

      updateImages({ main: firstImage, gallery: imageGallery });
      updateProductInfo({
        name: product.name || product.title || "Sản phẩm",
        category: product.category_name || product.category || "Nội thất",
        price:
          Number(
            String(product.price || product.base_price || 0).replace(
              /[^\d]/g,
              "",
            ),
          ) || 0,
        oldPrice:
          Number(
            String(product.old_price || product.compare_at_price || 0).replace(
              /[^\d]/g,
              "",
            ),
          ) || 0,
        description:
          product.short_description || product.description || "Chưa cập nhật",
        rating: Number(product.rating_avg || product.rating || 5),
        reviewCount: Number(product.review_count || 0),
      });

      const parsedVariants = Array.isArray(product.variants)
        ? product.variants.map((item) => parseVariantData(item))
        : [];

      updateVariants(parsedVariants);

      if (parsedVariants.length > 0) {
        updateSelections({
          size: parsedVariants[0].size || "",
          color: parsedVariants[0].color || "",
          quantity: 1,
        });
      }

      if (parsedVariants.length > 0) {
        updateProductInfo({ price: parsedVariants[0].price || 0 });
      }

      updateTabDetails({
        descriptions: product.detail_content
          ? String(product.detail_content)
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        specifications: Array.isArray(product.specs)
          ? product.specs.map((item) => ({
              label: item.spec_name || "Thông số",
              value: item.spec_value || "",
            }))
          : [],
        shippingPolicy: Array.isArray(product.policies)
          ? product.policies
              .filter((item) =>
                String(item.policy_type || "").toLowerCase().includes("shipping"),
              )
              .map((item) => item.content)
          : [],
      });

      const reviewItems = Array.isArray(product.reviews) ? product.reviews : [];
      const formattedReviews = reviewItems.map((item) => ({
        id: item.id || Math.random().toString(36),
        name: resolveReviewAuthorName(item),
        avatar: item.avatar || "https://placehold.co/100x100?text=U",
        rating: Number(item.rating || 5),
        date: formatReviewDate(item.created_at || item.date),
        content: item.content || item.comment || "",
        verified: Boolean(item.verified || item.purchased),
      }));

      updateReviews({
        items: formattedReviews,
        message: "",
        isSubmitting: false,
        showAll: false,
      });
      updateProductInfo({
        reviewCount: Number(product.review_count || formattedReviews.length),
      });

      const relatedResponse = await requestAPI({
        method: "GET",
        url: "/products/list",
      });
      const relatedList = Array.isArray(relatedResponse?.data?.data)
        ? relatedResponse.data.data
        : Array.isArray(relatedResponse?.data)
          ? relatedResponse.data
          : [];

      const relatedItems = relatedList
        .filter((item) => String(item.id) !== String(product.id))
        .filter(
          (item) =>
            (item.category_name || item.category) ===
            (product.category_name || product.category),
        )
        .slice(0, 4)
        .map((item) => ({
          id: item.id,
          name: item.name || item.title || "Sản phẩm",
          price:
            Number(
              String(
                item.price ||
                  item.base_price ||
                  item.old_price ||
                  item.compare_at_price ||
                  0,
              ).replace(/[^\d]/g, ""),
            ) || 0,
          image:
            item.featured_image ||
            item.image ||
            "https://placehold.co/600x600?text=PRODUCT",
          category: item.category_name || item.category || "",
          rating: Number(item.rating_avg || item.rating || 0),
          hasRating: Boolean(item.rating_avg || item.rating),
        }));
        console.log("Sản phẩm liên quan:", relatedItems);

      updateRelatedProducts(relatedItems);
    } catch (error) {
      updateLoading({ error: error?.message || "Không tải được sản phẩm" });
    } finally {
      updateLoading({ isLoading: false });
    }
  }

  useEffect(() => {
    if (!id) return;
    loadProductData();
  }, [id]);

  async function submitReview() {
    if (!id) {
      updateReviews({ message: "Không tìm thấy sản phẩm." });
      return;
    }
    if (reviewRating < 1 || reviewRating > 5) {
      updateReviews({ message: "Vui lòng chọn số sao từ 1 đến 5." });
      return;
    }
    if (!reviewContent.trim()) {
      updateReviews({ message: "Vui lòng nhập nội dung đánh giá." });
      return;
    }

    updateReviews({ isSubmitting: true, message: "" });
    try {
      const authorName = 'Bạn';

      await requestAPI({
        method: "POST",
        url: `/products/review`,
        data: {
          product_id: id,
          rating: reviewRating,
          comment: reviewContent.trim(),
        },
      });
      await requestAPI({
        method: "POST",
        url: `/products/comment`,
        data: {
          product_id: id,
          author_name: authorName,
          content: reviewContent.trim(),
        },
      });

      const newReview = {
        id: `local-${Date.now()}`,
        name: authorName,
        avatar: "https://placehold.co/100x100?text=U",
        rating: reviewRating,
        date: formatReviewDate(new Date()),
        content: reviewContent.trim(),
        verified: false,
      };

      updateReviews((previous) => ({
        ...previous,
        items: [newReview, ...previous.items],
        rating: 5,
        content: "",
        message: "Đánh giá của bạn đã được gửi.",
      }));
      updateProductInfo({ reviewCount: reviewCount + 1 });
    } catch (error) {
      updateReviews({
        message: error?.message || "Gửi đánh giá thất bại. Vui lòng thử lại.",
      });
    } finally {
      updateReviews({ isSubmitting: false });
    }
  }

  const displayedReviews = showAllReviews
    ? reviewList
    : reviewList.slice(0, 3);

  const shouldShowViewAllButton = !showAllReviews && reviewList.length > 3;
  const shouldShowCollapseButton = showAllReviews && reviewList.length > 3;

  return (
    <div>
      <main className="mt-20 max-w-7xl mx-auto px-6 py-10 md:px-12 w-full flex-grow">
        <nav className="flex text-sm text-textMuted mb-8 font-medium">
          <Link to="/" className="hover:text-orange-500 transition">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-orange-500 transition">
            Nội thất
          </Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-orange-500 transition">
            {categoryName}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary">{productName}</span>
        </nav>

        {isLoading && (
          <div className="mb-6 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-600">
            Đang tải dữ liệu sản phẩm...
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-20">
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="w-full h-[400px] md:h-[600px] bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
              <img
                src={mainImage}
                alt={productName}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-zoom-in"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  onClick={handleThumbnailClick.bind(null, image)}
                  className={`w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 shrink-0 transition duration-300 ${mainImage === image ? "border-orange-500 opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img
                    src={image}
                    alt={`Ảnh ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider rounded-md w-max mb-4">
              Sản phẩm mới
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-primary leading-tight mb-4 tracking-tight">
              {productName}
            </h1>

            {reviewCount > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <FormRating rating={productRating} />
                <span className="text-sm text-textMuted font-medium underline cursor-pointer">
                  ({reviewCount} đánh giá)
                </span>
              </div>
            )}

            <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-8 flex items-end tracking-tight">
              {FormPrice(currentPrice)}
              {oldPrice > 0 && (
                <span className="text-lg text-textMuted font-medium line-through ml-3 mb-1">
                  {FormPrice(oldPrice)}
                </span>
              )}
            </div>

            <p
              className={`text-sm font-semibold mb-4 ${isOutOfStock ? "text-gray-400" : "text-green-600"}`}
            >
              {isOutOfStock
                ? "Hết hàng"
                : `Còn ${selectedStock} sản phẩm trong kho`}
            </p>

            <p className="text-textMuted leading-relaxed mb-8 max-w-lg text-[15px]">
              {description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary">
                  Chọn Kích Thước
                </label>
                <select
                  value={selectedSize}
                  onChange={handleSizeChange}
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition text-sm font-medium text-primary cursor-pointer"
                >
                  {sizeOptions.length > 0 ? (
                    sizeOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Nhỏ (1.6m)">Nhỏ (1.6m)</option>
                      <option value="Vừa (2.0m)">Vừa (2.0m)</option>
                      <option value="Lớn (2.4m)">Lớn (2.4m)</option>
                    </>
                  )}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary">
                  Chọn Màu Sắc
                </label>
                <select
                  value={selectedColor}
                  onChange={handleColorChange}
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition text-sm font-medium text-primary cursor-pointer"
                >
                  {colorOptions.length > 0 ? (
                    colorOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Trắng Kem">Trắng Kem</option>
                      <option value="Xám Khói">Xám Khói</option>
                      <option value="Vàng Sồi">Vàng Sồi</option>
                      <option value="Đen Tuyền">Đen Tuyền</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10 items-stretch sm:items-center">
              <div className="flex items-center justify-between border-2 border-gray-100 rounded-xl px-4 py-3 w-32 bg-white shrink-0">
                <button
                  onClick={handleDecreaseQuantity}
                  className="text-gray-400 hover:text-orange-500 transition"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M20 12H4"
                    ></path>
                  </svg>
                </button>
                <span className="w-10 text-center text-primary font-bold">
                  {quantity}
                </span>
                <button
                  onClick={handleIncreaseQuantity}
                  disabled={isOutOfStock || quantity >= selectedStock}
                  className="text-gray-400 hover:text-orange-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                </button>
              </div>

              <button
                disabled={isOutOfStock}
                className={`flex-grow py-4 rounded-xl font-bold text-base transition duration-300 flex items-center justify-center gap-2 ${isOutOfStock ? "bg-gray-300 text-white cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600"}`}
              >
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
                Thêm vào giỏ hàng
              </button>

              <button className="w-14 h-14 border-2 border-gray-200 rounded-xl flex items-center justify-center text-textMuted hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-6 text-sm text-textMuted font-medium border-t border-gray-100 pt-6">
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Còn hàng
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                Giao hàng 2-4 ngày
              </span>
            </div>
          </div>
        </div>

        <div className="w-full bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 md:p-12 mb-20">
          <nav className="flex overflow-x-auto gap-8 border-b border-gray-100 mb-8 pb-4">
            {[
              { key: "desc", label: "Mô tả sản phẩm" },
              { key: "specs", label: "Thông số kỹ thuật" },
              { key: "shipping", label: "Chính sách giao hàng" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={handleTabChange.bind(null, tab.key)}
                className={`font-bold pb-4 px-2 whitespace-nowrap transition cursor-pointer border-b-2 ${activeTab === tab.key ? "text-orange-500 border-orange-500" : "text-textMuted hover:text-primary border-transparent"}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {activeTab === "desc" && (
            <div className="text-textMuted leading-relaxed space-y-4">
              {descriptionLines.length > 0 ? (
                descriptionLines.map((line, index) => <p key={index}>{line}</p>)
              ) : (
                <p>Chưa cập nhật</p>
              )}
            </div>
          )}

          {activeTab === "specs" && (
            <div className="text-textMuted leading-relaxed">
              {specifications.length > 0 ? (
                <table className="w-full text-sm text-left border-collapse">
                  <tbody>
                    {specifications.map((row, index) => (
                      <tr
                        key={index}
                        className={
                          index < specifications.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        }
                      >
                        <td className="py-4 font-semibold text-primary w-1/3">
                          {row.label}
                        </td>
                        <td className="py-4">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Chưa cập nhật</p>
              )}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="text-textMuted leading-relaxed space-y-4">
              {shippingPolicy.length > 0 ? (
                <>
                  <h4 className="text-primary font-bold text-lg mb-2">
                    Vận chuyển và đổi trả
                  </h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {shippingPolicy.map((line, index) => (
                      <li key={index}>{line}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Chưa cập nhật</p>
              )}
            </div>
          )}
        </div>

        <h2 className="text-3xl font-bold text-primary mb-10 text-center tracking-tight">
          Đánh giá
        </h2>
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 md:p-12 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1">
              <div className="flex items-end gap-4 mb-3">
                <div className="text-5xl font-bold text-primary leading-none">
                  {productRating.toFixed(1)}
                </div>
                <FormRating rating={productRating} />
              </div>
              <p className="text-sm text-textMuted">{reviewCount} đánh giá</p>

              <div className="mt-8 rounded-2xl border border-gray-100 bg-secondary/40 p-5">
                <h3 className="text-lg font-bold text-primary mb-3 tracking-tight">
                  Viết đánh giá
                </h3>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={handleReviewRatingChange.bind(null, star)}
                      className={`text-xl transition ${star <= reviewRating ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      <i className="bi bi-star-fill"></i>
                    </button>
                  ))}
                </div>

                <textarea
                  placeholder="Chia sẻ cảm nhận của bạn..."
                  rows="3"
                  value={reviewContent}
                  onChange={handleReviewContentChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-white transition text-sm resize-none"
                />

                {reviewMessage && (
                  <p className="mt-3 text-sm text-textMuted">{reviewMessage}</p>
                )}

                <button
                  onClick={submitReview}
                  disabled={isSubmittingReview}
                  className="mt-4 bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition duration-300 w-full"
                >
                  {isSubmittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
              </div>
            </div>

            {reviewList.length > 0 && (
              <div className="lg:col-span-2 flex flex-col gap-4">
                {displayedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-gray-100 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <h4 className="font-bold text-primary text-base flex items-center gap-2 truncate">
                            {review.name}
                            {review.verified && (
                              <span className="bg-green-100 text-green-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shrink-0">
                                ✓ Đã mua
                              </span>
                            )}
                          </h4>
                          <span className="text-xs text-gray-400">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <FormRating rating={review.rating} />
                        </div>
                        <p className="text-sm text-textMuted leading-relaxed">
                          {review.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {shouldShowViewAllButton && (
                  <button
                    onClick={handleShowAllReviews}
                    className="self-center mt-2 px-5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-primary hover:text-orange-500 hover:border-orange-300 transition"
                  >
                    Xem tất cả {reviewList.length} bình luận
                  </button>
                )}

                {shouldShowCollapseButton && (
                  <button
                    onClick={handleCollapseReviews}
                    className="self-center mt-2 px-5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-primary hover:text-orange-500 hover:border-orange-300 transition"
                  >
                    Thu gọn
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {relatedProductList.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-primary mb-8 tracking-tight">
              Sản phẩm cùng danh mục
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {relatedProductList.map((product) => (
                <Link
                  key={product.id}
                  to={`/product-detail/${product.id}`}
                  className="bg-white rounded-[24px] p-5 shadow-sm hover:shadow-xl transition flex flex-col group border border-gray-100"
                >
                  <div className="h-56 bg-secondary rounded-2xl mb-4 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="text-sm text-textMuted mb-2 uppercase tracking-wide font-medium">
                    {product.category || "Sản phẩm"}
                  </div>
                  <div className="text-lg font-bold text-primary mb-2 line-clamp-1">
                    {product.name}
                  </div>
                  {product.hasRating && (
                    <div className="mb-4">
                      <FormRating rating={product.rating} />
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold text-primary">
                      {FormPrice(product.price)}
                    </span>
                    <button className="w-10 h-10 rounded-full bg-primary text-white flex justify-center items-center hover:bg-orange-500 transition -rotate-45 group-hover:rotate-0 duration-300">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
