from fastapi import APIRouter
import requests
from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential
from typing import List, Dict
from dotenv import load_dotenv
import os

# 创建 APIRouter 实例
router = APIRouter()

load_dotenv()

key = os.getenv("AZURE_KEY")
endpoint = os.getenv("AZURE_ENDPOINT")

# 创建 TextAnalyticsClient 客户端
client = TextAnalyticsClient(endpoint=endpoint, credential=AzureKeyCredential(key))

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

# 分批处理情绪分析函数
def analyze_sentiment(documents: List[str]) -> List[Dict]:
    """
    使用 Azure Text Analytics API 对文档进行情绪分析，并返回情绪分析结果。
    :param documents: 文本列表（新闻标题）
    :return: 包含每个文档情绪分析结果的字典列表
    """
    sentiment_results = []
    batch_size = 10  # 每次请求最多发送10个文档

    # 分批处理文档
    for i in range(0, len(documents), batch_size):
        batch = documents[i:i + batch_size]
        response = client.analyze_sentiment(batch, language="en")
        
        # 将每个文档的情绪分析结果加入到列表中
        for doc in response:
            sentiment_results.append({
                "sentiment": doc.sentiment,
                "positive_score": doc.confidence_scores.positive,
                "negative_score": doc.confidence_scores.negative
            })
    
    return sentiment_results

# 获取新闻数据并进行情绪分析
def fetch_and_analyze_news_by_url(url: str) -> Dict:
    """
    通用函数：根据传入的 URL 获取新闻并进行情绪分析。
    :param url: 请求的新闻 API 地址
    :return: 包含新闻和情绪分析结果的字典
    """
    # 请求新闻API获取数据
    response = requests.get(url)
    news_data = response.json()

    # 获取新闻文章列表
    articles = news_data.get("articles", [])

    # 提取每篇新闻的标题进行情绪分析
    documents = [article["title"] for article in articles]

    # 获取情绪分析结果
    sentiment_results = analyze_sentiment(documents)

    # 将情绪分析结果与新闻数据合并
    for i, article in enumerate(articles):
        if i < len(sentiment_results):
            article["sentiment"] = sentiment_results[i]  # 将情绪分析结果添加到新闻数据中

    return {"articles": articles}

@router.get("/news")
def get_news():
    """
    FastAPI 路由，返回包含情绪分析结果的新闻数据。
    """
    # 获取新闻并分析情绪
    url = f"https://newsapi.org/v2/top-headlines?category=business&apiKey={NEWS_API_KEY}"
    return fetch_and_analyze_news_by_url(url)


@router.get("/crypto_news")
def get_crypt_news():
    """
    FastAPI 路由，返回包含情绪分析结果的币圈新闻数据。
    """
    # 获取新闻并分析情绪
    url = f"https://newsapi.org/v2/everything?q=crypto&language=en&sortBy=publishedAt&apiKey={NEWS_API_KEY}"
    return fetch_and_analyze_news_by_url(url)