import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../api';
import ProductCard from '../components/ProductCard';

const CATEGORY_IMAGES = {
  electronics: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
  jewelery: 'https://images.unsplash.com/photo-1515562141589-67f0d569b34e?w=400&h=300&fit=crop',
  "men's clothing": 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&h=300&fit=crop',
  "women's clothing": 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop',
};

function getCategoryImage(name) {
  const key = name.toLowerCase();
  return CATEGORY_IMAGES[key] || `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop`;
}

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProducts({ per_page: 8, sort: 'rating' }),
      getCategories(),
    ])
      .then(([prodRes, catRes]) => {
        setFeatured(prodRes.data.products);
        setCategories(catRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20">
        <div className="text-center animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-6">
            ✨ Premium Shopping Experience
          </span>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              Discover Luxury
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Redefine Style
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Explore our curated collection of premium products. From electronics to fashion, 
            find everything you need with an experience you&apos;ll love.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link to="/products" className="btn-premium text-base">
              Shop Now
              <svg className="inline-block w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link to="/products" className="btn-outline text-base">
              Browse Categories
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '500+', label: 'Products' },
            { value: '50K+', label: 'Customers' },
            { value: '4.9', label: 'Rating' },
            { value: '24/7', label: 'Support' },
          ].map((stat, i) => (
            <div key={i} className="glass text-center py-6 animate-fade-in-up" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Shop by Category</h2>
            <Link to="/products" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="glass group overflow-hidden animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={getCategoryImage(cat.name)}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-200 group-hover:text-purple-400 transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Featured Products</h2>
          <Link to="/products" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product, i) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="glass-strong p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-rose-500/20" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Elevate Your Style?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Join thousands of happy customers who trust LuxeCart for premium shopping.
            </p>
            <Link to="/products" className="btn-premium text-lg">
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
