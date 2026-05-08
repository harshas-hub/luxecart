import json
import os
from typing import Dict, Optional


# Supported locales
SUPPORTED_LOCALES = {"en", "de", "te"}
DEFAULT_LOCALE = "en"


class Translator:
    """
    Loads JSON translation catalogs and provides dot-notation key lookup.

    Usage:
        translator = Translator()
        translator.t("de", "order_status.pending")  # → "Ausstehend"
        translator.t("te", "messages.cart_empty")    # → "మీ కార్ట్ ఖాళీగా ఉంది."
    """

    def __init__(self):
        self._catalogs: Dict[str, dict] = {}
        self._load_all()

    def _load_all(self):
        """Load all locale JSON files from the locales/ directory."""
        locales_dir = os.path.join(os.path.dirname(__file__), "locales")
        for locale in SUPPORTED_LOCALES:
            filepath = os.path.join(locales_dir, f"{locale}.json")
            if os.path.exists(filepath):
                with open(filepath, "r", encoding="utf-8") as f:
                    self._catalogs[locale] = json.load(f)
            else:
                self._catalogs[locale] = {}

    def t(self, locale: str, key: str, fallback: Optional[str] = None) -> str:
        """
        Translate a key using dot-notation.

        Args:
            locale: Target locale (e.g., "de", "te")
            key: Dot-separated key path (e.g., "order_status.pending")
            fallback: Optional fallback string if key not found anywhere

        Returns:
            Translated string, or English fallback, or the raw key.
        """
        # Normalize locale — take first 2 chars (e.g., "de-DE" → "de")
        lang = locale[:2].lower() if locale else DEFAULT_LOCALE

        if lang not in SUPPORTED_LOCALES:
            lang = DEFAULT_LOCALE

        # Try target locale first
        result = self._resolve_key(lang, key)
        if result is not None:
            return result

        # Fallback to English
        if lang != DEFAULT_LOCALE:
            result = self._resolve_key(DEFAULT_LOCALE, key)
            if result is not None:
                return result

        # Final fallback: custom fallback or raw key
        return fallback if fallback is not None else key

    def _resolve_key(self, locale: str, key: str) -> Optional[str]:
        """Walk the catalog dict using dot-separated key path."""
        catalog = self._catalogs.get(locale, {})
        parts = key.split(".")
        current = catalog

        for part in parts:
            if isinstance(current, dict) and part in current:
                current = current[part]
            else:
                return None

        # Must resolve to a string, not a nested dict
        return current if isinstance(current, str) else None

    def get_section(self, locale: str, section: str) -> dict:
        """
        Get an entire section of translations (e.g., all order statuses).

        Args:
            locale: Target locale
            section: Top-level key (e.g., "order_status")

        Returns:
            Dict of translations for that section.
        """
        lang = locale[:2].lower() if locale else DEFAULT_LOCALE
        if lang not in SUPPORTED_LOCALES:
            lang = DEFAULT_LOCALE

        catalog = self._catalogs.get(lang, {})
        result = catalog.get(section, {})

        # Fallback to English if section is empty
        if not result and lang != DEFAULT_LOCALE:
            result = self._catalogs.get(DEFAULT_LOCALE, {}).get(section, {})

        return result


# Module-level singleton — created once on import
translator = Translator()
