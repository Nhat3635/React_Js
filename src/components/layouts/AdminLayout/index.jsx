import { Outlet } from "react-router-dom";
import AdminHeader from "../../ui/admin/header";
import AdminMenu from "../../ui/admin/menu";

const AdminLayout = () => {
    return (
        <div className="bg-secondary text-primary font-sans antialiased h-screen flex overflow-hidden w-full">
            {/* 1. Sidebar (Fixed Left) */}
            <AdminMenu />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                
                {/* Background decorative elements */}
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-orange-100/30 blur-[100px] pointer-events-none -z-10"></div>
                <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] rounded-full bg-blue-50/30 blur-[80px] pointer-events-none -z-10"></div>

                {/* 2. Top Header */}
                <AdminHeader />

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto space-y-8 pb-10">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;