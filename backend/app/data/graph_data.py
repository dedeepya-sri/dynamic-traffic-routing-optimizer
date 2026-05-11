import networkx as nx

# Create graph object
graph = nx.Graph()

# -----------------------------------
# ADD NODES (INTERSECTIONS)
# -----------------------------------

nodes = {
    "A": {"pos": (17.3850, 78.4867)},
    "B": {"pos": (17.3950, 78.4967)},
    "C": {"pos": (17.4050, 78.5067)},
    "D": {"pos": (17.4150, 78.5167)},
    "E": {"pos": (17.4250, 78.5267)},
    "F": {"pos": (17.4350, 78.5367)}
}

# Add nodes to graph
for node, data in nodes.items():
    graph.add_node(node, pos=data["pos"])

# -----------------------------------
# ADD EDGES (ROADS)
# -----------------------------------

roads = [
    ("A", "B", 4),
    ("A", "C", 7),
    ("B", "C", 1),
    ("B", "D", 5),
    ("C", "D", 2),
    ("C", "E", 6),
    ("D", "E", 3),
    ("D", "F", 8),
    ("E", "F", 2)
]

# Add weighted edges
for start, end, weight in roads:
    graph.add_edge(
        start,
        end,
        weight=weight,
        traffic=1.0
    )