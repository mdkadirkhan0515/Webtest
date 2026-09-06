import React, { useState, useEffect } from 'react';

const AddProductModal = ({ isOpen, onClose, onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({ title:'', price:'', discountPrice:'', image:'', category:'', stock:'', description:'' });
  const [errors, setErrors] = useState({});
  const isEditMode =!!initialData;

  useEffect(() => {
    if (initialData) setFormData({ title: initialData.title || initialData.name || '', price: initialData.price || '', discountPrice: initialData.discountPrice || '', image: initialData.image || initialData.images?.[0] || '', category: initialData.category || '', stock: initialData.stock?? '', description: initialData.description || '' });
    else setFormData({ title:'', price:'', discountPrice:'', image:'', category:'', stock:'', description:'' });
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = e => { const {name,value}=e.target; setFormData(p => ({...p,[name]:value})); if(errors[name]) setErrors(p=>({...p,[name]:''})); };
  const validate = () => { const ne={}; if(!formData.title.trim()) ne.title='Title required'; if(!formData.price || Number(formData.price)<=0) ne.price='Valid price required'; if(!formData.image.trim()) ne.image='Image URL required'; if(!formData.category.trim()) ne.category='Category required'; if(formData.stock===''|| Number(formData.stock)<0) ne.stock='Valid stock required'; return ne; };
  const handleSubmit = e => { e.preventDefault(); const v=validate(); if(Object.keys(v).length){ setErrors(v); return; } onSubmit({ title:formData.title.trim(), name:formData.title.trim(), price:Number(formData.price), discountPrice: formData.discountPrice? Number(formData.discountPrice):undefined, image:formData.image.trim(), images:[formData.image.trim()], category:formData.category.trim().toLowerCase(), stock:Number(formData.stock), description:formData.description.trim() }); };

  if(!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[1.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-5 border-b flex items-center justify-between"><div><h2 className="text-lg font-bold">{isEditMode? 'Edit Product':'Add New Product'}</h2><p className="text-xs text-gray-500 mt-1">{isEditMode? 'Update product info':'Create a new product'}</p></div><button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">✕</button></div>
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2"><label className="block text-xs font-semibold uppercase mb-1.5">Title *</label><input name="title" value={formData.title} onChange={handleChange} placeholder="Wireless Headphones" className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-gray-900 ${errors.title? 'border-red-300':'border-gray-200'}`} />{errors.title && <p className="text-[11px] text-red-500 mt-1">{errors.title}</p>}</div>
            <div><label className="block text-xs font-semibold uppercase mb-1.5">Price *</label><input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="99.99" className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm ${errors.price? 'border-red-300':'border-gray-200'}`} /></div>
            <div><label className="block text-xs font-semibold uppercase mb-1.5">Discount Price</label><input name="discountPrice" type="number" step="0.01" value={formData.discountPrice} onChange={handleChange} placeholder="79.99" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" /></div>
            <div><label className="block text-xs font-semibold uppercase mb-1.5">Category *</label><select name="category" value={formData.category} onChange={handleChange} className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm ${errors.category? 'border-red-300':'border-gray-200'}`}><option value="">Select</option><option value="electronics">Electronics</option><option value="fashion">Fashion</option><option value="home">Home</option><option value="beauty">Beauty</option><option value="sports">Sports</option><option value="books">Books</option></select></div>
            <div><label className="block text-xs font-semibold uppercase mb-1.5">Stock *</label><input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="50" className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm ${errors.stock? 'border-red-300':'border-gray-200'}`} /></div>
            <div className="md:col-span-2"><label className="block text-xs font-semibold uppercase mb-1.5">Image URL *</label><input name="image" value={formData.image} onChange={handleChange} placeholder="https://..." className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm ${errors.image? 'border-red-300':'border-gray-200'}`} />{formData.image && <div className="mt-3 w-24 h-24 rounded-xl overflow-hidden border"><img src={formData.image} alt="Preview" className="w-full h-full object-cover" /></div>}</div>
            <div className="md:col-span-2"><label className="block text-xs font-semibold uppercase mb-1.5">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Detailed description..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none" /></div>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3"><button type="button" onClick={onClose} disabled={loading} className="px-5 py-2.5 bg-white border rounded-full text-sm font-medium">Cancel</button><button type="submit" disabled={loading} className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-semibold flex items-center gap-2">{loading? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{isEditMode? 'Updating...':'Creating...'}</> : isEditMode? 'Update Product':'Create Product'}</button></div>
        </form>
      </div>
    </div>
  );
};
export default AddProductModal;
