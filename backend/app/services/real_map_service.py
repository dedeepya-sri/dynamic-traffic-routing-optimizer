import threading
from typing import Optional

import osmnx as ox

_original_graph = None
_projected_graph = None
_lock = threading.Lock()
_vizag_center = (17.6868, 83.2185)
_vizag_radii_meters = [3000, 2000]

ox.settings.use_cache = True
ox.settings.timeout = 180


def _load_vizag_graph():

    last_error = None

    for radius in _vizag_radii_meters:

        try:
            print(f"Loading Vizag road network ({radius}m radius)...")

            return ox.graph_from_point(
                _vizag_center,
                dist=radius,
                network_type="drive",
                simplify=True
            )

        except Exception as error:
            last_error = error
            print(
                f"Vizag graph load failed for {radius}m radius: {error}"
            )

    raise last_error


def _build_graphs():
    global _original_graph, _projected_graph
    if _original_graph is not None and _projected_graph is not None:
        return
    with _lock:
        if _original_graph is None:
            _original_graph = _load_vizag_graph()
        if _projected_graph is None:
            _projected_graph = ox.project_graph(_original_graph)
            print("Projected road network loaded successfully")


def get_original_graph():
    _build_graphs()
    return _original_graph


def get_projected_graph():
    _build_graphs()
    return _projected_graph
