import os
import requests
from dotenv import load_dotenv

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


def analyze_news_sentiment(news_headlines):
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
    prompt = (
        "Here are some financial news headlines. For each one, explain what the market might think — "
        "highlight potential impact, risks, or opportunities, and provide a concise market-oriented interpretation.\n\n"
        + "\n".join([f"{i + 1}. {title}" for i, title in enumerate(news_headlines)])
    )

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": "You are a helpful financial analyst."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 600
    }

    response = requests.post(f"{ENDPOINT}/chat/completions", headers=headers, json=payload)

    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        raise Exception(f"Error from GPT API: {response.status_code} - {response.text}")




