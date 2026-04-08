import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import requestAPI from "../../../../api";
import Toast from "../../../ui/common/Toast";

const BLOG_CATEGORIES = ["Tin công nghệ", "Hướng dẫn", "Khuyến mãi", "Mẹo nội thất"];

const CreateBlog = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [toast, setToast] = React.useState({ show: false, message: "", type: "success" });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      category: BLOG_CATEGORIES[0],
      is_published: "1",
      thumbnail: "",
      short_description: "",
      content: "",
      title: "",
    },
  });

  const showToast = React.useCallback((message, type = "success") => {
    setToast({ show: true, message, type });
  }, []);

  const closeToast = React.useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const onCreateBlog = async (data) => {
    try {
      setIsSubmitting(true);

      const contentWithSummary = `${data.content}<hr/><p><strong>Mo ta ngan:</strong> ${data.short_description}</p><p><strong>Danh muc:</strong> ${data.category}</p>`;

      await requestAPI({
        method: "POST",
        url: "/blogs/add",
        data: {
          title: data.title,
          content: contentWithSummary,
          featured_image: data.thumbnail,
          is_published: Number(data.is_published),
        },
      });

      showToast("Them bai viet thanh cong");
      setTimeout(() => navigate("/admin/blogs"), 500);
    } catch (err) {
      showToast(err.message || "Them bai viet that bai", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6 pb-20" id="createBlogForm" onSubmit={handleSubmit(onCreateBlog)}>
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={closeToast} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <div>
          <nav className="flex text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
            <Link to="/admin" className="hover:text-brandOrange transition">Admin</Link>
            <span className="mx-2 text-gray-300">/</span>
            <Link to="/admin/blogs" className="hover:text-brandOrange transition">Quản lý Blog</Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-primary font-bold">Thêm mới bài viết</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Tạo bài viết mới</h1>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate("/admin/blogs")} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-400 bg-white border border-gray-100 shadow-soft hover:bg-gray-50 transition">Hủy bỏ</button>
          <button disabled={isSubmitting} type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brandOrange hover:bg-orange-600 transition disabled:opacity-60">
            {isSubmitting ? "Dang luu..." : "Lưu bài viết"}
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
                <input
                  type="text"
                  placeholder="Nhập tiêu đề hấp dẫn..."
                  {...register("title", { required: "Tiêu đề không được để trống", minLength: { value: 8, message: "Tiêu đề phải ít nhất 8 ký tự" } })}
                  className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition"
                />
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
                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Ảnh đại diện (Thumbnail URL)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  {...register("thumbnail", { required: "Vui lòng nhập URL ảnh" })}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none"
                />
                {errors.thumbnail && <small className="text-red-500 text-sm">{errors.thumbnail.message}</small>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Mô tả ngắn</label>
                <textarea
                  rows="3"
                  placeholder="Tóm tắt bài viết..."
                  {...register("short_description", { required: "Vui lòng nhập mô tả ngắn" })}
                  className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none resize-none"
                ></textarea>
                {errors.short_description && <small className="text-red-500 text-sm">{errors.short_description.message}</small>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">Nội dung chi tiết</label>
                <div className="prose-editor border border-gray-100 rounded-xl overflow-hidden shadow-soft">
                  <CKEditor
                    editor={ClassicEditor}
                    data={watch("content") || ""}
                    onChange={(event, editor) => {
                      const value = editor.getData();
                      setValue("content", value, { shouldValidate: true });
                    }}
                  />
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
        </div>
      </div>
    </form>
  );
};

export default CreateBlog;
