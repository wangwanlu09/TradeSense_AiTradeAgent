from fastapi import FastAPI
from routes import news

app = FastAPI()

# 根路由
@app.get("/")
def root():
    return {"message": "Welcome to the AI Trade Agent API"}

# 引入并注册新闻路由
app.include_router(news.router)