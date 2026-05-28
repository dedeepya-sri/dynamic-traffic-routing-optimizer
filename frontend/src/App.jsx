import { useState } from "react";

import Navbar from "./components/Navbar";

import ModeSelector from "./components/ModeSelector";

import RealRoutingDashboard from "./pages/RealRoutingDashboard";

import GraphAnalysisDashboard from "./pages/GraphAnalysisDashboard";

function HowToRunDialog({
  isOpen,
  onClose
}) {

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 px-4">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-cyan-400">
              How to run the routing demo
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Use these steps to test routing, traffic simulation, and algorithm comparison.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded border border-slate-600 px-3 py-1 text-sm text-slate-200 hover:bg-slate-800"
          >
            Close
          </button>
        </div>

        <div className="space-y-5 text-sm text-slate-200">
          <div className="rounded-lg bg-slate-800 p-4">
            <h3 className="mb-2 font-bold text-white">
              Real Routing Mode
            </h3>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Select two locations inside the dark-brown service area on the map.
              </li>
              <li>
                Click either <span className="font-bold text-cyan-300">Run Dijkstra</span> or <span className="font-bold text-violet-300">Run A*</span> to generate one route.
              </li>
              <li>
                Review distance, ETA, delay, congestion, explored nodes, and road segment details in the analytics panels.
              </li>
              <li>
                Click <span className="font-bold text-red-300">Simulate Traffic</span> to create random congestion on road segments. For example, a road with traffic factor 3x becomes more expensive than the same road at 1x.
              </li>
              <li>
                Click <span className="font-bold text-emerald-300">Compare Algorithms</span> to run both Dijkstra and A* and see how they behave under the same traffic conditions.
              </li>
            </ol>
          </div>

          <div className="rounded-lg bg-slate-800 p-4">
            <h3 className="mb-2 font-bold text-white">
              Reading the map
            </h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Blue shows the recommended route.
              </li>
              <li>
                Red dashed lines show compared non-recommended routes.
              </li>
            </ul>
          </div>

          <div className="rounded-lg bg-slate-800 p-4">
            <h3 className="mb-2 font-bold text-white">
              Graph Analysis Mode
            </h3>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Choose source and destination nodes from the dropdowns.
              </li>
              <li>
                Compare Dijkstra and A* on a controlled graph.
              </li>
              <li>
                 this mode is to understand route cost, bottlenecks, traffic multipliers, runtime, and nodes explored.
              </li>
            </ol>
          </div>

          <div className="rounded-lg border border-amber-800 bg-amber-950/40 p-4 text-amber-100">
            The first route actually takes time to load, Please refresh the page or try CTRL + R</div>
        </div>
      </div>
    </div>
  );
}

function App() {

  const [currentMode, setCurrentMode] =
    useState("real");

  const [isHowToRunOpen, setIsHowToRunOpen] =
    useState(false);

  return (

    <div className="
      min-h-screen
      bg-slate-950
      text-white
    ">

      <Navbar />

      <div className="p-6">

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

          {/* MODE SELECTOR */}
          <ModeSelector
            currentMode={currentMode}
            setCurrentMode={setCurrentMode}
          />

          <div className="lg:text-right">
            <div className="mb-2 text-xs text-slate-400">
              Click here to know how to run
            </div>

            <button
              onClick={() => setIsHowToRunOpen(true)}
              className="rounded-lg border border-cyan-500 bg-slate-900 px-4 py-2 text-sm font-bold text-cyan-300 hover:bg-slate-800"
            >
              How to run
            </button>
          </div>

        </div>

        {/* REAL ROUTING */}
        {
          currentMode === "real" && (

            <RealRoutingDashboard />

          )
        }

        {/* GRAPH ANALYSIS */}
        {
          currentMode === "graph" && (

            <GraphAnalysisDashboard />

          )
        }

      </div>

      <HowToRunDialog
        isOpen={isHowToRunOpen}
        onClose={() => setIsHowToRunOpen(false)}
      />

    </div>
  );
}

export default App;
