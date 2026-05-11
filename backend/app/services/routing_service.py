from app.algorithms.dijkstra_algorithm import calculate_dijkstra_path
from app.algorithms.astar_algorithm import calculate_astar_path

# -----------------------------------
# DIJKSTRA SERVICE
# -----------------------------------

def get_dijkstra_route(source, destination):

    result = calculate_dijkstra_path(
        source,
        destination
    )

    return result

# -----------------------------------
# A* SERVICE
# -----------------------------------

def get_astar_route(source, destination):

    result = calculate_astar_path(
        source,
        destination
    )

    return result