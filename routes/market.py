# routes/market.py
from fastapi import APIRouter
from services.trend_analyzer import analyze_market_trend

router = APIRouter()

@router.get("/market", tags=["Market Trend"])
def market_overview():
    return analyze_market_trend()

