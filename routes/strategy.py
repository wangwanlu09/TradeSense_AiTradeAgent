from fastapi import APIRouter
from services.strategy_analyzer import analyze_stock_strategy, analyze_crypto_strategy, get_recommended_stocks, get_recommended_cryptos

router = APIRouter()

@router.get("/strategy/stock/{symbol}", tags=["Stock Strategy"])
def get_stock_strategy(symbol: str):
    """
    Get trading strategy recommendation for a stock symbol.
    This includes both news sentiment analysis and technical indicators.
    """
    return analyze_stock_strategy(symbol)

@router.get("/strategy/crypto/{symbol}", tags=["Crypto Strategy"])
def get_crypto_strategy(symbol: str):
    """
    Get trading strategy recommendation for a crypto symbol.
    This includes both news sentiment analysis and technical indicators.
    """
    return analyze_crypto_strategy(symbol)

@router.get("/strategy", tags=["Strategy"])
def get_strategy(symbol: str, is_crypto: bool = False):
    """
    Get trading strategy recommendation based on the is_crypto flag.
    This endpoint is used by the frontend.
    """
    if is_crypto:
        return analyze_crypto_strategy(symbol)
    else:
        return analyze_stock_strategy(symbol)

@router.get("/strategy/recommended-stocks", tags=["Recommendations"])
def get_stock_recommendations():
    """
    Get a list of recommended stocks based on technical and sentiment analysis.
    """
    return get_recommended_stocks()

@router.get("/strategy/recommended-cryptos", tags=["Recommendations"])
def get_crypto_recommendations():
    """
    Get a list of recommended cryptocurrencies based on technical and sentiment analysis.
    """
    return get_recommended_cryptos()


