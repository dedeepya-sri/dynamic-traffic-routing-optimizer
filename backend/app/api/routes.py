from fastapi import APIRouter

from app.services.graph_service import get_graph_data
from app.models.schemas import GraphResponse

router = APIRouter()

# -----------------------------------
# TEST ROUTE
# -----------------------------------

@router.get("/test")
def test_route():
    return {
        "message": "API routes working"
    }

# -----------------------------------
# GET GRAPH DATA
# -----------------------------------

@router.get("/graph", response_model=GraphResponse)
def fetch_graph():
    return get_graph_data()