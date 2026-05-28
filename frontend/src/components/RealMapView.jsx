import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Polyline,
  Popup,
  useMapEvents
} from "react-leaflet";

const SERVICE_AREA = {
  north: 17.7140,
  south: 17.6595,
  east: 83.2470,
  west: 83.1900
};

const SERVICE_AREA_POLYGON = [
  [SERVICE_AREA.north, SERVICE_AREA.west],
  [SERVICE_AREA.north, SERVICE_AREA.east],
  [SERVICE_AREA.south, SERVICE_AREA.east],
  [SERVICE_AREA.south, SERVICE_AREA.west]
];

function isInsideServiceArea(lat, lng) {
  return (
    lat >= SERVICE_AREA.south &&
    lat <= SERVICE_AREA.north &&
    lng >= SERVICE_AREA.west &&
    lng <= SERVICE_AREA.east
  );
}

// -----------------------------------
// CLICK HANDLER
// -----------------------------------

function ClickHandler({
  setSource,
  setDestination,
  source,
  destination
}) {

  useMapEvents({

    click(e) {

      const { lat, lng } = e.latlng;

      if (!isInsideServiceArea(lat, lng)) {
        alert(
          "Please select locations inside the marked Vizag service area."
        );
        return;
      }

      // First click = source
      if (!source) {

        setSource([lat, lng]);

      }

      // Second click = destination
      else if (!destination) {

        setDestination([lat, lng]);

      }

      // Reset selection
      else {

        setSource([lat, lng]);

        setDestination(null);
      }
    }
  });

  return null;
}

// -----------------------------------
// MAIN MAP
// -----------------------------------

function RealMapView({
  source,
  destination,
  setSource,
  setDestination,
  routeCoordinates,
  comparisonRoutes,
  recommendedAlgorithm
}) {

  // Vizag center
  const center = [17.6868, 83.2185];
  const hasComparisonRoutes =
    comparisonRoutes?.some(
      (route) => route?.route_coordinates?.length > 0
    );

  return (

    <div className="h-[700px] rounded-2xl overflow-hidden border border-slate-700">

      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full"
      >

        {/* MAP TILES */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* VIZAG SERVICE AREA */}
        <Polygon
          positions={SERVICE_AREA_POLYGON}
          interactive={false}
          pathOptions={{
            color: "#4a2c14",
            weight: 5,
            fillColor: "#7c4a20",
            fillOpacity: 0.08
          }}
        />

        {/* CLICK EVENTS */}
        <ClickHandler
          source={source}
          destination={destination}
          setSource={setSource}
          setDestination={setDestination}
        />

        {/* SOURCE MARKER */}
        {source && (

          <Marker position={source}>

            <Popup>
              Source Location
            </Popup>

          </Marker>

        )}

        {/* DESTINATION MARKER */}
        {destination && (

          <Marker position={destination}>

            <Popup>
              Destination Location
            </Popup>

          </Marker>

        )}

        {/* COMPARED ROUTES */}
        {comparisonRoutes?.map((route) => {

          if (!route?.route_coordinates?.length) {
            return null;
          }

          const isRecommended =
            route.algorithm === recommendedAlgorithm;

          return (
            <Polyline
              key={route.algorithm}
              positions={route.route_coordinates}
              pathOptions={{
                color: isRecommended ? "blue" : "red",
                weight: isRecommended ? 8 : 5,
                opacity: isRecommended ? 0.95 : 0.75,
                dashArray: isRecommended ? null : "8 8"
              }}
            />
          );
        })}

        {/* SINGLE ROUTE DRAWING */}
        {!hasComparisonRoutes && routeCoordinates?.length > 0 && (

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

export default RealMapView;
