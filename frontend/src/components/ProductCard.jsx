import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<span key={i} className="text-amber-400">★</span>);
    } else if (i - 0.5 <= rating) {
      stars.push(<span key={i} className="text-amber-400">★</span>);
    } else {
      stars.push(<span key={i} className="text-gray-600">★</span>);
    }
  }
  return <div className="flex text-sm gap-0.5">{stars}</div>;
}

export default function ProductCard({ product, index = 0 }) {
  const { t } = useTranslation('products');
  const { t: tc } = useTranslation('common');
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding || product.stock <= 0) return;

    setAdding(true);
    try {
      await addToCart(product.id, 1, null, product);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1, null, product);
    navigate('/cart');
  };

  return (
    <div className="product-card glass block overflow-hidden group relative">
      {/* Clickable Image Area */}
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-white/5 p-6 h-56 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="product-image max-h-full max-w-full object-contain drop-shadow-2xl"
            loading="lazy"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

          {/* Quick view badge */}
          <div className="absolute top-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
              👁 Quick View
            </span>
          </div>

          {/* Out of stock overlay */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-red-400 font-bold text-lg">{tc('outOfStock')}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-5">
        {/* Category */}
        {product.category && (
          <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">
            {product.category.name}
          </span>
        )}

        {/* Title */}
        <Link to={`/products/${product.id}`}>
          <h3 className="mt-1.5 text-sm font-semibold text-gray-200 line-clamp-2 leading-snug group-hover:text-white transition-colors cursor-pointer hover:text-purple-300">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-2.5 flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-500">({product.rating_count})</span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ${product.price.toFixed(2)}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            product.stock > 0
              ? 'text-emerald-400 bg-emerald-400/10'
              : 'text-red-400 bg-red-400/10'
          }`}>
            {product.stock > 0 ? tc('inStock') : tc('outOfStock')}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || adding}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed ${
              added
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-purple-500/20 hover:border-purple-500/40 hover:text-purple-300'
            }`}
          >
            {adding ? (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : added ? (
              <>✓ {t('addedToCart')}</>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {t('addToCart')}
              </>
            )}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
