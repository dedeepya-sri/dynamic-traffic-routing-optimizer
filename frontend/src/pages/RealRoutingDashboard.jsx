import { useState } from "react";

import Navbar from "../components/Navbar";

import RealMapView from "../components/RealMapView";

import {
  getRealShortestPath,
  getRealOptimizedPath
} from "../services/api";

function RealRoutingDashboard() {

  const [source, setSource] =
    useState(null);

  const [destination, setDestination] =
    useState(null);

  const [routeData, setRouteData] =
    useState(null);

  // -----------------------------------
  // REAL DIJKSTRA
  // -----------------------------------

  const runDijkstra = async () => {

    if (!source || !destination) {

      alert(
        "Select source and destination"
      );

      return;
    }

    try {

      const data =
        await getRealShortestPath(
          source[0],
          source[1],
          destination[0],
          destination[1]
        );

      setRouteData(data);

    } catch (error) {

      console.error(error);
    }
  };

  // -----------------------------------
  // REAL A*
  // -----------------------------------

  const runAStar = async () => {

    if (!source || !destination) {

      alert(
        "Select source and destination"
      );

      return;
    }

    try {

      const data =
        await getRealOptimizedPath(
          source[0],
          source[1],
          destination[0],
          destination[1]
        );

      setRouteData(data);

    } catch (error) {

      console.error(error);
    }
  };

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LEFT PANEL */}
        <div className="space-y-6">

          {/* CONTROLS */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">

            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              Real Map Routing
            </h2>

            <p className="text-slate-300 mb-4">
              Click two locations on map
            </p>

            <div className="space-y-4">

              <button
                onClick={runDijkstra}
                className="
                w-full
                bg-cyan-500
                hover:bg-cyan-600
                py-3
                rounded-xl
                font-bold
                "
              >
                Run Real Dijkstra
              </button>

              <button
                onClick={runAStar}
                className="
                w-full
                bg-purple-500
                hover:bg-purple-600
                py-3
                rounded-xl
                font-bold
                "
              >
                Run Real A*
              </button>

            </div>

          </div>

          {/* INFO PANEL */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">

            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Route Analytics
            </h2>

            {routeData ? (

              <div className="space-y-3">

                <div>
                  <span className="font-bold">
                    Algorithm:
                  </span>{" "}

                  {routeData.algorithm}
                </div>

                <div>
                  <span className="font-bold">
                    Distance:
                  </span>{" "}

                  {routeData.distance_meters} m
                </div>

                <div>
                  <span className="font-bold">
                    Route Nodes:
                  </span>{" "}

                  {routeData.node_count}
                </div>

              </div>

            ) : (

              <p className="text-slate-400">
                No route generated yet
              </p>

            )}

          </div>

        </div>

        {/* MAP */}
        <div className="lg:col-span-3">

          <RealMapView
            source={source}
            destination={destination}
            setSource={setSource}
            setDestination={setDestination}
            routeCoordinates={
              routeData?.route_coordinates
            }
          />

        </div>

      </div>

    </div>
  );
}

export default RealRoutingDashboard;