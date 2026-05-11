function ModeSelector({
  currentMode,
  setCurrentMode
}) {

  return (

    <div className="
      flex
      gap-4
      mb-6
    ">

      {/* REAL MAP MODE */}
      <button
        onClick={() =>
          setCurrentMode("real")
        }
        className={`
          px-6
          py-3
          rounded-xl
          font-bold
          transition-all

          ${
            currentMode === "real"
            ? "bg-cyan-500 text-white"
            : "bg-slate-800 text-slate-300"
          }
        `}
      >
        Real Routing Mode
      </button>

      {/* GRAPH MODE */}
      <button
        onClick={() =>
          setCurrentMode("graph")
        }
        className={`
          px-6
          py-3
          rounded-xl
          font-bold
          transition-all

          ${
            currentMode === "graph"
            ? "bg-purple-500 text-white"
            : "bg-slate-800 text-slate-300"
          }
        `}
      >
        Graph Analysis Mode
      </button>

    </div>
  );
}

export default ModeSelector;