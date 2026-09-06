import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FALLBACK_IMAGE = '/placeholder.png';

const ProductCard = ({ product }) => {
  const [imgSrc, setImgSrc] = useState(product?.image || product?.images?.[0] || FALLBACK_IMAGE);
  const [isAdding, setIsAdding] = useState(false);

  const { _id, id, title, name, category = 'General', price = 0, originalPrice, discountPrice, rating = 4.5, reviews = 0, stock } = product || {};
  const productId = _id || id;
  const productName = title || name || 'Product Name';
  const hasDiscount = discountPrice && discountPrice < (originalPrice || price);
  const displayPrice = hasDiscount? discountPrice : price;
  const oldPrice = hasDiscount? (originalPrice || price) : null;
  const discountPercent = hasDiscount && oldPrice? Math.round(((oldPrice - displayPrice) / oldPrice) * 100) : 0;

  const handleImageError = () => {
    if (imgSrc!== FALLBACK_IMAGE) setImgSrc(FALLBACK_IMAGE);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find((item) => (item._id || item.id) === productId);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({ _id: productId, id: productId, title: productName, price: displayPrice, image: imgSrc, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) { console.error(err); }
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <Link to={`/products/${productId}`} className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="relative aspect-[1/1] bg-gray-50 overflow-hidden">
        <img src={imgSrc} alt={productName} onError={handleImageError} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" loading="lazy" />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[11px] font-semibold uppercase text-gray-700 px-2.5 py-1 rounded-full shadow-sm">{category}</span>
        {hasDiscount && <span className="absolute top-3 right-3 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">-{discountPercent}%</span>}
        {stock === 0 && <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center"><span className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full">OUT OF STOCK</span></div>}
        <div className="absolute bottom-3 left-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button onClick={handleAddToCart} disabled={stock === 0 || isAdding} className="w-full bg-gray-900 hover:bg-black text-white text-sm font-medium py-2.5 rounded-full shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
            {isAdding? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Adding...</> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>Add to Cart</>}
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors min-h-[40px]">{productName}</h3>
        <div className="mt-2 mb-3 flex items-center gap-1">
          <div className="flex">{[...Array(5)].map((_, i) => <svg key={i} className={`w-4 h-4 ${i < Math.floor(rating)? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
          <span className="text-xs text-gray-500">({reviews || 24})</span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">${displayPrice?.toFixed(2)}</span>
            {oldPrice && <span className="text-xs text-gray-400 line-through">${oldPrice?.toFixed(2)}</span>}
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-indigo-50 flex items-center justify-center group-hover:text-indigo-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default ProductCard;
