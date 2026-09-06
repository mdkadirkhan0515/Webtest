import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import ProductTable from '@/components/admin/ProductTable';
import AddProductModal from '@/components/admin/AddProductModal';
import { getProducts } from '@/services/productService';
import apiClient from '@/services/apiClient';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try { setLoading(true); const data = await getProducts(); const list = data?.data || data?.products || data || []; setProducts(Array.isArray(list)? list:[]); }
    catch (err){ setError(err.message); } finally{ setLoading(false); }
  };
  useEffect(() => { fetchProducts(); }, []);

  const handleAddNew = () => { setEditingProduct(null); setIsModalOpen(true); };
  const handleEdit = (product) => { setEditingProduct(product); setIsModalOpen(true); };
  const handleDelete = async (id) => { if(!window.confirm('Delete this product?')) return; try{ await apiClient.delete(`/products/${id}`); setProducts(prev => prev.filter(p => (p._id||p.id)!==id)); } catch(err){ alert(err.response?.data?.message || 'Delete failed'); } };
  const handleSubmit = async (payload) => {
    try{ setSubmitLoading(true);
      if(editingProduct){ const id=editingProduct._id||editingProduct.id; const res=await apiClient.put(`/products/${id}`, payload); const updated=res.data?.data||res.data; setProducts(prev=>prev.map(p=>((p._id||p.id)===id? {...p,...updated,...payload}:p))); }
      else{ const res=await apiClient.post('/products', payload); const created=res.data?.data||res.data; setProducts(prev=>[{...payload,_id:Date.now().toString(),...created},...prev]); fetchProducts(); }
      setIsModalOpen(false); setEditingProduct(null);
    } catch(err){ alert(err.response?.data?.message||'Save failed'); } finally{ setSubmitLoading(false); }
  };

  const filtered = products.filter(p =>!search || (p.title||p.name||'').toLowerCase().includes(search.toLowerCase()) || (p.category||'').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isMobileOpen={isMobileOpen} setMobileOpen={setIsMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3"><button onClick={() => setIsMobileOpen(true)} className="lg:hidden w-9 h-9 flex items-center justify-center bg-gray-50 border rounded-full">☰</button><div><h1 className="text-xl font-bold tracking-tight">Products</h1><p className="text-xs text-gray-500 hidden sm:block">Manage your store products</p></div></div>
          <button onClick={handleAddNew} className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg">+ Add Product</button>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6"><div className="bg-white border rounded-full px-4 py-2 flex items-center gap-2 shadow-sm text-sm font-medium">{filtered.length} Products</div><div className="relative w-full sm:w-80"><input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-full focus:ring-2 focus:ring-gray-900" /><span className="absolute left-3.5 top-1/2 -translate-y-1/2">🔍</span></div></div>
          <ProductTable products={filtered} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
        </main>
      </div>
      <AddProductModal isOpen={isModalOpen} onClose={()=>{setIsModalOpen(false); setEditingProduct(null);}} onSubmit={handleSubmit} initialData={editingProduct} loading={submitLoading} />
    </div>
  );
};
export default AdminProductsPage;
