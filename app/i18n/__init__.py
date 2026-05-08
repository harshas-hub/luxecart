"""
LuxeCart i18n Module
====================

Provides backend localization support:
- LocaleMiddleware: Parses Accept-Language headers
- get_locale: FastAPI dependency for current request locale
- get_translator: FastAPI dependency for Translator instance
- translator: Module-level Translator singleton
- SUPPORTED_LOCALES: Set of supported locale codes
- DEFAULT_LOCALE: Fallback locale ("en")
"""

from app.i18n.middleware import LocaleMiddleware
from app.i18n.dependencies import get_locale, get_translator
from app.i18n.translator import translator, SUPPORTED_LOCALES, DEFAULT_LOCALE

__all__ = [
    "LocaleMiddleware",
    "get_locale",
    "get_translator",
    "translator",
    "SUPPORTED_LOCALES",
    "DEFAULT_LOCALE",
]
