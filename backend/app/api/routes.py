from fastapi import APIRouter

from app.services.graph_service import get_graph_data

from app.services.routing_service import (
    get_dijkstra_route,
    get_astar_route
)

from app.services.traffic_service import (
    simulate_traffic,
    get_traffic_status
)

from app.models.schemas import (
    GraphResponse,
    RouteRequest
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

    return get_dijkstra_route(
        request.source,
        request.destination
    )

# -----------------------------------
# A* ROUTE
# -----------------------------------

@router.post("/optimized-path")
def optimized_path(request: RouteRequest):

    return get_astar_route(
        request.source,
        request.destination
    )

# -----------------------------------
# SIMULATE TRAFFIC
# -----------------------------------

@router.post("/simulate-traffic")
def simulate():

    return simulate_traffic()

# -----------------------------------
# GET TRAFFIC STATUS
# -----------------------------------

@router.get("/traffic-status")
def traffic_status():

    return get_traffic_status()