import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import requestAPI from "../../../../api";
import Toast from "../../../ui/common/Toast";
import "./style.css";

const DEFAULT_IMAGE = "https://placehold.co/600x600?text=PRODUCT";
const DEFAULT_AVATAR = "https://placehold.co/100x100?text=U";

const formatPrice = (value) =>
  `${Number(value || 0).toLocaleString("vi-VN")} đ`;

const formatDate = (value) => {
  const date = value ? new Date(value) : new Date();
  return isNaN(date)
    ? ""
    : new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
};

const parseMoney = (value) =>
  Math.floor(Number(value ?? 0)) || 0;

const avgRating = (items) =>
  items.length
    ? items.reduce((s, r) => s + Number(r?.rating || 0), 0) / items.length
    : 0;

function StarRating({ rating }) {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <i key={i} className="bi bi-star-fill" />
  ));
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
}

function normalizeVariant(v) {
  return {
    id: v?.id,
    name: v?.name || v?.attribute_summary || `Biến thể #${v?.id ?? ""}`,
    sku: v?.sku || "",
    price: parseMoney(v?.price),
    image: v?.variant_image || "",
  };
}

function normalizeReview(r) {
  return {
    id: r?.id || Math.random().toString(36),
    name: r?.username || r?.user_name || r?.name || "Khách hàng",
    avatar: r?.avatar || DEFAULT_AVATAR,
    rating: Number(r?.rating || 5),
    date: formatDate(r?.created_at || r?.date),
    content: r?.comment || r?.content || "",
    verified: Boolean(r?.verified || r?.purchased),
  };
}

function normalizeComment(c) {
  return {
    id: c?.id || Math.random().toString(36),
    name: c?.username || c?.user_name || c?.name || "Khách hàng",
    avatar: c?.avatar || DEFAULT_AVATAR,
    date: formatDate(c?.created_at || c?.date),
    content: c?.content || c?.comment || "",
  };
}

function normalizeProduct(p) {
  const variants = Array.isArray(p?.variants)
    ? p.variants.map(normalizeVariant)
    : [];
  const galleryRaw = [
    ...(Array.isArray(p?.images) ? p.images : []),
    ...variants.map((v) => v.image),
    p?.image || DEFAULT_IMAGE,
  ].filter(Boolean);
  const gallery = [...new Set(galleryRaw)];
  const firstVariant = variants[0] || null;

  return {
    info: {
      name: p?.name || "Sản phẩm",
      category: p?.category_name || "Nội thất",
      price: firstVariant ? firstVariant.price : parseMoney(p?.base_price),
      oldPrice: 0,
      description: p?.short_description || "Chưa cập nhật",
    },
    images: {
      main: gallery[0] || DEFAULT_IMAGE,
      gallery: gallery.length ? gallery : [DEFAULT_IMAGE],
    },
    tabs: {
      descriptions: p?.detail_content
        ? String(p.detail_content)
        : "",
      specifications: Array.isArray(p?.specs)
        ? p.specs.map((s) => ({
            label: s?.spec_name || "Thông số",
            value: s?.spec_value || "",
          }))
        : [],
      shippingPolicy: Array.isArray(p?.policies)
        ? p.policies.map((s) => s?.content).filter(Boolean)
        : [],
    },
    variants,
    firstVariantId: firstVariant ? String(firstVariant.id) : "",
    comments: Array.isArray(p?.comments)
      ? p.comments
          .filter(
            (c) =>
              Number(c?.is_approved) === 1 &&
              Number(c?.id_visible ?? c?.is_visible ?? 0) === 1,
          )
          .map(normalizeComment)
      : [],
    reviews: Array.isArray(p?.reviews)
      ? p.reviews
          .filter((r) => Number(r?.id_visible ?? r?.is_visible ?? 0) === 1)
          .map(normalizeReview)
      : [],
  };
}

function buildRelated(current, list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter(
      (p) => Number(p?.status) === 1 && String(p?.id) !== String(current?.id),
    )
    .filter(
      (p) =>
        String(p?.category_name || "") === String(current?.category_name || ""),
    )
    .slice(0, 4)
    .map((p) => ({
      id: p?.id,
      name: p?.name || "Sản phẩm",
      price: parseMoney(p?.base_price),
      image: p?.image || DEFAULT_IMAGE,
      category: p?.category_name || "",
      rating: Number(p?.rating_avg || 0),
      hasRating: Boolean(p?.rating_avg),
    }));
}

const TABS = [
  { key: "desc", label: "Mô tả sản phẩm" },
  { key: "specs", label: "Thông số kỹ thuật" },
  { key: "shipping", label: "Chính sách giao hàng" },
];

const FEEDBACK_TABS = [
  { key: "comments", label: "Bình luận" },
  { key: "reviews", label: "Đánh giá" },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [info, setInfo] = useState({
    name: "",
    category: "",
    price: 0,
    oldPrice: 0,
    description: "",
  });
  const [images, setImages] = useState({
    main: DEFAULT_IMAGE,
    gallery: [DEFAULT_IMAGE],
  });
  const [tabs, setTabs] = useState({
    descriptions: [],
    specifications: [],
    shippingPolicy: [],
  });
  const [variants, setVariants] = useState([]);
  const [related, setRelated] = useState([]);
  const [variantId, setVariantId] = useState("");
  const [activeTab, setActiveTab] = useState("desc");
  const [activeFeedbackTab, setActiveFeedbackTab] = useState("comments");
  const [comments, setComments] = useState({ items: [], showAll: false });
  const [reviews, setReviews] = useState({ items: [], showAll: false });
  const [commentForm, setCommentForm] = useState({
    content: "",
    message: "",
    isSubmitting: false,
  });
  const [reviewForm, setReviewForm] = useState({
    content: "",
    rating: 5,
    message: "",
    isSubmitting: false,
  });
  const [loading, setLoading] = useState({ active: false, error: "" });
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") =>
    setToast({ show: true, message, type });
  const selectedVariant = variants.find(
    (v) => String(v.id) === String(variantId),
  );
  const currentPrice = selectedVariant ? selectedVariant.price : info.price;
  const computedRating = avgRating(reviews.items);
  const displayedComments = comments.showAll
    ? comments.items
    : comments.items.slice(0, 3);
  const displayedReviews = reviews.showAll
    ? reviews.items
    : reviews.items.slice(0, 3);

  function handleVariantChange(e) {
    const next = variants.find((v) => String(v.id) === String(e.target.value));
    setVariantId(e.target.value);
    setImages((prev) => ({
      ...prev,
      main: next?.image || images.gallery[0] || DEFAULT_IMAGE,
    }));
  }

  function handleGalleryImageClick(event) {
    const image = event.currentTarget.dataset.image;
    if (image) setImages((prev) => ({ ...prev, main: image }));
  }

  function handleProductTabClick(event) {
    const key = event.currentTarget.dataset.tabKey;
    if (key) setActiveTab(key);
  }

  function handleFeedbackTabClick(event) {
    const key = event.currentTarget.dataset.tabKey;
    if (key) setActiveFeedbackTab(key);
  }

  function handleReviewRatingChange(event) {
    const next = Number(event.currentTarget.dataset.rating || 5);
    setReviewForm((prev) => ({ ...prev, rating: next }));
  }

  async function handleSubmitComment() {
    if (!commentForm.content.trim()) {
      showToast("Vui lòng nhập nội dung bình luận.", "error");
      return;
    }
    setCommentForm((prev) => ({ ...prev, isSubmitting: true }));
    try {
      await requestAPI({
        method: "POST",
        url: "/products/comment",
        data: {
          product_id: parseInt(id),
          parent_id: null,
          content: commentForm.content.trim(),
        },
      });
      setCommentForm({
        content: "",
        message: "",
        isSubmitting: false,
      });
      showToast("Bình luận đã được gửi thành công", "success");
      await loadProduct();
    } catch (err) {
      setCommentForm((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
      showToast(
        err?.message || "Gửi bình luận thất bại. Vui lòng thử lại.",
        "error"
      );
    }
  }

  async function handleSubmitReview() {
    if (!reviewForm.content.trim()) {
      showToast("Vui lòng nhập nội dung đánh giá.", "error");
      return;
    }
    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      showToast("Vui lòng chọn số sao từ 1 đến 5.", "error");
      return;
    }
    setReviewForm((prev) => ({ ...prev, isSubmitting: true }));
    try {
      await requestAPI({
        method: "POST",
        url: "/reviews/add",
        data: {
          product_id: parseInt(id),
          rating: reviewForm.rating,
          comment: reviewForm.content.trim(),
        },
      });
      setReviewForm({
        content: "",
        rating: 5,
        message: "",
        isSubmitting: false,
      });
      showToast("Đánh giá đã được gửi.", "success");
      await loadProduct();
    } catch (err) {
      setReviewForm((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
      showToast(
        err?.response?.data?.message || "Gửi đánh giá thất bại.",
        "error"
      );
    }
  }

  async function handleAddToCart() {
    if (variants.length > 0 && !variantId) {
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
          variant_id: variantId ? parseInt(variantId) : null,
          quantity,
          unit_price: parseFloat(currentPrice),
          variant_name: selectedVariant?.name || "",
          variant_image:
            selectedVariant?.image || images.gallery[0] || DEFAULT_IMAGE,
          product_name: info.name,
        },
      });
      window.dispatchEvent(new Event("cart_update"));
      showToast("Thêm vào giỏ hàng thành công");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Lỗi khi thêm vào giỏ hàng",
        "error",
      );
    } finally {
      setIsAddingToCart(false);
    }
  }

  async function loadProduct() {
    setLoading({ active: true, error: "" });
    try {
      const [detailRes, listRes] = await Promise.all([
        requestAPI({ method: "GET", url: `/products/${id}` }),
        requestAPI({ method: "GET", url: "/products/list?status=1" }),
      ]);

      const status = detailRes?.status || detailRes?.data?.status;
      if (Number(status) === 404)
        return navigate("/404", {
          replace: true,
          state: { message: "Sản phẩm không tồn tại." },
        });

      const product = detailRes?.data?.data || {};
      if (Number(product?.status) !== 1)
        return navigate("/404", {
          replace: true,
          state: { message: "Sản phẩm đã ngừng hiển thị." },
        });

      const normalized = normalizeProduct(product);
      const initVariant = normalized.variants.find(
        (v) => String(v.id) === normalized.firstVariantId,
      );

      setInfo(normalized.info);
      setImages({
        ...normalized.images,
        main: initVariant?.image || normalized.images.main,
      });
      setTabs(normalized.tabs);
      setVariants(normalized.variants);
      setVariantId(normalized.firstVariantId);
      setRelated(
        buildRelated(
          product,
          Array.isArray(listRes?.data?.data) ? listRes.data.data : [],
        ),
      );
      setComments({ items: normalized.comments, showAll: false });
      setReviews({ items: normalized.reviews, showAll: false });
    } catch (err) {
      if (Number(err?.response?.status) === 404)
        return navigate("/404", {
          replace: true,
          state: { message: "Sản phẩm không tồn tại." },
        });
      setLoading((prev) => ({
        ...prev,
        error: err?.message || "Không tải được sản phẩm",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, active: false }));
    }
  }

  useEffect(() => {
    if (!id)
      return navigate("/404", {
        replace: true,
        state: { message: "Không tìm thấy mã sản phẩm." },
      });
    loadProduct();
  }, [id]);

  return (
    <div>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
      <main className="mt-20 max-w-7xl mx-auto px-6 py-10 md:px-12 w-full flex-grow">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-sm text-textMuted mb-8 font-medium">
          <Link to="/" className="hover:text-orange-500 transition">
            Trang chủ
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-orange-500 transition">
            Nội thất
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-orange-500 transition">
            {info.category}
          </Link>
          <span>/</span>
          <span className="text-primary">{info.name}</span>
        </nav>

        {loading.active && (
          <div className="mb-6 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-600">
            Đang tải dữ liệu sản phẩm...
          </div>
        )}
        {loading.error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {loading.error}
          </div>
        )}

        {/* Product main section */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 mb-16">
          {/* Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="w-full h-[360px] md:h-[520px] bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              <img
                src={images.main}
                alt={info.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-zoom-in"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.gallery.map((img, i) => (
                <button
                  key={i}
                  data-image={img}
                  onClick={handleGalleryImageClick}
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition duration-300 ${images.main === img ? "border-orange-500 opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img
                    src={img}
                    alt={`Ảnh ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider rounded-md w-max mb-4">
              Chi tiết sản phẩm
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4 tracking-tight">
              {info.name}
            </h1>

            {reviews.items.length > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <StarRating rating={computedRating} />
                <span className="text-sm text-textMuted font-medium underline cursor-pointer">
                  ({reviews.items.length} đánh giá)
                </span>
              </div>
            )}

            <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-8 flex items-end tracking-tight">
              {formatPrice(currentPrice)}
              {info.oldPrice > 0 && (
                <span className="text-lg text-textMuted font-medium line-through ml-3 mb-1">
                  {formatPrice(info.oldPrice)}
                </span>
              )}
            </div>

            <p className="text-textMuted leading-relaxed mb-8 max-w-lg text-[15px]">
              {info.description}
            </p>

            {variants.length > 0 && (
              <div className="mb-8">
                <label className="text-xs font-bold uppercase tracking-wider text-textMuted block mb-2">
                  Chọn biến thể
                </label>
                <div className="relative group">
                  <select
                    value={variantId}
                    onChange={handleVariantChange}
                    className="w-full appearance-none pl-5 pr-12 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm text-sm font-semibold text-primary cursor-pointer transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 group-hover:border-gray-300"
                  >
                    {variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
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
                      />
                    </svg>
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-10 items-stretch sm:items-center">
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-3 text-primary hover:bg-gray-100 transition font-bold text-lg"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
                  }
                  className="w-16 text-center py-3 border-x border-gray-300 focus:outline-none font-bold"
                />
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="px-4 py-3 text-primary hover:bg-gray-100 transition font-bold text-lg"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-grow py-4 rounded-xl font-bold text-base transition duration-300 flex items-center justify-center gap-2 bg-primary text-white hover:bg-orange-500 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <svg
                    className="animate-spin w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
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
                    />
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
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-textMuted font-medium border-t border-gray-100 pt-6">
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
                  />
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
                  />
                </svg>
                Giao hàng 2-4 ngày
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 mb-16">
          <nav className="flex overflow-x-auto gap-8 border-b border-gray-100 mb-8 pb-4">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                data-tab-key={tab.key}
                onClick={handleProductTabClick}
                className={`font-bold pb-4 px-2 whitespace-nowrap transition cursor-pointer border-b-2 ${activeTab === tab.key ? "text-orange-500 border-orange-500" : "text-textMuted hover:text-primary border-transparent"}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {activeTab === "desc" && (
            <div className="text-textMuted leading-relaxed space-y-4">
              {tabs.descriptions ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: tabs.descriptions }}
                />
              ) : (
                <p>Chưa cập nhật</p>
              )}
            </div>
          )}
          {activeTab === "specs" && (
            <div className="text-textMuted leading-relaxed">
              {tabs.specifications.length > 0 ? (
                <table className="w-full text-sm text-left border-collapse">
                  <tbody>
                    {tabs.specifications.map((row, i) => (
                      <tr
                        key={i}
                        className={
                          i < tabs.specifications.length - 1
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
              {tabs.shippingPolicy.length > 0 ? (
                <>
                  <h4 className="text-primary font-bold text-lg mb-2">
                    Vận chuyển và đổi trả
                  </h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {tabs.shippingPolicy.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Chưa cập nhật</p>
              )}
            </div>
          )}
        </div>

        {/* Comments & Reviews */}
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 tracking-tight">
          Bình luận và đánh giá
        </h2>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 mb-16">
          <nav className="flex gap-3 border-b border-gray-100 pb-4 mb-8 overflow-x-auto">
            {FEEDBACK_TABS.map((tab) => (
              <button
                key={tab.key}
                data-tab-key={tab.key}
                onClick={handleFeedbackTabClick}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${activeFeedbackTab === tab.key ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-textMuted hover:text-primary"}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1">
              {activeFeedbackTab === "reviews" && (
                <>
                  <div className="flex items-end gap-4 mb-3">
                    <div className="text-5xl font-bold text-primary leading-none">
                      {computedRating.toFixed(1)}
                    </div>
                    <StarRating rating={computedRating} />
                  </div>
                  <p className="text-sm text-textMuted">
                    {reviews.items.length} đánh giá
                  </p>
                  <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <h3 className="text-lg font-bold text-primary mb-3 tracking-tight">
                      Viết đánh giá
                    </h3>
                    <div className="flex items-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          data-rating={star}
                          onClick={handleReviewRatingChange}
                          className={`text-xl transition ${star <= reviewForm.rating ? "text-yellow-400" : "text-gray-300"}`}
                        >
                          <i className="bi bi-star-fill" />
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder="Chia sẻ cảm nhận của bạn..."
                      rows="3"
                      value={reviewForm.content}
                      onChange={(e) =>
                        setReviewForm((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-white transition text-sm resize-none"
                    />
                    <button
                      onClick={handleSubmitReview}
                      disabled={reviewForm.isSubmitting}
                      className="mt-4 bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition duration-300 w-full"
                    >
                      {reviewForm.isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                    </button>
                  </div>
                </>
              )}

              {activeFeedbackTab === "comments" && (
                <div className="mt-2 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <h3 className="text-lg font-bold text-primary mb-3 tracking-tight">
                    Viết bình luận
                  </h3>
                  <textarea
                    placeholder="Chia sẻ nội dung bình luận..."
                    rows="3"
                    value={commentForm.content}
                    onChange={(e) =>
                      setCommentForm((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-white transition text-sm resize-none"
                  />
                  <button
                    onClick={handleSubmitComment}
                    disabled={commentForm.isSubmitting}
                    className="mt-4 bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition duration-300 w-full"
                  >
                    {commentForm.isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
                  </button>
                </div>
              )}
            </div>

            {activeFeedbackTab === "comments" && comments.items.length > 0 && (
              <div className="lg:col-span-2 flex flex-col gap-4">
                {displayedComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-2xl border border-gray-100 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={comment.avatar}
                        alt={comment.name}
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <h4 className="font-bold text-primary text-base truncate">
                            {comment.name}
                          </h4>
                          <span className="text-xs text-gray-400">
                            {comment.date}
                          </span>
                        </div>
                        <p className="text-sm text-textMuted leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {comments.items.length > 3 && (
                  <button
                    onClick={() =>
                      setComments((prev) => ({
                        ...prev,
                        showAll: !prev.showAll,
                      }))
                    }
                    className="self-center mt-2 px-5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-primary hover:text-orange-500 hover:border-orange-300 transition"
                  >
                    {comments.showAll
                      ? "Thu gọn"
                      : `Xem tất cả ${comments.items.length} bình luận`}
                  </button>
                )}
              </div>
            )}

            {activeFeedbackTab === "reviews" && reviews.items.length > 0 && (
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
                          <StarRating rating={review.rating} />
                        </div>
                        <p className="text-sm text-textMuted leading-relaxed">
                          {review.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {reviews.items.length > 3 && (
                  <button
                    onClick={() =>
                      setReviews((prev) => ({
                        ...prev,
                        showAll: !prev.showAll,
                      }))
                    }
                    className="self-center mt-2 px-5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-primary hover:text-orange-500 hover:border-orange-300 transition"
                  >
                    {reviews.showAll
                      ? "Thu gọn"
                      : `Xem tất cả ${reviews.items.length} đánh giá`}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-primary mb-8 tracking-tight">
              Sản phẩm cùng danh mục
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {related.map((product) => (
                <Link
                  key={product.id}
                  to={`/product-detail/${product.id}`}
                  className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-lg transition flex flex-col group border border-gray-100"
                >
                  <div className="h-52 bg-gray-50 rounded-2xl mb-4 overflow-hidden">
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
                      <StarRating rating={product.rating} />
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    <button className="w-10 h-10 rounded-full bg-primary text-white flex justify-center items-center hover:bg-orange-500 transition -rotate-45 group-hover:rotate-0 duration-300">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
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
