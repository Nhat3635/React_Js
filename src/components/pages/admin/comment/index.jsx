import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import requestAPI from "../../../../api";
import Toast from "../../../ui/common/Toast";
import DeleteModal from "../../../ui/common/DeleteModal";

const CommentManagement = () => {
  const [comments, setComments] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [managerType, setManagerType] = useState("comment"); // comment, review
  const [activeTab, setActiveTab] = useState("all"); // all, pending, approved, hidden
  const [filters, setFilters] = useState({ productId: "", rating: "" });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [commentReplies, setCommentReplies] = useState({}); // {parentId: [replies]}
  const [replyForm, setReplyForm] = useState({ parentId: null, content: "" });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback((message, type = "success") => {
    setToast({ show: true, message, type });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      let statusParam = "";
      if (activeTab === "pending") statusParam = "0";
      if (activeTab === "approved") statusParam = "1";
      if (activeTab === "hidden") statusParam = "0"; // logic cho visible = 0

      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        productId: filters.productId,
        rating: filters.rating,
        status: statusParam,
        isVisible: activeTab === "hidden" ? "0" : (activeTab === "all" ? "" : "1")
      });

      const endpoint = managerType === "comment" ? "/comments/list" : "/reviews/list";
      const response = await requestAPI({
        method: "GET",
        url: `${endpoint}?${queryParams.toString()}`,
      });

      if (response?.data) {
        setComments(response.data.data || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination?.total || 0,
          total_pages: response.data.pagination?.total_pages || 0,
        }));
      }
    } catch (err) {
      showToast("Lỗi tải dữ liệu: " + err.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [managerType, activeTab, filters, pagination.page, pagination.limit, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Tải danh sách sản phẩm để lọc
    const fetchProducts = async () => {
      try {
        const res = await requestAPI({ method: "GET", url: "/products/list" });
        setProducts(res?.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const handleToggleStatus = async (id, field, value, parentId = null) => {
    try {
      const endpoint = managerType === "comment" ? `/comments/status/${id}` : `/reviews/status/${id}`;
      const data = managerType === "comment" ? { [field]: value } : { is_visible: value };
      
      await requestAPI({
        method: "PUT",
        url: endpoint,
        data: data,
      });

      // Cập nhật state local ngay lập tức
      if (parentId) {
        setCommentReplies(prev => ({
          ...prev,
          [parentId]: prev[parentId].map(r => r.id === id ? { ...r, [field]: value } : r)
        }));
      } else {
        setComments(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
      }

      showToast("Cập nhật trạng thái thành công");
    } catch (err) {
      showToast("Lỗi cập nhật: " + err.message, "error");
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;
    try {
      setIsProcessing(true);
      const data = {};
      if (action === "approve") data.is_approved = 1;
      if (action === "hide") data.id_visible = 0;
      if (action === "show") data.id_visible = 1;

      await requestAPI({
        method: "POST",
        url: "/comments/bulk-update",
        data: { ids: selectedIds, ...data },
      });
      showToast(`Đã xử lý ${selectedIds.length} mục`);
      setSelectedIds([]);
      fetchData();
    } catch (err) {
      showToast("Lỗi xử lý hàng loạt: " + err.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      setIsProcessing(true);
      await requestAPI({
        method: "DELETE",
        url: `/comments/delete/${pendingDeleteId}`,
      });
      showToast("Xóa bình luận thành công");
      
      // Cập nhật UI local
      setComments(prev => {
        let parentIdToUpdate = null;
        // Tìm parentId của reply bị xóa
        Object.keys(commentReplies).forEach(key => {
          if (commentReplies[key].some(r => r.id === pendingDeleteId)) {
            parentIdToUpdate = parseInt(key);
          }
        });

        return prev.filter(c => c.id !== pendingDeleteId).map(c => {
          if (c.id === parentIdToUpdate) {
            return { ...c, replies_count: Math.max(0, c.replies_count - 1) };
          }
          return c;
        });
      });

      setCommentReplies(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          const originalCount = next[key].length;
          next[key] = next[key].filter(r => r.id !== pendingDeleteId);
          
          // Nếu sau khi xóa mà danh sách trống, thì đóng hàng đó lại
          if (originalCount > 0 && next[key].length === 0) {
            setExpandedRows(prevExpanded => {
              const newExpanded = new Set(prevExpanded);
              newExpanded.delete(parseInt(key));
              return newExpanded;
            });
          }
        });
        return next;
      });

      setPendingDeleteId(null);
    } catch (err) {
      showToast("Lỗi khi xóa: " + err.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRow = async (parentId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(parentId)) {
      newExpanded.delete(parentId);
    } else {
      newExpanded.add(parentId);
      // Tải phản hồi nếu chưa có
      if (!commentReplies[parentId]) {
        try {
          const res = await requestAPI({ method: "GET", url: `/comments/replies/${parentId}` });
          setCommentReplies(prev => ({ ...prev, [parentId]: res?.data?.data || [] }));
        } catch (err) {
          showToast("Không thể tải phản hồi", "error");
        }
      }
    }
    setExpandedRows(newExpanded);
  };

  const handleReply = async (comment) => {
    if (!replyForm.content.trim()) return;
    try {
      setIsProcessing(true);
      await requestAPI({
        method: "POST",
        url: "/comments/reply",
        data: {
          product_id: comment.product_id,
          parent_id: comment.id,
          content: replyForm.content
        }
      });
      showToast("Đã gửi phản hồi");
      setReplyForm({ parentId: null, content: "" });
      
      // Tải lại replies cho cha này
      const res = await requestAPI({ method: "GET", url: `/comments/replies/${comment.id}` });
      setCommentReplies(prev => ({ ...prev, [comment.id]: res?.data?.data || [] }));
      
      // Đảm bảo hàng đang mở
      const newExpanded = new Set(expandedRows);
      newExpanded.add(comment.id);
      setExpandedRows(newExpanded);
      
      fetchData(); // Cập nhật số lượng đếm ở cha
    } catch (err) {
      showToast("Lỗi phản hồi: " + err.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === comments.length) setSelectedIds([]);
    else setSelectedIds(comments.map((c) => c.id));
  };

  return (
    <div className="space-y-6">
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      <DeleteModal
        isOpen={!!pendingDeleteId}
        title="Xóa bình luận"
        message="Bạn có chắc chắn muốn xóa bình luận này? Hành động không thể hoàn tác."
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
        isLoading={isProcessing}
      />

      <div className="flex flex-col gap-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-primary flex items-center gap-3">
              <span className="w-2 h-8 bg-brandOrange rounded-full"></span>
              Quản lý Phản hồi
            </h2>
            <p className="text-sm font-bold text-gray-400">
              {managerType === "comment" ? "Trao đổi & Hỏi đáp từ người dùng" : "Đánh giá chất lượng sản phẩm & Dịch vụ"}
            </p>
          </div>

          <div className="flex bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100">
            <button
              onClick={() => { setManagerType("comment"); setPagination(p => ({ ...p, page: 1 })); }}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${managerType === "comment" ? "bg-white text-brandOrange shadow-soft" : "text-gray-400 hover:text-primary"}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              Bình luận (Q&A)
            </button>
            <button
              onClick={() => { setManagerType("review"); setPagination(p => ({ ...p, page: 1 })); }}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${managerType === "review" ? "bg-white text-brandOrange shadow-soft" : "text-gray-400 hover:text-primary"}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-1.764 2.427-2.559 1.493l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.795.934-2.859-1.071-2.559-2.226l1.518-4.674a1 1 0 00-.363-1.118L2.98 10.1c-.783-.57-.381-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
              Đánh giá (Reviews)
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-8 shadow-soft border border-gray-50 flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-gray-50 pb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {[
                { id: "all", label: "Tất cả" },
                { id: "pending", label: "Chờ duyệt", hidden: managerType === "review" },
                { id: "approved", label: "Đã duyệt", hidden: managerType === "review" },
             
              ].filter(t => !t.hidden).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-brandOrange text-white shadow-lg shadow-orange-100" : "text-gray-400 hover:text-primary hover:bg-gray-50"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={filters.productId}
                onChange={(e) => setFilters({ ...filters, productId: e.target.value })}
                className="bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-xs font-bold text-primary focus:ring-2 focus:ring-brandOrange/20 outline-none cursor-pointer"
              >
                <option value="">Tất cả sản phẩm</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {managerType === "review" && (
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                  className="bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-xs font-bold text-primary focus:ring-2 focus:ring-brandOrange/20 outline-none cursor-pointer"
                >
                  <option value="">Tất cả sao</option>
                  {[5, 4, 3, 2, 1].map((s) => <option key={s} value={s}>{s} Sao</option>)}
                </select>
              )}
            </div>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between bg-orange-50/50 p-4 rounded-2xl border border-brandOrange/10">
              <span className="text-xs font-bold text-brandOrange">Đã chọn {selectedIds.length} mục</span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleBulkAction("approve")} className="px-4 py-2 bg-brandOrange text-white text-[10px] font-bold rounded-lg hover:bg-orange-600">Duyệt</button>
                <button onClick={() => handleBulkAction("hide")} className="px-4 py-2 bg-gray-600 text-white text-[10px] font-bold rounded-lg hover:bg-gray-700">Ẩn</button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-[10px] uppercase tracking-widest font-black">
                  <th className="p-5"><input type="checkbox" checked={selectedIds.length === comments.length && comments.length > 0} onChange={toggleSelectAll} className="rounded border-gray-300 text-brandOrange" /></th>
                  <th className="p-5">Sản phẩm / User</th>
                  <th className="p-5">Nội dung</th>
                  <th className="p-5">Trạng thái</th>
                  <th className="p-5">Ngày gửi</th>
                  <th className="p-5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                    {comments.length > 0 && comments.map((c) => (
                      <React.Fragment key={c.id}>
                        <tr className={`hover:bg-gray-50/50 transition-colors ${expandedRows.has(c.id) ? "bg-gray-50/30" : ""}`}>
                          <td className="p-5">
                            <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => toggleSelect(c.id)} className="rounded border-gray-300 text-brandOrange" />
                          </td>
                          <td className="p-5">
                            <div className="text-xs font-bold text-primary truncate max-w-[150px]">{c.product_name || "Sản phẩm #" + c.product_id}</div>
                            <div className="text-[10px] text-gray-400">{c.username || "Ẩn danh"}</div>
                          </td>
                          <td className="p-5 text-xs text-secondary-text max-w-xs">
                            <div className="space-y-1">
                              {managerType === "review" && (
                                <div className="flex items-center gap-0.5 mb-1 text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-3 h-3 ${i < c.rating ? "fill-yellow-400" : "fill-gray-200"}`} viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                  ))}
                                </div>
                              )}
                              <p className="line-clamp-2">{c.content || c.comment}</p>
                              {managerType === "comment" && c.replies_count > 0 && (
                                <button onClick={() => toggleRow(c.id)} className="text-[10px] font-bold text-brandOrange hover:underline mt-1 flex items-center gap-1">
                                  {expandedRows.has(c.id) ? "Đóng phản hồi" : `Xem ${c.replies_count} phản hồi`}
                                  <svg className={`w-3 h-3 transition-transform ${expandedRows.has(c.id) ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                              )}
                            </div>
                          </td>
                      <td className="p-5">
                        <div className="flex flex-col gap-2 min-w-[120px]">
                          {managerType === "comment" && (
                            <div className="flex items-center gap-3">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={c.is_approved === 1} onChange={() => handleToggleStatus(c.id, "is_approved", c.is_approved === 1 ? 0 : 1)} className="sr-only peer" />
                                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                              </label>
                              <span className={`text-[10px] font-black uppercase tracking-wider ${c.is_approved === 1 ? "text-emerald-500" : "text-gray-300"}`}>{c.is_approved === 1 ? "Đã duyệt" : "Chờ duyệt"}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" checked={(managerType === "comment" ? c.id_visible : c.is_visible) === 1} onChange={() => handleToggleStatus(c.id, managerType === "comment" ? "id_visible" : "is_visible", (managerType === "comment" ? c.id_visible : c.is_visible) === 1 ? 0 : 1)} className="sr-only peer" />
                              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                            </label>
                            <span className={`text-[10px] font-black uppercase tracking-wider ${(managerType === "comment" ? c.id_visible : c.is_visible) === 1 ? "text-blue-500" : "text-gray-300"}`}>{(managerType === "comment" ? c.id_visible : c.is_visible) === 1 ? "Hiển thị" : "Bị ẩn"}</span>
                          </div>
                        </div>
                      </td>
                          <td className="p-5 text-[10px] font-bold text-gray-400">{new Date(c.created_at).toLocaleDateString("vi-VN")}</td>
                          <td className="p-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {managerType === "comment" && (
                                <button
                                  onClick={() => setReplyForm(prev => ({ ...prev, parentId: prev.parentId === c.id ? null : c.id }))}
                                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${replyForm.parentId === c.id ? "bg-brandOrange text-white" : "bg-gray-100 text-gray-500 hover:bg-brandOrange hover:text-white"}`}
                                  title="Phản hồi"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                                </button>
                              )}
                              {managerType === "comment" ? (
                                <button onClick={() => setPendingDeleteId(c.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                              ) : (
                                <span className="text-[10px] font-bold text-gray-300 italic">Review cố định</span>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Reply Form Row */}
                        {replyForm.parentId === c.id && (
                          <tr className="bg-orange-50/30">
                            <td colSpan="6" className="p-5 pl-20">
                              <div className="flex flex-col gap-3 max-w-2xl animate-slide-up">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-brandOrange tracking-widest">
                                  <span className="w-1.5 h-1.5 rounded-full bg-brandOrange"></span>
                                  Phản hồi bình luận
                                </div>
                                <textarea
                                  value={replyForm.content}
                                  onChange={e => setReplyForm(prev => ({ ...prev, content: e.target.value }))}
                                  placeholder="Nhập nội dung phản hồi từ Admin..."
                                  className="w-full p-4 rounded-2xl border border-gray-100 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-brandOrange/5 focus:border-brandOrange transition-all resize-none"
                                  rows="2"
                                />
                                <div className="flex justify-end gap-3">
                                  <button onClick={() => setReplyForm({ parentId: null, content: "" })} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-primary">Hủy</button>
                                  <button
                                    onClick={() => handleReply(c)}
                                    disabled={!replyForm.content.trim() || isProcessing}
                                    className="px-6 py-2 bg-brandOrange text-white text-xs font-black rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-100 disabled:opacity-50 transition-all flex items-center gap-2"
                                  >
                                    {isProcessing ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : null}
                                    Gửi phản hồi
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* Expanded Replies Row */}
                        {expandedRows.has(c.id) && (
                          <tr className="bg-gray-50/20">
                            <td colSpan="6" className="p-0 border-b border-gray-50">
                              <div className="pl-24 pr-12 py-8 space-y-6 animate-slide-up">
                                {commentReplies[c.id]?.length === 0 ? (
                                  <p className="text-xs text-gray-400 font-bold italic">Chưa có phản hồi nào.</p>
                                ) : (
                                  <div className="space-y-6 border-l-2 border-gray-100 pl-8">
                                    {commentReplies[c.id]?.map(reply => (
                                      <div key={reply.id} className="flex flex-col gap-3 relative before:absolute before:w-6 before:h-[2px] before:bg-gray-100 before:-left-8 before:top-4">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-primary uppercase">
                                              {reply.user_name?.charAt(0) || "A"}
                                            </div>
                                            <div className="flex flex-col">
                                              <div className="flex items-center gap-2">
                                                <span className="text-xs font-black text-primary">{reply.user_name || "Admin"}</span>
                                                {reply.user_role === 1 && <span className="px-2 py-0.5 bg-blue-500 text-white text-[7px] font-black rounded-lg uppercase tracking-tighter">Admin</span>}
                                              </div>
                                              <span className="text-[9px] font-bold text-gray-400">{new Date(reply.created_at).toLocaleDateString("vi-VN")} {new Date(reply.created_at).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                          </div>
                                          
                                          <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-3">
                                              <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={reply.id_visible === 1} onChange={() => handleToggleStatus(reply.id, "id_visible", reply.id_visible === 1 ? 0 : 1, c.id)} className="sr-only peer" />
                                                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                                              </label>
                                              <span className={`text-[9px] font-black uppercase tracking-wider ${reply.id_visible === 1 ? "text-blue-500" : "text-gray-300"}`}>
                                                {reply.id_visible === 1 ? "Hiển thị" : "Bị ẩn"}
                                              </span>
                                            </div>
                                            <button onClick={() => setPendingDeleteId(reply.id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                          </div>
                                        </div>
                                        <div className="bg-white/50 p-4 rounded-2xl border border-gray-50 text-xs text-secondary-text leading-relaxed font-bold">
                                          {reply.content}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
              </tbody>
            </table>
          </div>

          {!isLoading && pagination.total_pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-50">
              {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => {
                    setPagination(prev => ({ ...prev, page: p }));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${pagination.page === p ? "bg-brandOrange text-white shadow-md shadow-orange-100" : "text-gray-400 hover:bg-gray-50 hover:text-primary"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentManagement;
