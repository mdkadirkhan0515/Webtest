import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '@/services/productService';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const FALLBACK_IMAGE = '/placeholder.png';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        const prod = data?.data || data?.product || data;
        setProduct(prod);
        setSelectedImage(prod?.image || prod?.images?.[0] || FALLBACK_IMAGE);
      } catch (err) {
        setError(err.message);
      } finally { setLoading(false); }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleQuantityChange = (type) => {
    if (type === 'inc') {
      if (product?.stock && quantity >= product.stock) return;
      setQuantity(q => q + 1);
    } else if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const productId = product._id || product.id;
      const existing = cart.find(item => (item._id || item.id) === productId);
      const displayPrice = product.discountPrice || product.price;
      if (existing) existing.quantity += quantity;
      else cart.push({ _id: productId, id: productId, title: product.title || product.name, price: displayPrice, image: selectedImage, quantity, stock: product.stock });
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      setTimeout(() => { setIsAdding(false); navigate('/cart'); }, 500);
    } catch { setIsAdding(false); }
  };

  if (loading) return <LoadingSpinner text="Loading product details..." />;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-20 text-center"><div className="bg-red-50 border border-red-100 rounded-2xl p-10 inline-block"><p className="text-red-600 font-medium">{error}</p><Link to="/products" className="mt-4 inline-block px-5 py-2.5 bg-gray-900 text-white text-sm rounded-full">Back to Products</Link></div></div>;
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20 text-center"><h2 className="text-2xl font-bold">Product not found</h2></div>;

  const images = product.images?.length? product.images : [product.image || FALLBACK_IMAGE];
  const displayPrice = product.discountPrice || product.price;
  const oldPrice = product.discountPrice? product.originalPrice || product.price : null;
  const discountPercent = oldPrice? Math.round(((oldPrice - displayPrice)/oldPrice)*100) : 0;
  const inStock = product.stock === undefined? true : product.stock > 0;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8"><Link to="/" className="hover:text-gray-900">Home</Link><span>/</span><Link to="/products" className="hover:text-gray-900">Products</Link><span>/</span><span className="text-gray-900 font-medium truncate">{product.title || product.name}</span></nav>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100"><img src={selectedImage} alt={product.title} className="w-full h-full object-cover" onError={(e) => e.target.src = FALLBACK_IMAGE} /></div>
            {images.length > 1 && <div className="flex gap-3 overflow-x-auto pb-2">{images.map((img, idx) => <button key={idx} onClick={() => setSelectedImage(img)} className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 ${selectedImage === img? 'border-gray-900' : 'border-gray-100'}`}><img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" /></button>)}</div>}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4"><span className="text-[11px] font-bold uppercase bg-gray-900 text-white px-3 py-1 rounded-full">{product.category || 'General'}</span><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${inStock? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{inStock? `● In Stock${product.stock? ` (${product.stock})` : ''}` : '● Out of Stock'}</span></div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.title || product.name}</h1>
            <div className="flex items-baseline gap-4 mt-6"><span className="text-3xl font-bold">${displayPrice?.toFixed(2)}</span>{oldPrice && <><span className="text-lg text-gray-400 line-through">${oldPrice?.toFixed(2)}</span><span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">-{discountPercent}% OFF</span></>}</div>
            <p className="text-sm text-gray-600 leading-relaxed mt-6">{product.description || 'Premium quality product designed for everyday use.'}</p>
            <div className="mt-8 space-y-6">
              <div className="flex items-center gap-4"><span className="text-sm font-medium">Quantity:</span><div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-2 py-1"><button onClick={() => handleQuantityChange('dec')} disabled={quantity<=1} className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm border disabled:opacity-40">-</button><span className="w-8 text-center text-sm font-bold">{quantity}</span><button onClick={() => handleQuantityChange('inc')} disabled={product.stock && quantity>=product.stock} className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm border disabled:opacity-40">+</button></div></div>
              <div className="flex gap-3"><button onClick={handleAddToCart} disabled={!inStock || isAdding} className="flex-1 bg-gray-900 hover:bg-black text-white font-semibold py-3.5 rounded-full flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">{isAdding? 'Adding...' : `Add to Cart - $${(displayPrice*quantity).toFixed(2)}`}</button></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetailPage;
