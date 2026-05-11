import { useState } from "react";

function RouteForm({
  onCompare
}) {

  const [source, setSource] = useState("A");

  const [destination, setDestination] =
    useState("F");

  const nodes = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F"
  ];

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">

      <h2 className="text-2xl font-bold mb-6 text-cyan-400">
        Route Optimizer
      </h2>

      {/* SOURCE */}
      <div className="mb-4">

        <label className="block mb-2 text-slate-300">
          Source Node
        </label>

        <select
          value={source}
          onChange={(e) =>
            setSource(e.target.value)
          }
          className="
          w-full
          p-3
          rounded-lg
          bg-slate-900
          border
          border-slate-600
          "
        >

          {nodes.map((node) => (

            <option
              key={node}
            >
              {node}
            </option>

          ))}

        </select>

      </div>

      {/* DESTINATION */}
      <div className="mb-6">

        <label className="block mb-2 text-slate-300">
          Destination Node
        </label>

        <select
          value={destination}
          onChange={(e) =>
            setDestination(e.target.value)
          }
          className="
          w-full
          p-3
          rounded-lg
          bg-slate-900
          border
          border-slate-600
          "
        >

          {nodes.map((node) => (

            <option
              key={node}
            >
              {node}
            </option>

          ))}

        </select>

      </div>

      {/* BUTTON */}
      <button
        onClick={() =>
          onCompare(
            source,
            destination
          )
        }
        className="
        w-full
        bg-cyan-500
        hover:bg-cyan-600
        py-3
        rounded-lg
        font-bold
        transition-all
        "
      >
        Compare Algorithms
      </button>

    </div>
  );
}

export default RouteForm;