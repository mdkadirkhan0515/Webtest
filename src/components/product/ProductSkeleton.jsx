import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col animate-pulse">
      <div className="aspect-[1/1] bg-gray-100 relative">
        <div className="absolute top-3 left-3 w-16 h-5 bg-gray-200 rounded-full" />
        <div className="absolute top-3 right-3 w-10 h-5 bg-gray-200 rounded-full" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="space-y-2 min-h-[40px]">
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-3/4" />
        </div>
        <div className="mt-2 mb-3 flex items-center gap-2">
          <div className="flex gap-1">{[...Array(5)].map((_, i) => <div key={i} className="w-4 h-4 bg-gray-100 rounded" />)}</div>
          <div className="w-8 h-3 bg-gray-100 rounded" />
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="w-16 h-5 bg-gray-900/10 rounded" />
          <div className="w-8 h-8 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="w-full">
    <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mb-6" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
      {[...Array(count)].map((_, i) => <ProductSkeleton key={i} />)}
    </div>
  </div>
);

export default ProductSkeleton;
