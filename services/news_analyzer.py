import requests
from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential
from typing import List, Dict
from dotenv import load_dotenv
import os

from services.gpt_client import analyze_news_sentiment  # GPT analysis function

load_dotenv()

AZURE_KEY = os.getenv("AZURE_KEY")
AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT")
client = TextAnalyticsClient(endpoint=AZURE_ENDPOINT, credential=AzureKeyCredential(AZURE_KEY))


def analyze_sentiment(documents: List[str]) -> List[Dict]:
    """
    Analyze sentiment using Azure Text Analytics API.
    """
    sentiment_results = []
    for i in range(0, len(documents), 10):
        batch = documents[i:i + 10]
        response = client.analyze_sentiment(batch, language="en")
        for doc in response:
            sentiment_results.append({
                "label": doc.sentiment,
                "confidence_scores": {
                    "positive": doc.confidence_scores.positive,
                    "neutral": doc.confidence_scores.neutral,
                    "negative": doc.confidence_scores.negative,
                }
            })
    return sentiment_results


def parse_gpt_response(gpt_response: str) -> List[str]:
    """
    Parse GPT response and extract explanation strings (no sentiment label)
    Expected format:
        "1. Something about the market trend..."
    """
    explanations = []
    lines = gpt_response.strip().split("\n")
    for line in lines:
        parts = line.split(". ", 1)
        if len(parts) == 2:
            explanations.append(parts[1].strip())
    return explanations


def fetch_and_analyze_news_by_url(url: str) -> Dict:
    """
    Fetch news data from the provided URL and analyze using Azure + GPT
    """
    response = requests.get(url)
    news_data = response.json()
    articles = news_data.get("articles", [])

    titles = [article["title"] for article in articles]

    # Azure sentiment analysis
    azure_results = analyze_sentiment(titles)

    # GPT trend/explanation analysis
    gpt_raw_response = analyze_news_sentiment(titles)
    gpt_results = parse_gpt_response(gpt_raw_response)

    # Combine results into each article
    for i, article in enumerate(articles):
        if i < len(azure_results):
            article["azure_sentiment"] = azure_results[i]
        if i < len(gpt_results):
            article["gpt_analysis"] = gpt_results[i]
        else:
            article["gpt_analysis"] = "No analysis available."

    return {"articles": articles}




