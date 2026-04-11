import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import requestAPI from "../../../../api";
import { uploadImageToServer } from "../../../../api/upload";
import Toast from "../../../ui/common/Toast";

const BLOG_CATEGORIES = ["Tin công nghệ", "Hướng dẫn", "Khuyến mãi", "Mẹo nội thất"];

const extractSummary = (html = "") => {
  const text = String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.slice(0, 180);
};

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [loadError, setLoadError] = React.useState("");
  const [comments, setComments] = React.useState([]);
  const [isLoadingComments, setIsLoadingComments] = React.useState(false);
  const [commentActionId, setCommentActionId] = React.useState(null);
  const [toast, setToast] = React.useState({ show: false, message: "", type: "success" });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      category: BLOG_CATEGORIES[0],
      short_description: "",
      thumbnail: "",
      content: "",
      is_published: "1",
    },
  });

  const showToast = React.useCallback((message, type = "success") => {
    setToast({ show: true, message, type });
  }, []);

  const closeToast = React.useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const onUploadThumbnail = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const imageUrl = await uploadImageToServer(file, "blogs");
      setValue("thumbnail", imageUrl, { shouldValidate: true });
      showToast("Tai anh thanh cong");
    } catch (err) {
      showToast(err.message || "Tai anh that bai", "error");
    } finally {
      setIsUploadingImage(false);
    }
  };

  React.useEffect(() => {
    const loadBlog = async () => {
      try {
        setIsLoading(true);
        setIsLoadingComments(true);
        setLoadError("");
        const [response, commentsResponse] = await Promise.all([
          requestAPI({ method: "GET", url: `/blogs/${id}` }),
          requestAPI({ method: "GET", url: `/blogs/${id}/comments/admin` }),
        ]);
        const blog = response?.data?.data || response?.data || null;
        const commentsPayload = commentsResponse?.data;
        const commentsData = Array.isArray(commentsPayload?.data) ? commentsPayload.data : Array.isArray(commentsPayload) ? commentsPayload : [];

        if (!blog) {
          throw new Error("Khong tim thay bai viet");
        }

        setComments(commentsData);

        reset({
          title: blog.title || "",
          category: BLOG_CATEGORIES[Number(blog.id) % BLOG_CATEGORIES.length],
          short_description: extractSummary(blog.content || ""),
          thumbnail: blog.featured_image || "",
          content: blog.content || "",
          is_published: String(Number(blog.is_published) === 1 ? 1 : 0),
        });
      } catch (err) {
        setLoadError(err.message || "Khong the tai chi tiet bai viet");
      } finally {
        setIsLoading(false);
        setIsLoadingComments(false);
      }
    };

    if (id) loadBlog();
  }, [id, reset]);

  const onModerateComment = async (commentId, action) => {
    try {
      setCommentActionId(commentId);
      await requestAPI({
        method: "PUT",
        url: `/blogs/comments/${commentId}/moderate`,
        data: { action },
      });

      setComments((prev) => prev.map((item) => {
        if (item.id !== commentId) return item;
        if (action === "approve") return { ...item, is_approved: 1, is_visible: 1 };
        if (action === "hide") return { ...item, is_visible: 0 };
        if (action === "show") return { ...item, is_approved: 1, is_visible: 1 };
        return item;
      }));

      showToast("Cập nhật trạng thái bình luận thành công");
    } catch (error) {
      showToast(error?.message || "Không thể cập nhật bình luận", "error");
    } finally {
      setCommentActionId(null);
    }
  };

  const onUpdateBlog = async (data) => {
    try {
      setIsSubmitting(true);

      const contentWithSummary = `${data.content}<hr/><p><strong>Mo ta ngan:</strong> ${data.short_description}</p><p><strong>Danh muc:</strong> ${data.category}</p>`;

      await requestAPI({
        method: "PUT",
        url: `/blogs/${id}`,
        data: {
          title: data.title,
          content: contentWithSummary,
          featured_image: data.thumbnail,
          is_published: Number(data.is_published),
        },
      });

      showToast("Cap nhat bai viet thanh cong");
      setTimeout(() => navigate("/admin/blogs"), 500);
    } catch (err) {
      showToast(err.message || "Cap nhat bai viet that bai", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-sm text-gray-500">Dang tai du lieu bai viet...</div>;
  }

  if (loadError) {
    return <div className="p-8 text-sm text-red-500">{loadError}</div>;
  }

  return (
    <form className="space-y-6 pb-20" id="editBlogForm" onSubmit={handleSubmit(onUpdateBlog)}>
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={closeToast} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <div>
          <nav className="flex text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
            <Link to="/admin" className="hover:text-brandOrange transition">Admin</Link>
            <span className="mx-2 text-gray-300">/</span>
            <Link to="/admin/blogs" className="hover:text-brandOrange transition">Quản lý Blog</Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-primary font-bold">Chỉnh sửa bài viết #{id}</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Cập nhật bài viết</h1>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate("/admin/blogs")} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-400 bg-white border border-gray-100 shadow-soft hover:bg-gray-50 transition">Hủy bỏ</button>
          <button disabled={isSubmitting || isUploadingImage} type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brandOrange hover:bg-orange-600 transition disabled:opacity-60">
            {isSubmitting ? "Dang cap nhat..." : "Cập nhật bài viết"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
            <h2 className="text-lg font-bold text-primary">Nội dung bài viết</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Tiêu đề bài viết</label>
                <input type="text" {...register("title", { required: "Tiêu đề không được để trống" })} className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none" />
                {errors.title && <small className="text-red-500 text-sm">{errors.title.message}</small>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Danh mục</label>
                  <select {...register("category")} className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none">
                    {BLOG_CATEGORIES.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Trạng thái xuất bản</label>
                  <select {...register("is_published")} className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none">
                    <option value="1">Hiển thị công khai</option>
                    <option value="0">Lưu nháp</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Ảnh đại diện</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onUploadThumbnail}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none text-sm"
                />
                <input type="hidden" {...register("thumbnail", { required: "Vui lòng tải ảnh" })} />
                {isUploadingImage && <small className="text-blue-500 text-sm">Dang upload anh...</small>}
                {errors.thumbnail && <small className="text-red-500 text-sm">{errors.thumbnail.message}</small>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Mô tả ngắn</label>
                <textarea rows="3" {...register("short_description", { required: "Vui lòng nhập mô tả ngắn" })} className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none resize-none"></textarea>
                {errors.short_description && <small className="text-red-500 text-sm">{errors.short_description.message}</small>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Nội dung chi tiết</label>
                <div className="prose-editor border border-gray-100 rounded-xl overflow-hidden shadow-soft">
                  <CKEditor editor={ClassicEditor} data={watch("content") || ""} onChange={(event, editor) => setValue("content", editor.getData(), { shouldValidate: true })} />
                  <input type="hidden" {...register("content", { required: "Nội dung bài viết không được để trống" })} />
                </div>
                {errors.content && <small className="text-red-500 text-sm">{errors.content.message}</small>}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50">
            <h2 className="text-lg font-bold text-primary">Xem trước ảnh</h2>
            <div className="mt-4 rounded-xl overflow-hidden border border-gray-100 bg-secondary/20 aspect-video">
              {watch("thumbnail") ? (
                <img src={watch("thumbnail")} alt="Thumbnail Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Chưa có ảnh</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50">
            <h2 className="text-lg font-bold text-primary">Quản lý bình luận</h2>
            <div className="mt-4 space-y-4 max-h-[520px] overflow-y-auto pr-1">
              {isLoadingComments ? (
                <p className="text-sm text-gray-500">Đang tải bình luận...</p>
              ) : comments.length === 0 ? (
                <p className="text-sm text-gray-500">Chưa có bình luận nào cho bài viết này.</p>
              ) : (
                comments.map((comment) => {
                  const approved = Number(comment.is_approved) === 1;
                  const visible = Number(comment.is_visible) === 1;

                  return (
                    <div key={comment.id} className="rounded-2xl border border-gray-100 p-4 bg-secondary/20">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="text-sm font-bold text-primary">{comment.author_name}</p>
                          <p className="text-xs text-gray-400">{comment.author_email || "Không có email"}</p>
                        </div>
                        <p className="text-[11px] text-gray-400">{new Date(comment.created_at || Date.now()).toLocaleDateString("vi-VN")}</p>
                      </div>

                      <p className="text-sm text-gray-700 whitespace-pre-line">{comment.content}</p>

                      <div className="flex items-center justify-between gap-3 mt-3">
                        <p className="text-xs font-semibold text-gray-500">
                          {approved ? (visible ? "Đã duyệt - Đang hiển thị" : "Đã duyệt - Đang ẩn") : "Chờ duyệt"}
                        </p>

                        <div className="flex items-center gap-2">
                          {!approved && (
                            <button
                              type="button"
                              disabled={commentActionId === comment.id}
                              onClick={() => onModerateComment(comment.id, "approve")}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-green-500 hover:bg-green-600 disabled:opacity-60"
                            >
                              Duyệt
                            </button>
                          )}

                          {approved && visible && (
                            <button
                              type="button"
                              disabled={commentActionId === comment.id}
                              onClick={() => onModerateComment(comment.id, "hide")}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-60"
                            >
                              Ẩn
                            </button>
                          )}

                          {approved && !visible && (
                            <button
                              type="button"
                              disabled={commentActionId === comment.id}
                              onClick={() => onModerateComment(comment.id, "show")}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-60"
                            >
                              Hiện
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditBlog;
