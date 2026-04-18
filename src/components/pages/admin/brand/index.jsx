import React from "react";
import { Link } from "react-router-dom";
import Toast from "../../../ui/common/Toast";
import DeleteModal from "../../../ui/common/DeleteModal";
import requestAPI from "../../../../api";

const BrandManagement = () => {
    const [brands, setBrands] = React.useState([]);
    const [searchText, setSearchText] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState("");
    const [pendingDeleteId, setPendingDeleteId] = React.useState(null);
    const [isDeleting, setIsDeleting] = React.useState(false);
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

    const loadBrands = React.useCallback(async () => {
        try {
            setIsLoading(true);
            setError("");
            const response = await requestAPI({
                method: "GET",
                url: "/brands/list",
            });

            const payload = response?.data;
            const normalizedBrands = Array.isArray(payload?.data)
                ? payload.data
                : Array.isArray(payload)
                    ? payload
                    : [];

            setBrands(normalizedBrands);
        } catch (err) {
            setError(err.message || "Không thể tải danh sách thương hiệu");
            setBrands([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        loadBrands();
    }, [loadBrands]);

    const onDelete = async (id) => {
        try {
            setIsDeleting(true);
            await requestAPI({
                method: "DELETE",
                url: `/brands/${id}`,
            });
            setBrands((prev) => prev.filter((item) => item.id !== id));
            showToast("Xóa thương hiệu thành công");
            setPendingDeleteId(null);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Xóa thương hiệu thất bại";
            showToast(errorMsg, "error");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredBrands = brands.filter((item) => {
        const keyword = searchText.trim().toLowerCase();
        if (!keyword) return true;

        return (
            String(item.id).toLowerCase().includes(keyword) ||
            (item.name || "").toLowerCase().includes(keyword)
        );
    });

    return (
        <div className="space-y-6">
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />

            {/* Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
                        Quản lý thương hiệu
                    </h1>
                    <p className="text-sm text-gray-400 mt-1 font-medium">
                        Quản lý các đối tác cung cấp sản phẩm của bạn.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-64 pl-4 pr-10 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange shadow-soft outline-none transition-all"
                            placeholder="Tìm thương hiệu..."
                        />
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brandOrange transition-colors">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <Link
                        to="/admin/brands/create"
                        className="bg-brandOrange text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_8px_16px_rgba(249,115,22,0.2)] hover:bg-orange-600 transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Thêm thương hiệu
                    </Link>
                </div>
            </div>

            {/* Brand Table */}
            <div className="bg-white rounded-[24px] shadow-soft border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
                                <th className="p-5 pl-8">ID</th>
                                <th className="p-5">Tên thương hiệu</th>
                                <th className="p-5">Mô tả</th>
                                <th className="p-5">Ngày tạo</th>
                                <th className="p-5 pr-8 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-sm text-gray-500">
                                        Đang tải danh sách thương hiệu...
                                    </td>
                                </tr>
                            )}

                            {!isLoading && error && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-sm text-red-500">
                                        {error}
                                    </td>
                                </tr>
                            )}

                            {!isLoading && !error && filteredBrands.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-sm text-gray-500">
                                        Không có thương hiệu nào.
                                    </td>
                                </tr>
                            )}

                            {!isLoading && !error && filteredBrands.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="p-5 pl-8">
                                        <span className="text-xs font-bold text-gray-400">#{item.id}</span>
                                    </td>
                                    <td className="p-5">
                                        <span className="text-sm font-bold text-primary group-hover:text-brandOrange transition-colors">
                                            {item.name}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <p className="text-xs text-gray-500 max-w-sm truncate">
                                            {item.description || "Không có mô tả"}
                                        </p>
                                    </td>
                                    <td className="p-5">
                                        <span className="text-xs text-gray-400">
                                            {item.created_at ? new Date(item.created_at).toLocaleDateString("vi-VN") : "---"}
                                        </span>
                                    </td>
                                    <td className="p-5 pr-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/admin/brands/edit/${item.id}`}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-orange-50 hover:text-brandOrange transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => setPendingDeleteId(item.id)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
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
                title="Xác nhận xóa thương hiệu"
                message="Bạn có chắc chắn muốn xóa thương hiệu này không? Hành động này không thể hoàn tác."
                onConfirm={() => onDelete(pendingDeleteId)}
                onCancel={() => setPendingDeleteId(null)}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default BrandManagement;
