import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import apiService from "../../services/api";

interface Article {
    title: string;
    azure_sentiment?: {
        label: string;
    };
}

export function NewsSentimentOverview() {
    const [sentimentData, setSentimentData] = useState({
        positive: 0,
        neutral: 0,
        negative: 0,
    });
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await apiService.news.getBusinessNews();
                const articles = res.articles;

                const sentimentCount = getSentimentDistribution(articles);
                setSentimentData(sentimentCount);
                setDate(new Date().toISOString().split("T")[0]);
                setError("");
            } catch (err) {
                console.error("Failed to fetch news sentiment:", err);
                setError("Failed to load data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    function getSentimentDistribution(articles: Article[]) {
        const sentimentCount = { positive: 0, neutral: 0, negative: 0 };

        articles.forEach((article: Article) => {
            const label = article.azure_sentiment?.label;
            if (label === "positive") sentimentCount.positive += 1;
            else if (label === "negative") sentimentCount.negative += 1;
            else sentimentCount.neutral += 1;
        });

        return sentimentCount;
    }

    function getOverallSentiment(data: {
        positive: number;
        neutral: number;
        negative: number;
    }) {
        const { positive, neutral, negative } = data;
        const max = Math.max(positive, neutral, negative);
        if (max === positive) return "Positive";
        if (max === negative) return "Negative";
        return "Neutral";
    }

    const sentimentColor = {
        Positive: "text-green-400",
        Neutral: "text-yellow-400",
        Negative: "text-red-400",
    };

    const pieData = [
        { name: "Positive", value: sentimentData.positive },
        { name: "Neutral", value: sentimentData.neutral },
        { name: "Negative", value: sentimentData.negative },
    ];

    if (loading) {
        return (
            <div className="bg-gray-900 p-6 rounded-lg shadow text-center text-white min-h-[400px] flex items-center justify-center">
                <p>Loading sentiment analysis...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-900 p-6 rounded-lg shadow text-center text-white min-h-[400px] flex items-center justify-center">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    const overallSentiment = getOverallSentiment(sentimentData);

    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow text-white mt-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* left */}
                <div className="lg:w-1/2 w-full text-center lg:text-left py-4 lg:py-20 px-4 lg:px-12">
                    <h2 className="text-xl lg:text-5xl font-bold mb-2">News & Sentiment Analysis</h2>
                    <h3 className="text-xl mt-2 lg:mt-8 font-semibold lg:text-3xl">
                        Market Sentiment:{" "}
                        <span className={`${sentimentColor[overallSentiment]} font-bold lg:text-5xl`}>
                            {overallSentiment}
                        </span>
                    </h3>
                    <p className="text-sm lg:text-lg text-gray-400 mt-1 lg:mt-2">Date: {date}</p>
                </div>

                {/* right */}
                <div className="lg:w-1/2 w-full flex flex-col items-center py-2 lg:py-14">
                    <h4 className="text-lg font-bold text-gray-300 mb-2 text-center">Sentiment Distribution</h4>
                    <div className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    <Cell key="positive" fill="#4CAF50" />
                                    <Cell key="neutral" fill="#FFC107" />
                                    <Cell key="negative" fill="#F44336" />
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewsSentimentOverview;




