import heapq
import networkx as nx
import random
import time

from pyproj import Transformer

from app.services.real_map_service import (
    get_original_graph,
    get_projected_graph
)

# -----------------------------------
# CREATE COORDINATE TRANSFORMER
# -----------------------------------

projected_graph = get_projected_graph()
transformer = Transformer.from_crs(
    "EPSG:4326",
    projected_graph.graph["crs"],
    always_xy=True
)

AVERAGE_CITY_SPEED_KMPH = 32

# -----------------------------------
# CONVERT GPS TO PROJECTED NODE
# -----------------------------------

def get_nearest_node(latitude, longitude):

    # Convert lat/lon into projected CRS
    x, y = transformer.transform(
        longitude,
        latitude
    )

    nearest_node = None
    shortest_distance = float("inf")

    for node, data in projected_graph.nodes(data=True):

        node_x = data.get("x")
        node_y = data.get("y")

        if node_x is None or node_y is None:
            continue

        distance = (
            (node_x - x) ** 2 +
            (node_y - y) ** 2
        )

        if distance < shortest_distance:
            shortest_distance = distance
            nearest_node = node

    if nearest_node is None:
        raise ValueError("No routable map nodes found")

    return nearest_node

# -----------------------------------
# CONVERT ROUTE TO LAT/LON
# -----------------------------------

def route_to_coordinates(route):

    original_graph = get_original_graph()
    coordinates = []

    for node in route:

        node_data = original_graph.nodes[node]

        coordinates.append([
            node_data["y"],
            node_data["x"]
        ])

    return coordinates

# -----------------------------------
# CREATE TRAFFIC GRAPH
# -----------------------------------

def create_traffic_graph():

    temp_graph = projected_graph.copy()

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
# ROUTE ANALYTICS
# -----------------------------------

def get_best_edge_data(graph, start, end):

    edge_options = graph.get_edge_data(
        start,
        end,
        default={}
    )

    if not edge_options:
        return {}

    return min(
        edge_options.values(),
        key=lambda data: data.get(
            "effective_cost",
            data.get("length", 0)
        )
    )


def normalize_road_name(name):

    if isinstance(name, list):
        return ", ".join(
            str(item) for item in name[:2]
        )

    if name:
        return str(name)

    return "Unnamed road"


def build_route_summary(
    algorithm,
    route,
    temp_graph,
    execution_time_ms,
    nodes_explored
):

    total_distance = 0
    traffic_weighted_distance = 0
    traffic_values = []
    road_segments = []

    for index in range(len(route) - 1):

        start = route[index]
        end = route[index + 1]
        edge_data = get_best_edge_data(
            temp_graph,
            start,
            end
        )

        length = edge_data.get("length", 0)
        traffic = edge_data.get("traffic", 1.0)
        cost = edge_data.get(
            "effective_cost",
            length * traffic
        )

        total_distance += length
        traffic_weighted_distance += cost
        traffic_values.append(traffic)

        if len(road_segments) < 8:
            road_segments.append({
                "name": normalize_road_name(
                    edge_data.get("name")
                ),
                "highway": normalize_road_name(
                    edge_data.get("highway")
                ),
                "distance_meters": round(length, 2),
                "traffic_factor": round(traffic, 2)
            })

    average_traffic = (
        traffic_weighted_distance / total_distance
        if total_distance
        else 1.0
    )

    free_flow_time_min = (
        (total_distance / 1000) /
        AVERAGE_CITY_SPEED_KMPH *
        60
        if total_distance
        else 0
    )

    estimated_time_min = (
        free_flow_time_min * average_traffic
    )

    delay_min = max(
        estimated_time_min - free_flow_time_min,
        0
    )

    if average_traffic >= 3:
        congestion_level = "Severe"
    elif average_traffic >= 2.2:
        congestion_level = "Heavy"
    elif average_traffic >= 1.4:
        congestion_level = "Moderate"
    else:
        congestion_level = "Clear"

    return {
        "algorithm": algorithm,
        "distance_meters": round(total_distance, 2),
        "traffic_weighted_distance_meters": round(
            traffic_weighted_distance,
            2
        ),
        "estimated_time_min": round(
            estimated_time_min,
            2
        ),
        "free_flow_time_min": round(
            free_flow_time_min,
            2
        ),
        "delay_min": round(delay_min, 2),
        "average_traffic_factor": round(
            average_traffic,
            2
        ),
        "congestion_level": congestion_level,
        "execution_time_ms": round(
            execution_time_ms,
            4
        ),
        "nodes_explored": nodes_explored,
        "route_coordinates": route_to_coordinates(
            route
        ),
        "node_count": len(route),
        "road_segments": road_segments
    }


def reconstruct_path(previous_node, destination):

    path = []
    current = destination

    while current is not None:
        path.append(current)
        current = previous_node.get(current)

    return list(reversed(path))


def get_neighbors(graph, node):

    if hasattr(graph, "successors"):
        return graph.successors(node)

    return graph.neighbors(node)


def run_instrumented_dijkstra(
    temp_graph,
    source_node,
    destination_node
):

    distances = {
        source_node: 0
    }
    previous_node = {
        source_node: None
    }
    explored_nodes = set()
    queue = [
        (0, source_node)
    ]

    while queue:

        current_distance, current_node = heapq.heappop(queue)

        if current_node in explored_nodes:
            continue

        explored_nodes.add(current_node)

        if current_node == destination_node:
            return (
                reconstruct_path(
                    previous_node,
                    destination_node
                ),
                len(explored_nodes)
            )

        for neighbor in get_neighbors(
            temp_graph,
            current_node
        ):
            edge_data = get_best_edge_data(
                temp_graph,
                current_node,
                neighbor
            )

            edge_cost = edge_data.get(
                "effective_cost",
                edge_data.get("length", 0)
            )

            new_distance = (
                current_distance +
                edge_cost
            )

            if new_distance < distances.get(
                neighbor,
                float("inf")
            ):
                distances[neighbor] = new_distance
                previous_node[neighbor] = current_node
                heapq.heappush(
                    queue,
                    (new_distance, neighbor)
                )

    raise nx.NetworkXNoPath


def run_instrumented_astar(
    temp_graph,
    source_node,
    destination_node
):

    distances = {
        source_node: 0
    }
    previous_node = {
        source_node: None
    }
    explored_nodes = set()
    queue = [
        (
            heuristic(
                source_node,
                destination_node
            ),
            0,
            source_node
        )
    ]

    while queue:

        _, current_distance, current_node = heapq.heappop(queue)

        if current_node in explored_nodes:
            continue

        explored_nodes.add(current_node)

        if current_node == destination_node:
            return (
                reconstruct_path(
                    previous_node,
                    destination_node
                ),
                len(explored_nodes)
            )

        for neighbor in get_neighbors(
            temp_graph,
            current_node
        ):
            edge_data = get_best_edge_data(
                temp_graph,
                current_node,
                neighbor
            )

            edge_cost = edge_data.get(
                "effective_cost",
                edge_data.get("length", 0)
            )

            new_distance = (
                current_distance +
                edge_cost
            )

            if new_distance < distances.get(
                neighbor,
                float("inf")
            ):
                distances[neighbor] = new_distance
                previous_node[neighbor] = current_node
                heapq.heappush(
                    queue,
                    (
                        new_distance + heuristic(
                            neighbor,
                            destination_node
                        ),
                        new_distance,
                        neighbor
                    )
                )

    raise nx.NetworkXNoPath


def choose_recommended_route(valid_routes):

    best_route = min(
        valid_routes,
        key=lambda route: (
            route["estimated_time_min"],
            route["traffic_weighted_distance_meters"],
            route["nodes_explored"],
            route["execution_time_ms"]
        )
    )

    same_cost_routes = [
        route for route in valid_routes
        if (
            route["estimated_time_min"] ==
            best_route["estimated_time_min"] and
            route["traffic_weighted_distance_meters"] ==
            best_route["traffic_weighted_distance_meters"]
        )
    ]

    if len(same_cost_routes) > 1:
        best_route = min(
            same_cost_routes,
            key=lambda route: (
                route["nodes_explored"],
                route["execution_time_ms"]
            )
        )

        return (
            best_route,
            "Same optimal route cost; recommended the algorithm with lower search effort"
        )

    return (
        best_route,
        "Lowest estimated travel time after applying traffic factors"
    )

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

        start_time = time.perf_counter()

        source_node = get_nearest_node(
            source_lat,
            source_lon
        )

        destination_node = get_nearest_node(
            dest_lat,
            dest_lon
        )

        temp_graph = create_traffic_graph()

        route, nodes_explored = run_instrumented_dijkstra(
            temp_graph,
            source_node,
            destination_node
        )

        execution_time_ms = (
            time.perf_counter() - start_time
        ) * 1000

        return build_route_summary(
            "Real Dijkstra",
            route,
            temp_graph,
            execution_time_ms,
            nodes_explored
        )

    except Exception as error:

        return {
            "error": str(error)
        }

# -----------------------------------
# HEURISTIC
# -----------------------------------

def heuristic(node1, node2):

    x1 = projected_graph.nodes[node1]["x"]
    y1 = projected_graph.nodes[node1]["y"]

    x2 = projected_graph.nodes[node2]["x"]
    y2 = projected_graph.nodes[node2]["y"]

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

        start_time = time.perf_counter()

        source_node = get_nearest_node(
            source_lat,
            source_lon
        )

        destination_node = get_nearest_node(
            dest_lat,
            dest_lon
        )

        temp_graph = create_traffic_graph()

        route, nodes_explored = run_instrumented_astar(
            temp_graph,
            source_node,
            destination_node
        )

        execution_time_ms = (
            time.perf_counter() - start_time
        ) * 1000

        return build_route_summary(
            "Real A*",
            route,
            temp_graph,
            execution_time_ms,
            nodes_explored
        )

    except Exception as error:

        return {
            "error": str(error)
        }

# -----------------------------------
# REAL ROUTE COMPARISON
# -----------------------------------

def calculate_real_comparison(
    source_lat,
    source_lon,
    dest_lat,
    dest_lon
):

    dijkstra = calculate_real_dijkstra(
        source_lat,
        source_lon,
        dest_lat,
        dest_lon
    )

    astar = calculate_real_astar(
        source_lat,
        source_lon,
        dest_lat,
        dest_lon
    )

    valid_routes = [
        route for route in [dijkstra, astar]
        if "error" not in route
    ]

    if not valid_routes:
        return {
            "error": "No route found",
            "routes": [dijkstra, astar]
        }

    recommended_route, recommendation_reason = choose_recommended_route(
        valid_routes
    )

    return {
        "recommended_algorithm": recommended_route["algorithm"],
        "recommendation_reason": recommendation_reason,
        "recommended_route": recommended_route,
        "routes": [dijkstra, astar]
    }

# -----------------------------------
# SIMULATE TRAFFIC
# -----------------------------------

def simulate_real_traffic():

    updated_edges = 0

    for u, v, key, data in projected_graph.edges(
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
