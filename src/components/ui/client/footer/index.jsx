 const Footer = () => {
    return (

        <footer className="bg-primary text-white pt-20 pb-10 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="md:col-span-1">
                    <div className="text-2xl font-bold mb-6">SmartLiving</div>
                        <p className="text-gray-400 leading-relaxed text-sm">Lợi thế khi lựa chọn SmartLiving là chúng tôi cam kết mang đến cho bạn dịch vụ thoải mái cùng tiện ích trọn vẹn nhất.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-6 uppercase tracking-wider text-sm text-accent">Dịch vụ</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition">Tiếp thị Email</a></li>
                            <li><a href="#" className="hover:text-white transition">Chiến dịch</a></li>
                            <li><a href="#" className="hover:text-white transition">Xây dựng thương hiệu</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-6 uppercase tracking-wider text-sm text-accent">Nội thất</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition">Giường</a></li>
                            <li><a href="#" className="hover:text-white transition">Ghế</a></li>
                            <li><a href="#" className="hover:text-white transition">Tất cả</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-6 uppercase tracking-wider text-sm text-accent">Kết nối với chúng tôi</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition flex items-center space-x-2"><span>Facebook</span></a></li>
                            <li><a href="#" className="hover:text-white transition flex items-center space-x-2"><span>Twitter</span></a></li>
                            <li><a href="#" className="hover:text-white transition flex items-center space-x-2"><span>Instagram</span></a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 border-t border-gray-800 pt-8">
                    <p>Bản quyền © 2026 thuộc về SmartLiving. Đã biểu lưu mọi quyền hạn.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition">Điều khoản & Điều kiện</a>
                        <a href="#" className="hover:text-white transition">Chính sách bảo mật</a>
                    </div>
                </div>
            </footer>
    );
};  
export default Footer;
