import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import requestAPI from "../../../../api";
import "./style.css";

const FALLBACK_MAIN_IMAGE = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&q=80";

const NOT_UPDATED_TEXT = "Chưa cập nhật";

const getNumberPrice = (value) => {
    return Number(String(value ?? 0).replace(/[^\d]/g, "")) || 0;
};

const getTextLines = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => String(item || "").trim()).filter(Boolean);
    }

    if (typeof value === "string") {
        return value
            .split(/\n+/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
};

const getSpecRows = (value) => {
    if (Array.isArray(value)) {
        return value
            .map((item) => {
                if (typeof item === "string") {
                    const [label, ...rest] = item.split(/[:\-]/);
                    return {
                        label: (label || "Thông số").trim(),
                        value: (rest.join(":") || item).trim(),
                    };
                }

                if (item && typeof item === "object") {
                    return {
                        label: String(item.label || item.name || item.key || "Thông số").trim(),
                        value: String(item.value || item.content || item.description || "").trim(),
                    };
                }

                return null;
            })
            .filter((item) => item && item.label && item.value);
    }

    if (value && typeof value === "object") {
        return Object.entries(value)
            .map(([label, specValue]) => ({
                label: String(label).trim(),
                value: String(specValue || "").trim(),
            }))
            .filter((item) => item.label && item.value);
    }

    if (typeof value === "string") {
        return getTextLines(value)
            .map((line) => {
                const [label, ...rest] = line.split(/[:\-]/);
                return {
                    label: (label || "Thông số").trim(),
                    value: (rest.join(":") || line).trim(),
                };
            })
            .filter((item) => item.label && item.value);
    }

    return [];
};

const normalizeProductDetail = (payload) => {
    const item = payload?.data || payload || {};

    const fallbackImage =
        item.featured_image ||
        item.image ||
        item.thumbnail ||
        item.avatar ||
        "https://placehold.co/1000x1000?text=PRODUCT";

    const rawGallery = Array.isArray(item.images)
        ? item.images
        : Array.isArray(item.gallery)
          ? item.gallery
          : [fallbackImage];

    const gallery = rawGallery.filter(Boolean);

    const descriptionLines = getTextLines(item.description_lines || item.description_blocks || item.description);
    const specRows = getSpecRows(item.specifications || item.specs || item.technical_specs);
    const shippingLines = getTextLines(item.shipping_policy || item.shipping || item.delivery_policy);

    return {
        id: item.id || item._id || "",
        name: item.name || item.title || item.product_name || "Sản phẩm",
        category: item.category_name || item.category || "Nội thất",
        brand: item.brand_name || item.brand || item.manufacturer || item.vendor || "",
        price: getNumberPrice(item.base_price || item.price || item.selling_price || item.sale_price || item.current_price),
        oldPrice: getNumberPrice(item.old_price || item.compare_at_price || item.original_price),
        rating: Number(item.rating || item.review_score || 5),
        reviewCount: Number(item.review_count || item.reviews_count || item.total_reviews || 0),
        description: item.short_description || item.description || NOT_UPDATED_TEXT,
        descriptionLines,
        specRows,
        shippingLines,
        gallery: gallery.length > 0 ? gallery : [fallbackImage],
    };
};

const normalizeProductList = (payload) => {
    const list = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.data?.items)
          ? payload.data.items
          : Array.isArray(payload)
            ? payload
            : [];

    return list
        .map((item) => ({
            id: item.id || item._id || "",
            name: item.name || item.title || item.product_name || "Sản phẩm",
            category: item.category_name || item.category || "",
            brand: item.brand_name || item.brand || item.manufacturer || item.vendor || "",
            price: getNumberPrice(item.base_price || item.price || item.selling_price || item.sale_price || item.current_price),
            rating: Number(item.rating || item.review_score || 5),
            image:
                item.featured_image ||
                item.image ||
                item.thumbnail ||
                item.avatar ||
                "https://placehold.co/600x600?text=PRODUCT",
        }))
        .filter((item) => item.id && item.name);
};

const normalizeReviews = (payload) => {
    const item = payload?.data || payload || {};
    const source = item.reviews || item.comments || item.feedbacks || item.ratings || [];

    if (!Array.isArray(source)) {
        return [];
    }

    return source
        .map((reviewItem) => ({
            id: reviewItem.id || reviewItem._id || reviewItem.user_id || reviewItem.user?.id || Math.random().toString(36),
            name: reviewItem.user_name || reviewItem.name || reviewItem.user?.name || "Khách hàng",
            avatar:
                reviewItem.user_avatar ||
                reviewItem.avatar ||
                reviewItem.user?.avatar ||
                "https://placehold.co/100x100?text=U",
            rating: Number(reviewItem.rating || reviewItem.score || 5),
            date: reviewItem.created_at || reviewItem.date || reviewItem.time || "",
            content: reviewItem.content || reviewItem.comment || reviewItem.message || "Đánh giá chi tiết chưa được cung cấp.",
            verified: Boolean(reviewItem.verified || reviewItem.purchased || reviewItem.is_verified),
        }))
        .filter((review) => review.name && review.content);
};

const formatMoney = (value) => {
    return `${Number(value || 0).toLocaleString("vi-VN")} đ`;
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

const ProductDetail = () => {
    const { id } = useParams();

    const [productState, setProductState] = useState({
        mainImage: FALLBACK_MAIN_IMAGE,
        thumbnails: [
            FALLBACK_MAIN_IMAGE,
            "https://images.unsplash.com/photo-1493663284031-b7e3a9032ff1?w=1000&q=80",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1000&q=80",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&q=80",
        ],
        quantity: 1,
        activeTab: "desc",
        selectedSize: "medium",
        selectedColor: "grey",
        productName: "Ghế Sofa Cao Cấp Minimalist",
        categoryName: "Phòng Khách",
        brandName: "",
        rating: 5,
        reviewCount: 0,
        price: 899,
        oldPrice: 1050,
        shortDescription: NOT_UPDATED_TEXT,
        descriptionLines: [],
        specRows: [],
        shippingLines: [],
        relatedProducts: [],
        reviews: [],
        reviewFormRating: 5,
        reviewFormContent: "",
        isSubmittingReview: false,
        reviewNotice: "",
        isLoading: false,
        error: "",
    });

    const updateProductState = (partialState) => {
        setProductState((prev) => ({ ...prev, ...partialState }));
    };

    const handleQuantityChange = (type) => {
        if (type === "minus") {
            updateProductState({ quantity: Math.max(1, productState.quantity - 1) });
            return;
        }

        if (type === "plus") {
            updateProductState({ quantity: productState.quantity + 1 });
        }
    };

    const loadProductDetail = async () => {
        if (!id) return;

        try {
            updateProductState({ isLoading: true, error: "" });

            const detailResponse = await requestAPI({
                method: "GET",
                url: `/products/${id}`,
            });

            const detail = normalizeProductDetail(detailResponse?.data);

            const listResponse = await requestAPI({
                method: "GET",
                url: "/products/list",
            });

            const currentCategory = String(detail.category || "").trim().toLowerCase();
            const currentBrand = String(detail.brand || "").trim().toLowerCase();

            const relatedProducts = normalizeProductList(listResponse?.data)
                .filter((item) => String(item.id) !== String(detail.id))
                .filter((item) => {
                    const itemCategory = String(item.category || "").trim().toLowerCase();
                    const itemBrand = String(item.brand || "").trim().toLowerCase();

                    return (
                        (currentCategory && itemCategory === currentCategory) ||
                        (currentBrand && itemBrand === currentBrand)
                    );
                })
                .slice(0, 4);

            const reviews = normalizeReviews(detailResponse?.data);

            updateProductState({
                mainImage: detail.gallery[0],
                thumbnails: detail.gallery,
                productName: detail.name,
                categoryName: detail.category,
                brandName: detail.brand,
                rating: detail.rating,
                reviewCount: detail.reviewCount || reviews.length,
                price: detail.price,
                oldPrice: detail.oldPrice,
                shortDescription: detail.description,
                descriptionLines: detail.descriptionLines,
                specRows: detail.specRows,
                shippingLines: detail.shippingLines,
                relatedProducts,
                reviews,
            });
        } catch (error) {
            updateProductState({
                error: error?.message || "Không tải được chi tiết sản phẩm",
            });
        } finally {
            updateProductState({ isLoading: false });
        }
    };

    useEffect(() => {
        loadProductDetail();
    }, [id]);

    const onReviewRatingSelect = (value) => {
        updateProductState({ reviewFormRating: value });
    };

    const onReviewContentChange = (event) => {
        updateProductState({ reviewFormContent: event.target.value });
    };

    const submitReview = async () => {
        const ratingValue = Number(productState.reviewFormRating) || 0;
        const contentValue = String(productState.reviewFormContent || "").trim();

        if (ratingValue < 1 || ratingValue > 5) {
            updateProductState({ reviewNotice: "Vui lòng chọn số sao từ 1 đến 5." });
            return;
        }

        if (!contentValue) {
            updateProductState({ reviewNotice: "Vui lòng nhập nội dung đánh giá." });
            return;
        }

        try {
            updateProductState({ isSubmittingReview: true, reviewNotice: "" });

            await requestAPI({
                method: "POST",
                url: `/products/${id}/reviews`,
                data: {
                    rating: ratingValue,
                    content: contentValue,
                },
            });

            setProductState((prev) => {
                const baseCount = Number(prev.reviewCount) || prev.reviews.length || 0;
                const nextCount = baseCount + 1;
                const currentAvg = Number(prev.rating) || 0;
                const nextAvg = ((currentAvg * baseCount) + ratingValue) / nextCount;

                const newReview = {
                    id: `local-${Date.now()}`,
                    name: "Bạn",
                    avatar: "https://placehold.co/100x100?text=U",
                    rating: ratingValue,
                    date: new Date().toLocaleDateString("vi-VN"),
                    content: contentValue,
                    verified: false,
                };

                return {
                    ...prev,
                    reviews: [newReview, ...prev.reviews],
                    reviewCount: nextCount,
                    rating: Number(nextAvg.toFixed(1)),
                    reviewFormContent: "",
                    reviewFormRating: 5,
                    reviewNotice: "Đánh giá của bạn đã được gửi.",
                };
            });
        } catch (error) {
            updateProductState({
                reviewNotice: error?.message || "Gửi đánh giá thất bại. Vui lòng thử lại.",
            });
        } finally {
            updateProductState({ isSubmittingReview: false });
        }
    };

    const reviewItems = productState.reviews;
    const displayReviewCount = productState.reviewCount || reviewItems.length;

    return (
        <div>
            <main className="mt-20 max-w-7xl mx-auto px-6 py-10 md:px-12 w-full flex-grow">
                <nav className="flex text-sm text-textMuted mb-8 font-medium">
                    <Link to="/" className="hover:text-orange-500 transition">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <Link to="/shop" className="hover:text-orange-500 transition">Nội thất</Link>
                    <span className="mx-2">/</span>
                    <Link to="/shop" className="hover:text-orange-500 transition">{productState.categoryName}</Link>
                    <span className="mx-2">/</span>
                    <span className="text-primary">{productState.productName}</span>
                </nav>

                {productState.isLoading && (
                    <div className="mb-6 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-600">
                        Đang tải dữ liệu sản phẩm...
                    </div>
                )}

                {productState.error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {productState.error}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-20">
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        <div className="w-full h-[400px] md:h-[600px] bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
                            <img src={productState.mainImage} alt={productState.productName} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-zoom-in" />
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {productState.thumbnails.map((thumb, index) => (
                                <button
                                    key={index}
                                    onClick={() => updateProductState({ mainImage: thumb })}
                                    className={`w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 shrink-0 transition duration-300 ${productState.mainImage === thumb ? "border-orange-500 opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}
                                >
                                    <img src={thumb} alt={`Thumb ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider rounded-md w-max mb-4">Sản phẩm mới</span>
                        <h1 className="text-3xl md:text-5xl font-bold text-primary leading-tight mb-4 tracking-tight">{productState.productName}</h1>

                        {displayReviewCount > 0 && (
                            <div className="flex items-center gap-4 mb-6">
                                {formatStars(productState.rating)}
                                <span className="text-sm text-textMuted font-medium hover:text-orange-500 transition cursor-pointer underline-offset-4 decoration-gray-300 underline">({displayReviewCount} đánh giá)</span>
                            </div>
                        )}

                        <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-8 flex items-end tracking-tight">
                            {formatMoney(productState.price)}
                            {productState.oldPrice > 0 && (
                                <span className="text-lg text-textMuted font-medium line-through ml-3 mb-1">{formatMoney(productState.oldPrice)}</span>
                            )}
                        </div>

                        <p className="text-textMuted leading-relaxed mb-8 max-w-lg text-[15px]">
                            {productState.shortDescription}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-primary">Chọn Kích Thước</label>
                                <div className="relative">
                                    <select value={productState.selectedSize} onChange={(event) => updateProductState({ selectedSize: event.target.value })} className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition text-sm font-medium text-primary appearance-none cursor-pointer">
                                        <option value="small">Nhỏ (1.6m)</option>
                                        <option value="medium">Vừa (2.0m)</option>
                                        <option value="large">Lớn (2.4m) +150.000 đ</option>
                                    </select>
                                    <svg className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-primary">Chọn Màu Sắc</label>
                                <div className="relative">
                                    <select value={productState.selectedColor} onChange={(event) => updateProductState({ selectedColor: event.target.value })} className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition text-sm font-medium text-primary appearance-none cursor-pointer">
                                        <option value="cream">Trắng Kem</option>
                                        <option value="grey">Xám Khói</option>
                                        <option value="oak">Vàng Sồi</option>
                                        <option value="black">Đen Tuyền</option>
                                    </select>
                                    <svg className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-stretch sm:items-center">
                            <div className="flex items-center justify-between border-2 border-gray-100 rounded-xl px-4 py-3 w-32 bg-white shrink-0">
                                <button onClick={() => handleQuantityChange("minus")} className="text-gray-400 hover:text-orange-500 transition focus:outline-none"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4"></path></svg></button>
                                <input type="text" value={productState.quantity} className="w-10 text-center text-primary font-bold outline-none bg-transparent" readOnly />
                                <button onClick={() => handleQuantityChange("plus")} className="text-gray-400 hover:text-orange-500 transition focus:outline-none"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg></button>
                            </div>

                            <button className="flex-grow bg-orange-500 text-white py-4 rounded-xl font-bold text-base hover:bg-orange-600 transition duration-300 shadow-[0_8px_20px_rgb(249,115,22,0.25)] flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                Thêm vào giỏ hàng
                            </button>
                            <button className="w-14 h-14 border-2 border-gray-200 rounded-xl flex items-center justify-center text-textMuted hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition shrink-0 group">
                                <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            </button>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-textMuted font-medium border-t border-gray-100 pt-6">
                            <span className="flex items-center gap-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Còn hàng</span>
                            <span className="flex items-center gap-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> Giao hàng 2-4 ngày</span>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 md:p-12 mb-20">
                    <nav className="flex overflow-x-auto gap-8 border-b border-gray-100 mb-8 pb-4 scrollbar-hide">
                        <button
                            onClick={() => updateProductState({ activeTab: "desc" })}
                            className={`font-bold pb-4 px-2 whitespace-nowrap transition cursor-pointer border-b-2 ${productState.activeTab === "desc" ? "text-orange-500 border-orange-500" : "text-textMuted hover:text-primary border-transparent"}`}
                        >
                            Mô tả sản phẩm
                        </button>
                        <button
                            onClick={() => updateProductState({ activeTab: "specs" })}
                            className={`font-bold pb-4 px-2 whitespace-nowrap transition cursor-pointer border-b-2 ${productState.activeTab === "specs" ? "text-orange-500 border-orange-500" : "text-textMuted hover:text-primary border-transparent"}`}
                        >
                            Thông số kỹ thuật
                        </button>
                        <button
                            onClick={() => updateProductState({ activeTab: "shipping" })}
                            className={`font-bold pb-4 px-2 whitespace-nowrap transition cursor-pointer border-b-2 ${productState.activeTab === "shipping" ? "text-orange-500 border-orange-500" : "text-textMuted hover:text-primary border-transparent"}`}
                        >
                            Chính sách giao hàng
                        </button>
                    </nav>

                    <div className="tab-contents">
                        {productState.activeTab === "desc" && (
                            <div className="detail-content text-textMuted leading-relaxed space-y-4">
                                {productState.descriptionLines.length > 0 ? (
                                    productState.descriptionLines.map((line, index) => (
                                        <p key={index}>{line}</p>
                                    ))
                                ) : (
                                    <p>{NOT_UPDATED_TEXT}</p>
                                )}
                            </div>
                        )}

                        {productState.activeTab === "specs" && (
                            <div className="detail-content text-textMuted leading-relaxed">
                                {productState.specRows.length > 0 ? (
                                    <table className="w-full text-sm text-left border-collapse">
                                        <tbody>
                                            {productState.specRows.map((row, index) => (
                                                <tr key={`${row.label}-${index}`} className={index < productState.specRows.length - 1 ? "border-b border-gray-100" : ""}>
                                                    <td className="py-4 font-semibold text-primary w-1/3">{row.label}</td>
                                                    <td className="py-4">{row.value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>{NOT_UPDATED_TEXT}</p>
                                )}
                            </div>
                        )}

                        {productState.activeTab === "shipping" && (
                            <div className="detail-content text-textMuted leading-relaxed space-y-4">
                                {productState.shippingLines.length > 0 ? (
                                    <>
                                        <h4 className="text-primary font-bold text-lg mb-2">Vận chuyển và đổi trả</h4>
                                        <ul className="list-disc pl-5 space-y-2 mb-6">
                                            {productState.shippingLines.map((line, index) => (
                                                <li key={index}>{line}</li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <p>{NOT_UPDATED_TEXT}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-primary mb-10 text-center tracking-tight">Đánh giá</h2>
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 md:p-12 mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
                        <div className="lg:col-span-1">
                            <div className="flex items-end gap-4 mb-3">
                                <div className="text-5xl font-bold text-primary leading-none">{Number(productState.rating || 0).toFixed(1)}</div>
                                {formatStars(productState.rating)}
                            </div>
                            <p className="text-sm text-textMuted">{displayReviewCount} đánh giá</p>
                            <p className="text-sm text-textMuted mt-3 leading-relaxed">Đánh giá được hiển thị ngắn gọn để bạn xem nhanh chất lượng sản phẩm.</p>

                            <div className="mt-8 rounded-2xl border border-gray-100 bg-secondary/40 p-5">
                                <h3 className="text-lg font-bold text-primary mb-3 tracking-tight">Viết đánh giá</h3>
                                <div className="flex items-center gap-1 mb-4" id="writeStarRating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => onReviewRatingSelect(star)}
                                            className={`text-xl transition ${star <= productState.reviewFormRating ? "text-yellow-400" : "text-gray-300"}`}
                                        >
                                            <i className="bi bi-star-fill"></i>
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    placeholder="Chia sẻ cảm nhận của bạn..."
                                    rows="3"
                                    value={productState.reviewFormContent}
                                    onChange={onReviewContentChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-white transition text-sm resize-none"
                                ></textarea>
                                {productState.reviewNotice && (
                                    <p className="mt-3 text-sm text-textMuted">{productState.reviewNotice}</p>
                                )}
                                <button
                                    type="button"
                                    onClick={submitReview}
                                    className="mt-4 bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition duration-300 w-full"
                                    disabled={productState.isSubmittingReview}
                                >
                                    {productState.isSubmittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                                </button>
                            </div>
                        </div>

                        {reviewItems.length > 0 && (
                            <div className="lg:col-span-2 flex flex-col gap-4">
                                {reviewItems.slice(0, 3).map((review) => (
                                    <div key={review.id} className="rounded-2xl border border-gray-100 p-5">
                                        <div className="flex items-start gap-4">
                                            <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                                    <h4 className="font-bold text-primary text-base flex items-center gap-2 truncate">
                                                        {review.name}
                                                        {review.verified && (
                                                            <span className="bg-green-100 text-green-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                                Đã mua
                                                            </span>
                                                        )}
                                                    </h4>
                                                    <span className="text-xs text-gray-400">{review.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    {formatStars(review.rating)}
                                                </div>
                                                <p className="text-sm text-textMuted leading-relaxed">{review.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {productState.relatedProducts.length > 0 && (
                    <>
                        <h2 className="text-2xl font-bold text-primary mb-8 tracking-tight">Sản phẩm cùng danh mục hoặc thương hiệu</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                            {productState.relatedProducts.map((product, index) => (
                                <Link
                                    key={product.id || index}
                                    to={product.id ? `/product-detail/${product.id}` : "/product-detail"}
                                    className="bg-white rounded-[24px] p-5 shadow-sm hover:shadow-xl transition flex flex-col group border border-gray-100"
                                >
                                    <div className="h-56 bg-secondary rounded-2xl mb-4 overflow-hidden relative">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                    </div>
                                    <div className="text-sm text-textMuted mb-2 uppercase tracking-wide font-medium">{product.category || product.brand || "Sản phẩm"}</div>
                                    <div className="text-lg font-bold text-primary mb-2 line-clamp-1">{product.name}</div>
                                    <div className="flex items-center space-x-1 mb-4 text-xs">
                                        <span className="text-yellow-400">{formatStars(product.rating)}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div>
                                            <span className="text-xl font-bold text-primary">{formatMoney(product.price)}</span>
                                        </div>
                                        <button className="w-10 h-10 rounded-full bg-primary text-white flex justify-center items-center hover:bg-orange-500 transition -rotate-45 group-hover:rotate-0 duration-300">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
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
