import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import apiService from "../../services/api";

// Interface for each market item (includes current price and 24h percentage change)
interface MarketItem {
    current_price: string;
    percentage_change: number;
}

// Market section (either indices or crypto coins)
interface MarketSection {
    [key: string]: MarketItem;
}

// Stock market data structure
interface StockMarketData {
    indices: MarketSection;
    avg_trend: number;
}

// Crypto market data structure
interface CryptoMarketData {
    coins: MarketSection;
    avg_trend: number;
}

// Overall market data structure
interface MarketData {
    stock_market: StockMarketData;
    crypto_market: CryptoMarketData;
}

// Type guard for distinguishing stock vs crypto market
function isStockMarketData(market: StockMarketData | CryptoMarketData): market is StockMarketData {
    return 'indices' in market;
}

export function MarketTrendCard() {
    const [data, setData] = useState<MarketData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    // Fetch market data on component mount
    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                setLoading(true);
                const res: MarketData = await apiService.market.getMarketTrend();
                setData(res);
                setError("");
            } catch (err) {
                console.error("Failed to fetch market data:", err);
                setError("Failed to load market trend data.");
            } finally {
                setLoading(false);
            }
        };

        fetchMarketData();
    }, []);

    // Render individual market section (stock or crypto)
    const renderMarketSection = (
        title: string,
        market: StockMarketData | CryptoMarketData
    ): React.ReactElement => {
        const items = isStockMarketData(market) ? market.indices : market.coins;
        const isBearish = market.avg_trend < 0;
        const label = isBearish ? "Bearish" : "Bullish";
        const color = isBearish ? "text-red-400" : "text-green-400";
        const route = isStockMarketData(market) ? "/stock" : "/crypto";

        // Prepare data for line chart
        const chartData = Object.entries(items).map(([name, item]) => {
            const price = parseFloat(item.current_price.replace('$', ''));
            return {
                name,
                value: item.percentage_change,
                displayPrice: isNaN(price) ? "N/A" : `$${price.toFixed(2)}`, // Safe price display
            };
        });

        return (
            <div className="flex flex-col lg:flex-row gap-8 items-start bg-gray-900 p-6 rounded-lg shadow text-white mt-6">
                {/* Market list */}
                <div className="lg:w-1/2 w-full flex flex-col justify-center ">
                    <div className="text-lg font-bold mb-4 lg:text-3xl">{title}</div>
                    <div className="divide-y divide-gray-700 text-sm">
                        {Object.entries(items).map(([name, item]) => {
                            const isUp = item.percentage_change >= 0;
                            const priceColor = isUp ? "text-green-400" : "text-red-400";
                            const percentColor = priceColor;
                            const arrow = isUp ? "▲" : "▼";

                            const price = parseFloat(item.current_price.replace('$', ''));
                            const displayPrice = isNaN(price) ? "N/A" : `$${price.toFixed(2)}`;

                            return (
                                <div key={name} className="flex justify-between items-center py-2">
                                    {/* Left: Name */}
                                    <span className="text-gray-300 w-1/3 truncate">{name}</span>

                                    {/* Middle: Price */}
                                    <span className={`w-1/3 text-left ${priceColor}`}>
                                        {displayPrice}
                                    </span>

                                    {/* Right: Percentage */}
                                    <span className={`w-1/3 text-right ${percentColor}`}>
                                        {arrow} {item.percentage_change.toFixed(2)}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-4 text-gray-400 font-bold">
                        {title} Trend: <span className={color}>{label} ({market.avg_trend.toFixed(2)}%)</span>
                    </div>
                    <button
                        className="mt-3 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-xs w-auto mr-auto transition duration-300"
                        onClick={() => navigate(route)}
                    >
                        About More
                    </button>
                </div>

                {/* Chart section */}
                <div className="lg:w-1/2 w-full">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <XAxis dataKey="name" stroke="#ccc" />
                            <YAxis stroke="#ccc" domain={['auto', 'auto']} />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    // Loading state
    if (loading) {
        return (
            <div className="bg-gray-900 p-6 rounded-lg shadow text-white text-center">
                Loading Market Trend...
            </div>
        );
    }

    // Error state
    if (error || !data) {
        return (
            <div className="bg-gray-900 p-6 rounded-lg shadow text-red-400 text-center">
                {error}
            </div>
        );
    }

    // Final render
    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow text-white mt-8">
            <h2 className="text-2xl font-bold mb-6 text-center lg:text-5xl lg:py-16">Market Trend</h2>
            {renderMarketSection("Stock Market", data.stock_market)}
            {renderMarketSection("Crypto Market", data.crypto_market)}
        </div>
    );
}

export default MarketTrendCard;




