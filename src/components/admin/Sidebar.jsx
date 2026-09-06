import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { logout } from '@/services/authService';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: (active) => <svg className={`w-5 h-5 ${active? 'text-white':'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { label: 'Products', path: '/admin/products', icon: (active) => <svg className={`w-5 h-5 ${active? 'text-white':'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10m0 0l8-4V7m-8 4L4 7" /></svg> },
  { label: 'Orders', path: '/admin/orders', icon: (active) => <svg className={`w-5 h-5 ${active? 'text-white':'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
];

const Sidebar = ({ isMobileOpen = false, setMobileOpen }) => {
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const handleLogout = () => { if(window.confirm('Are you sure?')){ setIsLoggingOut(true); logout(); } };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-gray-800">
        <Link to="/admin/dashboard" className="flex items-center gap-3"><div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white">S</div><div><h1 className="text-white font-bold text-[15px] leading-none">ShopMart</h1><p className="text-gray-400 text-[11px] tracking-widest uppercase mt-1">Admin Panel</p></div></Link>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path+'/');
          return <NavLink key={item.path} to={item.path} onClick={() => setMobileOpen && setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>{item.icon(isActive)}{item.label}{isActive && <span className="ml-auto w-2 h-2 bg-indigo-500 rounded-full" />}</NavLink>;
        })}
        <div className="pt-6 mt-6 border-t border-gray-800"><Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50">← Back to Store</Link></div>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800/50 rounded-xl p-3 flex items-center gap-3 mb-3"><div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div><div className="flex-1 min-w-0"><p className="text-white text-sm font-medium truncate">Admin</p><p className="text-gray-400 text-[11px] truncate">admin@shopmart.com</p></div></div>
        <button onClick={handleLogout} disabled={isLoggingOut} className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-sm font-medium py-2.5 rounded-xl transition">{isLoggingOut? 'Logging out...' : 'Logout'}</button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:shrink-0 lg:w-64 flex-col bg-gray-950 border-r border-gray-900 h-screen sticky top-0"><SidebarContent /></aside>
      {isMobileOpen && <div className="lg:hidden fixed inset-0 z-50 flex"><div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} /><div className="relative w-64 bg-gray-950 border-r border-gray-900 h-full"><SidebarContent /></div></div>}
    </>
  );
};
export default Sidebar;
