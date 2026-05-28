import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup
} from "react-leaflet";

function MapView({
  graphData,
  routeData,
  comparisonRoutes,
  recommendedAlgorithm
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
  const hasComparisonRoutes =
    comparisonRoutes?.some(
      (route) => route?.path?.length > 0
    );

  const getRouteCoordinates = (route) => (
    route?.path?.map(
      (nodeId) => getNodePosition(nodeId)
    ).filter(Boolean) || []
  );

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
        {/* COMPARED ROUTES */}
        {/* ----------------------------------- */}

        {comparisonRoutes?.map((route) => {

          const coordinates = getRouteCoordinates(route);

          if (coordinates.length === 0) {
            return null;
          }

          const isRecommended =
            route.algorithm === recommendedAlgorithm;

          return (
            <Polyline
              key={route.algorithm}
              positions={coordinates}
              pathOptions={{
                color: isRecommended ? "blue" : "red",
                weight: isRecommended ? 8 : 5,
                opacity: isRecommended ? 0.95 : 0.75,
                dashArray: isRecommended ? null : "8 8"
              }}
            />
          );
        })}

        {/* ACTIVE ROUTE */}
        {/* ----------------------------------- */}

        {!hasComparisonRoutes && routeCoordinates.length > 0 && (

          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color: "blue",
              weight: 8
            }}
          />

        )}

      </MapContainer>

    </div>
  );
}

export default MapView;
