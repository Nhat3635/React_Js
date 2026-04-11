import React from "react";
import { Link } from "react-router-dom";
import requestAPI from "../../../../api";
import Toast from "../../../ui/common/Toast";
import DeleteModal from "../../../ui/common/DeleteModal";

const BLOG_CATEGORIES = ["Tin công nghệ", "Hướng dẫn", "Khuyến mãi", "Mẹo nội thất"];

const BlogManagement = () => {
  const [blogs, setBlogs] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("Tất cả danh mục");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [pendingDeleteId, setPendingDeleteId] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [toast, setToast] = React.useState({ show: false, message: "", type: "success" });

  const showToast = React.useCallback((message, type = "success") => {
    setToast({ show: true, message, type });
  }, []);

  const closeToast = React.useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const loadBlogs = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await requestAPI({ method: "GET", url: "/blogs/list" });
      const payload = response?.data;
      const normalized = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
      setBlogs(normalized);
    } catch (err) {
      setError(err.message || "Không thể tải danh sách bài viết");
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const onDelete = async (id) => {
    try {
      setIsDeleting(true);
      await requestAPI({ method: "DELETE", url: `/blogs/${id}` });
      setBlogs((prev) => (Array.isArray(prev) ? prev : []).filter((item) => item.id !== id));
      showToast("Xóa bài viết thành công");
      setPendingDeleteId(null);
    } catch (err) {
      showToast(err.message || "Xóa bài viết thất bại", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredBlogs = (Array.isArray(blogs) ? blogs : []).filter((blog) => {
    const keyword = searchText.trim().toLowerCase();
    const autoCategory = BLOG_CATEGORIES[Number(blog.id) % BLOG_CATEGORIES.length];

    const matchesKeyword = !keyword
      || String(blog.title || "").toLowerCase().includes(keyword)
      || String(blog.author_name || "").toLowerCase().includes(keyword)
      || String(blog.slug || "").toLowerCase().includes(keyword);

    const matchesCategory = selectedCategory === "Tất cả danh mục" || selectedCategory === autoCategory;
    return matchesKeyword && matchesCategory;
  });

  const formatDate = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("vi-VN");
  };

  const getStatusLabel = (published) => (Number(published) === 1 ? "Hiển thị" : "Nháp");

  return (
    <div className="space-y-6">
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={closeToast} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Quản lý Blog</h1>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="block w-64 pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange shadow-soft transition-all"
              placeholder="Tìm bài viết..."
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-gray-100 text-gray-500 text-sm rounded-xl focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange block p-2.5 shadow-soft transition-all outline-none"
          >
            <option>Tất cả danh mục</option>
            {BLOG_CATEGORIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <Link to="/admin/blogs/create" className="bg-brandOrange text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
            Thêm bài viết mới
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-soft border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-[0.1em] font-bold">
                <th className="p-5 pl-8">ID</th>
                <th className="p-5">Ảnh bìa</th>
                <th className="p-5">Tiêu đề</th>
                <th className="p-5 text-center">Tác giả</th>
                <th className="p-5 text-center">Ngày đăng</th>
                <th className="p-5 text-center">Trạng thái</th>
                <th className="p-5 pr-8 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-sm text-gray-500">Đang tải danh sách bài viết...</td>
                </tr>
              )}

              {!isLoading && error && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-sm text-red-500">{error}</td>
                </tr>
              )}

              {!isLoading && !error && filteredBlogs.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-sm text-gray-500">Không có bài viết nào.</td>
                </tr>
              )}

              {!isLoading && !error && filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50/30 transition-colors group text-sm">
                  <td className="p-5 pl-8"><span className="text-sm font-semibold text-gray-400 font-mono">#{blog.id}</span></td>
                  <td className="p-5">
                    <div className="w-20 h-14 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                      <img src={blog.featured_image || "https://placehold.co/220x140?text=BLOG"} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col max-w-md">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-primary group-hover:text-brandOrange transition-colors truncate">{blog.title}</span>
                        {Number(blog.comment_count) > 0 && (
                          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-500 shrink-0" title={`${Number(blog.comment_count)} bình luận`}></span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400 mt-1">{BLOG_CATEGORIES[Number(blog.id) % BLOG_CATEGORIES.length]}</span>
                      {Number(blog.comment_count) > 0 && (
                        <span className="text-[11px] text-red-500 mt-1 font-semibold">
                          {Number(blog.pending_comment_count) > 0
                            ? `${Number(blog.pending_comment_count)} bình luận chờ duyệt`
                            : `${Number(blog.comment_count)} bình luận`}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-5 text-center"><span className="font-semibold text-gray-600">{blog.author_name || "Admin"}</span></td>
                  <td className="p-5 text-center"><span className="text-gray-500 font-mono text-xs">{formatDate(blog.created_at)}</span></td>
                  <td className="p-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase border ${Number(blog.is_published) === 1 ? "bg-green-100/60 text-green-600 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                      {getStatusLabel(blog.is_published)}
                    </span>
                  </td>
                  <td className="p-5 pr-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/blogs/edit/${blog.id}`} className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-orange-50 hover:text-brandOrange transition-all" title="Sửa">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </Link>
                      <button onClick={() => setPendingDeleteId(blog.id)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all" title="Xóa">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteModal
        isOpen={!!pendingDeleteId}
        title="Xác nhận xóa bài viết"
        message="Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác."
        onConfirm={() => onDelete(pendingDeleteId)}
        onCancel={() => setPendingDeleteId(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default BlogManagement;
