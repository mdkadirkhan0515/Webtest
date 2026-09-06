import React from 'react';

const Header = () => {
  return (
    <div className="bg-gray-900 text-white text-[13px] md:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-2 gap-1 md:gap-0">
          <div className="flex items-center gap-2">
            <span className="bg-white text-gray-900 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Hot</span>
            <p className="tracking-wide">
              Free Shipping on orders over <span className="font-semibold text-yellow-400">$50</span> - Shop Now!
            </p>
          </div>
          <div className="flex items-center gap-4 text-gray-300">
            <a href="tel:+8801234567890" className="flex items-center gap-1.5 hover:text-white transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <span className="hidden sm:inline">+880 1234-567890</span>
            </a>
            <span className="hidden sm:block w-px h-4 bg-gray-700"></span>
            <a href="mailto:support@shop.com" className="flex items-center gap-1.5 hover:text-white transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span className="hidden sm:inline">support@shop.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
