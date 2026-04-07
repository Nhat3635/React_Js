import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Layouts
import ClientLayout from './components/layouts/ClientLayout';

// Pages Client
import Home from './components/pages/client/home';
import Shop from './components/pages/client/shop';
import About from './components/pages/client/about';
import Contact from './components/pages/client/contact';
import Cart from './components/pages/client/cart';
import Profile from './components/pages/client/profile';
import Checkout from './components/pages/client/checkout';
import Login from './components/pages/client/login';
import Register from './components/pages/client/register';
import ProductDetail from './components/pages/client/product-detail';
import Blog from './components/pages/client/blog';
import BlogDetail from './components/pages/client/blog-detail';

// Layouts
import AdminLayout from './components/layouts/AdminLayout';

// Pages Admin
import Dashboard from './components/pages/admin/dashboard';
import ProductManagement from './components/pages/admin/product';
import CreateProduct from './components/pages/admin/product/create';
import EditProduct from './components/pages/admin/product/edit';
import CategoryManagement from './components/pages/admin/category';
import CreateCategory from './components/pages/admin/category/create';
import EditCategory from './components/pages/admin/category/edit';
import OrderManagement from './components/pages/admin/order';
import OrderDetail from './components/pages/admin/order/detail';
import PaymentManagement from './components/pages/admin/payment-method';
import UserManagement from './components/pages/admin/user';
import EditUser from './components/pages/admin/user/edit';
import SalesReport from './components/pages/admin/report';
import AdminSettings from './components/pages/admin/settings';
import BlogManagement from './components/pages/admin/blog';
import CreateBlog from './components/pages/admin/blog/create';
import EditBlog from './components/pages/admin/blog/edit';

function App() {
  return (
    <div className="bg-secondary text-primary font-sans antialiased overflow-x-hidden min-h-screen flex flex-col relative w-full">
      <Routes>
        {/* Nhóm giao diện của Client (Có Header) */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          <Route path="profile" element={<Profile />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="product-detail" element={<ProductDetail />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog-detail/:id" element={<BlogDetail />} />
        </Route>

        {/* Nhóm giao diện của Admin (Có Header) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="products/edit" element={<EditProduct />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="categories/create" element={<CreateCategory />} />
          <Route path="categories/edit" element={<EditCategory />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="orders/detail" element={<OrderDetail />} />
          <Route path="payment-methods" element={<PaymentManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="users/edit" element={<EditUser />} />
          <Route path="reports" element={<SalesReport />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="blogs" element={<BlogManagement />} />
          <Route path="blogs/create" element={<CreateBlog />} />
          <Route path="blogs/edit/:id" element={<EditBlog />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
