import networkx as nx
import math

from app.data.graph_data import graph

# -----------------------------------
# HEURISTIC FUNCTION
# -----------------------------------

def heuristic(node1, node2):

    pos1 = graph.nodes[node1]["pos"]
    pos2 = graph.nodes[node2]["pos"]

    x1, y1 = pos1
    x2, y2 = pos2

    return math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

# -----------------------------------
# A* ROUTING
# -----------------------------------

def calculate_astar_path(source, destination):

    try:

        # Create temporary graph
        temp_graph = graph.copy()

        # Update effective weights
        for start, end, data in temp_graph.edges(data=True):

            effective_weight = (
                data["weight"] * data["traffic"]
            )

            data["effective_weight"] = effective_weight

        # Calculate optimized path
        path = nx.astar_path(
            temp_graph,
            source,
            destination,
            heuristic=heuristic,
            weight="effective_weight"
        )

        total_distance = nx.astar_path_length(
            temp_graph,
            source,
            destination,
            heuristic=heuristic,
            weight="effective_weight"
        )

        estimated_time = round(total_distance * 1.8, 2)

        congestion = calculate_congestion(path)

        return {
            "algorithm": "A*",
            "path": path,
            "distance": round(total_distance, 2),
            "estimated_time": estimated_time,
            "congestion_level": congestion
        }

    except nx.NetworkXNoPath:

        return {
            "error": "No path found"
        }

    except Exception as error:

        return {
            "error": str(error)
        }

# -----------------------------------
# CONGESTION CALCULATION
# -----------------------------------

def calculate_congestion(path):

    total_traffic = 0
    edge_count = 0

    for i in range(len(path) - 1):

        start = path[i]
        end = path[i + 1]

        traffic = graph[start][end]["traffic"]

        total_traffic += traffic
        edge_count += 1

    if edge_count == 0:
        return 0

    average_traffic = total_traffic / edge_count

    return round(average_traffic, 2)