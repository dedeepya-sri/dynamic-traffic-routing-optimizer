import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMapEvents
} from "react-leaflet";

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
  routeCoordinates
}) {

  // Guntur center
  const center = [16.3067, 80.4365];

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

        {/* ROUTE DRAWING */}
        {routeCoordinates?.length > 0 && (

          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color: "cyan",
              weight: 6
            }}
          />

        )}

      </MapContainer>

    </div>
  );
}

export default RealMapView;