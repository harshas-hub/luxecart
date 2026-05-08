import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { t } = useTranslation('cart');
  const { t: tc } = useTranslation('common');
  const { cart, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 text-center py-20 animate-fade-in-up">
        <div className="glass-strong p-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">{t('empty')}</h2>
          <p className="text-gray-300 mb-8">{t('emptySubtitle')}</p>
          <Link to="/products" className="btn-premium">{t('startShopping')}</Link>
        </div>
      </div>
    );
  }

  const tax = cart.total * 0.08;
  const grandTotal = cart.total + tax;

  return (
    <div className="max-w-6xl mx-auto px-6 pb-16">
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
        <span className="text-sm text-gray-300 font-medium">{t('itemCount', { count: cart.item_count })}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item, i) => (
            <div
              key={item.id}
              className="glass p-4 sm:p-5 flex gap-4 items-center animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Image */}
              <Link to={`/products/${item.product.id}`} className="shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white/10 p-2 flex items-center justify-center hover:bg-white/15 transition-colors">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item.product.id}`}
                  className="text-sm font-semibold text-white hover:text-purple-300 transition-colors line-clamp-2"
                >
                  {item.product.title}
                </Link>
                {(item.product.category || item.size) && (
                  <p className="text-xs text-purple-300 mt-0.5 font-medium uppercase tracking-wide flex items-center gap-1.5">
                    {item.product.category && <span>{item.product.category.name}</span>}
                    {item.product.category && item.size && <span className="w-1 h-1 bg-purple-400 rounded-full"></span>}
                    {item.size && <span>{t('size')}: {item.size}</span>}
                  </p>
                )}
                <p className="mt-1.5 text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ${item.product.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center glass rounded-lg overflow-hidden shrink-0 border border-white/10">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-3 py-2 text-white hover:bg-white/10 transition-colors text-sm font-bold"
                >
                  −
                </button>
                <span className="px-3 py-2 text-white text-sm font-bold min-w-[36px] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-3 py-2 text-white hover:bg-white/10 transition-colors text-sm font-bold"
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right shrink-0 min-w-[80px] hidden sm:block">
                <p className="text-sm font-bold text-white">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 rounded-lg hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-all shrink-0"
                title={t('remove')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-strong p-6 sticky top-28 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-lg font-bold text-white mb-6">{t('orderSummary')}</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">{t('subtotal')} ({cart.item_count})</span>
                <span className="text-white font-semibold">${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">{t('shipping')}</span>
                <span className="text-emerald-400 font-semibold">{t('freeShipping')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Tax (8%)</span>
                <span className="text-white font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-white/20 pt-3 flex justify-between text-lg font-bold">
                <span className="text-white">{t('total')}</span>
                <span className="text-white">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {user ? (
              <Link to="/checkout" className="btn-premium w-full text-center mt-6 block">
                {t('checkout')}
              </Link>
            ) : (
              <Link to="/login" className="btn-premium w-full text-center mt-6 block">
                {tc('shopNow')}
              </Link>
            )}

            <Link
              to="/products"
              className="block text-center mt-3 text-sm text-purple-300 hover:text-purple-200 transition-colors font-medium"
            >
              ← {t('continueShopping')}
            </Link>

            {/* Promo banner */}
            <div className="mt-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <p className="text-sm text-emerald-300 font-medium">🎁 {t('freeShipping')}!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
