import osmnx as ox

print("Loading road network...")

# -----------------------------------
# ORIGINAL GRAPH (LAT/LON)
# -----------------------------------

ORIGINAL_GRAPH = ox.graph_from_point(
    (16.3067, 80.4365),
    dist=3000,
    network_type="drive"
)

# -----------------------------------
# PROJECTED GRAPH
# -----------------------------------

PROJECTED_GRAPH = ox.project_graph(
    ORIGINAL_GRAPH
)

print("Projected road network loaded successfully")