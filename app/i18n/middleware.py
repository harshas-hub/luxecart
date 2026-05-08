from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.i18n.translator import SUPPORTED_LOCALES, DEFAULT_LOCALE


class LocaleMiddleware(BaseHTTPMiddleware):
    """
    Middleware that parses the Accept-Language header and stores
    the resolved locale in request.state.locale.

    Supports quality-value syntax:
        Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7

    The middleware picks the highest-quality locale from our supported set.
    Falls back to "en" if no supported locale is found.
    """

    async def dispatch(self, request: Request, call_next):
        accept_language = request.headers.get("accept-language", "")
        locale = self._parse_accept_language(accept_language)
        request.state.locale = locale
        response = await call_next(request)
        # Set Content-Language header in response for transparency
        response.headers["Content-Language"] = locale
        return response

    @staticmethod
    def _parse_accept_language(header: str) -> str:
        """
        Parse Accept-Language header and return the best matching locale.

        Examples:
            "de-DE,de;q=0.9,en;q=0.8" → "de"
            "te"                        → "te"
            ""                          → "en"
            "fr-FR,fr;q=0.9"           → "en" (fr not supported, fallback)
        """
        if not header:
            return DEFAULT_LOCALE

        # Parse quality values
        languages = []
        for part in header.split(","):
            part = part.strip()
            if not part:
                continue

            if ";q=" in part:
                lang, q = part.split(";q=", 1)
                try:
                    quality = float(q.strip())
                except ValueError:
                    quality = 0.0
            else:
                lang = part
                quality = 1.0

            # Normalize: "de-DE" → "de", "en-US" → "en"
            lang = lang.strip().split("-")[0].lower()
            languages.append((lang, quality))

        # Sort by quality descending
        languages.sort(key=lambda x: x[1], reverse=True)

        # Return first supported locale
        for lang, _ in languages:
            if lang in SUPPORTED_LOCALES:
                return lang

        return DEFAULT_LOCALE
