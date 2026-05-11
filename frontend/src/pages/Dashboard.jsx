import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import RouteForm from "../components/RouteForm";
import TrafficPanel from "../components/TrafficPanel";
import MapView from "../components/MapView";
import ComparisonCard from "../components/ComparisonCard";

import {
  fetchGraph,
  getShortestPath,
  getOptimizedPath,
  simulateTraffic
} from "../services/api";

function Dashboard() {

  const [graphData, setGraphData] =
    useState(null);

  const [dijkstraData, setDijkstraData] =
    useState(null);

  const [astarData, setAstarData] =
    useState(null);

  const [activeRoute, setActiveRoute] =
    useState(null);

  // -----------------------------------
  // LOAD GRAPH
  // -----------------------------------

  useEffect(() => {

    loadGraph();

  }, []);

  const loadGraph = async () => {

    try {

      const data = await fetchGraph();

      setGraphData(data);

    } catch (error) {

      console.error(error);
    }
  };

  // -----------------------------------
  // COMPARE ALGORITHMS
  // -----------------------------------

  const handleCompare = async (
    source,
    destination
  ) => {

    try {

      // Run both algorithms
      const dijkstra =
        await getShortestPath(
          source,
          destination
        );
        console.log(data);

      const astar =
        await getOptimizedPath(
          source,
          destination
        );

      setDijkstraData(dijkstra);

      setAstarData(astar);

      // Default displayed route
      setActiveRoute(astar);

    } catch (error) {

      console.error(error);
    }
  };

  // -----------------------------------
  // TRAFFIC SIMULATION
  // -----------------------------------

  const handleTrafficSimulation =
    async () => {

      try {

        await simulateTraffic();

        await loadGraph();

        alert(
          "Traffic simulation updated"
        );

      } catch (error) {

        console.error(error);
      }
    };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LEFT SIDEBAR */}
        <div className="space-y-6">

          <RouteForm
            onCompare={handleCompare}
          />

          <TrafficPanel
            onSimulate={
              handleTrafficSimulation
            }
          />

        </div>

        {/* MAP */}
        <div className="lg:col-span-3">

          <MapView
            graphData={graphData}
            routeData={activeRoute}
          />

          {/* COMPARISON */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

            <ComparisonCard
              title="Dijkstra Analysis"
              data={dijkstraData}
              color="text-cyan-400"
            />

            <ComparisonCard
              title="A* Analysis"
              data={astarData}
              color="text-purple-400"
            />

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;