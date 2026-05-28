import heapq
import networkx as nx
import math
import time

from app.data.graph_data import graph


def reconstruct_path(previous_node, destination):

    path = []
    current = destination

    while current is not None:
        path.append(current)
        current = previous_node.get(current)

    return list(reversed(path))

# -----------------------------------
# HEURISTIC
# -----------------------------------

def heuristic(node1, node2):

    pos1 = graph.nodes[node1]["pos"]
    pos2 = graph.nodes[node2]["pos"]

    x1, y1 = pos1
    x2, y2 = pos2

    return math.sqrt(
        (x2 - x1) ** 2 +
        (y2 - y1) ** 2
    )


def run_instrumented_astar(temp_graph, source, destination):

    distances = {
        source: 0
    }
    previous_node = {
        source: None
    }
    explored_nodes = set()
    queue = [
        (
            heuristic(source, destination),
            0,
            source
        )
    ]

    while queue:

        _, current_distance, current_node = heapq.heappop(queue)

        if current_node in explored_nodes:
            continue

        explored_nodes.add(current_node)

        if current_node == destination:
            return (
                reconstruct_path(
                    previous_node,
                    destination
                ),
                current_distance,
                len(explored_nodes)
            )

        for neighbor, edge_data in temp_graph[current_node].items():

            new_distance = (
                current_distance +
                edge_data["effective_weight"]
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
                            destination
                        ),
                        new_distance,
                        neighbor
                    )
                )

    raise nx.NetworkXNoPath

# -----------------------------------
# A* ROUTING
# -----------------------------------

def calculate_astar_path(source, destination):

    try:

        # Start timer
        start_time = time.perf_counter()

        temp_graph = graph.copy()

        # Traffic-aware weights
        for start, end, data in temp_graph.edges(data=True):

            effective_weight = (
                data["weight"] * data["traffic"]
            )

            data["effective_weight"] = effective_weight

        path, total_distance, nodes_explored = run_instrumented_astar(
            temp_graph,
            source,
            destination
        )

        # End timer
        end_time = time.perf_counter()

        execution_time = (
            end_time - start_time
        ) * 1000

        estimated_time = round(
            total_distance * 2,
            2
        )

        congestion = calculate_congestion(path)

        return {
            "algorithm": "A*",
            "path": path,
            "distance": round(total_distance, 2),
            "estimated_time": estimated_time,
            "congestion_level": congestion,
            "nodes_explored": nodes_explored,
            "execution_time_ms": round(
                execution_time,
                4
            )
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
# CONGESTION
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

    return round(
        total_traffic / edge_count,
        2
    )
