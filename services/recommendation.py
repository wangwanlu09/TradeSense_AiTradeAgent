from .strategy_analyzer import analyze_stock_strategy, analyze_crypto_strategy
import requests

STOCK_LIST = ["AAPL", "MSFT", "TSLA", "NVDA", "AMZN", "GOOG", "META", "NFLX", "INTC", "AMD"]

def get_stock_price(symbol: str):
    """
    Get current stock price and price change from Yahoo Finance API via RapidAPI or other.
    (Here we simulate with dummy data or use real API if available)
    """
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
    try:
        res = requests.get(url)
        data = res.json()
        price = data["chart"]["result"][0]["meta"]["regularMarketPrice"]
        previous_close = data["chart"]["result"][0]["meta"]["previousClose"]
        change_percent = ((price - previous_close) / previous_close) * 100
        return {
            "price": round(price, 2),
            "change_percent": round(change_percent, 2)
        }
    except:
        return {"price": None, "change_percent": None}


def recommend_top_stocks(count: int = 10):
    result = []
    for symbol in STOCK_LIST:
        analysis = analyze_stock_strategy(symbol)  # should include news + technical
        if "error" not in analysis:
            score = calculate_stock_score(analysis)
            price_data = get_stock_price(symbol)

            result.append({
                "symbol": symbol,
                "score": score,
                "price": price_data["price"],
                "change_percent": price_data["change_percent"],
                "news_sentiment": analysis.get("news_sentiment", ""),
                "technical_summary": analysis.get("technical_summary", "")
            })

    sorted_result = sorted(result, key=lambda x: x["score"], reverse=True)
    return sorted_result[:count]


def get_crypto_price(symbol: str):
    """
    Get current crypto price and 24h change from Binance API.
    """
    url = f"https://api.binance.com/api/v3/ticker/24hr?symbol={symbol}USDT"
    try:
        res = requests.get(url)
        data = res.json()
        price = float(data["lastPrice"])
        change_percent = float(data["priceChangePercent"])
        return {
            "price": round(price, 4),
            "change_percent": round(change_percent, 2)
        }
    except:
        return {"price": None, "change_percent": None}


def get_top_binance_symbols(limit=20):
    url = "https://api.binance.com/api/v3/ticker/24hr"
    try:
        res = requests.get(url)
        data = res.json()
        usdt_pairs = [item for item in data if item["symbol"].endswith("USDT")]
        sorted_by_volume = sorted(usdt_pairs, key=lambda x: float(x["quoteVolume"]), reverse=True)
        top_symbols = [item["symbol"].replace("USDT", "") for item in sorted_by_volume[:limit]]
        return top_symbols
    except:
        return []


def recommend_top_cryptos(count: int = 10):
    result = []
    crypto_symbols = get_top_binance_symbols(limit=30)

    for symbol in crypto_symbols:
        analysis = analyze_crypto_strategy(symbol)  # should include news + technical
        if "error" not in analysis:
            score = calculate_crypto_score(analysis)
            price_data = get_crypto_price(symbol)

            result.append({
                "symbol": symbol,
                "score": score,
                "price": price_data["price"],
                "change_percent": price_data["change_percent"],
                "news_sentiment": analysis.get("news_sentiment", ""),
                "technical_summary": analysis.get("technical_summary", "")
            })

    sorted_result = sorted(result, key=lambda x: x["score"], reverse=True)
    return sorted_result[:count]
