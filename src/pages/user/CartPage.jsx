import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const FALLBACK_IMAGE = '/placeholder.png';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { loadCart(); window.addEventListener('cartUpdated', loadCart); return () => window.removeEventListener('cartUpdated', loadCart); }, []);
  const loadCart = () => { try { setCartItems(JSON.parse(localStorage.getItem('cart') || '[]')); } catch { setCartItems([]); } };
  const updateCartStorage = (newCart) => { localStorage.setItem('cart', JSON.stringify(newCart)); setCartItems(newCart); window.dispatchEvent(new Event('cartUpdated')); };
  const handleQuantityChange = (id, type) => { const updated = cartItems.map(item => { if ((item._id || item.id) === id) { if (type==='inc') { if(item.stock && item.quantity>=item.stock) return item; return {...item, quantity:item.quantity+1}; } else { if(item.quantity<=1) return item; return {...item, quantity:item.quantity-1}; } } return item; }); updateCartStorage(updated); };
  const handleRemove = (id) => updateCartStorage(cartItems.filter(item => (item._id || item.id)!== id));

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 50 || subtotal===0? 0 : 5.99;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen"><div className="max-w-7xl mx-auto px-4 py-20"><div className="max-w-md mx-auto text-center bg-white rounded-[2rem] border p-10"><div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">🛒</div><h2 className="text-2xl font-bold">Your cart is empty</h2><p className="text-sm text-gray-500 mt-2">Start shopping to fill it up!</p><Link to="/products" className="mt-8 inline-flex bg-gray-900 text-white text-sm font-semibold px-7 py-3 rounded-full">Continue Shopping</Link></div></div></div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart <span className="text-gray-400 font-normal">({cartItems.length})</span></h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map(item => {
              const itemId = item._id || item.id;
              return (
                <div key={itemId} className="bg-white rounded-2xl border p-4 flex gap-4 shadow-sm">
                  <Link to={`/products/${itemId}`} className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0"><img src={item.image || FALLBACK_IMAGE} alt={item.title} className="w-full h-full object-cover" /></Link>
                  <div className="flex-1 flex flex-col"><div className="flex justify-between gap-2"><Link to={`/products/${itemId}`} className="text-sm font-semibold line-clamp-2">{item.title}</Link><button onClick={() => handleRemove(itemId)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full">×</button></div>
                    <div className="mt-auto flex items-center justify-between"><span className="text-lg font-bold">${item.price?.toFixed(2)}</span><div className="flex items-center gap-2 bg-gray-50 border rounded-full px-1.5 py-1"><button onClick={() => handleQuantityChange(itemId,'dec')} disabled={item.quantity<=1} className="w-7 h-7 bg-white rounded-full border shadow-sm disabled:opacity-40">-</button><span className="w-6 text-center text-sm font-bold">{item.quantity}</span><button onClick={() => handleQuantityChange(itemId,'inc')} className="w-7 h-7 bg-white rounded-full border shadow-sm">+</button></div></div>
                    <p className="text-xs text-gray-500 mt-2">Subtotal: <span className="font-semibold text-gray-900">${(item.price*item.quantity).toFixed(2)}</span></p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="lg:col-span-4"><div className="bg-white rounded-2xl border p-6 shadow-sm sticky top-24"><h3 className="text-lg font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 text-sm"><div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">${subtotal.toFixed(2)}</span></div><div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className={`font-medium ${shipping===0? 'text-green-600':'text-gray-900'}`}>{shipping===0? 'FREE' : `$${shipping.toFixed(2)}`}</span></div><div className="border-t pt-4 flex justify-between text-base"><span className="font-bold">Total</span><span className="font-bold text-lg">${total.toFixed(2)}</span></div></div>
            <button onClick={() => navigate('/checkout')} className="mt-6 w-full bg-gray-900 text-white font-semibold py-3.5 rounded-full shadow-lg">Proceed to Checkout →</button>
            <Link to="/products" className="mt-3 w-full bg-white border text-sm font-medium py-3 rounded-full flex justify-center">Continue Shopping</Link>
          </div></div>
        </div>
      </div>
    </div>
  );
};
export default CartPage;
