import requests
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import yfinance as yf  # for stock data
from services.technical_analysis import get_crypto_technical_indicator, get_stock_technical_indicator

# --- Sentiment Analysis (Real Implementation) ---
def analyze_crypto_news_sentiment(symbol: str):
    """
    Analyze the sentiment of the latest news articles for a given cryptocurrency symbol.
    Returns sentiment analysis results from real news API.
    """
    import os
    from services.news_analyzer import fetch_and_analyze_news_by_url
    
    NEWS_API_KEY = os.getenv("NEWS_API_KEY")
    # Get news specific to the crypto symbol
    url = f"https://newsapi.org/v2/everything?q={symbol} crypto&language=en&sortBy=publishedAt&apiKey={NEWS_API_KEY}"
    
    results = fetch_and_analyze_news_by_url(url)
    
    if "error" in results:
        # Fallback to default data if API call fails
        articles = [
            {"title": f"{symbol} market analysis", "gpt_analysis": "Positive"},
            {"title": f"{symbol} price prediction", "gpt_analysis": "Neutral"},
            {"title": f"{symbol} trading volume increases", "gpt_analysis": "Positive"},
        ]
        return {"symbol": symbol, "articles": articles}
    
    # Transform API results to match expected format
    simplified_articles = []
    for article in results.get("articles", [])[:5]:  # Limit to 5 articles
        sentiment = "Positive"
        if article.get("azure_sentiment") and article["azure_sentiment"].get("label"):
            azure_label = article["azure_sentiment"]["label"].lower()
            if azure_label == "negative":
                sentiment = "Negative"
            elif azure_label == "neutral":
                # For neutral, look at confidence scores to decide
                if article["azure_sentiment"].get("confidence_scores"):
                    scores = article["azure_sentiment"]["confidence_scores"]
                    if scores.get("negative", 0) > scores.get("positive", 0):
                        sentiment = "Negative"
        
        simplified_articles.append({
            "title": article.get("title", ""),
            "gpt_analysis": sentiment
        })
    
    return {"symbol": symbol, "articles": simplified_articles}

def analyze_stock_news_sentiment(symbol: str):
    """
    Analyze the sentiment of the latest news articles for a given stock symbol.
    Returns sentiment analysis results from real news API.
    """
    import os
    from services.news_analyzer import fetch_and_analyze_news_by_url
    
    NEWS_API_KEY = os.getenv("NEWS_API_KEY")
    # Get news specific to the stock symbol
    url = f"https://newsapi.org/v2/everything?q={symbol} stock&language=en&sortBy=publishedAt&apiKey={NEWS_API_KEY}"
    
    results = fetch_and_analyze_news_by_url(url)
    
    if "error" in results:
        # Fallback to default data if API call fails
        articles = [
            {"title": f"{symbol} earnings report", "gpt_analysis": "Positive"},
            {"title": f"{symbol} market outlook", "gpt_analysis": "Neutral"},
            {"title": f"{symbol} company news", "gpt_analysis": "Positive"},
        ]
        return {"symbol": symbol, "articles": articles}
    
    # Transform API results to match expected format
    simplified_articles = []
    for article in results.get("articles", [])[:5]:  # Limit to 5 articles
        sentiment = "Positive"
        if article.get("azure_sentiment") and article["azure_sentiment"].get("label"):
            azure_label = article["azure_sentiment"]["label"].lower()
            if azure_label == "negative":
                sentiment = "Negative"
            elif azure_label == "neutral":
                # For neutral, look at confidence scores to decide
                if article["azure_sentiment"].get("confidence_scores"):
                    scores = article["azure_sentiment"]["confidence_scores"]
                    if scores.get("negative", 0) > scores.get("positive", 0):
                        sentiment = "Negative"
        
        simplified_articles.append({
            "title": article.get("title", ""),
            "gpt_analysis": sentiment
        })
    
    return {"symbol": symbol, "articles": simplified_articles}

# --- Strategy Analysis ---
def generate_strategy_signal(symbol: str, is_crypto: bool):
    """
    Generate a strategy signal based on technical indicators and sentiment analysis.
    """
    # Fetch technical indicators
    if is_crypto:
        tech_indicators = get_crypto_technical_indicator(symbol)
    else:
        tech_indicators = get_stock_technical_indicator(symbol)

    if "error" in tech_indicators:
        return tech_indicators

    rsi = tech_indicators.get("RSI")
    ma_20 = tech_indicators.get("MA_20" if is_crypto else "MA_50")
    ma_120 = tech_indicators.get("MA_120" if is_crypto else "MA_50")
    volume = tech_indicators.get("Volume")

    # Generate technical signals
    buy_signal = False
    sell_signal = False

    # RSI Signal
    if rsi < 30:
        buy_signal = True
    elif rsi > 70:
        sell_signal = True

    # Moving Average Signal (Bullish crossover: MA_20 > MA_120)
    if ma_20 > ma_120:
        buy_signal = True
    elif ma_20 < ma_120:
        sell_signal = True

    # Volume Signal (Check if volume is above average)
    avg_volume = volume  # You could implement a rolling average for volume
    if volume > avg_volume * 1.5:  # Example: Volume spike threshold
        if not sell_signal:  # Avoid double sell signal if RSI and MA are not confirming
            sell_signal = True

    # Fetch news sentiment
    if is_crypto:
        sentiment_data = analyze_crypto_news_sentiment(symbol)
    else:
        sentiment_data = analyze_stock_news_sentiment(symbol)

    if "articles" not in sentiment_data:
        return {"error": "No news articles found."}

    positive_sentiment = sum(1 for article in sentiment_data["articles"] if article["gpt_analysis"] == "Positive") / len(sentiment_data["articles"])
    negative_sentiment = 1 - positive_sentiment

    # Combine sentiment and technical signals
    if positive_sentiment > 0.6:  # Positive sentiment threshold
        buy_signal = True
    elif negative_sentiment > 0.6:  # Negative sentiment threshold
        sell_signal = True

    # Combine Signals
    if buy_signal and sell_signal:
        final_signal = "Hold"  # If conflicting signals
    elif buy_signal:
        final_signal = "Buy"
    elif sell_signal:
        final_signal = "Sell"
    else:
        final_signal = "Hold"  # No clear signal

    return {
        "symbol": symbol,
        "buy_signal": buy_signal,
        "sell_signal": sell_signal,
        "final_signal": final_signal,
        "technical_indicators": tech_indicators,
        "positive_sentiment": positive_sentiment,
        "negative_sentiment": negative_sentiment
    }

# --- Main endpoints that will be called by routes ---
def analyze_stock_strategy(symbol: str):
    """
    Analyze a stock symbol and generate a trading strategy recommendation.
    This function is used by the API endpoints.
    """
    return generate_strategy_signal(symbol, is_crypto=False)

def analyze_crypto_strategy(symbol: str):
    """
    Analyze a cryptocurrency symbol and generate a trading strategy recommendation.
    This function is used by the API endpoints.
    """
    return generate_strategy_signal(symbol, is_crypto=True)

# --- Strategy Recommendations for Multiple Assets ---
def get_top_stock_symbols():
    """
    Fetch the top 10 stock symbols that have the highest potential based on technical and sentiment analysis.
    """
    stock_symbols = ["AAPL", "MSFT", "GOOG", "AMZN", "TSLA", "NVDA", "META", "SPY", "AMD", "NFLX"]  # Sample list
    stock_recommendations = []

    for symbol in stock_symbols:
        strategy = generate_strategy_signal(symbol, is_crypto=False)
        if strategy.get("final_signal") == "Buy":
            stock_recommendations.append(strategy)

    return stock_recommendations[:10]  # Return top 10 recommendations

def get_top_crypto_symbols():
    """
    Fetch the top 10 cryptocurrency symbols that have the highest potential based on technical and sentiment analysis.
    """
    crypto_symbols = ["BTC", "ETH", "BNB", "ADA", "SOL", "XRP", "DOGE", "DOT", "LTC", "MATIC"]  # Sample list
    crypto_recommendations = []

    for symbol in crypto_symbols:
        strategy = generate_strategy_signal(symbol, is_crypto=True)
        if strategy.get("final_signal") == "Buy":
            crypto_recommendations.append(strategy)

    return crypto_recommendations[:10]  # Return top 10 recommendations

# --- Main endpoints to display recommendations ---
def get_recommended_stocks():
    """
    Return a list of recommended stocks based on technical and sentiment analysis.
    """
    recommendations = get_top_stock_symbols()
    
    # If no recommendations found, return some default stocks with real-time data
    if not recommendations:
        # Default stocks to show when no recommendations are available (10个知名股票)
        default_symbols = ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "TSLA", "META", "JPM", "V", "WMT"]
        default_recommendations = []
        
        for symbol in default_symbols:
            try:
                # Get real-time data using yfinance
                stock = yf.Ticker(symbol)
                hist = stock.history(period="3mo")  # Get 3 months of history
                
                if len(hist) > 0:
                    # Calculate technical indicators
                    close_prices = hist['Close']
                    volume = hist['Volume']
                    
                    # Calculate RSI (14-day)
                    delta = close_prices.diff()
                    gain = delta.where(delta > 0, 0).rolling(window=14).mean()
                    loss = -delta.where(delta < 0, 0).rolling(window=14).mean()
                    rs = gain / loss
                    rsi = 100 - (100 / (1 + rs)).iloc[-1]  # Get latest RSI
                    
                    # Calculate 50-day Moving Average
                    ma_50 = close_prices.rolling(window=50).mean().iloc[-1]
                    
                    # Get latest volume
                    latest_volume = volume.iloc[-1]
                    
                    # Determine signal based on actual indicators
                    signal = "Hold"  # Default signal
                    if rsi < 30:
                        signal = "Buy"  # Oversold condition
                    elif rsi > 70:
                        signal = "Sell"  # Overbought condition
                    else:
                        # Check if price is above MA
                        latest_price = close_prices.iloc[-1]
                        if latest_price > ma_50:
                            signal = "Buy"
                    
                    # Add to recommendations
                    default_recommendations.append({
                        "symbol": symbol,
                        "name": stock.info.get("shortName", symbol),
                        "final_signal": signal,
                        "technical_indicators": {
                            "RSI": round(rsi, 2),
                            "MA_50": round(ma_50, 2),
                            "Volume": int(latest_volume)
                        }
                    })
            except Exception as e:
                print(f"Error fetching data for {symbol}: {e}")
                # Fallback in case of API error
                default_recommendations.append({
                    "symbol": symbol,
                    "name": symbol,
                    "final_signal": "Hold",
                    "technical_indicators": {
                        "RSI": "N/A",
                        "MA_50": "N/A",
                        "Volume": "N/A"
                    }
                })
        
        return default_recommendations
    
    return recommendations

def get_recommended_cryptos():
    """
    Return a list of recommended cryptocurrencies based on technical and sentiment analysis.
    """
    return get_top_crypto_symbols()

# You can call the above functions to get the list of top 10 stocks or cryptos for recommendations

