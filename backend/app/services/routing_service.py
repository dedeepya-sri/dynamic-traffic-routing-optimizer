from app.algorithms.dijkstra_algorithm import calculate_dijkstra_path

def get_dijkstra_route(source, destination):
    """
    Service layer for Dijkstra routing
    """

    result = calculate_dijkstra_path(source, destination)

    return result