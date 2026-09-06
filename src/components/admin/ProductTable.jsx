import React from 'react';
const FALLBACK_IMAGE = '/placeholder.png';

const ProductTable = ({ products = [], onEdit, onDelete, loading = false }) => {
  if (loading) {
    return <div className="bg-white rounded-2xl border overflow-hidden"><div className="animate-pulse"><div className="h-12 bg-gray-50 border-b" />{[...Array(5)].map((_, i) => <div key={i} className="flex gap-4 p-4 border-b"><div className="w-12 h-12 bg-gray-100 rounded-lg" /><div className="flex-1 space-y-2"><div className="h-4 bg-gray-100 rounded w-1/3" /><div className="h-3 bg-gray-100 rounded w-1/4" /></div></div>)}</div></div>;
  }
  if (!products.length) {
    return <div className="bg-white rounded-2xl border p-12 text-center"><div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">📦</div><h3 className="text-sm font-semibold">No products found</h3><p className="text-xs text-gray-500 mt-1">Add your first product</p></div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead><tr className="bg-gray-50 border-b text-left"><th className="px-5 py-3.5 text-[11px] font-bold uppercase text-gray-500">Product</th><th className="px-5 py-3.5 text-[11px] font-bold uppercase text-gray-500">Category</th><th className="px-5 py-3.5 text-[11px] font-bold uppercase text-gray-500">Price</th><th className="px-5 py-3.5 text-[11px] font-bold uppercase text-gray-500">Stock</th><th className="px-5 py-3.5 text-[11px] font-bold uppercase text-gray-500 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-50">
            {products.map(p => {
              const id = p._id || p.id;
              const inStock = p.stock === undefined? true : p.stock > 0;
              return <tr key={id} className="hover:bg-gray-50/50"><td className="px-5 py-4"><div className="flex items-center gap-3"><img src={p.image || p.images?.[0] || FALLBACK_IMAGE} alt={p.title} className="w-12 h-12 rounded-xl object-cover border bg-gray-50" /><div><p className="text-sm font-semibold truncate max-w-[200px]">{p.title || p.name}</p><p className="text-[11px] text-gray-500">ID: {String(id).slice(-8)}</p></div></div></td><td className="px-5 py-4"><span className="bg-gray-100 text-gray-700 text-[11px] px-2.5 py-1 rounded-full capitalize">{p.category}</span></td><td className="px-5 py-4"><p className="text-sm font-bold">${(p.discountPrice || p.price || 0).toFixed(2)}</p></td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${inStock? 'bg-green-50 text-green-700':'bg-red-50 text-red-700'}`}>{inStock? `${p.stock?? '∞'} in stock`:'Out of stock'}</span></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => onEdit(p)} className="w-8 h-8 flex items-center justify-center bg-white border rounded-full hover:bg-gray-900 hover:text-white">✎</button><button onClick={() => onDelete(id)} className="w-8 h-8 flex items-center justify-center bg-white border rounded-full hover:bg-red-500 hover:text-white">🗑</button></div></td></tr>;
            })}
          </tbody>
        </table>
      </div>
      <div className="md:hidden divide-y">{products.map(p => { const id=p._id||p.id; return <div key={id} className="p-4 flex gap-3"><img src={p.image || FALLBACK_IMAGE} className="w-16 h-16 rounded-xl object-cover border" /><div className="flex-1"><p className="text-sm font-semibold truncate">{p.title || p.name}</p><p className="text-xs text-gray-500 mt-1">${(p.discountPrice || p.price)?.toFixed(2)} • {p.category}</p><div className="flex gap-2 mt-3"><button onClick={() => onEdit(p)} className="flex-1 py-2 text-xs border rounded-full">Edit</button><button onClick={() => onDelete(id)} className="flex-1 py-2 text-xs border rounded-full">Delete</button></div></div></div>; })}</div>
    </div>
  );
};
export default ProductTable;
