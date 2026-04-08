import React from "react";
import { Link } from "react-router-dom";
import requestAPI from "../../../../api";

const CATEGORIES = ["Tin công nghệ", "Hướng dẫn", "Khuyến mãi", "Mẹo nội thất"];
const PAGE_SIZE = 6;

const stripHtml = (html = "") => String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const BlogListing = () => {
  const [blogs, setBlogs] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("Tất cả");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await requestAPI({ method: "GET", url: "/blogs/list" });
        const payload = response?.data;
        const normalized = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
        setBlogs(normalized);
      } catch (error) {
        setBlogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const mappedBlogs = (Array.isArray(blogs) ? blogs : []).map((blog) => ({
    ...blog,
    category: CATEGORIES[Number(blog.id) % CATEGORIES.length],
    excerpt: stripHtml(blog.content).slice(0, 140),
  }));

  const filtered = mappedBlogs.filter((blog) => {
    const keyword = searchTerm.trim().toLowerCase();
    const matchesKeyword = !keyword || String(blog.title || "").toLowerCase().includes(keyword) || String(blog.excerpt || "").toLowerCase().includes(keyword);
    const matchesCategory = activeCategory === "Tất cả" || activeCategory === blog.category;
    return matchesKeyword && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedBlogs = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const latestPosts = mappedBlogs.slice(0, 5);

  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  return (
    <main className="bg-secondary min-h-screen">
      <section className="relative h-[360px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1920" alt="Blog Hero" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-secondary"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-semibold text-primary mb-6 tracking-tight">Tin tức & Blog</h1>
          <div className="relative max-w-xl mx-auto">
            <div className="flex items-center bg-white/80 backdrop-blur-md rounded-full shadow-soft border border-white/50 p-1.5">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="flex-grow bg-transparent px-6 py-2.5 text-primary focus:outline-none placeholder-gray-500"
              />
              <button className="bg-brandOrange text-white p-2.5 rounded-full hover:bg-orange-600 transition shadow-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-8">
          {isLoading ? (
            <div className="text-sm text-gray-500">Dang tai bai viet...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {paginatedBlogs.map((blog) => (
                <article key={blog.id} className="bg-white rounded-[2rem] overflow-hidden shadow-soft border border-gray-100 hover:shadow-xl transition-all duration-500 group flex flex-col h-full">
                  <Link to={`/blog-detail/${blog.slug || blog.id}`} className="block relative h-56 overflow-hidden">
                    <img src={blog.featured_image || "https://placehold.co/640x400?text=BLOG"} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-5 left-5"><span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-brandOrange uppercase tracking-wider">{blog.category}</span></div>
                  </Link>

                  <div className="p-6 flex flex-col flex-grow">
                    <Link to={`/blog-detail/${blog.slug || blog.id}`}>
                      <h2 className="text-xl font-semibold text-primary mb-3 group-hover:text-brandOrange transition-colors line-clamp-2">{blog.title}</h2>
                    </Link>
                    <p className="text-gray-500 mb-4 line-clamp-3 leading-relaxed">{blog.excerpt || "Noi dung dang cap nhat..."}</p>

                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs">
                      <span className="font-semibold text-primary">{blog.author_name || "Admin"}</span>
                      <Link to={`/blog-detail/${blog.slug || blog.id}`} className="font-bold text-brandOrange">Đọc thêm</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-12 flex items-center justify-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} className="px-4 py-2 rounded-full border border-gray-200 text-sm disabled:opacity-40">Trước</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-full text-sm font-semibold ${page === currentPage ? "bg-brandOrange text-white" : "bg-white border border-gray-100 text-primary"}`}>{page}</button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} className="px-4 py-2 rounded-full border border-gray-200 text-sm disabled:opacity-40">Sau</button>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft">
            <h3 className="text-lg font-bold text-primary mb-4">Danh mục bài viết</h3>
            <div className="space-y-2">
              <button onClick={() => setActiveCategory("Tất cả")} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${activeCategory === "Tất cả" ? "bg-brandOrange text-white" : "hover:bg-gray-50"}`}>Tất cả</button>
              {CATEGORIES.map((item) => (
                <button key={item} onClick={() => setActiveCategory(item)} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${activeCategory === item ? "bg-brandOrange text-white" : "hover:bg-gray-50"}`}>{item}</button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft">
            <h3 className="text-lg font-bold text-primary mb-4">Bài mới nhất</h3>
            <div className="space-y-3">
              {latestPosts.map((post) => (
                <Link key={post.id} to={`/blog-detail/${post.slug || post.id}`} className="block rounded-lg p-2 hover:bg-gray-50">
                  <p className="text-sm font-semibold text-primary line-clamp-2">{post.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{post.author_name || "Admin"}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default BlogListing;
