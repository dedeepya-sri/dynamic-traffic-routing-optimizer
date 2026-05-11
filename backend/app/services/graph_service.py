from app.data.graph_data import graph

def get_graph_data():
    """
    Convert graph into JSON-friendly format
    """

    nodes = []
    edges = []

    # Process nodes
    for node, data in graph.nodes(data=True):
        nodes.append({
            "id": node,
            "position": data["pos"]
        })

    # Process edges
    for start, end, data in graph.edges(data=True):
        edges.append({
            "source": start,
            "target": end,
            "weight": data["weight"],
            "traffic": data["traffic"]
        })

    return {
        "nodes": nodes,
        "edges": edges
    }