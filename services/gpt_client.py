import os
import requests
from dotenv import load_dotenv
import time
from typing import List, Dict, Optional
import json

# Load environment variables from .env file
load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
ENDPOINT = "https://models.github.ai/inference"
MODEL_NAME = "openai/gpt-4.1"

if not GITHUB_TOKEN:
    raise ValueError("GITHUB_TOKEN is not set in the .env file")

headers = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Content-Type": "application/json"
}

# Global variables tracking API call status
LAST_CALL_TIMESTAMP = 0
CALLS_TODAY = 0
MAX_CALLS_PER_DAY = 40  # Safety limit, slightly lower than actual limit to leave margin
CACHE_FILE = "gpt_cache.json"

# Load cache
def load_gpt_cache() -> Dict:
    try:
        if os.path.exists(CACHE_FILE):
            with open(CACHE_FILE, 'r') as f:
                cache_data = json.load(f)
                
                # Reset daily counter (if it's a new day)
                last_date = time.strftime("%Y-%m-%d", time.localtime(cache_data.get("last_timestamp", 0)))
                today = time.strftime("%Y-%m-%d")
                
                if last_date != today:
                    cache_data["calls_today"] = 0
                
                global LAST_CALL_TIMESTAMP, CALLS_TODAY
                LAST_CALL_TIMESTAMP = cache_data.get("last_timestamp", 0)
                CALLS_TODAY = cache_data.get("calls_today", 0)
                
                return cache_data.get("results", {})
        return {}
    except Exception as e:
        print(f"Error loading GPT cache: {e}")
        return {}

# Save cache
def save_gpt_cache(cache: Dict):
    try:
        with open(CACHE_FILE, 'w') as f:
            cache_data = {
                "results": cache,
                "last_timestamp": LAST_CALL_TIMESTAMP,
                "calls_today": CALLS_TODAY
            }
            json.dump(cache_data, f)
    except Exception as e:
        print(f"Error saving GPT cache: {e}")

# Global cache
gpt_cache = load_gpt_cache()

def analyze_news_sentiment(news_headlines: List[str]) -> str:
    """
    Send financial news headlines to a GPT model and receive 
    a concise, market-oriented explanation for each headline.

    The model is expected to provide analytical interpretations
    without performing sentiment classification.

    Args:
        news_headlines (List[str]): A list of news titles/headlines.

    Returns:
        str: Raw GPT response as a single text block.
    """
    global LAST_CALL_TIMESTAMP, CALLS_TODAY, gpt_cache
    
    # Generate cache key
    cache_key = "_".join(sorted(news_headlines))[:500]  # Limit key length
    
    # Check cache
    if cache_key in gpt_cache:
        print("Using cached GPT results")
        return gpt_cache[cache_key]
    
    # Check API call limits
    current_time = time.time()
    today = time.strftime("%Y-%m-%d")
    last_call_date = time.strftime("%Y-%m-%d", time.localtime(LAST_CALL_TIMESTAMP))
    
    # If it's a new day, reset counter
    if last_call_date != today:
        CALLS_TODAY = 0
    
    # Check if daily limit exceeded
    if CALLS_TODAY >= MAX_CALLS_PER_DAY:
        print(f"Daily API call limit reached ({MAX_CALLS_PER_DAY})")
        return "Daily API call limit reached. Here is a general analysis:\n" + "\n".join([
            f"{i+1}. {title} - This news may have some impact on the market, please refer to other analysis tools for detailed information."
            for i, title in enumerate(news_headlines)
        ])
    
    prompt = (
        "Analyze each financial news headline below individually. For each one, provide a market-focused interpretation that highlights potential impact, risks, or opportunities. DO NOT include any introductory text like 'Certainly' or 'Here's my analysis'. DO NOT provide interpretations for multiple headlines in one answer. For each headline, only give the analysis for that specific headline.\n\n"
        + "\n".join([f"{i + 1}. {title}" for i, title in enumerate(news_headlines)])
    )

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": "You are a concise financial analyst who provides directly actionable market interpretations without introductory phrases. Format your responses with just the number and the analysis."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 600
    }

    try:
        # Update call statistics
        LAST_CALL_TIMESTAMP = current_time
        CALLS_TODAY += 1
        
        response = requests.post(f"{ENDPOINT}/chat/completions", headers=headers, json=payload)

        if response.status_code == 200:
            result = response.json()["choices"][0]["message"]["content"]
            
            # Cache results
            gpt_cache[cache_key] = result
            save_gpt_cache(gpt_cache)
            
            return result
        else:
            error_msg = f"Error from GPT API: {response.status_code} - {response.text}"
            print(error_msg)
            
            # If rate limit error, reduce counter (since call wasn't successful)
            if response.status_code == 429:
                CALLS_TODAY -= 1
                
            raise Exception(error_msg)
    except Exception as e:
        # Save current state
        save_gpt_cache(gpt_cache)
        raise e




