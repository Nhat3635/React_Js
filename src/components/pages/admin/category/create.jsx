import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Toast from "../../../ui/common/Toast";
import requestAPI from "../../../../api";
import { uploadImageToServer } from "../../../../api/upload";

const CreateCategory = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: "1",
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [toast, setToast] = React.useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = React.useCallback((message, type = "success") => {
    setToast({ show: true, message, type });
  }, []);

  const closeToast = React.useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const onUploadCategoryImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const imageUrl = await uploadImageToServer(file, "categories");
      setValue("image", imageUrl, { shouldValidate: true });
      showToast("Tai anh thanh cong");
    } catch (err) {
      showToast(err.message || "Tai anh that bai", "error");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const onCreateCategory = async (data) => {
    try {
      setIsSubmitting(true);
      await requestAPI({
        method: "POST",
        url: "/categories/add",
        data: {
          name: data.name,
          description: data.description,
          status: Number(data.status),
          parent_id: null,
          product_count: 0,
          image: data.image,
        }
      });
      showToast("Them danh muc thanh cong");
      setTimeout(() => navigate("/admin/categories"), 500);
    } catch (err) {
      showToast(err.message || "Them danh muc that bai", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />
      <form
        className="space-y-6 pb-20"
        id="createCategoryForm"
        onSubmit={handleSubmit(onCreateCategory)}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <nav className="flex text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
              <Link to="/admin" className="hover:text-brandOrange transition">
                Admin
              </Link>
              <span className="mx-2 text-gray-300">/</span>
              <Link
                to="/admin/categories"
                className="hover:text-brandOrange transition"
              >
                Danh mục
              </Link>
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-primary font-bold">Thêm mới</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
              Tạo danh mục mới
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/categories")}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-white border border-gray-100 shadow-soft hover:bg-gray-50 transition"
            >
              Hủy bỏ
            </button>
            <button
              disabled={isSubmitting || isUploadingImage}
              type="submit"
              form="createCategoryForm"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brandOrange shadow-[0_8px_16px_rgba(249,115,22,0.2)] hover:bg-orange-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Dang luu..." : "Lưu danh mục"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                <span className="w-1.5 h-6 bg-brandOrange rounded-full"></span>
                Thông tin danh mục
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">
                    Tên danh mục
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tên"
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-medium"
                    {...register("name", {
                      required: {
                        value: true,
                        message: "Tên danh mục không được để trống",
                      },
                      minLength: {
                        value: 2,
                        message: "Tên danh mục phải có ít nhất 2 ký tự",
                      },
                    })}
                  />
                  {errors.name && (
                    <small className="text-red-500 text-sm">
                      {errors.name.message}
                    </small>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-wider pl-1">
                    Mô tả tóm tắt
                  </label>
                  <div className="prose-editor border border-gray-100 rounded-xl overflow-hidden shadow-soft">
                    <CKEditor
                      editor={ClassicEditor}
                      data=""
                      onReady={(editor) => {
                        console.log("Editor is ready to use!", editor);
                      }}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setValue("description", data, { shouldValidate: true });
                      }}
                    />
                    {/* Register description to be tracked by react-hook-form */}
                    <input
                      type="hidden"
                      {...register("description", {
                        required: "Mô tả tóm tắt không được để trống",
                      })}
                    />
                  </div>
                  {errors.description && (
                    <small className="text-red-500 text-sm">
                      {errors.description.message}
                    </small>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-6">
              <h2 className="text-lg font-bold text-primary">Hình đại diện</h2>
              <input
                type="file"
                accept="image/*"
                onChange={onUploadCategoryImage}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-secondary/30 focus:bg-white focus:outline-none text-sm"
              />
              <input type="hidden" {...register("image", { required: "Vui lòng tải ảnh" })} />
              {isUploadingImage && <small className="text-blue-500 text-sm">Dang upload anh...</small>}
              {errors.image && <small className="text-red-500 text-sm">{errors.image.message}</small>}
            </div>
            <div className="bg-white rounded-[24px] p-8 shadow-soft border border-gray-50 space-y-4">
              <h2 className="text-lg font-bold text-primary">
                Trạng thái h.động
              </h2>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange transition text-sm font-medium outline-none"
                {...register("status", {
                  required: {
                    value: true,
                    message: "Vui lòng chọn trạng thái",
                  },
                })}
              >
                <option value="1">Hoạt động</option>
                <option value="0">Tạm ngưng</option>
              </select>
              {errors.status && (
                <small className="text-red-500 text-sm">
                  {errors.status.message}
                </small>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateCategory;
