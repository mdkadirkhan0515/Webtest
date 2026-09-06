import React from 'react';

const LoadingSpinner = ({ size = 'default', fullScreen = false, text = 'Loading...', showText = true }) => {
  const sizeClasses = { small: 'w-5 h-5 border-2', default: 'w-8 h-8 border-[3px]', large: 'w-12 h-12 border-4' };
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} border-gray-200 border-t-indigo-600 rounded-full animate-spin`} role="status" aria-label="loading" />
      {showText && text && <p className="text-sm text-gray-500 font-medium animate-pulse">{text}</p>}
    </div>
  );
  if (fullScreen) return <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">{spinner}</div>;
  return <div className="flex items-center justify-center w-full py-16">{spinner}</div>;
};

export const ProductSkeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl p-4 border border-gray-100">
    <div className="bg-gray-100 rounded-xl h-48 mb-4"></div>
    <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-100 rounded w-1/2 mb-4"></div>
    <div className="flex justify-between items-center"><div className="h-6 bg-gray-100 rounded w-20"></div><div className="h-8 bg-gray-100 rounded-full w-20"></div></div>
  </div>
);

export default LoadingSpinner;
