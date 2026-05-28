import { useCallback, useEffect, useMemo, useState } from "react";

import RouteForm from "../components/RouteForm";
import TrafficPanel from "../components/TrafficPanel";
import MapView from "../components/MapView";

import {
  fetchGraph,
  getShortestPath,
  getOptimizedPath,
  getTrafficStatus,
  simulateTraffic
} from "../services/api";

function StatTile({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
      <div className="text-xs uppercase text-slate-400">
        {label}
      </div>
      <div className="mt-1 text-xl font-bold text-white">
        {value ?? "-"}
      </div>
    </div>
  );
}

function AlgorithmCard({
  title,
  data,
  accent,
  isRecommended
}) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className={`text-xl font-bold ${accent}`}>
          {title}
        </h2>

        {isRecommended && (
          <span className="rounded bg-emerald-500 px-2 py-1 text-xs font-bold text-white">
            Recommended
          </span>
        )}
      </div>

      {data && !data.error ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-slate-900 p-3 text-sm text-slate-300">
            {data.path.join(" -> ")}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatTile
              label="Cost"
              value={data.distance}
            />
            <StatTile
              label="ETA"
              value={data.estimated_time}
            />
            <StatTile
              label="Traffic"
              value={`${data.congestion_level}x`}
            />
            <StatTile
              label="Runtime"
              value={`${data.execution_time_ms} ms`}
            />
            <StatTile
              label="Explored"
              value={data.nodes_explored}
            />
          </div>
        </div>
      ) : (
        <p className="text-slate-400">
          {data?.error ? `Error: ${data.error}` : "Run a comparison"}
        </p>
      )}
    </div>
  );
}

function GraphAnalysisDashboard() {

  const [graphData, setGraphData] =
    useState(null);

  const [trafficData, setTrafficData] =
    useState([]);

  const [dijkstraData, setDijkstraData] =
    useState(null);

  const [astarData, setAstarData] =
    useState(null);

  const [activeRoute, setActiveRoute] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const chooseBestRoute = useCallback((routes) => {
    const validRoutes = routes.filter(
      (route) => route && !route.error
    );

    if (validRoutes.length === 0) {
      return null;
    }

    return validRoutes.reduce(
      (bestRoute, route) => {
        if (route.distance !== bestRoute.distance) {
          return route.distance < bestRoute.distance
            ? route
            : bestRoute;
        }

        if (route.nodes_explored !== bestRoute.nodes_explored) {
          return route.nodes_explored < bestRoute.nodes_explored
            ? route
            : bestRoute;
        }

        return route.execution_time_ms < bestRoute.execution_time_ms
          ? route
          : bestRoute;
      }
    );
  }, []);

  const loadGraphState = useCallback(async () => {
    const [graph, traffic] = await Promise.all([
      fetchGraph(),
      getTrafficStatus()
    ]);

    setGraphData(graph);
    setTrafficData(traffic.roads || []);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadGraphState();
  }, [loadGraphState]);

  const recommendation = useMemo(() => {
    const routes = [dijkstraData, astarData].filter(
      (route) => route && !route.error
    );

    if (routes.length === 0) {
      return null;
    }

    return chooseBestRoute(routes);
  }, [astarData, chooseBestRoute, dijkstraData]);

  const recommendationReason = useMemo(() => {
    const routes = [dijkstraData, astarData].filter(
      (route) => route && !route.error
    );

    if (!recommendation || routes.length < 2) {
      return null;
    }

    const sameDistance = routes.every(
      (route) => route.distance === recommendation.distance
    );

    if (sameDistance) {
      return "Both algorithms found the same optimal route cost; recommendation uses nodes explored and runtime.";
    }

    return "Recommended because it produced the lower traffic-weighted route cost.";
  }, [astarData, dijkstraData, recommendation]);

  const comparisonRoutes = useMemo(() => (
    [dijkstraData, astarData].filter(
      (route) => route && !route.error
    )
  ), [astarData, dijkstraData]);

  const comparedRoutesOverlap = useMemo(() => {
    if (comparisonRoutes.length < 2) {
      return false;
    }

    const firstPath = comparisonRoutes[0].path?.join("-");

    return comparisonRoutes.every(
      (route) => route.path?.join("-") === firstPath
    );
  }, [comparisonRoutes]);

  const graphStats = useMemo(() => {
    const roadCount = graphData?.edges?.length || 0;
    const nodeCount = graphData?.nodes?.length || 0;
    const averageTraffic = trafficData.length
      ? trafficData.reduce(
        (sum, road) => sum + road.traffic,
        0
      ) / trafficData.length
      : 0;

    const worstRoad = trafficData.reduce(
      (worst, road) => (
        !worst || road.traffic > worst.traffic
          ? road
          : worst
      ),
      null
    );

    return {
      nodeCount,
      roadCount,
      averageTraffic: averageTraffic
        ? averageTraffic.toFixed(2)
        : "-",
      worstRoad
    };
  }, [graphData, trafficData]);

  const handleCompare = async (
    source,
    destination
  ) => {

    setLoading(true);

    try {
      const [dijkstra, astar] = await Promise.all([
        getShortestPath(
          source,
          destination
        ),
        getOptimizedPath(
          source,
          destination
        )
      ]);

      setDijkstraData(dijkstra);
      setAstarData(astar);
      setActiveRoute(
        chooseBestRoute([
          dijkstra,
          astar
        ])
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrafficSimulation =
    async () => {

      setLoading(true);

      try {
        await simulateTraffic();
        await loadGraphState();

        setDijkstraData(null);
        setAstarData(null);
        setActiveRoute(null);

        alert("Traffic simulation updated");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  return (

    <div className="space-y-6">

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">

        <div className="space-y-6">
          <RouteForm
            onCompare={handleCompare}
          />

          <TrafficPanel
            onSimulate={handleTrafficSimulation}
          />

          <div className="rounded-lg border border-slate-700 bg-slate-800 p-5">
            <h2 className="mb-4 text-lg font-bold text-cyan-400">
              Lab Summary
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <StatTile
                label="Nodes"
                value={graphStats.nodeCount}
              />
              <StatTile
                label="Roads"
                value={graphStats.roadCount}
              />
              <StatTile
                label="Avg Traffic"
                value={`${graphStats.averageTraffic}x`}
              />
              <StatTile
                label="Status"
                value={loading ? "Running" : "Ready"}
              />
            </div>

            {recommendation && (
              <div className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-100">
                <div className="font-bold">
                  Best route: {recommendation.algorithm} with cost {recommendation.distance}
                </div>
                <div className="mt-1">
                  {recommendationReason}
                </div>
                {comparedRoutesOverlap && (
                  <div className="mt-2 text-emerald-200">
                    Dijkstra and A* selected the same path; recommendation is based on search effort.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 lg:col-span-3">
          <MapView
            graphData={graphData}
            routeData={activeRoute}
            comparisonRoutes={comparisonRoutes}
            recommendedAlgorithm={recommendation?.algorithm}
          />

          {comparisonRoutes.length > 0 && (
            <div className="flex flex-wrap gap-4 rounded-lg border border-slate-700 bg-slate-800 p-4 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <span className="h-1 w-8 rounded bg-blue-600" />
                Recommended route
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1 w-8 rounded bg-red-500" />
                Compared route
              </div>
              {comparedRoutesOverlap && (
                <div className="basis-full text-slate-400">
                  The compared routes overlap exactly, so the recommended blue line is drawn on top.
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <AlgorithmCard
              title="Dijkstra"
              data={dijkstraData}
              accent="text-cyan-400"
              isRecommended={recommendation?.algorithm === "Dijkstra"}
            />

            <AlgorithmCard
              title="A*"
              data={astarData}
              accent="text-violet-400"
              isRecommended={recommendation?.algorithm === "A*"}
            />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        <div className="rounded-lg border border-slate-700 bg-slate-800 p-5 lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-cyan-400">
            Traffic State
          </h2>

          <div className="overflow-hidden rounded-lg border border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-300">
                <tr>
                  <th className="p-3">Road</th>
                  <th className="p-3">Base Cost</th>
                  <th className="p-3">Traffic</th>
                  <th className="p-3">Effective Cost</th>
                </tr>
              </thead>
              <tbody>
                {trafficData.map((road) => (
                  <tr
                    key={`${road.source}-${road.target}`}
                    className="border-t border-slate-700 text-slate-300"
                  >
                    <td className="p-3">
                      {`${road.source} -> ${road.target}`}
                    </td>
                    <td className="p-3">
                      {road.distance}
                    </td>
                    <td className="p-3">
                      {road.traffic}x
                    </td>
                    <td className="p-3">
                      {road.effective_weight}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800 p-5">
          <h2 className="mb-4 text-lg font-bold text-cyan-400">
            Bottleneck
          </h2>

          {graphStats.worstRoad ? (
            <div className="space-y-3 text-slate-300">
              <div className="rounded-lg bg-slate-900 p-4">
                <div className="text-sm text-slate-400">
                  Road
                </div>
                <div className="text-xl font-bold text-white">
                  {`${graphStats.worstRoad.source} -> ${graphStats.worstRoad.target}`}
                </div>
              </div>

              <StatTile
                label="Traffic Factor"
                value={`${graphStats.worstRoad.traffic}x`}
              />
              <StatTile
                label="Effective Cost"
                value={graphStats.worstRoad.effective_weight}
              />
            </div>
          ) : (
            <p className="text-slate-400">
              No traffic data available
            </p>
          )}
        </div>

      </div>

    </div>
  );
}

export default GraphAnalysisDashboard;
