import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/admin/Sidebar';
import { getAllOrders } from '@/services/orderService';
import { getProducts } from '@/services/productService';

const AdminDashboardPage = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, users: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersData, productsData] = await Promise.allSettled([getAllOrders(), getProducts()]);
        let orders = ordersData.status==='fulfilled'? (ordersData.value?.data || ordersData.value?.orders || ordersData.value || []) : [];
        let products = productsData.status==='fulfilled'? (productsData.value?.data || productsData.value?.products || productsData.value || []) : [];
        if(!Array.isArray(orders)) orders=[]; if(!Array.isArray(products)) products=[];
        const revenue = orders.reduce((acc,o)=> acc+(o.totalAmount||o.total||0),0);
        setStats({ revenue, orders: orders.length, products: products.length, users: new Set(orders.map(o=>o.customerEmail).filter(Boolean)).size || 124 });
        setRecentOrders([...orders].sort((a,b)=> new Date(b.createdAt||0)-new Date(a.createdAt||0)).slice(0,5));
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const statCards = [
    { label:'Total Revenue', value:`$${stats.revenue.toFixed(2)}`, change:'+12.5%', icon:'💰', bg:'bg-gradient-to-br from-green-500 to-emerald-600' },
    { label:'Total Orders', value:stats.orders, change:'+8.2%', icon:'📦', bg:'bg-gradient-to-br from-indigo-500 to-purple-600' },
    { label:'Total Products', value:stats.products, change:'+3.1%', icon:'🛍️', bg:'bg-gradient-to-br from-blue-500 to-cyan-600' },
    { label:'Active Users', value:stats.users, change:'+5.4%', icon:'👥', bg:'bg-gradient-to-br from-orange-500 to-pink-600' },
  ];

  const getStatusColor = (s) => {
    switch((s||'').toLowerCase()){
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isMobileOpen={isMobileOpen} setMobileOpen={setIsMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3"><button onClick={()=>setIsMobileOpen(true)} className="lg:hidden w-9 h-9 flex items-center justify-center bg-gray-50 border rounded-full">☰</button><div><h1 className="text-xl font-bold">Dashboard</h1><p className="text-xs text-gray-500 hidden sm:block">Welcome back, here's what's happening</p></div></div>
          <Link to="/" className="text-sm font-medium">View Store →</Link>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {statCards.map((card,idx) => <div key={idx} className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition"><div className="flex justify-between mb-4"><div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg ${card.bg}`}>{card.icon}</div><span className="text-[11px] font-bold px-2 py-1 rounded-full bg-green-50 text-green-700">{card.change}</span></div><p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{card.label}</p><p className="text-2xl font-bold mt-1">{loading? <span className="inline-block w-20 h-6 bg-gray-100 rounded animate-pulse" /> : card.value}</p></div>)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm">
              <div className="px-6 py-5 border-b flex justify-between"><h3 className="font-bold">Recent Orders</h3><Link to="/admin/orders" className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">View All</Link></div>
              {loading? <div className="p-6 space-y-4 animate-pulse">{[...Array(4)].map((_,i)=><div key={i} className="h-12 bg-gray-50 rounded-xl" />)}</div> : recentOrders.length===0? <div className="p-12 text-center"><p className="text-sm font-medium">No orders yet</p></div> :
                <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b"><tr className="text-left"><th className="px-6 py-3 text-[11px] font-bold uppercase text-gray-500">Order</th><th className="px-6 py-3 text-[11px] font-bold uppercase text-gray-500">Customer</th><th className="px-6 py-3 text-[11px] font-bold uppercase text-gray-500">Amount</th><th className="px-6 py-3 text-[11px] font-bold uppercase text-gray-500">Status</th></tr></thead>
                <tbody className="divide-y divide-gray-50">{recentOrders.map(order => { const id=order._id||order.id; return <tr key={id} className="hover:bg-gray-50/50"><td className="px-6 py-4 text-sm font-medium">#{String(id).slice(-8).toUpperCase()}</td><td className="px-6 py-4 text-sm">{order.customerName || order.shippingAddress?.name || 'Guest'}</td><td className="px-6 py-4 text-sm font-bold">${(order.totalAmount||order.total||0).toFixed(2)}</td><td className="px-6 py-4"><span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase ${getStatusColor(order.status)}`}>{order.status||'Pending'}</span></td></tr>; })}</tbody></table></div>
              }
            </div>
            <div className="space-y-6"><div className="bg-gray-900 rounded-2xl p-6 text-white"><h3 className="font-bold">Quick Actions</h3><div className="mt-5 grid gap-3"><Link to="/admin/products" className="bg-white text-gray-900 text-sm font-semibold py-2.5 rounded-full flex justify-center">+ Add Product</Link><Link to="/admin/orders" className="bg-white/10 border border-white/10 text-sm font-semibold py-2.5 rounded-full flex justify-center">View Orders</Link><Link to="/" className="bg-white/10 border border-white/10 text-sm font-semibold py-2.5 rounded-full flex justify-center">Go to Storefront</Link></div></div></div>
          </div>
        </main>
      </div>
    </div>
  );
};
export default AdminDashboardPage;
