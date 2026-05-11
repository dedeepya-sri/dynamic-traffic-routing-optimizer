import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import RouteForm from "../components/RouteForm";
import TrafficPanel from "../components/TrafficPanel";
import StatsCard from "../components/StatsCard";
import MapView from "../components/MapView";

import {
  fetchGraph,
  getShortestPath,
  getOptimizedPath,
  simulateTraffic
} from "../services/api";

function Dashboard() {

  const [graphData, setGraphData] = useState(null);

  const [routeData, setRouteData] = useState(null);

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
  // DIJKSTRA
  // -----------------------------------

  const handleDijkstra = async (
    source,
    destination
  ) => {

    try {

      const data = await getShortestPath(
        source,
        destination
      );

      setRouteData(data);

    } catch (error) {

      console.error(error);
    }
  };

  // -----------------------------------
  // A*
  // -----------------------------------

  const handleAStar = async (
    source,
    destination
  ) => {

    try {

      const data = await getOptimizedPath(
        source,
        destination
      );

      setRouteData(data);

    } catch (error) {

      console.error(error);
    }
  };

  // -----------------------------------
  // TRAFFIC SIMULATION
  // -----------------------------------

  const handleTrafficSimulation = async () => {

    try {

      await simulateTraffic();

      // Reload graph after traffic changes
      await loadGraph();

      alert("Traffic Updated Successfully");

    } catch (error) {

      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT PANEL */}
        <div className="space-y-6">

          <RouteForm
            onDijkstra={handleDijkstra}
            onAStar={handleAStar}
          />

          <TrafficPanel
            onSimulate={handleTrafficSimulation}
          />

          {/* STATS */}
          <div className="grid grid-cols-1 gap-4">

            <StatsCard
              title="Algorithm"
              value={routeData?.algorithm || "-"}
            />

            <StatsCard
              title="Distance"
              value={routeData?.distance || "-"}
            />

            <StatsCard
              title="Congestion"
              value={routeData?.congestion_level || "-"}
            />

            <StatsCard
              title="Estimated Time"
              value={routeData?.estimated_time || "-"}
            />

          </div>

        </div>

        {/* MAP PANEL */}
        <div className="lg:col-span-2">

          <MapView
            graphData={graphData}
            routeData={routeData}
          />

          {/* ROUTE DETAILS */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mt-6">

            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              Route Result
            </h2>

            {routeData ? (

              <div>

                <p className="mb-3 text-lg">
                  <span className="font-bold">
                    Path:
                  </span>{" "}

                  {routeData.path.join(" → ")}
                </p>

                <p className="text-slate-300">
                  Dynamic congestion-aware route
                  generated using{" "}

                  <span className="text-cyan-400 font-bold">
                    {routeData.algorithm}
                  </span>
                </p>

              </div>

            ) : (

              <p className="text-slate-400">
                Select source and destination
                to generate optimized route.
              </p>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;