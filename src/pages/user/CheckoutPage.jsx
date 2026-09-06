import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder } from '@/services/orderService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'cod',
  });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
    setCartItems(cart);
  }, [navigate]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 50? 0 : 5.99;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.name ||!formData.email ||!formData.address ||!formData.city) {
      setError('Please fill in all required fields');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id || item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zip: formData.zip,
        },
        customerName: formData.name,
        customerEmail: formData.email,
        totalAmount: total,
        total: total,
        subtotal: subtotal,
        shippingCost: shipping,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'cod'? 'pending' : 'paid',
      };
      const response = await createOrder(orderData);
      const createdId = response?.data?._id || response?._id || response?.orderId || Math.random().toString(36).slice(2,10).toUpperCase();
      setOrderId(createdId);
      setSuccess(true);
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 md:p-12 max-w-md w-full text-center shadow-sm">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Order Placed!</h2>
          <p className="text-sm text-gray-500 mt-2">Thank you for your purchase. Your order has been received.</p>
          <div className="mt-6 bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Order ID</p>
            <p className="text-lg font-mono font-bold mt-1">#{String(orderId).slice(-8).toUpperCase()}</p>
            <p className="text-xs text-gray-500 mt-2">Total: <span className="font-bold text-gray-900">${total.toFixed(2)}</span></p>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <Link to="/products" className="w-full bg-gray-900 text-white font-semibold py-3 rounded-full">Continue Shopping</Link>
            <Link to="/" className="w-full bg-white border border-gray-200 font-medium py-3 rounded-full text-sm">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <form onSubmit={handlePlaceOrder} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Shipping Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-700 mb-1.5">Full Name *</label>
                    <input name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-700 mb-1.5">Email *</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-700 mb-1.5">Phone</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+880 1234-567890" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-700 mb-1.5">Address *</label>
                    <input name="address" value={formData.address} onChange={handleChange} required placeholder="123 Main St, Apartment 4B" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-700 mb-1.5">City *</label>
                    <input name="city" value={formData.city} onChange={handleChange} required placeholder="Dhaka" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-700 mb-1.5">ZIP Code</label>
                    <input name="zip" value={formData.zip} onChange={handleChange} placeholder="1200" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-bold text-gray-900 mb-4">Payment Method</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition ${formData.paymentMethod === 'cod'? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} />
                    <div><p className="text-sm font-semibold">Cash on Delivery</p><p className="text-xs text-gray-500">Pay when you receive</p></div>
                  </label>
                  <label className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition ${formData.paymentMethod === 'card'? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} />
                    <div><p className="text-sm font-semibold">Credit Card</p><p className="text-xs text-gray-500">Secure payment</p></div>
                  </label>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3.5 rounded-full flex items-center justify-center gap-2 transition shadow-lg disabled:opacity-50">
                {loading? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Placing Order...</> : `Place Order - $${total.toFixed(2)}`}
              </button>
            </form>
          </div>
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {cartItems.map(item => (
                  <div key={item._id || item.id} className="flex gap-3">
                    <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg bg-gray-50 object-cover border" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                    </div>
                    <p className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className={shipping===0?'text-green-600 font-medium':'font-medium'}>{shipping===0?'FREE':`$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between text-base font-bold border-t pt-3"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
