from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import news, market, technical, strategy, recommend

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to the AI Trade Agent API"}


app.include_router(news.router)
app.include_router(strategy.router)
app.include_router(market.router)
app.include_router(technical.router)
app.include_router(recommend.router)