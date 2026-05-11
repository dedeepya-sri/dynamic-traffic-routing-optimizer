import networkx as nx
import osmnx as ox

from app.services.real_map_service import REAL_GRAPH

# -----------------------------------
# GET NEAREST NODE
# -----------------------------------

def get_nearest_node(latitude, longitude):

    return ox.distance.nearest_nodes(
        REAL_GRAPH,
        longitude,
        latitude
    )

# -----------------------------------
# CONVERT ROUTE TO COORDINATES
# -----------------------------------

def route_to_coordinates(route):

    coordinates = []

    for node in route:

        node_data = REAL_GRAPH.nodes[node]

        coordinates.append([
            node_data["y"],
            node_data["x"]
        ])

    return coordinates

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

        print("SOURCE NODE:", source_node)
        print("DEST NODE:", destination_node)

        route = nx.shortest_path(
            REAL_GRAPH,
            source_node,
            destination_node,
            weight="length"
        )

        distance = nx.shortest_path_length(
            REAL_GRAPH,
            source_node,
            destination_node,
            weight="length"
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

    x1 = REAL_GRAPH.nodes[node1]["x"]
    y1 = REAL_GRAPH.nodes[node1]["y"]

    x2 = REAL_GRAPH.nodes[node2]["x"]
    y2 = REAL_GRAPH.nodes[node2]["y"]

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

        route = nx.astar_path(
            REAL_GRAPH,
            source_node,
            destination_node,
            heuristic=heuristic,
            weight="length"
        )

        distance = nx.astar_path_length(
            REAL_GRAPH,
            source_node,
            destination_node,
            heuristic=heuristic,
            weight="length"
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