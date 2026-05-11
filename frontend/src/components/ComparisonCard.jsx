function ComparisonCard({
  title,
  data,
  color
}) {

  return (
    <div
      className="
      rounded-2xl
      p-6
      border
      shadow-xl
      bg-slate-800
      border-slate-700
      "
    >

      <h2
        className={`text-2xl font-bold mb-4 ${color}`}
      >
        {title}
      </h2>

      {data ? (

        <div className="space-y-3">

          <div>
            <span className="font-bold">
              Path:
            </span>

            <p className="text-slate-300 mt-1">
              {data.path.join(" → ")}
            </p>
          </div>

          <div>
            <span className="font-bold">
              Distance:
            </span>{" "}

            {data.distance}
          </div>

          <div>
            <span className="font-bold">
              Estimated Time:
            </span>{" "}

            {data.estimated_time}
          </div>

          <div>
            <span className="font-bold">
              Congestion:
            </span>{" "}

            {data.congestion_level}
          </div>

          <div>
            <span className="font-bold">
              Execution Time:
            </span>{" "}

            {data.execution_time_ms} ms
          </div>

        </div>

      ) : (

        <p className="text-slate-400">
          No data available
        </p>

      )}

    </div>
  );
}

export default ComparisonCard;