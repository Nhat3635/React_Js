import React from "react";
import { Link } from "react-router-dom";
import Toast from "../../../ui/common/Toast";
import requestAPI from "../../../../api";

const UserManagement = () => {
  const [users, setUsers] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [pendingDeleteId, setPendingDeleteId] = React.useState(null);
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

  const loadUsers = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await requestAPI({
        method: "GET",
        url: "/users/list",
      });

      const payload = response?.data;
      const normalizedUsers = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : [];

      setUsers(normalizedUsers);
    } catch (err) {
      setError(err.message || "Không thể tải danh sách người dùng");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const onDelete = async (id) => {
    try {
      await requestAPI({
        method: "DELETE",
        url: `/users/${id}`,
      });
      setUsers((prev) =>
        (Array.isArray(prev) ? prev : []).filter((item) => item.id !== id),
      );
      showToast("Xóa người dùng thành công");
    } catch (err) {
      showToast(err.message || "Xóa người dùng thất bại", "error");
    }
  };

  const requestDelete = (id) => setPendingDeleteId(id);
  const cancelDelete = () => setPendingDeleteId(null);

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    await onDelete(pendingDeleteId);
    setPendingDeleteId(null);
  };

  const filteredUsers = (Array.isArray(users) ? users : []).filter((item) => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return true;

    return (
      String(item.id).toLowerCase().includes(keyword) ||
      (item.full_name || "").toLowerCase().includes(keyword) ||
      (item.email || "").toLowerCase().includes(keyword) ||
      (item.username || "").toLowerCase().includes(keyword)
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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
            Quản lý tài khoản
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-medium">
            Danh sách nhân viên và khách hàng trong hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-64 pl-4 pr-10 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-brandOrange/20 focus:border-brandOrange shadow-soft outline-none transition-all"
              placeholder="Tìm tên, email, username..."
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brandOrange transition-colors">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-soft border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
                <th className="p-5 pl-8">ID</th>
                <th className="p-5">Người dùng</th>
                <th className="p-5">Email</th>
                <th className="p-5">Vai trò</th>
                <th className="p-5">Trạng thái</th>
                <th className="p-5">Ngày tạo</th>
                <th className="p-5 pr-8 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-12 text-center text-sm text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-brandOrange border-t-transparent rounded-full animate-spin"></div>
                      Đang tải danh sách người dùng...
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading && error && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-sm text-red-500 font-medium"
                  >
                    {error}
                  </td>
                </tr>
              )}

              {!isLoading && !error && filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-sm text-gray-400"
                  >
                    Không tìm thấy người dùng nào phù hợp.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !error &&
                filteredUsers.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/30 transition-colors group"
                  >
                    <td className="p-5 pl-8">
                      <span className="text-xs font-bold text-gray-400">
                        #{item.id}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-brandOrange flex items-center justify-center text-white font-bold shadow-sm">
                          {item.full_name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-primary group-hover:text-brandOrange transition-colors">
                            {item.full_name}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            @{item.username}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-sm text-gray-500">{item.email}</td>
                    <td className="p-5">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                          item.role === 1
                            ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                            : "bg-gray-50 text-gray-500 border-gray-100"
                        }`}
                      >
                        {item.role === 1 ? "Admin" : "Khách hàng"}
                      </span>
                    </td>
                    <td className="p-5">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                          item.status === 1
                            ? "bg-green-50 text-green-600 border-green-100"
                            : "bg-red-50 text-red-500 border-red-100"
                        }`}
                      >
                        {item.status === 1 ? "Hoạt động" : "Vô hiệu hóa"}
                      </span>
                    </td>
                    <td className="p-5 text-sm text-gray-400">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString("vi-VN")
                        : "---"}
                    </td>
                    <td className="p-5 pr-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/users/edit/${item.id}`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-orange-50 hover:text-brandOrange transition-all"
                        >
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
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
