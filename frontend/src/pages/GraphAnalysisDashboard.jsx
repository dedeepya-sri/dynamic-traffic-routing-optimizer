import { useState } from "react";

import RouteForm from "../components/RouteForm";
import TrafficPanel from "../components/TrafficPanel";
import ComparisonCard from "../components/ComparisonCard";

import {
  getShortestPath,
  getOptimizedPath,
  simulateTraffic
} from "../services/api";

function GraphAnalysisDashboard() {

  const [dijkstraData, setDijkstraData] =
    useState(null);

  const [astarData, setAstarData] =
    useState(null);

  // -----------------------------------
  // COMPARE ALGORITHMS
  // -----------------------------------

  const handleCompare = async (
    source,
    destination
  ) => {

    try {

      const dijkstra =
        await getShortestPath(
          source,
          destination
        );

      const astar =
        await getOptimizedPath(
          source,
          destination
        );

      setDijkstraData(dijkstra);

      setAstarData(astar);

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

        alert(
          "Traffic simulation updated"
        );

      } catch (error) {

        console.error(error);
      }
    };

  return (

    <div>

      {/* CONTROL PANELS */}
      <div className="
        grid
        grid-cols-1
        lg:grid-cols-3
        gap-6
        mb-6
      ">

        <RouteForm
          onCompare={handleCompare}
        />

        <TrafficPanel
          onSimulate={
            handleTrafficSimulation
          }
        />

        {/* ANALYTICS */}
        <div className="
          bg-slate-800
          p-6
          rounded-2xl
          border
          border-slate-700
        ">

          <h2 className="
            text-2xl
            font-bold
            text-cyan-400
            mb-4
          ">
            System Insights
          </h2>

          <ul className="
            space-y-3
            text-slate-300
          ">
            <li>
              • Dynamic congestion-aware routing
            </li>

            <li>
              • Dijkstra explores broadly
            </li>

            <li>
              • A* uses heuristic guidance
            </li>

            <li>
              • Real-time traffic adaptation
            </li>

          </ul>

        </div>

      </div>

      {/* COMPARISON */}
      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-6
      ">

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
  );
}

export default GraphAnalysisDashboard;