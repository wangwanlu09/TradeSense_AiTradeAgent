from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import news, market, technical, strategy, recommend

app = FastAPI()

<<<<<<< HEAD
# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
=======
>>>>>>> 5f1c279ea36c65ef3a2f76ab32043d635c266238

@app.get("/")
def root():
    return {"message": "Welcome to the AI Trade Agent API"}


app.include_router(news.router)
app.include_router(strategy.router)
app.include_router(market.router)
<<<<<<< HEAD
app.include_router(technical.router)
app.include_router(recommend.router)
=======
>>>>>>> 5f1c279ea36c65ef3a2f76ab32043d635c266238
