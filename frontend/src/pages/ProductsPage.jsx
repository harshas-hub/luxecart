import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../api';
import ProductCard from '../components/ProductCard';
import Dropdown from '../components/Dropdown';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const page = parseInt(searchParams.get('page') || '1');
  const categoryId = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, per_page: 12, sort };
    if (categoryId) params.category_id = categoryId;
    if (search) params.search = search;

    getProducts(params)
      .then((res) => {
        setProducts(res.data.products);
        setTotal(res.data.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, categoryId, sort, search]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="max-w-7xl mx-auto px-6 pb-16">
      {/* Header */}
      <div className="mb-10 animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-bold text-white">All Products</h1>
        <p className="mt-2 text-gray-400">Showing {total} products</p>
      </div>

      {/* Filters Bar */}
      <div 
        className="glass p-4 mb-8 flex flex-wrap gap-4 items-center animate-fade-in-up relative z-20" 
        style={{ animationDelay: '0.1s' }}
      >
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-premium !py-2.5 !text-sm"
          />
        </div>

        {/* Category Filter */}
        <Dropdown
          value={categoryId}
          onChange={(val) => updateParam('category', val)}
          options={[
            { label: 'All Categories', value: '' },
            ...categories.map((cat) => ({ label: cat.name, value: String(cat.id) }))
          ]}
          placeholder="All Categories"
        />

        {/* Sort */}
        <Dropdown
          value={sort}
          onChange={(val) => updateParam('sort', val)}
          options={[
            { label: 'Newest', value: 'newest' },
            { label: 'Price: Low → High', value: 'price_low' },
            { label: 'Price: High → Low', value: 'price_high' },
            { label: 'Top Rated', value: 'rating' }
          ]}
          placeholder="Sort By"
        />
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="glass overflow-hidden">
              <div className="skeleton h-56 w-full" />
              <div className="p-5 space-y-3">
                <div className="skeleton h-3 w-16" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-3 w-24" />
                <div className="skeleton h-6 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="glass text-center py-20">
          <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-300">No products found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => updateParam('page', String(page - 1))}
            disabled={page <= 1}
            className="px-4 py-2 glass text-sm font-medium text-gray-300 disabled:opacity-30 hover:bg-white/10 transition-colors rounded-xl"
          >
            ← Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => updateParam('page', String(i + 1))}
              className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                page === i + 1
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                  : 'glass text-gray-400 hover:bg-white/10'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => updateParam('page', String(page + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 glass text-sm font-medium text-gray-300 disabled:opacity-30 hover:bg-white/10 transition-colors rounded-xl"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
