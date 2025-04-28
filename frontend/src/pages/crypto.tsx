import { useState, useEffect } from "react";
import apiService from "../services/api";

interface Article {
    title: string;
    gpt_analysis: "Positive" | "Negative";
}

interface TechnicalIndicators {
    RSI: string | number;
    MA_20: string | number;
    Volume: string | number;
}

interface SentimentData {
    articles: Article[];
}

interface StrategyResponse {
    technical_indicators: TechnicalIndicators;
    articles?: Article[];
    sentiment_data?: SentimentData;
    positive_sentiment: number;
    negative_sentiment: number;
    final_signal: "Buy" | "Sell" | "Hold";
    error?: string;
}

interface CryptoRecommendation {
    symbol: string;
    name: string;
    final_signal: "Buy" | "Sell" | "Hold";
    price?: number;
    change?: number;
}

export function Crypto() {
    const [symbol, setSymbol] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<StrategyResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cryptoRecommendations, setCryptoRecommendations] = useState<CryptoRecommendation[]>([
        {
            symbol: "BTC",
            name: "Bitcoin",
            final_signal: "Buy",
            price: 65340.75,
            change: 2.45
        },
        {
            symbol: "ETH",
            name: "Ethereum",
            final_signal: "Buy",
            price: 3560.20,
            change: 1.35
        },
        {
            symbol: "BNB",
            name: "Binance Coin",
            final_signal: "Hold",
            price: 580.50,
            change: -0.75
        },
        {
            symbol: "SOL",
            name: "Solana",
            final_signal: "Buy",
            price: 140.65,
            change: 4.20
        },
        {
            symbol: "XRP",
            name: "Ripple",
            final_signal: "Sell",
            price: 0.58,
            change: -2.10
        }
    ]);

    // 页面加载时尝试获取推荐加密货币
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // 尝试使用直接方法获取数据
                const cryptosData = await apiService.directData.getTopCryptos();
                if (cryptosData && cryptosData.length > 0) {
                    setCryptoRecommendations(cryptosData);
                }
            } catch (err) {
                console.error("Failed to load crypto recommendations:", err);
                // 保留默认数据，不做任何改变
            }
        };

        fetchRecommendations();
    }, []);

    // 点击按钮后获取用户输入加密货币的分析数据
    const fetchStrategy = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const strategyRes = await apiService.strategy.getStrategyWithParams(symbol, true); // true表示这是加密货币
            setResult(strategyRes);
        } catch (err) {
            setError("Failed to fetch strategy data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white w-full flex flex-col">
            <div className="flex-grow max-w-3xl mx-auto p-8 py-10 lg:py-20 w-full">
                <h1 className="text-2xl font-bold mb-4 text-white">Crypto Recommendation</h1>

                {/* 加密货币推荐部分 - 表格形式 */}
                <div className="mb-8 bg-gray-900 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-300 mb-4">Top Crypto Recommendations</h2>

                    {cryptoRecommendations.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-300">
                                <thead className="text-xs uppercase bg-gray-800 text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">Symbol</th>
                                        <th scope="col" className="px-4 py-3">Name</th>
                                        <th scope="col" className="px-4 py-3">Price</th>
                                        <th scope="col" className="px-4 py-3">Change</th>
                                        <th scope="col" className="px-4 py-3">Signal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cryptoRecommendations.map((crypto, i) => (
                                        <tr key={i} className="border-b border-gray-800 hover:bg-gray-800">
                                            <td className="px-4 py-3 font-medium">{crypto.symbol}</td>
                                            <td className="px-4 py-3">{crypto.name}</td>
                                            <td className="px-4 py-3">${crypto.price !== undefined ? crypto.price.toFixed(2) : "N/A"}</td>
                                            <td className={`px-4 py-3 ${crypto.change !== undefined && crypto.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {crypto.change !== undefined ? `${crypto.change >= 0 ? '+' : ''}${crypto.change.toFixed(2)}%` : 'N/A'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-semibold ${crypto.final_signal === "Buy"
                                                        ? "bg-green-900 text-green-400"
                                                        : crypto.final_signal === "Sell"
                                                            ? "bg-red-900 text-red-400"
                                                            : "bg-yellow-900 text-yellow-400"
                                                        }`}
                                                >
                                                    {crypto.final_signal}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-400">No recommendations available.</p>
                    )}
                </div>

                {/* 加密货币分析输入框 */}
                <div className="bg-gray-900 rounded-lg p-6 shadow-lg mb-6">
                    <h2 className="text-xl font-semibold text-gray-300 mb-4">Analyze a Cryptocurrency</h2>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Enter crypto symbol, e.g. BTC"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            className="border border-gray-700 bg-gray-800 text-white rounded p-2 flex-grow"
                        />
                        <button
                            onClick={fetchStrategy}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Submit
                        </button>
                    </div>
                </div>

                {/* 加载或错误提示 */}
                {loading && <p className="text-gray-400">Loading...</p >}
                {error && <p className="text-red-500">{error}</p >}

                {/* 分析结果展示 */}
                {result && !result.error && (
                    <div className="bg-gray-900 rounded-lg p-6 shadow-lg space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-300">Technical Indicators</h2>
                            <ul className="list-disc pl-5 mt-2 text-gray-400">
                                <li>RSI: {result.technical_indicators.RSI}</li>
                                <li>MA_20: {result.technical_indicators.MA_20}</li>
                                <li>Volume: {result.technical_indicators.Volume}</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-300">News Sentiment</h2>
                            <ul className="list-disc pl-5 mt-2 text-gray-400 space-y-1">
                                {(result.articles ?? result.sentiment_data?.articles)?.map((a, i) => (
                                    <li key={i}>
                                        {a.title} -{" "}
                                        <span
                                            className={
                                                a.gpt_analysis === "Positive"
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }
                                        >
                                            {a.gpt_analysis}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-2 text-gray-500">
                                Positive Sentiment: {(result.positive_sentiment * 100).toFixed(1)}% | Negative Sentiment:{" "}
                                {(result.negative_sentiment * 100).toFixed(1)}%
                            </p >
                        </div>

                        <div className="text-xl font-bold border-t border-gray-800 pt-4">
                            Final Signal:{" "}
                            <span
                                className={
                                    result.final_signal === "Buy"
                                        ? "text-green-500"
                                        : result.final_signal === "Sell"
                                            ? "text-red-500"
                                            : "text-yellow-500"
                                }
                            >
                                {result.final_signal}
                            </span>
                        </div>
                    </div>
                )}

                {result?.error && (
                    <p className="text-red-500 mt-4">❌ {result.error}</p >
                )}
            </div>

        </div>
    );
}

export default Crypto; 