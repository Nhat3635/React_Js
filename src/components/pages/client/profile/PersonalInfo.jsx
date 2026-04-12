import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import requestAPI from "../../../../api/index.jsx";

const PersonalInfo = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await requestAPI({ method: "GET", url: "/users/profile" });
                setUserData(res.data.data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div id="tabInfo" className="profile-content bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100 flex justify-center items-center py-16">
                <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div id="tabInfo" className="profile-content bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 px-1 gap-4">
                <h2 className="text-2xl font-bold text-primary">Thông tin cá nhân</h2>
                <Link to="/profile/edit" className="bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-2.5 rounded-full text-sm font-bold transition duration-300 shadow-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    Chỉnh sửa
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5 p-5 bg-secondary rounded-2xl">
                    <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">Họ và tên</span>
                    <span className="text-base font-semibold text-primary">{userData?.full_name || "Chưa cập nhật"}</span>
                </div>
                <div className="flex flex-col gap-1.5 p-5 bg-secondary rounded-2xl">
                    <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">Số điện thoại</span>
                    <span className="text-base font-semibold text-primary">{userData?.phone || "Chưa cập nhật"}</span>
                </div>
                <div className="flex flex-col gap-1.5 p-5 bg-secondary rounded-2xl">
                    <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">Địa chỉ Email</span>
                    <span className="text-base font-semibold text-primary">{userData?.email || "Chưa cập nhật"}</span>
                </div>
                <div className="flex flex-col gap-1.5 p-5 bg-secondary rounded-2xl">
                    <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">Địa chỉ</span>
                    <span className="text-base font-semibold text-primary">{userData?.address || "Chưa cập nhật"}</span>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfo;
