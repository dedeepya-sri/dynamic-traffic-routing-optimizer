import networkx as nx

from app.data.graph_data import graph

def calculate_dijkstra_path(source, destination):
    """
    Calculate shortest path using Dijkstra Algorithm
    """

    try:
        # Calculate shortest path
        path = nx.dijkstra_path(
            graph,
            source,
            destination,
            weight="weight"
        )

        # Calculate total distance
        total_distance = nx.dijkstra_path_length(
            graph,
            source,
            destination,
            weight="weight"
        )

        # Calculate estimated travel time
        estimated_time = total_distance * 2

        # Calculate congestion level
        congestion = calculate_congestion(path)

        return {
            "algorithm": "Dijkstra",
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


def calculate_congestion(path):
    """
    Calculate average congestion on selected path
    """

    total_traffic = 0
    edge_count = 0

    # Loop through path edges
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