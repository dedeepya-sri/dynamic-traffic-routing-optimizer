from fastapi import APIRouter

from app.services.graph_service import get_graph_data
from app.services.routing_service import get_dijkstra_route

from app.models.schemas import (
    GraphResponse,
    RouteRequest,
    RouteResponse
)

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
# GET GRAPH
# -----------------------------------

@router.get("/graph", response_model=GraphResponse)
def fetch_graph():
    return get_graph_data()

# -----------------------------------
# DIJKSTRA ROUTE
# -----------------------------------

@router.post("/shortest-path")
def shortest_path(request: RouteRequest):

    result = get_dijkstra_route(
        request.source,
        request.destination
    )

    return result