import { useState } from "react";

function RouteForm({
  onDijkstra,
  onAStar
}) {

  const [source, setSource] = useState("A");
  const [destination, setDestination] = useState("F");

  const nodes = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">

      <h2 className="text-xl font-bold mb-4 text-cyan-400">
        Route Optimizer
      </h2>

      {/* Source Selection */}
      <div className="mb-4">
        <label className="block mb-2 text-slate-300">
          Source Node
        </label>

        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full p-3 rounded bg-slate-900 border border-slate-600"
        >
          {nodes.map((node) => (
            <option key={node}>
              {node}
            </option>
          ))}
        </select>
      </div>

      {/* Destination Selection */}
      <div className="mb-4">
        <label className="block mb-2 text-slate-300">
          Destination Node
        </label>

        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full p-3 rounded bg-slate-900 border border-slate-600"
        >
          {nodes.map((node) => (
            <option key={node}>
              {node}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">

        <button
          onClick={() => onDijkstra(source, destination)}
          className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded font-semibold"
        >
          Run Dijkstra
        </button>

        <button
          onClick={() => onAStar(source, destination)}
          className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded font-semibold"
        >
          Run A*
        </button>

      </div>
    </div>
  );
}

export default RouteForm;