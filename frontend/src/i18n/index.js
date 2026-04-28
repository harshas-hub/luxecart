import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ---- English Bundles ----
import enCommon from './locales/en/common.json';
import enNav from './locales/en/nav.json';
import enProducts from './locales/en/products.json';
import enCart from './locales/en/cart.json';
import enCheckout from './locales/en/checkout.json';
import enOrders from './locales/en/orders.json';
import enAuth from './locales/en/auth.json';

// ---- German Bundles ----
import deCommon from './locales/de/common.json';
import deNav from './locales/de/nav.json';
import deProducts from './locales/de/products.json';
import deCart from './locales/de/cart.json';
import deCheckout from './locales/de/checkout.json';
import deOrders from './locales/de/orders.json';
import deAuth from './locales/de/auth.json';

// ---- Telugu Bundles ----
import teCommon from './locales/te/common.json';
import teNav from './locales/te/nav.json';
import teProducts from './locales/te/products.json';
import teCart from './locales/te/cart.json';
import teCheckout from './locales/te/checkout.json';
import teOrders from './locales/te/orders.json';
import teAuth from './locales/te/auth.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        nav: enNav,
        products: enProducts,
        cart: enCart,
        checkout: enCheckout,
        orders: enOrders,
        auth: enAuth,
      },
      de: {
        common: deCommon,
        nav: deNav,
        products: deProducts,
        cart: deCart,
        checkout: deCheckout,
        orders: deOrders,
        auth: deAuth,
      },
      te: {
        common: teCommon,
        nav: teNav,
        products: teProducts,
        cart: teCart,
        checkout: teCheckout,
        orders: teOrders,
        auth: teAuth,
      },
    },
    // Default namespace used when no namespace is specified
    defaultNS: 'common',
    // Fallback language when key is not found in current language
    fallbackLng: 'en',
    // Only allow these languages
    supportedLngs: ['en', 'de', 'te'],
    // React already protects from XSS
    interpolation: {
      escapeValue: false,
    },
    // Language detection configuration
    detection: {
      // Check localStorage first, then browser navigator
      order: ['localStorage', 'navigator'],
      // localStorage key name
      lookupLocalStorage: 'luxecart_locale',
      // Cache detected language in localStorage
      caches: ['localStorage'],
    },
  });

export default i18n;
