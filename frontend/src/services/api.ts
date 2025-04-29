import axios from "axios";

// Define types
interface MarketData {
    symbol: string;
    timeframe?: string;
    indicators?: string[];
}

// Base API URL
const API_URL = "http://localhost:8000";

// Create axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Handle request interceptor (e.g., for adding auth headers)
apiClient.interceptors.request.use(
    (config) => {
        // You can add an auth token here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// API service object
const apiService = {
    // News related API
    news: {
        // Get business news
        getBusinessNews: async () => {
            try {
                const response = await apiClient.get("/news");
                return response.data;
            } catch (error) {
                console.error("Error fetching business news:", error);
                throw error;
            }
        },

        // Get crypto news
        getCryptoNews: async () => {
            try {
                const response = await apiClient.get("/news/crypto");
                return response.data;
            } catch (error) {
                console.error("Error fetching crypto news:", error);
                throw error;
            }
        }
    },

    // Strategy related API
    strategy: {
        // Get strategy recommendation for a stock
        getStockStrategy: async (symbol: string) => {
            try {
                const response = await apiClient.get(`/strategy/stock/${symbol}`);
                return response.data;
            } catch (error) {
                console.error(`Error fetching stock strategy for ${symbol}:`, error);
                throw error;
            }
        },

        // Get strategy recommendation for a crypto asset
        getCryptoStrategy: async (symbol: string) => {
            try {
                const response = await apiClient.get(`/strategy/crypto/${symbol}`);
                return response.data;
            } catch (error) {
                console.error(`Error fetching crypto strategy for ${symbol}:`, error);
                throw error;
            }
        },

        // Generic strategy endpoint - using query parameters
        getStrategyWithParams: async (symbol: string, isCrypto: boolean = false) => {
            try {
                const response = await apiClient.get(`/strategy?symbol=${symbol}&is_crypto=${isCrypto}`);
                return response.data;
            } catch (error) {
                console.error(`Error fetching strategy for ${symbol}:`, error);
                throw error;
            }
        },

        // Get recommended stocks list
        getRecommendedStocks: async () => {
            try {
                const response = await apiClient.get('/strategy/recommended-stocks');
                return response.data;
            } catch (error) {
                console.error('Error fetching recommended stocks:', error);
                throw error;
            }
        },

        // Get recommended cryptocurrencies list
        getRecommendedCryptos: async () => {
            try {
                const response = await apiClient.get('/strategy/recommended-cryptos');
                return response.data;
            } catch (error) {
                console.error('Error fetching recommended cryptos:', error);
                throw error;
            }
        }
    },

    // Market related API
    market: {
        // Get market data for a specific symbol
        getMarketData: async (symbol: string) => {
            try {
                const response = await apiClient.get(`/market/${symbol}`);
                return response.data;
            } catch (error) {
                console.error(`Error fetching market data for ${symbol}:`, error);
                throw error;
            }
        },

        // Get general market trend overview
        getMarketTrend: async () => {
            try {
                const response = await apiClient.get('/market');
                return response.data;
            } catch (error) {
                console.error('Error fetching market trend:', error);
                throw error;
            }
        }
    },

    // Technical analysis related API
    technical: {
        // Get technical indicators for a stock
        getStockTechnical: async (symbol: string) => {
            try {
                const response = await apiClient.get(`/technical/stock/${symbol}`);
                return response.data;
            } catch (error) {
                console.error(`Error fetching stock technical indicators for ${symbol}:`, error);
                throw error;
            }
        },

        // Get technical indicators for a crypto asset
        getCryptoTechnical: async (symbol: string) => {
            try {
                const response = await apiClient.get(`/technical/crypto/${symbol}`);
                return response.data;
            } catch (error) {
                console.error(`Error fetching crypto technical indicators for ${symbol}:`, error);
                throw error;
            }
        }
    },

    // Direct data fetching functions (not relying on backend)
    directData: {
        // Get top stocks with real market data
        getTopStocks: async () => {
            const stockSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "JPM", "V", "WMT"];
            const stocks = [];

            try {
                // First try to get data from our API
                try {
                    const response = await apiClient.get('/strategy/recommended-stocks');
                    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                        return response.data;
                    }
                } catch (error) {
                    console.log("Backend API failed, using direct Yahoo Finance data");
                }

                // If backend fails, get data directly from Yahoo Finance
                for (const symbol of stockSymbols) {
                    try {
                        const yahooResponse = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d`);
                        const data = await yahooResponse.json();

                        if (data.chart && data.chart.result && data.chart.result.length > 0) {
                            const quote = data.chart.result[0].meta;
                            const previousClose = quote.previousClose || quote.chartPreviousClose;
                            const currentPrice = quote.regularMarketPrice;
                            const changePercent = previousClose ? ((currentPrice - previousClose) / previousClose) * 100 : 0;

                            // Generate a random signal based on price movement
                            let signal = "Hold";
                            if (changePercent > 1.5) signal = "Buy";
                            else if (changePercent < -1.5) signal = "Sell";

                            stocks.push({
                                symbol: symbol,
                                name: quote.instrumentName || symbol,
                                final_signal: signal,
                                price: currentPrice,
                                change: parseFloat(changePercent.toFixed(2))
                            });
                        }
                    } catch (error) {
                        console.error(`Error fetching data for ${symbol}:`, error);
                    }
                }

                return stocks;
            } catch (error) {
                console.error("Error in getTopStocks:", error);
                throw error;
            }
        },

        // Get top cryptos with real market data
        getTopCryptos: async () => {
            const cryptoIds = "bitcoin,ethereum,binancecoin,solana,ripple,cardano,dogecoin,polkadot,litecoin,matic-network";

            try {
                // First try to get data from our API
                try {
                    const response = await apiClient.get('/strategy/recommended-cryptos');
                    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                        return response.data;
                    }
                } catch (error) {
                    console.log("Backend API failed, using direct CoinGecko data");
                }

                // If backend fails, get data directly from CoinGecko
                const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoIds}&price_change_percentage=24h`);
                const coinData = await response.json();

                const cryptos = coinData.map((coin: {
                    id: string;
                    symbol: string;
                    name: string;
                    current_price: number;
                    price_change_percentage_24h: number;
                }) => {
                    // Generate a random signal based on price movement
                    let signal = "Hold";
                    if (coin.price_change_percentage_24h > 5) signal = "Buy";
                    else if (coin.price_change_percentage_24h < -5) signal = "Sell";

                    const symbolMap: { [key: string]: string } = {
                        'bitcoin': 'BTC',
                        'ethereum': 'ETH',
                        'binancecoin': 'BNB',
                        'solana': 'SOL',
                        'ripple': 'XRP',
                        'cardano': 'ADA',
                        'dogecoin': 'DOGE',
                        'polkadot': 'DOT',
                        'litecoin': 'LTC',
                        'matic-network': 'MATIC'
                    };

                    return {
                        symbol: symbolMap[coin.id] || coin.symbol.toUpperCase(),
                        name: coin.name,
                        final_signal: signal,
                        price: coin.current_price,
                        change: parseFloat(coin.price_change_percentage_24h.toFixed(2))
                    };
                });

                return cryptos;
            } catch (error) {
                console.error("Error in getTopCryptos:", error);
                throw error;
            }
        },

        // Get business news directly
        getBusinessNews: async () => {
            try {
                // Try to get data from our API
                const response = await apiClient.get('/news');
                return response.data;
            } catch (error) {
                console.error("Error in getBusinessNews:", error);

                // Provide mock news data as a fallback
                const mockNews = [
                    {
                        title: "Apple Reports Record Quarterly Revenue Despite Market Challenges",
                        source: { name: "Financial Times" },
                        publishedAt: new Date(Date.now() - 3600000).toISOString(),
                        url: "https://example.com/apple-quarterly-revenue",
                        sentiment: {
                            label: "positive",
                            score: 0.85
                        },
                        gpt_analysis: "Strong performance in a challenging economic environment. Investors remain optimistic about future growth."
                    },
                    {
                        title: "Tesla Delivers More Cars Than Expected in Q2",
                        source: { name: "Bloomberg" },
                        publishedAt: new Date(Date.now() - 7200000).toISOString(),
                        url: "https://example.com/tesla-delivers",
                        sentiment: {
                            label: "positive",
                            score: 0.78
                        },
                        gpt_analysis: "Tesla continues to overcome supply chain challenges, indicating strong demand for electric vehicles."
                    },
                    {
                        title: "Fed Signals Interest Rate Hike in Effort to Combat Inflation",
                        source: { name: "Wall Street Journal" },
                        publishedAt: new Date(Date.now() - 10800000).toISOString(),
                        url: "https://example.com/fed-rate-hike",
                        sentiment: {
                            label: "neutral",
                            score: 0.52
                        },
                        gpt_analysis: "Expected move by the Federal Reserve as it continues to battle persistent inflation. Markets had largely priced in this decision."
                    },
                    {
                        title: "Microsoft Acquires AI Startup for $2 Billion",
                        source: { name: "CNBC" },
                        publishedAt: new Date(Date.now() - 14400000).toISOString(),
                        url: "https://example.com/microsoft-acquisition",
                        sentiment: {
                            label: "positive",
                            score: 0.81
                        },
                        gpt_analysis: "Strategic acquisition to strengthen Microsoft's AI capabilities amid increasing competition in the sector."
                    },
                    {
                        title: "Global Supply Chain Issues Expected to Persist Through 2023",
                        source: { name: "Reuters" },
                        publishedAt: new Date(Date.now() - 18000000).toISOString(),
                        url: "https://example.com/supply-chain-issues",
                        sentiment: {
                            label: "negative",
                            score: 0.67
                        },
                        gpt_analysis: "Ongoing challenges for manufacturers and retailers. Companies with robust logistics networks are better positioned to navigate these disruptions."
                    },
                    {
                        title: "Amazon Announces New Fulfillment Centers, Creating 10,000 Jobs",
                        source: { name: "Business Insider" },
                        publishedAt: new Date(Date.now() - 21600000).toISOString(),
                        url: "https://example.com/amazon-expansion",
                        sentiment: {
                            label: "positive",
                            score: 0.89
                        },
                        gpt_analysis: "Significant expansion of Amazon's logistics network, highlighting confidence in continued e-commerce growth."
                    }
                ];

                return mockNews;
            }
        },

        // Get crypto news directly
        getCryptoNews: async () => {
            try {
                // Try to get data from our API
                const response = await apiClient.get('/news/crypto');
                return response.data;
            } catch (error) {
                console.error("Error in getCryptoNews:", error);

                // Provide mock cryptocurrency news data as a fallback
                const mockCryptoNews = [
                    {
                        title: "Bitcoin Surges Past $60,000 as Institutional Adoption Grows",
                        source: { name: "CoinDesk" },
                        publishedAt: new Date(Date.now() - 2800000).toISOString(),
                        url: "https://example.com/bitcoin-surge",
                        sentiment: {
                            label: "positive",
                            score: 0.91
                        },
                        gpt_analysis: "Increased institutional investment and limited supply continue to drive Bitcoin's price appreciation."
                    },
                    {
                        title: "Ethereum Completes Major Network Upgrade, Improving Scalability",
                        source: { name: "The Block" },
                        publishedAt: new Date(Date.now() - 5200000).toISOString(),
                        url: "https://example.com/ethereum-upgrade",
                        sentiment: {
                            label: "positive",
                            score: 0.87
                        },
                        gpt_analysis: "Significant technical milestone that addresses Ethereum's scaling challenges and potentially reduces transaction fees."
                    },
                    {
                        title: "Regulatory Concerns Grow as Cryptocurrency Market Expands",
                        source: { name: "Financial Times" },
                        publishedAt: new Date(Date.now() - 9100000).toISOString(),
                        url: "https://example.com/crypto-regulation",
                        sentiment: {
                            label: "neutral",
                            score: 0.48
                        },
                        gpt_analysis: "Increased regulatory scrutiny is expected as cryptocurrencies become more mainstream. Clear regulations could actually benefit the industry long-term."
                    },
                    {
                        title: "Binance Faces Probe from Financial Regulators",
                        source: { name: "Bloomberg" },
                        publishedAt: new Date(Date.now() - 12500000).toISOString(),
                        url: "https://example.com/binance-probe",
                        sentiment: {
                            label: "negative",
                            score: 0.71
                        },
                        gpt_analysis: "Regulatory challenges for one of the world's largest cryptocurrency exchanges. This could impact market liquidity in the short term."
                    },
                    {
                        title: "Major Bank Launches Cryptocurrency Custody Service for Institutional Clients",
                        source: { name: "Reuters" },
                        publishedAt: new Date(Date.now() - 16700000).toISOString(),
                        url: "https://example.com/bank-crypto-custody",
                        sentiment: {
                            label: "positive",
                            score: 0.82
                        },
                        gpt_analysis: "Notable step in the integration of cryptocurrencies into traditional financial infrastructure, potentially lowering barriers to institutional adoption."
                    },
                    {
                        title: "NFT Market Shows Signs of Cooling After Record-Breaking Quarter",
                        source: { name: "CNBC" },
                        publishedAt: new Date(Date.now() - 19900000).toISOString(),
                        url: "https://example.com/nft-market-cooling",
                        sentiment: {
                            label: "neutral",
                            score: 0.54
                        },
                        gpt_analysis: "Normalization of the NFT market after period of extraordinary growth. Focus is shifting to projects with clear utility and long-term value."
                    }
                ];

                return mockCryptoNews;
            }
        }
    }
};

export default apiService;

