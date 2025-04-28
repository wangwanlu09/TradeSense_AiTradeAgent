import { useEffect, useState } from "react";
import apiService from "../services/api";

interface Article {
    title: string;
    original_title?: string;
    source: { name: string };
    publishedAt: string;
    url: string;
    azure_sentiment: {
        label: string;
        confidence_scores: {
            positive: number;
            neutral: number;
            negative: number;
        };
    };
    gpt_analysis: string;
}

export function CryptoNews() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await apiService.directData.getCryptoNews();

                if (data && data.articles) {
                    setArticles(data.articles);
                } else {
                    setError("Failed to retrieve crypto news.");
                }
            } catch (err) {
                console.error("Failed to fetch crypto news:", err);
                setError("An error occurred while loading crypto news.");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const getSentimentColor = (label: string) => {
        switch (label.toLowerCase()) {
            case "positive":
                return "text-green-400";
            case "neutral":
                return "text-yellow-400";
            case "negative":
                return "text-red-400";
            default:
                return "text-white";
        }
    };

    if (loading) return <div className="p-4 text-gray-300 bg-black h-screen">Loading crypto news...</div>;
    if (error) return <div className="p-4 text-red-500 bg-black h-screen">Error: {error}</div>;
    if (articles.length === 0) return <div className="p-4 text-gray-300 bg-black h-screen">No crypto news available</div>;

    return (
        <div className="bg-black bg-opacity-95 min-h-screen px-4 py-12 lg:px-32 lg:py-16 mx-auto text-white">
            <h2 className="text-3xl lg:text-5xl font-bold py-10 flex justify-center">
                Latest Crypto News
            </h2>
            <div className="space-y-6">
                {articles.map((article, idx) => (
                    <div
                        key={idx}
                        className="p-4 border border-gray-800 rounded-xl shadow-sm hover:shadow-md transition bg-gray-900"
                    >
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            <h3 className="text-lg font-bold text-white hover:text-green-400 hover:underline">
                                {article.title}
                            </h3>
                        </a>
                        <div className="text-sm text-gray-400 mb-1">
                            {article.source?.name} ·{" "}
                            {article.publishedAt
                                ? new Date(article.publishedAt).toLocaleString()
                                : "Unknown date"}
                        </div>

                        <div className="mt-2 text-sm text-gray-300">
                            <strong>Insight:</strong>{" "}
                            {article.gpt_analysis?.includes("Rate limited")
                                ? <span className="italic text-gray-500">Insight unavailable due to rate limits.</span>
                                : article.gpt_analysis || "No analysis available"}
                            {article.original_title &&
                                article.original_title !== article.title && (
                                    <div className="mt-1 text-xs text-orange-400">
                                        ⚠️ Alternate title: {article.original_title}
                                    </div>
                                )}
                        </div>

                        {article.azure_sentiment && (
                            <div className="mt-3 text-sm flex flex-wrap items-center gap-2">
                                <span className="text-white">
                                    Positive: <span className="text-green-400">{article.azure_sentiment.confidence_scores.positive.toFixed(2)}</span>
                                </span>
                                <span className="text-white">
                                    Neutral: <span className="text-yellow-400">{article.azure_sentiment.confidence_scores.neutral.toFixed(2)}</span>
                                </span>
                                <span className="text-white">
                                    Negative: <span className="text-red-400">{article.azure_sentiment.confidence_scores.negative.toFixed(2)}</span>
                                </span>
                                <span className={`ml-auto ${getSentimentColor(article.azure_sentiment.label)} text-sm font-medium`}>
                                    Sentiment: {article.azure_sentiment.label}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CryptoNews;

