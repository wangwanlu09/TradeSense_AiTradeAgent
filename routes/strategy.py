from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class StrategyInput(BaseModel):
    symbol: str
    sentiment: str  # "positive", "negative", "neutral"
    rsi: float

def generate_strategy(sentiment: str, rsi: float) -> str:
    if sentiment == "positive" and rsi < 30:
        return "Buy"
    elif sentiment == "negative" and rsi > 70:
        return "Sell"
    else:
        return "Hold"

@router.post("/recommend_strategy")
def recommend_strategy(data: StrategyInput):
    strategy = generate_strategy(data.sentiment, data.rsi)
    return {
        "symbol": data.symbol,
        "recommended_action": strategy,
        "reason": f"Sentiment: {data.sentiment}, RSI: {data.rsi}"
    }