import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import requestAPI from "../../../../api";
import Toast from "../../../ui/common/Toast";
import "./style.css";

// Ảnh mặc định nếu không có ảnh sản phẩm
const ANH_MAC_DINH = "https://placehold.co/600x600?text=PRODUCT";

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
  return {
    id: variantItem?.id,
    name:
      variantItem?.name ||
      variantItem?.attribute_summary ||
      `Biến thể #${variantItem?.id || ""}`,
    sku: variantItem?.sku || "",
    price: Number(String(variantItem?.price || 0).replace(/[^\d]/g, "")) || 0,
    stock_quantity: Number(variantItem?.stock_quantity || 0),
    image: variantItem?.variant_image || "",
  };
}

function parseMoney(value) {
  return Number(String(value ?? 0).replace(/[^\d]/g, "")) || 0;
}

function normalizeReviewData(reviewItem) {
  return {
    id: reviewItem?.id || Math.random().toString(36),
    name: resolveReviewAuthorName(reviewItem),
    avatar: reviewItem?.avatar || "https://placehold.co/100x100?text=U",
    rating: Number(reviewItem?.rating || 5),
    date: formatReviewDate(reviewItem?.created_at || reviewItem?.date),
    content: reviewItem?.comment || reviewItem?.content || "",
    verified: Boolean(reviewItem?.verified || reviewItem?.purchased),
  };
}

function calculateAverageRating(reviewItems) {
  if (!Array.isArray(reviewItems) || reviewItems.length === 0) {
    return 0;
  }

  const totalRating = reviewItems.reduce(
    (sum, item) => sum + Number(item?.rating || 0),
    0,
  );

  return totalRating / reviewItems.length;
}

function normalizeRelatedProductData(productItem) {
  return {
    id: productItem?.id,
    name: productItem?.name || "Sản phẩm",
    price: parseMoney(productItem?.base_price),
    image: productItem?.image || ANH_MAC_DINH,
    category: productItem?.category_name || "",
    rating: Number(productItem?.rating_avg || 0),
    hasRating: Boolean(productItem?.rating_avg),
  };
}

function buildImageGallery(product, variants) {
  const detailImages = Array.isArray(product?.images)
    ? product.images.filter(Boolean)
    : [];
  const variantImages = variants.map((item) => item.image).filter(Boolean);

  const mergedGallery = [
    ...detailImages,
    ...variantImages,
    product?.image || ANH_MAC_DINH,
  ].filter(Boolean);

  return Array.from(new Set(mergedGallery));
}

function normalizeDetailData(product) {
  const variants = Array.isArray(product?.variants)
    ? product.variants.map((item) => parseVariantData(item))
    : [];

  const gallery = buildImageGallery(product, variants);
  const firstVariant = variants[0] || null;
  const firstVariantId = firstVariant ? String(firstVariant.id) : "";
  const normalizedReviews = Array.isArray(product?.reviews)
    ? product.reviews.map((item) => normalizeReviewData(item))
    : [];
  const averageRating = calculateAverageRating(normalizedReviews);

  return {
    productInfo: {
      name: product?.name || "Sản phẩm",
      category: product?.category_name || "Nội thất",
      price: firstVariant ? firstVariant.price : parseMoney(product?.base_price),
      oldPrice: 0,
      description: product?.short_description || "Chưa cập nhật",
      rating: averageRating || product?.rating_avg || 0,
      reviewCount: normalizedReviews.length,
    },
    images: {
      main: gallery[0] || ANH_MAC_DINH,
      gallery: gallery.length > 0 ? gallery : [ANH_MAC_DINH],
    },
    tabDetails: {
      descriptions: product?.detail_content
        ? String(product.detail_content)
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
      specifications: Array.isArray(product?.specs)
        ? product.specs.map((item) => ({
            label: item?.spec_name || "Thông số",
            value: item?.spec_value || "",
          }))
        : [],
      shippingPolicy: Array.isArray(product?.policies)
        ? product.policies.map((item) => item?.content).filter(Boolean)
        : [],
    },
    variants,
    reviews: normalizedReviews,
    firstVariantId,
  };
}

function buildRelatedProducts(currentProduct, productList) {
  if (!Array.isArray(productList)) {
    return [];
  }

  return productList
    .filter((item) => Number(item?.status) === 1)
    .filter((item) => String(item?.id) !== String(currentProduct?.id))
    .filter(
      (item) =>
        String(item?.category_name || "") ===
        String(currentProduct?.category_name || ""),
    )
    .slice(0, 4)
    .map((item) => normalizeRelatedProductData(item));
}

function resolveVariantImage(variantItem, fallbackImage) {
  return variantItem?.image || fallbackImage || ANH_MAC_DINH;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productInfo, setProductInfo] = useState({
    name: "Ghế Sofa Cao Cấp Minimalist",
    category: "Phòng Khách",
    price: 899000,
    oldPrice: 0,
    description: "Chưa cập nhật",
    rating: 5,
    reviewCount: 0,
  });
  const [images, setImages] = useState({
    main: ANH_MAC_DINH,
    gallery: [ANH_MAC_DINH],
  });
  const [selections, setSelections] = useState({
    quantity: 1,
    variantId: "",
    activeTab: "desc",
  });
  const [tabDetails, setTabDetails] = useState({
    descriptions: [],
    specifications: [],
    shippingPolicy: [],
  });
  const [reviews, setReviews] = useState({
    items: [],
    rating: 5,
    content: "",
    message: "",
    isSubmitting: false,
    showAll: false,
  });
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState({
    isLoading: false,
    error: "",
  });
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
      setToast({ show: true, message, type });
  };

  const closeToast = () => {
      setToast((prev) => ({ ...prev, show: false }));
  };

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
  const selectedVariantId = selections.variantId;
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

  const computedReviewCount = reviewList.length;
  const computedProductRating = calculateAverageRating(reviewList);

  const selectedVariant = variantList.find(
    (item) => String(item.id) === String(selectedVariantId),
  );
  const currentPrice = selectedVariant ? selectedVariant.price : price;

  // ===== patch state helpers =====
  function patchProductInfo(partialInfo) {
    setProductInfo((previous) => ({ ...previous, ...partialInfo }));
  }

  function patchImages(partialImages) {
    setImages((previous) => ({ ...previous, ...partialImages }));
  }

  function patchSelections(partialSelections) {
    setSelections((previous) => ({ ...previous, ...partialSelections }));
  }

  function patchTabDetails(partialTabDetails) {
    setTabDetails((previous) => ({ ...previous, ...partialTabDetails }));
  }

  function patchReviews(partialReviews) {
    setReviews((previous) =>
      typeof partialReviews === "function"
        ? partialReviews(previous)
        : { ...previous, ...partialReviews },
    );
  }

  function patchLoading(partialLoading) {
    setLoading((previous) => ({ ...previous, ...partialLoading }));
  }

  // ===== event handlers =====
  function handleThumbnailClick(image) {
    patchImages({ main: image });
  }

  function handleVariantChange(event) {
    const nextVariantId = event.target.value;
    const nextVariant = variantList.find(
      (item) => String(item.id) === String(nextVariantId),
    );

    patchSelections({ variantId: nextVariantId, quantity: 1 });
    patchImages({ main: resolveVariantImage(nextVariant, galleryImages[0]) });
  }

  function handleDecreaseQuantity() {
    patchSelections({ quantity: Math.max(1, quantity - 1) });
  }

  function handleIncreaseQuantity() {
    patchSelections({ quantity: quantity + 1 });
  }

  function handleTabChange(tabKey) {
    patchSelections({ activeTab: tabKey });
  }

  function handleReviewRatingChange(star) {
    patchReviews({ rating: star });
  }

  function handleReviewContentChange(event) {
    patchReviews({ content: event.target.value });
  }

  function handleShowAllReviews() {
    patchReviews({ showAll: true });
  }

  function handleCollapseReviews() {
    patchReviews({ showAll: false });
  }

  async function handleAddToCart() {
    if (!id || !selectedVariantId) {
      showToast("Vui lòng chọn đầy đủ thuộc tính sản phẩm", "error");
      return;
    }

    setIsAddingToCart(true);
    try {
      await requestAPI({
        method: "POST",
        url: "/carts/items/add",
        data: {
          product_id: parseInt(id),
          variant_id: parseInt(selectedVariantId),
          quantity: parseInt(quantity),
          unit_price: parseFloat(currentPrice),
          variant_name: selectedVariant ? selectedVariant.name : "",
          variant_image: resolveVariantImage(selectedVariant, galleryImages[0]),
          product_name: productName
        }
      });
      // Fire generic event to update header badge
      window.dispatchEvent(new Event("cart_update"));
      showToast("Thêm vào giỏ hàng thành công", "success");
    } catch (error) {
      console.error("Lỗi thêm vào giỏ hàng:", error);
      const msg = error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng";
      showToast(msg, "error");
    } finally {
      setIsAddingToCart(false);
    }
  }

  // ===== data loader =====
  async function loadProductData() {
    patchLoading({ isLoading: true, error: "" });
    try {
      const [detailResponse, listResponse] = await Promise.all([
        requestAPI({ method: "GET", url: `/products/${id}` }),
        requestAPI({ method: "GET", url: "/products/list" }),
      ]);

      const detailStatus = detailResponse?.status || detailResponse?.data?.status;
      if (Number(detailStatus) === 404) {
        navigate("/404", {
          replace: true,
          state: { message: "Sản phẩm không tồn tại." },
        });
        return;
      }

      const product = detailResponse?.data?.data || {};
      if (Number(product?.status) !== 1) {
        navigate("/404", {
          replace: true,
          state: { message: "Sản phẩm đã ngừng hiển thị." },
        });
        return;
      }

      const productList = Array.isArray(listResponse?.data?.data)
        ? listResponse.data.data
        : [];

      const normalizedDetail = normalizeDetailData(product);
      const relatedItems = buildRelatedProducts(product, productList);
      const initialVariant = normalizedDetail.variants.find(
        (item) => String(item.id) === String(normalizedDetail.firstVariantId),
      );
      const initialMainImage = resolveVariantImage(
        initialVariant,
        normalizedDetail.images.main,
      );

      setImages({ ...normalizedDetail.images, main: initialMainImage });
      setProductInfo(normalizedDetail.productInfo);
      setTabDetails(normalizedDetail.tabDetails);
      setVariants(normalizedDetail.variants);
      patchSelections({
        variantId: normalizedDetail.firstVariantId,
        quantity: 1,
      });
      patchReviews({
        items: normalizedDetail.reviews,
        message: "",
        isSubmitting: false,
        showAll: false,
      });
      setRelatedProducts(relatedItems);
    } catch (error) {
      if (Number(error?.response?.status) === 404) {
        navigate("/404", {
          replace: true,
          state: { message: "Sản phẩm không tồn tại." },
        });
        return;
      }
      patchLoading({ error: error?.message || "Không tải được sản phẩm" });
    } finally {
      patchLoading({ isLoading: false });
    }
  }

  useEffect(() => {
    if (!id) {
      navigate("/404", {
        replace: true,
        state: { message: "Không tìm thấy mã sản phẩm." },
      });
      return;
    }

    loadProductData();
  }, [id, navigate]);

  async function submitReview() {
    if (!id) {
      patchReviews({ message: "Không tìm thấy sản phẩm." });
      return;
    }
    if (reviewRating < 1 || reviewRating > 5) {
      patchReviews({ message: "Vui lòng chọn số sao từ 1 đến 5." });
      return;
    }
    if (!reviewContent.trim()) {
      patchReviews({ message: "Vui lòng nhập nội dung đánh giá." });
      return;
    }

    patchReviews({ isSubmitting: true, message: "" });
    try {
      const authorName = "Bạn";

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

      patchReviews((previous) => ({
        ...previous,
        items: [newReview, ...previous.items],
        rating: 5,
        content: "",
        message: "Đánh giá của bạn đã được gửi.",
      }));
      patchProductInfo({ reviewCount: reviewCount + 1 });
    } catch (error) {
      patchReviews({
        message: error?.message || "Gửi đánh giá thất bại. Vui lòng thử lại.",
      });
    } finally {
      patchReviews({ isSubmitting: false });
    }
  }

  const displayedReviews = showAllReviews
    ? reviewList
    : reviewList.slice(0, 3);

  const shouldShowViewAllButton = !showAllReviews && reviewList.length > 3;
  const shouldShowCollapseButton = showAllReviews && reviewList.length > 3;

  return (
    <div>
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={closeToast} />
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

            {computedReviewCount > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <FormRating rating={computedProductRating} />
                <span className="text-sm text-textMuted font-medium underline cursor-pointer">
                  ({computedReviewCount} đánh giá)
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

            <p className="text-textMuted leading-relaxed mb-8 max-w-lg text-[15px]">
              {description}
            </p>

            {variantList.length > 0 && (
              <div className="grid grid-cols-1 gap-5 mb-8">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-textMuted">
                    Chọn biến thể
                  </label>
                  <div className="relative group">
                    <select
                      value={selectedVariantId}
                      onChange={handleVariantChange}
                      className="w-full appearance-none pl-5 pr-12 py-4 rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 shadow-sm text-sm font-semibold text-primary cursor-pointer transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 group-hover:border-gray-300"
                    >
                      {variantList.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            )}

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
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                </button>
              </div>

              <button onClick={handleAddToCart} disabled={isAddingToCart} className="flex-grow py-4 rounded-xl font-bold text-base transition duration-300 flex items-center justify-center gap-2 bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-75 disabled:cursor-not-allowed">
                {isAddingToCart ? (
                    <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
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
                )}
                {isAddingToCart ? "Đang xử lý..." : "Thêm vào giỏ hàng"}
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
                Uy tín
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
                  {computedProductRating.toFixed(1)}
                </div>
                <FormRating rating={computedProductRating} />
              </div>
              <p className="text-sm text-textMuted">{computedReviewCount} đánh giá</p>

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
