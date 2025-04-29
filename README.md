# AI Trade Agent

TradeSense is an AI-powered trading assistant that helps users analyze financial news, market trends, and provides intelligent investment insights.

![TradeSense Home](https://github.com/wangwanlu09/TradeSense_AiTradeAgent/blob/main/Home.png?raw=true)

## Background + Overview

Making smart investments shouldn’t require constant monitoring of volatile markets or spending hours reading scattered financial news. TradeSense is designed to simplify that process with real-time, AI-powered trading insights based on news sentiment, technical analysis, and live market data.

Imagine opening your dashboard and instantly understanding the market mood, key opportunities, and smart strategies—all backed by real-time data and intelligent recommendations. With TradeSense, trading becomes more informed, focused, and accessible.


## Features

- **News Analysis**: Analyzes financial news to extract sentiment and relevant insights
- **Technical Analysis**: Provides technical indicators and chart pattern recognition
- **Strategy Evaluation**: Evaluates and recommends trading strategies based on market conditions
- **Market Insights**: Offers real-time market data and trend analysis
- **Personalized Recommendations**: Generates tailored investment recommendations

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

- **Backend**: FastAPI, Python
- **Frontend**: React, TypeScript, Tailwind CSS
- **AI/ML**:  Azure AI Agent Service (GPT models), Azure AI Text Analytics
- **Other**: Redis for caching

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
