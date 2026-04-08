import React from "react";
import { Link, useParams } from "react-router-dom";
import requestAPI from "../../../../api";
import Toast from "../../../ui/common/Toast";

const CATEGORIES = ["Tin công nghệ", "Hướng dẫn", "Khuyến mãi", "Mẹo nội thất"];

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = React.useState(null);
  const [latestPosts, setLatestPosts] = React.useState([]);
  const [comments, setComments] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [commentForm, setCommentForm] = React.useState({ author_name: "", author_email: "", content: "" });
  const [isSubmittingComment, setIsSubmittingComment] = React.useState(false);
  const [toast, setToast] = React.useState({ show: false, message: "", type: "success" });

  const showToast = React.useCallback((message, type = "success") => {
    setToast({ show: true, message, type });
  }, []);

  const closeToast = React.useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const [detailResponse, listResponse, commentsResponse] = await Promise.all([
          requestAPI({ method: "GET", url: `/blogs/${id}` }),
          requestAPI({ method: "GET", url: "/blogs/list" }),
          requestAPI({ method: "GET", url: `/blogs/${id}/comments` }),
        ]);

        const detailData = detailResponse?.data?.data || detailResponse?.data || null;
        const listPayload = listResponse?.data;
        const listData = Array.isArray(listPayload?.data) ? listPayload.data : Array.isArray(listPayload) ? listPayload : [];
        const commentsPayload = commentsResponse?.data;
        const commentsData = Array.isArray(commentsPayload?.data) ? commentsPayload.data : Array.isArray(commentsPayload) ? commentsPayload : [];

        setBlog(detailData);
        setLatestPosts(listData.filter((item) => String(item.id) !== String(detailData?.id)).slice(0, 5));
        setComments(commentsData);
      } catch (error) {
        setBlog(null);
        setLatestPosts([]);
        setComments([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) loadData();
  }, [id]);

  const onChangeCommentField = (event) => {
    const { name, value } = event.target;
    setCommentForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitComment = async (event) => {
    event.preventDefault();
    if (!commentForm.author_name.trim() || !commentForm.content.trim()) {
      showToast("Vui lòng nhập tên và nội dung bình luận", "error");
      return;
    }

    try {
      setIsSubmittingComment(true);
      await requestAPI({
        method: "POST",
        url: `/blogs/${id}/comments`,
        data: {
          author_name: commentForm.author_name.trim(),
          author_email: commentForm.author_email.trim(),
          content: commentForm.content.trim(),
        },
      });

      setCommentForm({ author_name: "", author_email: "", content: "" });
      showToast("Bình luận đã gửi và đang chờ admin duyệt");
    } catch (error) {
      showToast(error?.message || "Gửi bình luận thất bại", "error");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const categoryLabel = CATEGORIES[Number(blog?.id || 0) % CATEGORIES.length];

  if (isLoading) {
    return <main className="min-h-screen bg-secondary p-8 text-sm text-gray-500">Dang tai bai viet...</main>;
  }

  if (!blog) {
    return <main className="min-h-screen bg-secondary p-8 text-sm text-red-500">Khong tim thay bai viet</main>;
  }

  return (
    <main className="bg-secondary min-h-screen">
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={closeToast} />

      <div className="w-full h-[460px] relative overflow-hidden">
        <img src={blog.featured_image || "https://placehold.co/1400x700?text=BLOG"} alt={blog.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-6xl px-6 text-white">
          <span className="bg-brandOrange px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">{categoryLabel}</span>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight max-w-4xl">{blog.title}</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-4 gap-10">
        <article className="lg:col-span-3 bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-gray-100 mb-8">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Tác giả</p>
              <p className="text-primary font-semibold">{blog.author_name || "Admin"}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Ngày đăng</p>
              <p className="text-primary font-semibold">{new Date(blog.created_at || Date.now()).toLocaleDateString("vi-VN")}</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none prose-img:rounded-2xl prose-video:rounded-2xl" dangerouslySetInnerHTML={{ __html: blog.content || "<p>Chua co noi dung</p>" }} />

          <section className="mt-10 pt-8 border-t border-gray-100">
            <h3 className="text-xl font-bold text-primary mb-4">Bình luận</h3>

            <form onSubmit={onSubmitComment} className="space-y-4 bg-secondary/40 rounded-2xl p-5 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="author_name"
                  value={commentForm.author_name}
                  onChange={onChangeCommentField}
                  placeholder="Tên của bạn *"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none"
                />
                <input
                  type="email"
                  name="author_email"
                  value={commentForm.author_email}
                  onChange={onChangeCommentField}
                  placeholder="Email (không bắt buộc)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none"
                />
              </div>
              <textarea
                rows="4"
                name="content"
                value={commentForm.content}
                onChange={onChangeCommentField}
                placeholder="Nhập bình luận của bạn *"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none resize-none"
              />
              <button
                type="submit"
                disabled={isSubmittingComment}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-brandOrange hover:opacity-90 disabled:opacity-60"
              >
                {isSubmittingComment ? "Đang gửi..." : "Gửi bình luận"}
              </button>
            </form>

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-sm text-gray-500">Chưa có bình luận nào được duyệt.</p>
              ) : (
                comments.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-gray-100 p-4 bg-white">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="font-semibold text-primary">{item.author_name}</p>
                      <p className="text-xs text-gray-400">{new Date(item.created_at || Date.now()).toLocaleDateString("vi-VN")}</p>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{item.content}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </article>

        <aside className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft">
            <h3 className="text-lg font-bold text-primary mb-4">Danh mục</h3>
            <div className="space-y-2">
              {CATEGORIES.map((item) => (
                <Link key={item} to="/blog" className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">{item}</Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft">
            <h3 className="text-lg font-bold text-primary mb-4">Bài mới nhất</h3>
            <div className="space-y-3">
              {latestPosts.map((post) => (
                <Link key={post.id} to={`/blog-detail/${post.slug || post.id}`} className="block rounded-lg p-2 hover:bg-gray-50">
                  <p className="text-sm font-semibold text-primary line-clamp-2">{post.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(post.created_at || Date.now()).toLocaleDateString("vi-VN")}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default BlogDetail;
