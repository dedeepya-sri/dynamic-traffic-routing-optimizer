import osmnx as ox

print("Loading road network...")

# Geographic graph (lat/lon)
REAL_GRAPH = ox.graph_from_point(
    (16.3067, 80.4365),
    dist=3000,
    network_type="drive"
)

print("Road network loaded successfully")