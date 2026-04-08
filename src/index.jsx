import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Provider chứa hook context */}
    {/* LÀ store lưu trữ  dữ liệu của router*/}
    {/* tất cả thành phần con bên trong đều truy cập đưuọc */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
