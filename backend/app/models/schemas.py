from pydantic import BaseModel
from typing import List

# -----------------------------------
# GRAPH SCHEMAS
# -----------------------------------

class NodeSchema(BaseModel):
    id: str
    position: tuple

class EdgeSchema(BaseModel):
    source: str
    target: str
    weight: float
    traffic: float

class GraphResponse(BaseModel):
    nodes: List[NodeSchema]
    edges: List[EdgeSchema]

# -----------------------------------
# ROUTE REQUEST
# -----------------------------------

class RouteRequest(BaseModel):
    source: str
    destination: str

# -----------------------------------
# ROUTE RESPONSE
# -----------------------------------

class RouteResponse(BaseModel):
    algorithm: str
    path: List[str]
    distance: float
    estimated_time: float
    congestion_level: float


# -----------------------------------
# REAL ROUTING REQUEST
# -----------------------------------

class RealRouteRequest(BaseModel):

    source_lat: float
    source_lon: float

    dest_lat: float
    dest_lon: float