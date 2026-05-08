/**
 * Translation Key Constants
 * 
 * Centralized key references to prevent typos in translation calls.
 * Usage: import { T } from '../i18n/translationKeys';
 *        t(T.NAV.HOME)  →  t('home', { ns: 'nav' })
 * 
 * Or use directly with namespace prefix:
 *        t('nav:home')
 */

export const T = {
  // ---- Nav Namespace ----
  NAV: {
    HOME: 'nav:home',
    PRODUCTS: 'nav:products',
    ORDERS: 'nav:orders',
    SIGN_IN: 'nav:signIn',
    SIGN_OUT: 'nav:signOut',
    MY_ORDERS: 'nav:myOrders',
    CART: 'nav:cart',
    SIGNED_IN_AS: 'nav:signedInAs',
    LANGUAGE: 'nav:language',
  },

  // ---- Common Namespace ----
  COMMON: {
    ADD_TO_CART: 'common:addToCart',
    REMOVE: 'common:removeFromCart',
    LOADING: 'common:loading',
    ERROR: 'common:error',
    RETRY: 'common:retry',
    SAVE: 'common:save',
    CANCEL: 'common:cancel',
    DELETE: 'common:delete',
    CONFIRM: 'common:confirm',
    BACK: 'common:back',
    NEXT: 'common:next',
    SEARCH: 'common:search',
    NO_RESULTS: 'common:noResults',
    VIEW_ALL: 'common:viewAll',
    SHOP_NOW: 'common:shopNow',
    LEARN_MORE: 'common:learnMore',
    OUT_OF_STOCK: 'common:outOfStock',
    IN_STOCK: 'common:inStock',
  },

  // ---- Products Namespace ----
  PRODUCTS: {
    TITLE: 'products:title',
    SEARCH_PLACEHOLDER: 'products:searchPlaceholder',
    ALL_CATEGORIES: 'products:allCategories',
    SORT_BY: 'products:sortBy',
    ADD_TO_CART: 'products:addToCart',
    SELECT_SIZE: 'products:selectSize',
    DESCRIPTION: 'products:description',
    CUSTOMER_REVIEWS: 'products:customerReviews',
    HERO_TITLE: 'products:heroTitle',
    HERO_SUBTITLE: 'products:heroSubtitle',
    BROWSE_COLLECTION: 'products:browseCollection',
    FEATURED: 'products:featured',
  },

  // ---- Cart Namespace ----
  CART: {
    TITLE: 'cart:title',
    EMPTY: 'cart:empty',
    CHECKOUT: 'cart:checkout',
    SUBTOTAL: 'cart:subtotal',
    TOTAL: 'cart:total',
    CONTINUE_SHOPPING: 'cart:continueShopping',
  },

  // ---- Checkout Namespace ----
  CHECKOUT: {
    TITLE: 'checkout:title',
    SHIPPING_ADDRESS: 'checkout:shippingAddress',
    PLACE_ORDER: 'checkout:placeOrder',
    ORDER_SUMMARY: 'checkout:orderSummary',
    PROCESSING: 'checkout:processing',
  },

  // ---- Orders Namespace ----
  ORDERS: {
    TITLE: 'orders:title',
    EMPTY: 'orders:empty',
    ORDER_NUMBER: 'orders:orderNumber',
    STATUS: 'orders:status',
    TOTAL: 'orders:total',
    DATE: 'orders:date',
  },

  // ---- Auth Namespace ----
  AUTH: {
    SIGN_IN: 'auth:signIn',
    SIGN_UP: 'auth:signUp',
    EMAIL: 'auth:email',
    PASSWORD: 'auth:password',
    FULL_NAME: 'auth:fullName',
    LOGIN_BUTTON: 'auth:loginButton',
    REGISTER_BUTTON: 'auth:registerButton',
    WELCOME_BACK: 'auth:welcomeBack',
    JOIN_US: 'auth:joinUs',
  },
};
