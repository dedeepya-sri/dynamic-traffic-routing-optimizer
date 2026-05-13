import networkx as nx
import osmnx as ox
import random

from pyproj import Transformer

from app.services.real_map_service import (
    ORIGINAL_GRAPH,
    PROJECTED_GRAPH
)

# -----------------------------------
# CREATE COORDINATE TRANSFORMER
# -----------------------------------

transformer = Transformer.from_crs(
    "EPSG:4326",
    PROJECTED_GRAPH.graph["crs"],
    always_xy=True
)

# -----------------------------------
# CONVERT GPS TO PROJECTED NODE
# -----------------------------------

def get_nearest_node(latitude, longitude):

    # Convert lat/lon into projected CRS
    x, y = transformer.transform(
        longitude,
        latitude
    )

    return ox.distance.nearest_nodes(
        PROJECTED_GRAPH,
        x,
        y
    )

# -----------------------------------
# CONVERT ROUTE TO LAT/LON
# -----------------------------------

def route_to_coordinates(route):

    coordinates = []

    for node in route:

        node_data = ORIGINAL_GRAPH.nodes[node]

        coordinates.append([
            node_data["y"],
            node_data["x"]
        ])

    return coordinates

# -----------------------------------
# CREATE TRAFFIC GRAPH
# -----------------------------------

def create_traffic_graph():

    temp_graph = PROJECTED_GRAPH.copy()

    for u, v, key, data in temp_graph.edges(
        keys=True,
        data=True
    ):

        traffic = data.get(
            "traffic",
            1.0
        )

        data["effective_cost"] = (
            data["length"] * traffic
        )

    return temp_graph

# -----------------------------------
# REAL DIJKSTRA
# -----------------------------------

def calculate_real_dijkstra(
    source_lat,
    source_lon,
    dest_lat,
    dest_lon
):

    try:

        source_node = get_nearest_node(
            source_lat,
            source_lon
        )

        destination_node = get_nearest_node(
            dest_lat,
            dest_lon
        )

        temp_graph = create_traffic_graph()

        route = nx.shortest_path(
            temp_graph,
            source_node,
            destination_node,
            weight="effective_cost"
        )

        distance = nx.shortest_path_length(
            temp_graph,
            source_node,
            destination_node,
            weight="effective_cost"
        )

        coordinates = route_to_coordinates(
            route
        )

        return {
            "algorithm": "Real Dijkstra",
            "distance_meters": round(distance, 2),
            "route_coordinates": coordinates,
            "node_count": len(route)
        }

    except Exception as error:

        return {
            "error": str(error)
        }

# -----------------------------------
# HEURISTIC
# -----------------------------------

def heuristic(node1, node2):

    x1 = PROJECTED_GRAPH.nodes[node1]["x"]
    y1 = PROJECTED_GRAPH.nodes[node1]["y"]

    x2 = PROJECTED_GRAPH.nodes[node2]["x"]
    y2 = PROJECTED_GRAPH.nodes[node2]["y"]

    return (
        (x2 - x1)**2 +
        (y2 - y1)**2
    )**0.5

# -----------------------------------
# REAL A*
# -----------------------------------

def calculate_real_astar(
    source_lat,
    source_lon,
    dest_lat,
    dest_lon
):

    try:

        source_node = get_nearest_node(
            source_lat,
            source_lon
        )

        destination_node = get_nearest_node(
            dest_lat,
            dest_lon
        )

        temp_graph = create_traffic_graph()

        route = nx.astar_path(
            temp_graph,
            source_node,
            destination_node,
            heuristic=heuristic,
            weight="effective_cost"
        )

        distance = nx.astar_path_length(
            temp_graph,
            source_node,
            destination_node,
            heuristic=heuristic,
            weight="effective_cost"
        )

        coordinates = route_to_coordinates(
            route
        )

        return {
            "algorithm": "Real A*",
            "distance_meters": round(distance, 2),
            "route_coordinates": coordinates,
            "node_count": len(route)
        }

    except Exception as error:

        return {
            "error": str(error)
        }

# -----------------------------------
# SIMULATE TRAFFIC
# -----------------------------------

def simulate_real_traffic():

    updated_edges = 0

    for u, v, key, data in PROJECTED_GRAPH.edges(
        keys=True,
        data=True
    ):

        traffic = round(
            random.uniform(1.0, 4.0),
            2
        )

        data["traffic"] = traffic

        updated_edges += 1

    return {
        "message": "Traffic updated",
        "updated_roads": updated_edges
    }