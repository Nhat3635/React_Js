import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const revenueChartRef = useRef(null);
    const categoryChartRef = useRef(null);
    const chartInstances = useRef({});

    useEffect(() => {
        const fetchAdminOrders = async () => {
            try {
                const token = localStorage.getItem('token'); 
                const response = await axios.get('http://localhost:3001/orders/admin/list', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                console.log("Dữ liệu nhận được:", response.data);

                const rawData = response.data.orders || response.data.data || response.data;
                const finalData = Array.isArray(rawData) ? rawData : [];
                
                setOrders(finalData);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi kết nối API:", error);
                setOrders([]); 
                setLoading(false);
            }
        };

        fetchAdminOrders();
    }, []);

    useEffect(() => {
        if (!Array.isArray(orders) || orders.length === 0 || loading) return;

        const sortedOrders = [...orders].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        const labels = sortedOrders.map(o => new Date(o.created_at).toLocaleDateString('vi-VN'));
        const dataRevenue = sortedOrders.map(o => parseFloat(o.total_amount || 0));

        const statusCounts = orders.reduce((acc, curr) => {
            const status = curr.order_status || 'Unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        if (chartInstances.current.revenue) chartInstances.current.revenue.destroy();
        if (chartInstances.current.status) chartInstances.current.status.destroy();

        const revCtx = revenueChartRef.current.getContext('2d');
        chartInstances.current.revenue = new Chart(revCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Doanh thu (VNĐ)',
                    data: dataRevenue,
                    borderColor: '#f97316',
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        const statusCtx = categoryChartRef.current.getContext('2d');
        chartInstances.current.status = new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: ['#f97316', '#fb923c', '#fdba74', '#fed7aa'],
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }, [orders, loading]);

    const totalRevenue = Array.isArray(orders) 
        ? orders.reduce((sum, item) => sum + parseFloat(item.total_amount || 0), 0) 
        : 0;

    if (loading) return <div className="p-10 text-center text-orange-600 font-bold">Đang tải dữ liệu từ SmartLiving Database...</div>;

    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-800">Báo cáo quản trị</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Tổng doanh thu</p>
                    <h3 className="text-2xl font-bold text-orange-600">{totalRevenue.toLocaleString()} ₫</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Tổng đơn hàng</p>
                    <h3 className="text-2xl font-bold text-blue-600">{orders.length} đơn</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Khách hàng</p>
                    <h3 className="text-2xl font-bold text-teal-600">
                        {[...new Set(orders.map(o => o.user_id))].length}
                    </h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="font-bold mb-4">Biến động doanh thu</h3>
                    <div className="h-80"><canvas ref={revenueChartRef}></canvas></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold mb-4">Trạng thái đơn hàng</h3>
                    <div className="h-80"><canvas ref={categoryChartRef}></canvas></div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;