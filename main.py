from fastapi import FastAPI
from routes import news, strategy, market

app = FastAPI()


@app.get("/")
def root():
    return {"message": "Welcome to the AI Trade Agent API"}


app.include_router(news.router)
app.include_router(strategy.router)
app.include_router(market.router)
