import random

from app.data.graph_data import graph

# -----------------------------------
# RANDOM TRAFFIC SIMULATION
# -----------------------------------

def simulate_traffic():

    """
    Randomly update traffic levels
    for all roads
    """

    updated_roads = []

    # Loop through all edges
    for start, end, data in graph.edges(data=True):

        # Random traffic multiplier
        traffic = round(random.uniform(1.0, 3.0), 2)

        # Update graph traffic
        graph[start][end]["traffic"] = traffic

        updated_roads.append({
            "source": start,
            "target": end,
            "traffic": traffic
        })

    return {
        "message": "Traffic updated successfully",
        "roads": updated_roads
    }

# -----------------------------------
# GET CURRENT TRAFFIC STATUS
# -----------------------------------

def get_traffic_status():

    roads = []

    for start, end, data in graph.edges(data=True):

        roads.append({
            "source": start,
            "target": end,
            "distance": data["weight"],
            "traffic": data["traffic"],
            "effective_weight": round(
                data["weight"] * data["traffic"],
                2
            )
        })

    return {
        "roads": roads
    }