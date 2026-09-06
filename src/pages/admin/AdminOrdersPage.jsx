import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { getAllOrders, updateOrderStatus } from '@/services/orderService';

const statusOptions = ['pending','processing','shipped','delivered','cancelled'];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchOrders = async () => {
    try { setLoading(true); const data = await getAllOrders(); const list = data?.data || data?.orders || data || []; setOrders(Array.isArray(list)? list:[]); }
    catch(err){ setError(err.message); } finally{ setLoading(false); }
  };
  useEffect(()=>{ fetchOrders(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try { setUpdatingId(orderId); await updateOrderStatus(orderId, newStatus); setOrders(prev => prev.map(o => ((o._id||o.id)===orderId? {...o, status:newStatus, orderStatus:newStatus}:o))); }
    catch(err){ alert(err.message); } finally{ setUpdatingId(null); }
  };

  const getStatusColor = (s) => {
    switch((s||'').toLowerCase()){
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filtered = orders.filter(o => {
    const matchesSearch =!search || String(o._id||o.id||'').toLowerCase().includes(search.toLowerCase()) || (o.customerName||o.shippingAddress?.name||'').toLowerCase().includes(search.toLowerCase());
    const matchesStatus =!filterStatus || (o.status||o.orderStatus||'pending').toLowerCase()===filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isMobileOpen={isMobileOpen} setMobileOpen={setIsMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3"><button onClick={()=>setIsMobileOpen(true)} className="lg:hidden w-9 h-9 flex items-center justify-center bg-gray-50 border rounded-full">☰</button><div><h1 className="text-xl font-bold">Orders</h1><p className="text-xs text-gray-500">{filtered.length} orders</p></div></div>
          <button onClick={fetchOrders} className="text-sm px-4 py-2 bg-white border rounded-full">↻ Refresh</button>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-2xl border p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="relative flex-1"><span className="absolute left-3.5 top-1/2 -translate-y-1/2">🔍</span><input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search Order ID, customer..." className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border rounded-full focus:ring-2 focus:ring-gray-900" /></div>
            <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="px-4 py-2.5 text-sm bg-gray-50 border rounded-full"><option value="">All Status</option>{statusOptions.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</select>
          </div>
          {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            {loading? <div className="p-6 space-y-4 animate-pulse">{[...Array(6)].map((_,i)=><div key={i} className="h-14 bg-gray-50 rounded-xl" />)}</div> : filtered.length===0? <div className="p-12 text-center"><p className="text-sm font-semibold">No orders found</p></div> :
              <div className="hidden lg:block overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b"><tr className="text-left"><th className="px-5 py-3.5 text-[11px] font-bold uppercase text-gray-500">Order ID</th><th className="px-5 py-3.5 text-[11px] font-bold uppercase text-gray-500">Customer</th><th className="px-5 py-3.5 text-[11px] font-bold uppercase text-gray-500">Date</th><th className="px-5 py-3.5 text-[11px] font-bold uppercase text-gray-500">Total</th><th className="px-5 py-3.5 text-[11px] font-bold uppercase text-gray-500">Payment</th><th className="px-5 py-3.5 text-[11px] font-bold uppercase text-gray-500">Status</th></tr></thead>
              <tbody className="divide-y divide-gray-50">{filtered.map(order => { const id=order._id||order.id; const status=order.status||order.orderStatus||'pending'; return <tr key={id} className="hover:bg-gray-50/50"><td className="px-5 py-4 text-sm font-mono">#{String(id).slice(-8).toUpperCase()}</td><td className="px-5 py-4"><p className="text-sm font-medium">{order.customerName||order.shippingAddress?.name||'Guest'}</p><p className="text-xs text-gray-500">{order.customerEmail||'-'}</p></td><td className="px-5 py-4 text-sm text-gray-600">{new Date(order.createdAt||Date.now()).toLocaleDateString()}</td><td className="px-5 py-4 text-sm font-bold">${(order.totalAmount||order.total||0).toFixed(2)}</td><td className="px-5 py-4"><span className={`text-[11px] px-2.5 py-1 rounded-full border font-medium uppercase ${order.paymentStatus==='paid'||order.isPaid? 'bg-green-50 text-green-700 border-green-200':'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>{order.paymentStatus||(order.isPaid? 'Paid':'Unpaid')}</span></td><td className="px-5 py-4"><select value={status.toLowerCase()} onChange={e=>handleStatusChange(id, e.target.value)} disabled={updatingId===id} className={`text-xs font-bold uppercase px-3 py-1.5 rounded-full border ${getStatusColor(status)}`} >{statusOptions.map(opt=><option key={opt} value={opt}>{opt}</option>)}</select></td></tr>; })}</tbody></table></div>
            }
          </div>
        </main>
      </div>
    </div>
  );
};
export default AdminOrdersPage;
