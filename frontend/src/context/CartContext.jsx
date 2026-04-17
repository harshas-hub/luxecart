import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, addToCart as apiAddToCart, updateCartItem, removeCartItem, clearCart as apiClearCart } from '../api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const LOCAL_CART_KEY = 'luxecart_guest_cart';

function getLocalCart() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLocalCart(items) {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [cart, setCart] = useState({ items: [], total: 0, item_count: 0 });
  const [loading, setLoading] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);

  // Compute totals from local cart items
  const computeLocalCart = useCallback((items) => {
    const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const item_count = items.reduce((sum, i) => sum + i.quantity, 0);
    return { items, total: Math.round(total * 100) / 100, item_count };
  }, []);

  // Fetch cart from API (logged-in users)
  const fetchCart = useCallback(async () => {
    if (!user) {
      const localItems = getLocalCart();
      setCart(computeLocalCart(localItems));
      return;
    }
    try {
      setLoading(true);
      const res = await getCart();
      setCart(res.data);
    } catch {
      // not logged in or error
    } finally {
      setLoading(false);
    }
  }, [user, computeLocalCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add to cart
  const addToCartAction = async (productId, quantity = 1, size = null, productData = null) => {
    if (user) {
      // Server-side cart
      try {
        await apiAddToCart({ product_id: productId, quantity, size });
        await fetchCart();
        setLastAdded(Date.now());
        addToast('Added to cart! 🛒', 'success');
      } catch (err) {
        addToast(err.response?.data?.detail || 'Failed to add to cart', 'error');
      }
    } else if (productData) {
      // Guest local cart
      const localItems = getLocalCart();
      const existing = localItems.find((i) => i.product.id === productId && i.size === size);

      if (existing) {
        existing.quantity += quantity;
      } else {
        localItems.push({
          id: Date.now() + Math.random(),
          product_id: productId,
          quantity,
          size,
          product: productData,
        });
      }

      saveLocalCart(localItems);
      setCart(computeLocalCart(localItems));
      setLastAdded(Date.now());
      addToast('Added to cart! 🛒', 'success');
    } else {
      addToast('Please sign in to add items to cart', 'warning');
    }
  };

  // Update quantity
  const updateQuantity = async (itemId, quantity) => {
    if (user) {
      try {
        if (quantity <= 0) {
          await removeCartItem(itemId);
        } else {
          await updateCartItem(itemId, { quantity });
        }
        await fetchCart();
      } catch (err) {
        addToast('Failed to update quantity', 'error');
      }
    } else {
      const localItems = getLocalCart();
      if (quantity <= 0) {
        const updated = localItems.filter((i) => i.id !== itemId);
        saveLocalCart(updated);
        setCart(computeLocalCart(updated));
        addToast('Item removed from cart', 'info');
      } else {
        const item = localItems.find((i) => i.id === itemId);
        if (item) {
          item.quantity = quantity;
          saveLocalCart(localItems);
          setCart(computeLocalCart(localItems));
        }
      }
    }
  };

  // Remove item
  const removeItem = async (itemId) => {
    if (user) {
      try {
        await removeCartItem(itemId);
        await fetchCart();
        addToast('Item removed from cart', 'info');
      } catch {
        addToast('Failed to remove item', 'error');
      }
    } else {
      const localItems = getLocalCart().filter((i) => i.id !== itemId);
      saveLocalCart(localItems);
      setCart(computeLocalCart(localItems));
      addToast('Item removed from cart', 'info');
    }
  };

  // Clear cart
  const clearCartItems = async () => {
    if (user) {
      try {
        await apiClearCart();
        await fetchCart();
      } catch {
        addToast('Failed to clear cart', 'error');
      }
    } else {
      saveLocalCart([]);
      setCart({ items: [], total: 0, item_count: 0 });
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, lastAdded, addToCart: addToCartAction, updateQuantity, removeItem, clearCartItems, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
