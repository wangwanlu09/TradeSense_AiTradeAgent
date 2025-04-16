import requests
from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential
from typing import List, Dict
from dotenv import load_dotenv
import os

load_dotenv()

AZURE_KEY = os.getenv("AZURE_KEY")
AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT")
client = TextAnalyticsClient(endpoint=AZURE_ENDPOINT, credential=AzureKeyCredential(AZURE_KEY))

def analyze_sentiment(documents: List[str]) -> List[Dict]:
    sentiment_results = []
    for i in range(0, len(documents), 10):
        batch = documents[i:i + 10]
        response = client.analyze_sentiment(batch, language="en")
        for doc in response:
            sentiment_results.append({
                "sentiment": doc.sentiment,
                "positive_score": doc.confidence_scores.positive,
                "negative_score": doc.confidence_scores.negative
            })
    return sentiment_results

def fetch_and_analyze_news_by_url(url: str) -> Dict:
    response = requests.get(url)
    news_data = response.json()
    articles = news_data.get("articles", [])
    documents = [article["title"] for article in articles]
    sentiment_results = analyze_sentiment(documents)

    for i, article in enumerate(articles):
        if i < len(sentiment_results):
            article["sentiment"] = sentiment_results[i]
    return {"articles": articles}
