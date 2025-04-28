import { useState, useEffect } from "react";
import apiService from "../services/api";

interface Article {
    title: string;
    gpt_analysis: "Positive" | "Negative";
}

interface TechnicalIndicators {
    RSI: string | number;
    MA_50: string | number;
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

interface StockRecommendation {
    symbol: string;
    name: string;
    final_signal: "Buy" | "Sell" | "Hold";
    price?: number;
    change?: number;
}

export function Stock() {
    const [symbol, setSymbol] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<StrategyResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [stockRecommendations, setStockRecommendations] = useState<StockRecommendation[]>([
        {
            symbol: "AAPL",
            name: "Apple Inc.",
            final_signal: "Buy",
            price: 180.25,
            change: 1.25
        },
        {
            symbol: "MSFT",
            name: "Microsoft Corporation",
            final_signal: "Buy",
            price: 350.80,
            change: 0.75
        },
        {
            symbol: "GOOGL",
            name: "Alphabet Inc.",
            final_signal: "Hold",
            price: 140.10,
            change: -0.5
        },
        {
            symbol: "AMZN",
            name: "Amazon.com Inc.",
            final_signal: "Buy",
            price: 125.30,
            change: 2.15
        },
        {
            symbol: "TSLA",
            name: "Tesla Inc.",
            final_signal: "Sell",
            price: 220.45,
            change: -3.20
        }
    ]);

    // 页面加载时尝试获取推荐股票
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // 尝试使用直接方法获取数据
                const stocksData = await apiService.directData.getTopStocks();
                if (stocksData && stocksData.length > 0) {
                    setStockRecommendations(stocksData);
                }
            } catch (err) {
                console.error("Failed to load stock recommendations:", err);
                // 保留默认数据，不做任何改变
            }
        };

        fetchRecommendations();
    }, []);

    // 点击按钮后获取用户输入股票的分析数据
    const fetchStrategy = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const strategyRes = await apiService.strategy.getStrategyWithParams(symbol, false);
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
                <h1 className="text-2xl font-bold mb-4 text-white">Stock Recommendation</h1>

                {/* 股票推荐部分 - 表格形式 */}
                <div className="mb-8 bg-gray-900 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-300 mb-4">Top Stock Recommendations</h2>

                    {stockRecommendations.length > 0 ? (
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
                                    {stockRecommendations.map((stock, i) => (
                                        <tr key={i} className="border-b border-gray-800 hover:bg-gray-800">
                                            <td className="px-4 py-3 font-medium">{stock.symbol}</td>
                                            <td className="px-4 py-3">{stock.name}</td>
                                            <td className="px-4 py-3">${stock.price !== undefined ? stock.price.toFixed(2) : "N/A"}</td>
                                            <td className={`px-4 py-3 ${stock.change !== undefined && stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {stock.change !== undefined ? `${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}%` : 'N/A'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-semibold ${stock.final_signal === "Buy"
                                                        ? "bg-green-900 text-green-400"
                                                        : stock.final_signal === "Sell"
                                                            ? "bg-red-900 text-red-400"
                                                            : "bg-yellow-900 text-yellow-400"
                                                        }`}
                                                >
                                                    {stock.final_signal}
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

                {/* 股票分析输入框 */}
                <div className="bg-gray-900 rounded-lg p-6 shadow-lg mb-6">
                    <h2 className="text-xl font-semibold text-gray-300 mb-4">Analyze a Stock</h2>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Enter stock symbol, e.g. AAPL"
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
                                <li>MA_50: {result.technical_indicators.MA_50}</li>
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

export default Stock;

