import requests
from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential
from dotenv import load_dotenv
from typing import Optional
import os
import time
import hashlib
import json
from datetime import datetime, timedelta
import logging
from services.gpt_client import analyze_news_sentiment  # GPT analysis function

# Load environment variables
load_dotenv()

AZURE_KEY = os.getenv("AZURE_KEY")
AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT")
client = TextAnalyticsClient(endpoint=AZURE_ENDPOINT, credential=AzureKeyCredential(AZURE_KEY))

# Cache settings
CACHE_EXPIRATION_HOURS = 6
NEWS_CACHE_FILE = "news_cache.json"
LAST_API_CALL_TIME = 0
API_CALL_COOLDOWN = 60  # in seconds

# Global cache dictionary
news_cache = {}

# Setup logging
logging.basicConfig(level=logging.INFO)

def load_cache():
    """Load news sentiment cache from file."""
    global news_cache
    try:
        if os.path.exists(NEWS_CACHE_FILE):
            with open(NEWS_CACHE_FILE, 'r') as f:
                news_cache = json.load(f)
    except Exception as e:
        logging.error(f"Error loading cache: {e}")
        news_cache = {}

def save_cache():
    """Save sentiment analysis cache to file."""
    try:
        with open(NEWS_CACHE_FILE, 'w') as f:
            json.dump(news_cache, f)
    except Exception as e:
        logging.error(f"Error saving cache: {e}")

# Load cache on startup
load_cache()

def cache_key(url: str, titles: list) -> str:
    """Generate a unique cache key based on URL and news titles."""
    content_hash = hashlib.md5(str(titles).encode()).hexdigest()
    return f"{url}_{content_hash}"

def get_cached_response(key: str) -> Optional[dict]:
    """Retrieve a valid cache entry if it hasn't expired."""
    if key in news_cache:
        timestamp = news_cache[key]["timestamp"]
        expiration = datetime.fromtimestamp(timestamp) + timedelta(hours=CACHE_EXPIRATION_HOURS)
        if datetime.now() < expiration:
            return news_cache[key]["data"], news_cache[key]["gpt_results"]
    logging.info(f"No valid cache found for key: {key}")
    return None

def analyze_sentiment(documents: list) -> list:
    """Use Azure Text Analytics API to analyze sentiment in batches."""
    results = []
    for i in range(0, len(documents), 10):
        batch = documents[i:i + 10]
        response = client.analyze_sentiment(batch, language="en")
        results.extend([
            {"label": doc.sentiment, "confidence_scores": {
            "positive": doc.confidence_scores.positive,
            "neutral": doc.confidence_scores.neutral,
            "negative": doc.confidence_scores.negative
            }}
            for doc in response
        ])
    return results

def parse_gpt_response(gpt_response: str, expected_count: int) -> list:
    """Parse GPT response into a list of analysis strings with padding if needed."""
    explanations = []
    
    # Split the response by numbered lines (e.g., "1. ", "2. ", etc.)
    lines = gpt_response.strip().split('\n')
    current_explanation = ""
    
    for line in lines:
        line = line.strip()
        # Skip empty lines
        if not line:
            continue
            
        # Skip intro lines that don't start with a number
        if not (line[0].isdigit() and ". " in line[:4]):
            # Check if this is a continuation of a previous explanation
            if current_explanation:
                current_explanation += " " + line
            continue
            
        # If we have an existing explanation, add it to the list before starting a new one
        if current_explanation:
            explanations.append(clean_explanation(current_explanation))
            
        # Start a new explanation, removing the number prefix
        parts = line.split(". ", 1)
        if len(parts) > 1:
            current_explanation = parts[1]
        else:
            current_explanation = line
    
    # Add the last explanation if there is one
    if current_explanation:
        explanations.append(clean_explanation(current_explanation))

    # Pad or trim to match expected count
    if len(explanations) < expected_count:
        # Fill missing explanations with placeholder
        while len(explanations) < expected_count:
            explanations.append("No analysis available.")
    elif len(explanations) > expected_count:
        explanations = explanations[:expected_count]  # Trim to match expected count

    return explanations

def clean_explanation(text: str) -> str:
    """Clean up explanation text to remove unwanted patterns"""
    # Remove introductory phrases
    patterns_to_remove = [
        "Certainly!", 
        "Here's a market-oriented interpretation",
        "Here's my analysis",
        "Market analysis:",
        "Market interpretation:",
        "**Interpretation:**"
    ]
    
    cleaned_text = text
    for pattern in patterns_to_remove:
        if cleaned_text.startswith(pattern):
            cleaned_text = cleaned_text[len(pattern):].strip()
    
    # Remove headline repetition (often appears when GPT repeats the headline)
    if "**" in cleaned_text and cleaned_text.count("**") >= 2:
        # Extract content between first set of ** markers
        headline_parts = cleaned_text.split("**", 2)
        if len(headline_parts) >= 3:
            # Check if this looks like a headline
            potential_headline = headline_parts[1]
            if len(potential_headline.split()) <= 15:  # Reasonable headline length
                # Remove the headline part
                cleaned_text = "".join(headline_parts[2:]).strip()
                # If the next part starts with **, remove those too
                if cleaned_text.startswith("**"):
                    cleaned_text = cleaned_text[2:].strip()
    
    return cleaned_text

def get_gpt_analysis(titles: list, contents: list) -> tuple:
    """Perform GPT sentiment analysis with rate limiting."""
    global LAST_API_CALL_TIME
    current_time = time.time()
    if current_time - LAST_API_CALL_TIME < API_CALL_COOLDOWN:
        logging.warning("API rate limit exceeded. Please try again later.")
        return "API rate limited", ["Rate limited. Try again later."] * len(titles)

    try:
        LAST_API_CALL_TIME = current_time
        gpt_raw_response = analyze_news_sentiment(titles)  
        logging.info(f"GPT Response: {gpt_raw_response}")  # Log the raw response
        gpt_results = parse_gpt_response(gpt_raw_response, expected_count=len(titles))
        return gpt_raw_response, gpt_results
    except Exception as e:
        logging.error(f"Error during GPT analysis: {e}")
        return "API error", ["Unable to analyze news."] * len(titles)

def fetch_and_analyze_news_by_url(url: str) -> dict:
    """Fetch news from a URL and return analyzed results with Azure and GPT sentiment."""
    try:
        response = requests.get(url)
        response.raise_for_status()  
        news_data = response.json()
        if "articles" not in news_data:
            logging.error("No 'articles' key in response data.")
            return {"error": "No news articles found."}
        articles = news_data["articles"]
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching news from {url}: {e}")
        return {"error": str(e)}

    titles = [article.get("title", "") for article in articles]
    descriptions = [article.get("description", "") for article in articles]
    contents = [
        f"{desc}\n{content}" if desc else content
        for desc, content in zip(descriptions, [article.get("content", "") for article in articles])
    ]

    cache_id = cache_key(url, titles)
    cached_result = get_cached_response(cache_id)
    if cached_result:
        return {"articles": cached_result[0]}

    azure_results = analyze_sentiment(titles)
    gpt_raw_response, gpt_results = get_gpt_analysis(titles, contents)

    for i, article in enumerate(articles):
        article["azure_sentiment"] = azure_results[i] if i < len(azure_results) else {}
        article["gpt_analysis"] = gpt_results[i] if i < len(gpt_results) else "No analysis available."

    news_cache[cache_id] = {
        "timestamp": time.time(),
        "data": articles,
        "gpt_results": gpt_results
    }
    save_cache()

    return {"articles": articles}













