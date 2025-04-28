from fastapi import APIRouter
from services.strategy_analyzer import get_recommended_stocks, get_recommended_cryptos

router = APIRouter(prefix="/recommend", tags=["Recommendation"])

@router.get("/stocks")
def get_stock_recommendations(count: int = 10):
    
    recommendations = get_recommended_stocks()
    return {"recommendations": recommendations[:count] if count else recommendations}

@router.get("/cryptos")
def get_crypto_recommendations(count: int = 10):
   
    recommendations = get_recommended_cryptos()
    return {"recommendations": recommendations[:count] if count else recommendations}
