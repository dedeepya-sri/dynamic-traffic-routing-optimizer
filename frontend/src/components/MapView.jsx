import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup
} from "react-leaflet";

function MapView({
  graphData,
  routeData
}) {

  // Default map center
  const center = [17.4050, 78.5067];

  // -----------------------------------
  // GET NODE POSITION
  // -----------------------------------

  const getNodePosition = (nodeId) => {

    const node = graphData?.nodes?.find(
      (n) => n.id === nodeId
    );

    return node?.position;
  };

  // -----------------------------------
  // BUILD ROUTE COORDINATES
  // -----------------------------------

  const routeCoordinates = routeData?.path?.map(
    (nodeId) => getNodePosition(nodeId)
  ) || [];

  return (
    <div className="h-[700px] rounded-xl overflow-hidden border border-slate-700">

      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >

        {/* OpenStreetMap Tiles */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ----------------------------------- */}
        {/* GRAPH NODES */}
        {/* ----------------------------------- */}

        {graphData?.nodes?.map((node) => (

          <Marker
            key={node.id}
            position={node.position}
          >

            <Popup>
              Node: {node.id}
            </Popup>

          </Marker>

        ))}

        {/* ----------------------------------- */}
        {/* ROAD EDGES */}
        {/* ----------------------------------- */}

        {graphData?.edges?.map((edge, index) => {

          const sourcePosition = getNodePosition(
            edge.source
          );

          const targetPosition = getNodePosition(
            edge.target
          );

          // Road color based on traffic
          let roadColor = "green";

          if (edge.traffic > 2.0) {
            roadColor = "red";
          }
          else if (edge.traffic > 1.5) {
            roadColor = "orange";
          }

          return (

            <Polyline
              key={index}
              positions={[
                sourcePosition,
                targetPosition
              ]}
              pathOptions={{
                color: roadColor,
                weight: 5
              }}
            />

          );
        })}

        {/* ----------------------------------- */}
        {/* ACTIVE ROUTE */}
        {/* ----------------------------------- */}

        {routeCoordinates.length > 0 && (

          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color: "cyan",
              weight: 8
            }}
          />

        )}

      </MapContainer>

    </div>
  );
}

export default MapView;