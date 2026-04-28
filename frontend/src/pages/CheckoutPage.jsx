import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createOrder } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage() {
  const { t } = useTranslation('checkout');
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 text-center py-20 animate-fade-in-up">
        <div className="glass-strong p-16">
          <h2 className="text-2xl font-bold text-white mb-3">{t('cartEmpty')}</h2>
          <p className="text-gray-400 mb-8">{t('goShopping')}</p>
          <Link to="/products" className="btn-premium">{t('goShopping')}</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const fullAddress = `${address}, ${city}, ${zipCode}`;
      await createOrder({ shipping_address: fullAddress });
      await fetchCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const tax = cart.total * 0.08;
  const grandTotal = cart.total + tax;

  return (
    <div className="max-w-6xl mx-auto px-6 pb-16">
      <h1 className="text-3xl font-bold text-white mb-8 animate-fade-in-up">{t('title')}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2 animate-fade-in-up">
          <div className="glass-strong p-6">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('shippingAddress')}
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} id="checkout-form" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">{t('fullAddress')}</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input-premium"
                  placeholder={t('addressPlaceholder')}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-premium"
                    placeholder="New York"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Zip Code</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="input-premium"
                    placeholder="10001"
                    required
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Order Items */}
          <div className="glass-strong p-6 mt-6">
            <h2 className="text-lg font-bold text-white mb-4">{t('items')}</h2>
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-14 h-14 object-contain rounded-lg bg-white/5 p-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 truncate">{item.product.title}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}{item.size ? ` • Size: ${item.size}` : ''}</p>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-strong p-6 sticky top-28 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-lg font-bold text-white mb-6">{t('orderSummary')}</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">{t('subtotal')}</span>
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
              <div className="border-t border-white/20 pt-3 flex justify-between text-xl font-bold">
                <span className="text-white">{t('total')}</span>
                <span className="text-white">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="btn-premium w-full text-center mt-6 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t('processing')}
                </span>
              ) : (
                `${t('placeOrder')} — $${grandTotal.toFixed(2)}`
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
