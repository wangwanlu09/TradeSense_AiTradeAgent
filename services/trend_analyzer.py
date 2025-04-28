import requests
import yfinance as yf

def analyze_market_trend():
    # stock（yfinance）
    index_symbols = {
        "S&P500": "^GSPC",
        "NASDAQ": "^IXIC",
        "Dow Jones": "^DJI"
    }

    stock_changes = {}
    for name, symbol in index_symbols.items():
        data = yf.Ticker(symbol).history(period="1d")
        open_price = data["Open"][-1]
        close_price = data["Close"][-1]
        pct_change = (close_price - open_price) / open_price * 100
        stock_changes[name] = {
            "current_price": f"${round(close_price, 2)}",
            "percentage_change": round(pct_change, 2)
        }

    stock_avg_trend = round(
        sum(v["percentage_change"] for v in stock_changes.values()) / len(stock_changes), 2
    )

    # crpto
    crypto_ids = "bitcoin,ethereum,binancecoin,solana,dogecoin"
    response = requests.get("https://api.coingecko.com/api/v3/coins/markets", params={
        "vs_currency": "usd",
        "ids": crypto_ids,
        "price_change_percentage": "24h"
    })
    crypto_data = response.json()

    crypto_info = {
        coin["id"]: {
            "current_price": f"${round(coin['current_price'], 2)}",
            "percentage_change": round(coin["price_change_percentage_24h"], 2)
        }
        for coin in crypto_data
    }

    crypto_avg_trend = round(
        sum(v["percentage_change"] for v in crypto_info.values()) / len(crypto_info), 2
    )

    return {
        "stock_market": {
            "indices": stock_changes,
            "avg_trend": stock_avg_trend
        },
        "crypto_market": {
            "coins": crypto_info,
            "avg_trend": crypto_avg_trend
        }
    }

