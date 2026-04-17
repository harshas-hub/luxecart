import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../api';
import { useAuth } from '../context/AuthContext';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getOrders()
        .then((res) => setOrders(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-6 text-center py-20">
        <div className="glass-strong p-16">
          <h2 className="text-2xl font-bold text-white mb-3">Sign in to view orders</h2>
          <Link to="/login" className="btn-premium mt-4 inline-block">Sign In</Link>
        </div>
      </div>
    );
  }

  const statusColors = {
    pending: 'text-yellow-300 bg-yellow-400/20 border border-yellow-400/30',
    confirmed: 'text-emerald-300 bg-emerald-400/20 border border-emerald-400/30',
    shipped: 'text-blue-300 bg-blue-400/20 border border-blue-400/30',
    delivered: 'text-green-300 bg-green-400/20 border border-green-400/30',
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pb-16">
      <h1 className="text-3xl font-bold text-white mb-8 animate-fade-in-up">Your Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass p-6">
              <div className="skeleton h-4 w-32 mb-3" />
              <div className="skeleton h-3 w-48 mb-2" />
              <div className="skeleton h-3 w-24" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-strong text-center p-16 animate-fade-in-up">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-xl font-bold text-white mb-2">No orders yet</h2>
          <p className="text-gray-300 mb-6">Start shopping to place your first order</p>
          <Link to="/products" className="btn-premium">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, i) => (
            <div
              key={order.id}
              className="glass-strong p-6 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-white">Order #{order.id}</h3>
                  <p className="text-sm text-gray-300 mt-0.5 font-medium">
                    📅 {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    }) : 'Recently placed'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] || 'text-gray-300 bg-gray-400/10 border border-gray-400/30'}`}>
                    {order.status}
                  </span>
                  <span className="text-xl font-bold text-white">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Shipping */}
              {order.shipping_address && (
                <div className="mb-5 p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-gray-200 font-medium">
                    📍 <span className="font-semibold text-white">Shipping to:</span> {order.shipping_address}
                  </p>
                </div>
              )}

              {/* Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/8 border border-white/10">
                    <div className="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 p-1">
                      <img
                        src={item.product?.image}
                        alt={item.product?.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{item.product?.title}</p>
                      {item.size && <p className="text-xs text-gray-400 mt-0.5 font-medium">Size: {item.size}</p>}
                      <p className="text-sm text-purple-300 mt-0.5 font-semibold">
                        {item.quantity} × ${item.price_at_time.toFixed(2)}
                        <span className="text-gray-300 font-normal ml-2">
                          = ${(item.quantity * item.price_at_time).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <p className="text-sm text-gray-300">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
                <p className="text-sm font-bold text-white">
                  Total: <span className="text-purple-300">${order.total.toFixed(2)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
