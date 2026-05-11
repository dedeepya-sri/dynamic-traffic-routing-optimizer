import { useState } from "react";

import Navbar from "./components/Navbar";

import ModeSelector from "./components/ModeSelector";

import RealRoutingDashboard from "./pages/RealRoutingDashboard";

import GraphAnalysisDashboard from "./pages/GraphAnalysisDashboard";

function App() {

  const [currentMode, setCurrentMode] =
    useState("real");

  return (

    <div className="
      min-h-screen
      bg-slate-950
      text-white
    ">

      <Navbar />

      <div className="p-6">

        {/* MODE SELECTOR */}
        <ModeSelector
          currentMode={currentMode}
          setCurrentMode={setCurrentMode}
        />

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

    </div>
  );
}

export default App;