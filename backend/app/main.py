from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router

app = FastAPI(
    title="Dynamic Traffic Routing Optimizer",
    description="API for intelligent traffic routing using Dijkstra and A*",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)

@app.get("/")
def home():
    return {
        "message": "Traffic Routing Optimizer API Running"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }