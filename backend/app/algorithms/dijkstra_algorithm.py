import networkx as nx

from app.data.graph_data import graph

# -----------------------------------
# DIJKSTRA ROUTING
# -----------------------------------

def calculate_dijkstra_path(source, destination):

    """
    Calculate shortest path using
    traffic-aware weights
    """

    try:

        # Create temporary graph
        temp_graph = graph.copy()

        # Update effective weights
        for start, end, data in temp_graph.edges(data=True):

            effective_weight = (
                data["weight"] * data["traffic"]
            )

            data["effective_weight"] = effective_weight

        # Find shortest path
        path = nx.dijkstra_path(
            temp_graph,
            source,
            destination,
            weight="effective_weight"
        )

        # Path distance
        total_distance = nx.dijkstra_path_length(
            temp_graph,
            source,
            destination,
            weight="effective_weight"
        )

        estimated_time = round(total_distance * 2, 2)

        congestion = calculate_congestion(path)

        return {
            "algorithm": "Dijkstra",
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