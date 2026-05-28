import threading
from typing import Optional

import osmnx as ox

_original_graph = None
_projected_graph = None
_lock = threading.Lock()


def _build_graphs():
    global _original_graph, _projected_graph
    if _original_graph is not None and _projected_graph is not None:
        return
    with _lock:
        if _original_graph is None:
            print("Loading road network...")
            _original_graph = ox.graph_from_point((16.3067, 80.4365), dist=3000, network_type="drive")
        if _projected_graph is None:
            _projected_graph = ox.project_graph(_original_graph)
            print("Projected road network loaded successfully")


def get_original_graph():
    _build_graphs()
    return _original_graph


def get_projected_graph():
    _build_graphs()
    return _projected_graph
