import { useState } from "react";

import Navbar from "../components/Navbar";
import RouteForm from "../components/RouteForm";
import TrafficPanel from "../components/TrafficPanel";
import StatsCard from "../components/StatsCard";

import {
  getShortestPath,
  getOptimizedPath,
  simulateTraffic
} from "../services/api";

function Dashboard() {

  const [routeData, setRouteData] = useState(null);

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

      alert("Traffic Updated Successfully");

    } catch (error) {

      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Panel */}
        <div className="space-y-6">

          <RouteForm
            onDijkstra={handleDijkstra}
            onAStar={handleAStar}
          />

          <TrafficPanel
            onSimulate={handleTrafficSimulation}
          />

        </div>

        {/* Right Panel */}
        <div className="lg:col-span-2">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

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

          </div>

          {/* Route Output */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">

            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              Route Result
            </h2>

            {routeData ? (

              <div>

                <p className="mb-2">
                  <span className="font-bold">
                    Path:
                  </span>{" "}

                  {routeData.path.join(" → ")}
                </p>

                <p className="mb-2">
                  <span className="font-bold">
                    Estimated Time:
                  </span>{" "}

                  {routeData.estimated_time}
                </p>

              </div>

            ) : (

              <p className="text-slate-400">
                Run an algorithm to see results
              </p>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;