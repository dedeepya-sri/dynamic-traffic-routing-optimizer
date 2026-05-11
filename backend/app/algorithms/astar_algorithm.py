import networkx as nx
import math

from app.data.graph_data import graph

# -----------------------------------
# HEURISTIC FUNCTION
# -----------------------------------

def heuristic(node1, node2):
    """
    Estimate distance between two nodes
    using Euclidean distance
    """

    pos1 = graph.nodes[node1]["pos"]
    pos2 = graph.nodes[node2]["pos"]

    x1, y1 = pos1
    x2, y2 = pos2

    return math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

# -----------------------------------
# A* PATH CALCULATION
# -----------------------------------

def calculate_astar_path(source, destination):
    """
    Calculate optimized path using A* Algorithm
    """

    try:

        # Find path
        path = nx.astar_path(
            graph,
            source,
            destination,
            heuristic=heuristic,
            weight="weight"
        )

        # Calculate path length
        total_distance = nx.astar_path_length(
            graph,
            source,
            destination,
            heuristic=heuristic,
            weight="weight"
        )

        # Estimated travel time
        estimated_time = total_distance * 1.8

        # Congestion level
        congestion = calculate_congestion(path)

        return {
            "algorithm": "A*",
            "path": path,
            "distance": total_distance,
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