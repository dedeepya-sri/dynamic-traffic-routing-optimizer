function StatsCard({ title, value }) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700">
      <h3 className="text-slate-400 text-sm">
        {title}
      </h3>

      <p className="text-2xl font-bold text-cyan-400 mt-2">
        {value}
      </p>
    </div>
  );
}

export default StatsCard;