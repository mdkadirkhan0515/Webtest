import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '@/services/productService';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductGridSkeleton } from '@/components/product/ProductSkeleton';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (category) params.category = category;
    if (sort) params.sort = sort;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, category, sort, setSearchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const queryParams = {};
        if (debouncedSearch) queryParams.search = debouncedSearch;
        if (category) queryParams.category = category;
        if (sort) queryParams.sort = sort;
        const data = await getProducts(queryParams);
        const list = data?.data || data?.products || data || [];
        setProducts(Array.isArray(list)? list : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [debouncedSearch, category, sort]);

  const handleClear = () => {
    setSearchInput(''); setCategory(''); setSort(''); setSearchParams({});
  };
  const hasFilters = debouncedSearch || category || sort;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="text-sm text-gray-500 mt-2">Find your perfect product from our curated collection</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search for products..." className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white" />
            </div>
            <div className="md:col-span-4">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">All Categories</option><option value="electronics">Electronics</option><option value="fashion">Fashion</option><option value="home">Home & Living</option><option value="beauty">Beauty</option><option value="sports">Sports</option><option value="books">Books</option>
              </select>
            </div>
            <div className="md:col-span-3 flex gap-2">
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="flex-1 px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Sort by</option><option value="price_asc">Price: Low to High</option><option value="price_desc">Price: High to Low</option><option value="newest">Newest First</option><option value="rating">Highest Rated</option>
              </select>
              {hasFilters && <button onClick={handleClear} className="px-4 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-black">Clear</button>}
            </div>
          </div>
        </div>

        {loading? <ProductGridSkeleton count={8} /> : error? <div className="bg-white border border-red-100 rounded-2xl p-10 text-center"><p className="text-sm font-medium">Failed to load</p><p className="text-xs text-gray-500 mt-1">{error}</p></div> : <ProductGrid products={products} searchQuery={debouncedSearch} />}
      </div>
    </div>
  );
};
export default ProductsPage;
