import React from 'react';
import ProductCard from './ProductCard';

const EmptyState = ({ searchQuery }) => (
  <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
      <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
    <p className="text-sm text-gray-500 max-w-sm">
      {searchQuery? `No results for "${searchQuery}"` : 'No products match your filters. Try clearing filters.'}
    </p>
  </div>
);

const ProductGrid = ({ products = [], searchQuery = '' }) => {
  if (!products || products.length === 0) {
    return <div className="w-full"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"><EmptyState searchQuery={searchQuery} /></div></div>;
  }
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">Showing <span className="font-semibold text-gray-900">{products.length}</span> products</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
        {products.map((product) => <ProductCard key={product._id || product.id} product={product} />)}
      </div>
    </div>
  );
};
export default ProductGrid;
