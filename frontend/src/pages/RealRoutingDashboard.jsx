import { useState } from "react";

import RealMapView from "../components/RealMapView";

import {
  getRealShortestPath,
  getRealOptimizedPath,
  getRealRouteComparison,
  simulateRealTraffic
} from "../services/api";

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
      <div className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className="mt-1 text-lg font-bold text-white">
        {value ?? "-"}
      </div>
    </div>
  );
}

function RealRoutingDashboard() {

  const [source, setSource] =
    useState(null);

  const [destination, setDestination] =
    useState(null);

  const [routeData, setRouteData] =
    useState(null);

  const [comparisonData, setComparisonData] =
    useState(null);

  const [loadingAction, setLoadingAction] =
    useState(null);

  const hasSelection =
    source && destination;

  const formatMeters = (value) => (
    value !== undefined
      ? `${Number(value).toLocaleString()} m`
      : "-"
  );

  const formatMinutes = (value) => (
    value !== undefined
      ? `${value} min`
      : "-"
  );

  const formatMs = (value) => (
    value !== undefined
      ? `${value} ms`
      : "-"
  );

  const comparedRoutesOverlap = (routes) => {
    const validRoutes = routes?.filter(
      (route) => route?.route_coordinates?.length > 0
    );

    if (!validRoutes || validRoutes.length < 2) {
      return false;
    }

    const firstRoute = JSON.stringify(
      validRoutes[0].route_coordinates
    );

    return validRoutes.every(
      (route) => JSON.stringify(route.route_coordinates) === firstRoute
    );
  };

  const buildClientComparison = (
    dijkstra,
    astar
  ) => {

    const routes = [dijkstra, astar];
    const validRoutes = routes.filter(
      (route) => !route.error
    );

    if (validRoutes.length === 0) {
      return {
        error: "No route found",
        routes
      };
    }

    const recommendedRoute = validRoutes.reduce(
      (bestRoute, route) => {
        const routeCost = route.estimated_time_min ?? route.distance_meters;
        const bestCost = bestRoute.estimated_time_min ?? bestRoute.distance_meters;

        if (routeCost !== bestCost) {
          return routeCost < bestCost
            ? route
            : bestRoute;
        }

        const routeExplored = route.nodes_explored ?? Number.MAX_SAFE_INTEGER;
        const bestExplored = bestRoute.nodes_explored ?? Number.MAX_SAFE_INTEGER;

        if (routeExplored !== bestExplored) {
          return routeExplored < bestExplored
            ? route
            : bestRoute;
        }

        return route.execution_time_ms < bestRoute.execution_time_ms
          ? route
          : bestRoute;
      }
    );

    const sameCost = validRoutes.every(
      (route) => (
        (route.estimated_time_min ?? route.distance_meters) ===
        (recommendedRoute.estimated_time_min ?? recommendedRoute.distance_meters)
      )
    );

    return {
      recommended_algorithm: recommendedRoute.algorithm,
      recommendation_reason: sameCost
        ? "Same optimal route cost; recommended the algorithm with lower search effort"
        : "Lowest estimated travel time after applying traffic factors",
      recommended_route: recommendedRoute,
      routes
    };
  };

  const compareAlgorithms = async (
    sourceLat,
    sourceLon,
    destLat,
    destLon
  ) => {

    try {
      return await getRealRouteComparison(
        sourceLat,
        sourceLon,
        destLat,
        destLon
      );
    } catch (error) {
      console.warn(
        "Comparison endpoint unavailable, using client-side fallback",
        error
      );

      const [dijkstra, astar] = await Promise.all([
        getRealShortestPath(
          sourceLat,
          sourceLon,
          destLat,
          destLon
        ),
        getRealOptimizedPath(
          sourceLat,
          sourceLon,
          destLat,
          destLon
        )
      ]);

      return buildClientComparison(
        dijkstra,
        astar
      );
    }
  };

  const runRouteAction = async (
    actionName,
    request
  ) => {

    if (!hasSelection) {
      alert("Select source and destination");
      return;
    }

    setLoadingAction(actionName);

    try {
      const data = await request(
        source[0],
        source[1],
        destination[0],
        destination[1]
      );

      if (data.recommended_route) {
        setRouteData(data.recommended_route);
        setComparisonData(data);
      } else {
        setRouteData(data);
        setComparisonData(null);
      }
    } catch (error) {
      console.error(error);
      setRouteData({
        error: "Unable to fetch route from backend"
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const simulateTraffic = async () => {

    setLoadingAction("traffic");

    try {
      const data = await simulateRealTraffic();

      setRouteData(null);
      setComparisonData(null);

      alert(
        `Traffic congestion updated across ${data.updated_roads ?? 0} road segments`
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };

  const selectedRouteCoordinates =
    routeData?.route_coordinates;

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-4">

        <div className="space-y-6">

          <div className="rounded-lg border border-slate-700 bg-slate-800 p-5">

            <h2 className="mb-2 text-xl font-bold text-cyan-400">
              Real Map Routing
            </h2>

            <div className="mb-4 text-sm text-slate-300">
              Click two locations inside the marked Vizag service area.
            </div>

            <div className="mb-4 rounded-lg border border-amber-800 bg-amber-950/40 p-3 text-sm text-amber-100">
              Demo scope: route snapping and OSM graph search are configured for the dark-brown Vizag boundary on the map.
            </div>

            <div className="space-y-3">

              <button
                onClick={() => runRouteAction(
                  "dijkstra",
                  getRealShortestPath
                )}
                disabled={loadingAction !== null}
                className="
                  w-full rounded-lg bg-cyan-500 py-3 font-bold
                  hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60
                "
              >
                {loadingAction === "dijkstra" ? "Running..." : "Run Dijkstra"}
              </button>

              <button
                onClick={() => runRouteAction(
                  "astar",
                  getRealOptimizedPath
                )}
                disabled={loadingAction !== null}
                className="
                  w-full rounded-lg bg-violet-500 py-3 font-bold
                  hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-60
                "
              >
                {loadingAction === "astar" ? "Running..." : "Run A*"}
              </button>

              <button
                onClick={() => runRouteAction(
                  "comparison",
                  compareAlgorithms
                )}
                disabled={loadingAction !== null}
                className="
                  w-full rounded-lg bg-emerald-500 py-3 font-bold
                  hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60
                "
              >
                {loadingAction === "comparison" ? "Comparing..." : "Compare Algorithms"}
              </button>

              <button
                onClick={simulateTraffic}
                disabled={loadingAction !== null}
                className="
                  w-full rounded-lg bg-red-500 py-3 font-bold
                  hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60
                "
              >
                {loadingAction === "traffic" ? "Updating..." : "Simulate Traffic"}
              </button>

            </div>

          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800 p-5">

            <h2 className="mb-4 text-lg font-bold text-cyan-400">
              Selected Points
            </h2>

            <div className="space-y-3 text-sm">
              <div className="rounded-lg bg-slate-900 p-3">
                <span className="font-bold text-slate-200">Source:</span>{" "}
                {source ? `${source[0].toFixed(5)}, ${source[1].toFixed(5)}` : "-"}
              </div>

              <div className="rounded-lg bg-slate-900 p-3">
                <span className="font-bold text-slate-200">Destination:</span>{" "}
                {destination ? `${destination[0].toFixed(5)}, ${destination[1].toFixed(5)}` : "-"}
              </div>
            </div>

          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800 p-5">

            <h2 className="mb-4 text-lg font-bold text-cyan-400">
              Route Analytics
            </h2>

            {routeData ? (

              routeData.error ? (
                <div className="text-red-400">Error: {routeData.error}</div>
              ) : (
                <div className="space-y-4">

                  {comparisonData && (
                    <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-100">
                      <div className="font-bold">
                        Recommended: {comparisonData.recommended_algorithm}
                      </div>
                      <div className="mt-1">
                        {comparisonData.recommendation_reason}
                      </div>
                      {comparedRoutesOverlap(comparisonData.routes) && (
                        <div className="mt-2 text-emerald-200">
                          Both algorithms produced the same visible route; blue covers the red path because the paths overlap.
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <Metric
                      label="Algorithm"
                      value={routeData.algorithm}
                    />
                    <Metric
                      label="Congestion"
                      value={routeData.congestion_level}
                    />
                    <Metric
                      label="Distance"
                      value={formatMeters(routeData.distance_meters)}
                    />
                    <Metric
                      label="ETA"
                      value={formatMinutes(routeData.estimated_time_min)}
                    />
                    <Metric
                      label="Delay"
                      value={formatMinutes(routeData.delay_min)}
                    />
                    <Metric
                      label="Execution"
                      value={formatMs(routeData.execution_time_ms)}
                    />
                    <Metric
                      label="Explored"
                      value={routeData.nodes_explored}
                    />
                  </div>

                  <div className="space-y-2 text-sm text-slate-300">
                    <div>
                      Traffic factor: {routeData.average_traffic_factor ?? "-"}x
                    </div>
                    <div>
                      Route nodes: {routeData.node_count ?? "-"}
                    </div>
                    <div>
                      Traffic-weighted cost: {formatMeters(routeData.traffic_weighted_distance_meters)}
                    </div>
                  </div>

                </div>
              )

            ) : (

              <p className="text-slate-400">
                No route generated yet
              </p>

            )}

          </div>

        </div>

        <div className="space-y-6 lg:col-span-3">

          <RealMapView
            source={source}
            destination={destination}
            setSource={setSource}
            setDestination={setDestination}
            routeCoordinates={selectedRouteCoordinates}
            comparisonRoutes={comparisonData?.routes}
            recommendedAlgorithm={
              comparisonData?.recommended_algorithm
            }
          />

          {comparisonData?.routes && (
            <div className="flex flex-wrap gap-4 rounded-lg border border-slate-700 bg-slate-800 p-4 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <span className="h-1 w-8 rounded bg-blue-600" />
                Recommended route
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1 w-8 rounded bg-red-500" />
                Compared route
              </div>
              {comparedRoutesOverlap(comparisonData.routes) && (
                <div className="basis-full text-slate-400">
                  The compared routes overlap exactly, so the recommended blue line is drawn on top.
                </div>
              )}
            </div>
          )}

          {comparisonData?.routes && (
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-5">
              <h2 className="mb-4 text-lg font-bold text-cyan-400">
                Algorithm Benchmark
              </h2>

              <div className="grid gap-3 md:grid-cols-2">
                {comparisonData.routes.map((route) => (
                  <div
                    key={route.algorithm}
                    className="rounded-lg border border-slate-700 bg-slate-900 p-4"
                  >
                    {route.error ? (
                      <div className="text-red-400">
                        {route.algorithm || "Route"}: {route.error}
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm text-slate-300">
                        <div className="text-base font-bold text-white">
                          {route.algorithm}
                        </div>
                        <div>ETA: {formatMinutes(route.estimated_time_min)}</div>
                        <div>Distance: {formatMeters(route.distance_meters)}</div>
                        <div>Delay: {formatMinutes(route.delay_min)}</div>
                        <div>Nodes explored: {route.nodes_explored ?? "-"}</div>
                        <div>Execution: {formatMs(route.execution_time_ms)}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {routeData?.road_segments?.length > 0 && (
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-5">
              <h2 className="mb-4 text-lg font-bold text-cyan-400">
                Road Segments
              </h2>

              <div className="grid gap-3 md:grid-cols-2">
                {routeData.road_segments.map((segment, index) => (
                  <div
                    key={`${segment.name}-${index}`}
                    className="rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300"
                  >
                    <div className="font-bold text-white">
                      {segment.name}
                    </div>
                    <div>{segment.highway}</div>
                    <div>{formatMeters(segment.distance_meters)}</div>
                    <div>Traffic: {segment.traffic_factor}x</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default RealRoutingDashboard;
