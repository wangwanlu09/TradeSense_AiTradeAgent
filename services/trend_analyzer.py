import requests
import yfinance as yf

def analyze_market_trend():
    # 获取主要股指的涨跌幅
    stock_indices = ["^GSPC", "^IXIC", "^DJI"]
    stock_changes = []

    for symbol in stock_indices:
        data = yf.Ticker(symbol).history(period="1d")
        pct = (data["Close"][-1] - data["Open"][-1]) / data["Open"][-1] * 100
        stock_changes.append(pct)

    stock_avg_trend = round(sum(stock_changes) / len(stock_changes), 2)

    # 使用 CoinGecko API 获取加密货币的 24 小时价格变化百分比
    crypto_ids = "bitcoin,ethereum,binancecoin,xrp,solana,dogecoin,toncoin"
    response = requests.get("https://api.coingecko.com/api/v3/coins/markets", params={
        "vs_currency": "usd",
        "ids": crypto_ids,
        "price_change_percentage": "24h"
    })
    crypto_data = response.json()

    # 提取每个币种的价格变化百分比
    crypto_changes = [coin["price_change_percentage_24h"] for coin in crypto_data]
    crypto_avg_trend = round(sum(crypto_changes) / len(crypto_changes), 2)

    return {
        "stock_market": {
            "indices": dict(zip(stock_indices, stock_changes)),
            "avg_trend": stock_avg_trend
        },
        "crypto_market": {
            "coins": {coin["id"]: coin["price_change_percentage_24h"] for coin in crypto_data},
            "avg_trend": crypto_avg_trend
        }
    }
