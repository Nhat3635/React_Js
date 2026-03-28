# SmartLiving - Hệ thống Thương mại Điện tử Cao cấp

**SmartLiving** là một ứng dụng web thương mại điện tử hiện đại, được xây dựng bằng **ReactJS** và **Tailwind CSS**. Dự án tập trung vào trải nghiệm người dùng tối giản, sang trọng theo phong cách **"Quiet Luxury"** và tích hợp đầy đủ các tính năng của một hệ thống bán hàng chuyên nghiệp.

---

## 🚀 Tính năng chính

### 🛒 Dành cho Khách hàng (Client Side)
- **Trang chủ (Home):** Giao diện bắt mắt, hiển thị các sản phẩm mới nhất và nổi bật.
- **Cửa hàng (Shop):** Danh sách sản phẩm đa dạng với tính năng lọc và tìm kiếm.
- **Chi tiết sản phẩm:** Thông tin chi tiết, hình ảnh chất lượng cao và các sản phẩm liên quan.
- **Giỏ hàng & Thanh toán:** Quy trình đặt hàng tối ưu, quản lý giỏ hàng trực quan.
- **Tài khoản người dùng:** Đăng ký, đăng nhập, quản lý thông tin cá nhân và lịch sử mua hàng.
- **Trang thông tin:** Giới thiệu về thương hiệu (About) và Liên hệ (Contact).

### 🛠️ Quản trị viên (Admin Dashboard)
Hệ thống Admin được thiết kế với giao diện Dashboard hiện đại, hỗ trợ quản lý vận hành toàn diện:
- **Tổng quan:** Theo dõi doanh thu, số lượng đơn hàng qua biểu đồ trực quan.
- **Quản lý sản phẩm:** Thêm mới, cập nhật thông tin, hình ảnh và trạng thái kho hàng.
- **Quản lý danh mục:** Phân loại sản phẩm khoa học.
- **Quản lý đơn hàng:** Theo dõi và xử lý tiến độ đơn hàng từ khách hàng.
- **Quản lý người dùng:** Điều hành danh sách tài khoản và phân quyền.
- **Phương thức thanh toán:** Tùy chỉnh các cổng thanh toán hỗ trợ.
- **Báo cáo & Thống kê:** Xuất báo cáo doanh số định kỳ.

---

## 🛠️ Công nghệ sử dụng

- **Core:** ReactJS 19, React Router DOM v7.
- **Styling:**
  - **Tailwind CSS (v3.4):** Framework chính cho giao diện linh hoạt và hiện đại.
  - **Bootstrap 5:** Sử dụng cho một số thành phần UI cấu trúc.
- **Design:**
  - **Font:** Inter (từ Google Fonts).
  - **Aesthetics:** Minimalist, Glassmorphism, Quiet Luxury style.
- **Build Tool:** Create React App / Vite (react-scripts).

---

## 📂 Cấu trúc thư mục dự án

```text
src/
├── components/
│   ├── layouts/    # Chứa khung giao diện chung (Header, Footer, Sidebar)
│   │   ├── AdminLayout   # Giao diện dành cho trang quản trị
│   │   └── ClientLayout  # Giao diện dành cho người mua hàng
│   ├── pages/      # Chứa các trang chức năng chính của ứng dụng
│   │   ├── admin/        # Các module quản lý (Product, Order, User...)
│   │   └── client/       # Các trang dành cho người dùng (Home, Shop, Cart...)
│   └── ui/         # Các thành phần giao diện dùng chung (Button, Card, Input...)
├── App.jsx        # File cấu hình định tuyến (Routing) chính
├── index.css      # Cấu trúc Tailwind và định dạng CSS toàn cục
└── index.jsx      # Điểm bắt đầu (Entry point) của ứng dụng
```

---

## ⚙️ Hướng dẫn cài đặt

Để chạy dự án này trên môi trường local, hãy thực hiện các bước sau:

1. **Tải mã nguồn:**
   ```bash
   git clone [URL_REPOS_CUA_BAN]
   cd react_asm
   ```

2. **Cài đặt các gói phụ thuộc (Dependencies):**
   ```bash
   npm install
   ```

3. **Khởi chạy ứng dụng:**
   ```bash
   npm start
   ```
   Sau khi hoàn tất, trình duyệt sẽ tự động mở tại: `http://localhost:3000`

4. **Xây dựng bản sản xuất (Production Build):**
   ```bash
   npm run build
   ```

---

## 🎨 Thiết kế & Thương hiệu

Dự án sử dụng hệ thống Design System riêng biệt với:
- **Màu sắc chính:** 
  - `Primary`: `#1a1a1a` (Đen sang trọng)
  - `Brand Orange`: `#f97316` (Cam thương hiệu làm điểm nhấn)
- **Hiệu ứng:** Sử dụng `soft shadow` và `glassmorphism` để tạo cảm giác cao cấp và hiện đại.

---
*Dự án được thực hiện bởi sinh viên FPT Polytechnic.*
