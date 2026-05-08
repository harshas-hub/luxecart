from fastapi import Request

from app.i18n.translator import translator, DEFAULT_LOCALE, Translator


def get_locale(request: Request) -> str:
    """
    FastAPI dependency that returns the resolved locale from the request.

    The locale is set by LocaleMiddleware from the Accept-Language header.
    Falls back to "en" if middleware hasn't run or locale is missing.

    Usage in routes:
        @router.get("/items")
        def get_items(locale: str = Depends(get_locale)):
            ...
    """
    return getattr(request.state, "locale", DEFAULT_LOCALE)


def get_translator() -> Translator:
    """
    FastAPI dependency that returns the Translator singleton.

    Usage in routes:
        @router.get("/items")
        def get_items(t: Translator = Depends(get_translator)):
            message = t.t("de", "messages.welcome")
    """
    return translator
