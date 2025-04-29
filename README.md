# TradeSense: AI Trade Agent

TradeSense is an AI-powered trading assistant that helps users analyze financial news, market trends, and provides intelligent investment insights.

![TradeSense Home](https://github.com/wangwanlu09/TradeSense_AiTradeAgent/blob/main/Home.png?raw=true)

## Background + Overview

Making smart investments shouldn’t require constant monitoring of volatile markets or spending hours reading scattered financial news. TradeSense is designed to simplify that process with real-time, AI-powered trading insights based on news sentiment, technical analysis, and live market data.

Imagine opening your dashboard and instantly understanding the market mood, key opportunities, and smart strategies—all backed by real-time data and intelligent recommendations. With TradeSense, trading becomes more informed, focused, and accessible.

![TradeSense Overview News](https://github.com/wangwanlu09/TradeSense_AiTradeAgent/blob/main/Overview%20News%20Analysis.png?raw=true)

![TradeSense Market Trend](https://github.com/wangwanlu09/TradeSense_AiTradeAgent/blob/main/Market%20Trend.png?raw=true)

### The Problem:

- **Too Much Noise**: Investors are overwhelmed by fragmented news sources and conflicting signals.
- **Lack of Personalization**: Most tools don’t adapt to individual risk preferences or investment styles.
- **Outdated Tools**: Traditional market analysis is slow and reactive, not predictive.

### Our Solution:

Powered by cutting-edge AI models and real-time financial data, TradeSense delivers personalized, intelligent trading insights across both crypto and stock markets. Whether you're a new investor overwhelmed by market noise or an experienced trader looking to enhance your strategy, TradeSense helps you make smarter, faster decisions.

By combining live news sentiment analysis with technical indicators like RSI, MA20, MA120, and volume trends, TradeSense adapts continuously to changing market conditions—ensuring every recommendation is timely, relevant, and actionable.

## Features

- **News Analysis**  
  Analyzes financial news in real time to extract sentiment, identify key topics, and surface relevant market insights.

- **Technical Analysis**  
  Provides essential technical indicators such as RSI, MA20, MA120, and volume analytics, along with basic chart pattern recognition.

- **Strategy Evaluation**  
  Evaluates market conditions and suggests trading strategies based on data-driven insights and sentiment signals.

- **Market Insights**  
  Offers real-time stock and crypto market data, highlighting major movements and emerging trends.

- **Personalized Recommendations**  
  Delivers tailored investment suggestions based on user preferences, live data, and AI-driven analysis.

## How It Works

TradeSense combines real-time data retrieval, AI-powered analysis, and personalized strategy generation to deliver actionable trading insights. Here's how the system works:

- **News Aggregation**  
  The system continuously fetches and filters financial news from reliable sources across the stock and crypto markets.

  ![TradeSense News Analysis](https://github.com/wangwanlu09/TradeSense_AiTradeAgent/blob/main/News%20Analysis.png?raw=true)

- **Sentiment Analysis**  
  AI models analyze the news content to detect market sentiment (positive, neutral, negative) and identify key financial signals.

- **Strategy Evaluation**  
  Evaluates market conditions and suggests trading strategies based on data-driven insights and sentiment signals.

- **Technical Indicator Calculation**  
  Using APIs (e.g., Binance, Yahoo Finance), TradeSense calculates indicators such as RSI, MA20, MA120, and volume trends for selected assets.

- **Strategy & Trend Evaluation**  
  Based on combined news sentiment and technical signals, the system generates strategy suggestions and highlights short-term trends.

- **Personalized Recommendations**  
  Finally, TradeSense tailors its output based on user preferences or portfolio interests, delivering concise, actionable recommendations via dashboard or chat.
  
## Project Structure

```
├── main.py                 # FastAPI application entry point
├── routes/                 # API route definitions
│   ├── news.py             # News analysis endpoints
│   ├── market.py           # Market data endpoints
│   ├── technical.py        # Technical analysis endpoints
│   ├── strategy.py         # Strategy evaluation endpoints
│   └── recommend.py        # Recommendation endpoints
├── services/               # Business logic services
│   ├── news_analyzer.py    # News processing and analysis
│   ├── technical_analysis.py # Technical indicators and patterns
│   ├── strategy_analyzer.py  # Strategy evaluation logic
│   ├── trend_analyzer.py     # Market trend analysis
│   ├── recommendation.py     # Recommendation generation
│   └── gpt_client.py         # GPT integration for analysis
├── frontend/               # React frontend application
│   ├── src/                # Frontend source code
│   └── public/             # Static assets
└── requirements.txt        # Python dependencies
```

## Setup Instructions

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-trade-agent.git
   cd ai-trade-agent
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # On Windows
   .venv\Scripts\activate
   # On macOS/Linux
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at http://localhost:5173

## API Endpoints

- `GET /news` - Get analyzed financial news
- `GET /market` - Get market data
- `GET /technical` - Get technical analysis for specific securities
- `GET /strategy` - Get strategy evaluations and recommendations
- `GET /recommend` - Get personalized investment recommendations

## Technologies Used 
Here’s what powers the intelligent trading experience behind **TradeSense**:

- **FastAPI ⚡**  
  A high-performance web framework for handling API requests efficiently, enabling real-time data access and interaction with the AI trade agent.

- **React + TypeScript + Tailwind CSS 💻**  
  A modern, responsive front-end stack that ensures a smooth user interface with clean visuals, dynamic updates, and a great dashboard experience.

- **Azure AI Agent Service 🤖**  
  Powers intelligent interactions and trading recommendations using cutting-edge GPT models tailored for financial context and dialogue.

- **Azure Text Analytics 🧠**  
  Extracts sentiment and key insights from financial news, turning unstructured text into actionable intelligence.

- **Redis 🔄**  
  Used for caching frequently accessed data like market summaries or news sentiment results, improving system responsiveness.

## Insights Deep Dive

### Real-Time Smart Analysis  
TradeSense retrieves the latest financial news and market data based on user input (e.g., BTC or a specific stock), and uses AI models to analyze current sentiment and trends. For example, when a user enters “AAPL?”, the system combines sentiment analysis and technical indicators to generate a real-time market summary and actionable insight.

### GPT-Powered Summaries   
Powered by Azure AI Agent Service with GPT models, TradeSense produces concise and insightful trend summaries.  
**Example output**: *“Lower stock futures signal cautious sentiment as investors await earnings reports, company results and outlooks.”*

![TradeSense Business News](https://github.com/wangwanlu09/TradeSense_AiTradeAgent/blob/main/Business%20News.png?raw=true)

### Multimodal Insights   
By combining news sentiment, market movement (e.g., price and percent change), and technical indicators such as RSI, MA20, and MA120, TradeSense provides a comprehensive market perspective. This multi-signal approach helps users make better-informed decisions and avoid relying on a single indicator.


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
