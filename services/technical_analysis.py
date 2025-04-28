import requests
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import yfinance as yf  # for stock data

# --- Crypto Technical Indicators using Binance API ---
def get_crypto_technical_indicator(symbol: str):
    """
    Get technical indicators for a given crypto symbol from Binance.
    Includes RSI, MA_20, MA_120 and Volume.
    """
    symbol = symbol.upper()
    binance_symbol = f"{symbol}USDT"

    # Fetch historical klines (candlestick) data for 120 days
    url = "https://api.binance.com/api/v3/klines"
    params = {
        "symbol": binance_symbol,
        "interval": "1d",
        "limit": 120
    }
    response = requests.get(url, params=params)
    data = response.json()

    if not data or isinstance(data, dict) and data.get("code"):
        return {"error": f"Failed to fetch data for {binance_symbol}"}

    # Parse close prices and volumes
    closes = [float(kline[4]) for kline in data]
    volumes = [float(kline[5]) for kline in data]
    df = pd.DataFrame({
        "close": closes,
        "volume": volumes
    })

    # Calculate RSI
    delta = df['close'].diff()
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)
    avg_gain = gain.rolling(window=14).mean()
    avg_loss = loss.rolling(window=14).mean()
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    latest_rsi = rsi.iloc[-1]

    # Moving Averages
    ma_20 = df['close'].rolling(window=20).mean().iloc[-1]
    ma_120 = df['close'].rolling(window=120).mean().iloc[-1]
    latest_volume = df['volume'].iloc[-1]

    return {
        "symbol": binance_symbol,
        "RSI": round(latest_rsi, 2),
        "MA_20": round(ma_20, 2),
        "MA_120": round(ma_120, 2),
        "Volume": int(latest_volume)
    }

# --- Stock Technical Indicators using Yahoo Finance ---
def get_stock_technical_indicator(symbol: str):
    """
    Get technical indicators for a given stock symbol using Yahoo Finance.
    Includes RSI, MA_50 and Volume.
    """
    stock = yf.Ticker(symbol)
    df = stock.history(period="6mo", interval="1d")

    if df.empty:
        return {"error": f"No data found for stock symbol: {symbol}"}

    df['close'] = df['Close']

    # Calculate RSI
    delta = df['close'].diff()
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)
    avg_gain = gain.rolling(window=14).mean()
    avg_loss = loss.rolling(window=14).mean()
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    latest_rsi = rsi.iloc[-1]

    ma_50 = df['close'].rolling(window=50).mean().iloc[-1]
    latest_volume = df['Volume'].iloc[-1]

    return {
        "symbol": symbol.upper(),
        "RSI": round(latest_rsi, 2),
        "MA_50": round(ma_50, 2),
        "Volume": int(latest_volume)
    }


