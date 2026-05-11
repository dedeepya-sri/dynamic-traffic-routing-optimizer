function TrafficPanel({ onSimulate }) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">

      <h2 className="text-xl font-bold mb-4 text-orange-400">
        Traffic Simulation
      </h2>

      <button
        onClick={onSimulate}
        className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded font-semibold"
      >
        Simulate Traffic
      </button>

    </div>
  );
}

export default TrafficPanel;