from fastapi import APIRouter
from services.technical_analysis import get_stock_technical_indicator, get_crypto_technical_indicator

router = APIRouter()

@router.get("/technical/stock/{symbol}", tags=["Stock Technical"])
def get_stock_technical(symbol: str):
    """
    Get technical indicators for a given stock symbol.

    Returns common indicators such as RSI, MA (Moving Average), and Volume.
    """
    return get_stock_technical_indicator(symbol)

@router.get("/technical/crypto/{symbol}", tags=["Crypto Technical"])
def get_crypto_technical(symbol: str):
    """
    Get technical indicators for a given crypto symbol.

    Returns common indicators such as RSI, MA (Moving Average), and Volume.
    """
    return get_crypto_technical_indicator(symbol)

