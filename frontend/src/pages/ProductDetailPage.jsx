import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProduct, getProducts } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= Math.floor(rating) ? 'text-amber-400' : 'text-gray-600'}>
        ★
      </span>
    );
  }
  return <div className="flex text-lg gap-0.5">{stars}</div>;
}

export default function ProductDetailPage() {
  const { t } = useTranslation('products');
  const { t: tc } = useTranslation('common');
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedTab, setSelectedTab] = useState('description');
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    setLoading(true);
    setAdded(false);
    setQuantity(1);
    getProduct(id)
      .then((res) => {
        setProduct(res.data);
        if (res.data.sizes) {
          const sizesArray = res.data.sizes.split(',');
          setSelectedSize(sizesArray[0]);
        } else {
          setSelectedSize(null);
        }
        // Fetch related products
        if (res.data.category_id) {
          getProducts({ category_id: res.data.category_id, per_page: 4 }).then((r) => {
            setRelated(r.data.products.filter((p) => p.id !== res.data.id).slice(0, 4));
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity, selectedSize, product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuyNow = async () => {
    await addToCart(product.id, quantity, selectedSize, product);
    navigate('/cart');
  };

  const sizeList = product?.sizes ? product.sizes.split(',') : [];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="skeleton h-[500px] rounded-2xl" />
          <div className="space-y-4">
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-8 w-full" />
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-10 w-28" />
            <div className="skeleton h-24 w-full" />
            <div className="skeleton h-14 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 text-center py-20">
        <h2 className="text-2xl text-gray-300">{tc('noResults')}</h2>
        <Link to="/products" className="btn-premium mt-4 inline-block">
          {tc('back')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pb-16">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-300 animate-fade-in">
        <Link to="/" className="hover:text-purple-400 transition-colors text-gray-300">Home</Link>
        <span className="text-gray-400">/</span>
        <Link to="/products" className="hover:text-purple-400 transition-colors text-gray-300">{t('title')}</Link>
        <span className="text-gray-400">/</span>
        <span className="text-white font-medium truncate max-w-[200px]">{product.title}</span>
      </nav>

      {/* Product Detail */}
      <div className="grid md:grid-cols-2 gap-12 animate-fade-in-up">
        {/* Image */}
        <div className="glass p-8 flex items-center justify-center min-h-[400px] md:min-h-[500px] relative overflow-hidden group">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-[400px] max-w-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
          {/* Zoom hint */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-500">
            🔍 Hover to zoom
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          {product.category && (
            <Link
              to={`/products?category=${product.category_id}`}
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-4 hover:bg-purple-500/30 transition-colors"
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="mt-4 flex items-center gap-3">
            <StarRating rating={product.rating} />
            <span className="text-sm text-gray-400">
              {product.rating} ({product.rating_count} {t('ratings')})
            </span>
          </div>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-lg text-gray-500 line-through">
              ${(product.price * 1.3).toFixed(2)}
            </span>
            <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-semibold">
              23% OFF
            </span>
          </div>

          {/* Stock */}
          <div className="mt-3">
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {product.stock > 0 ? `✓ ${t('inStock')} (${product.stock})` : `✕ ${t('outOfStock')}`}
            </span>
          </div>

          {/* Sizes */}
          {sizeList.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-200 font-medium">{t('selectSize')}:</span>
                <span className="text-xs text-purple-400 font-medium cursor-pointer hover:underline">Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizeList.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[50px] px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                      selectedSize === size
                        ? 'bg-purple-500 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/30'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-200 font-medium">{t('quantity')}:</span>
              <div className="flex items-center glass rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-gray-300 hover:bg-white/10 transition-colors text-lg font-medium"
                >
                  −
                </button>
                <span className="px-5 py-3 text-white font-semibold min-w-[50px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-3 text-gray-300 hover:bg-white/10 transition-colors text-lg font-medium"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-4 px-6 rounded-xl text-base font-semibold transition-all duration-300 border flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  added
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-white/5 border-white/20 text-gray-200 hover:bg-purple-500/20 hover:border-purple-500/40 hover:text-purple-300'
                }`}
              >
                {added ? (
                  <>✓ {t('addedToCart')}</>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    {t('addToCart')}
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 btn-premium text-center text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⚡ Buy Now
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { icon: '🚚', text: tc('free') + ' Shipping' },
              { icon: '🔄', text: '30-Day Returns' },
              { icon: '🛡️', text: '2-Year Warranty' },
            ].map((f, i) => (
              <div key={i} className="glass text-center p-3 border border-white/15">
                <div className="text-xl mb-1">{f.icon}</div>
                <div className="text-xs text-gray-200 font-medium">{f.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-16 animate-fade-in-up">
        <div className="flex gap-1 border-b border-white/10 mb-6">
          {['description', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-all relative ${
                selectedTab === tab
                  ? 'text-purple-300'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab === 'description' ? t('description') : tab === 'reviews' ? t('customerReviews') : tab}
              {selectedTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />
              )}
            </button>
          ))}
        </div>

        <div className="glass-strong p-6">
          {selectedTab === 'description' && (
            <p className="text-gray-200 leading-relaxed">{product.description}</p>
          )}
          {selectedTab === 'specifications' && (
            <div className="space-y-3">
              {[
                [t('category'), product.category?.name || 'N/A'],
                [tc('rating'), `${product.rating} / 5.0`],
                [tc('reviews'), `${product.rating_count} ${t('ratings')}`],
                ['Stock', `${product.stock} units`],
                ['SKU', `LXC-${String(product.id).padStart(5, '0')}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-300">{label}</span>
                  <span className="text-white font-semibold">{value}</span>
                </div>
              ))}
            </div>
          )}
          {selectedTab === 'reviews' && (
            <div className="text-center py-8">
              <p className="text-gray-300 font-medium">{t('customerReviews')} coming soon!</p>
              <p className="text-sm text-gray-400 mt-2">Be the first to review this product.</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-white mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p, i) => (
              <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
