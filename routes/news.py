from fastapi import APIRouter
from services.news_analyzer import fetch_and_analyze_news_by_url
import os

router = APIRouter()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

@router.get("/news",tags=["Business News"])
def get_news():
    url = f"https://newsapi.org/v2/top-headlines?category=business&apiKey={NEWS_API_KEY}"
    return fetch_and_analyze_news_by_url(url)

@router.get("/crypto_news",tags=["Crypto News"])
def get_crypt_news():
    url = f"https://newsapi.org/v2/everything?q=crypto&language=en&sortBy=publishedAt&apiKey={NEWS_API_KEY}"
    return fetch_and_analyze_news_by_url(url)
