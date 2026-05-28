import axios from "axios";

// Backend API base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

// -----------------------------------
// GET GRAPH DATA
// -----------------------------------

export const fetchGraph = async () => {
  const response = await API.get("/graph");
  return response.data;
};

// -----------------------------------
// DIJKSTRA ROUTE
// -----------------------------------

export const getShortestPath = async (source, destination) => {
  const response = await API.post("/shortest-path", {
    source,
    destination,
  });

  return response.data;
};

// -----------------------------------
// A* ROUTE
// -----------------------------------

export const getOptimizedPath = async (source, destination) => {
  const response = await API.post("/optimized-path", {
    source,
    destination,
  });

  return response.data;
};

// -----------------------------------
// SIMULATE TRAFFIC
// -----------------------------------

export const simulateTraffic = async () => {
  const response = await API.post("/simulate-traffic");

  return response.data;
};

// -----------------------------------
// GET TRAFFIC STATUS
// -----------------------------------

export const getTrafficStatus = async () => {
  const response = await API.get("/traffic-status");

  return response.data;
};

// -----------------------------------
// REAL DIJKSTRA ROUTING
// -----------------------------------

export const getRealShortestPath = async (
  sourceLat,
  sourceLon,
  destLat,
  destLon
) => {

  const response = await API.post(
    "/real-shortest-path",
    {
      source_lat: sourceLat,
      source_lon: sourceLon,
      dest_lat: destLat,
      dest_lon: destLon,
    }
  );

  return response.data;
};

// -----------------------------------
// REAL A* ROUTING
// -----------------------------------

export const getRealOptimizedPath = async (
  sourceLat,
  sourceLon,
  destLat,
  destLon
) => {

  const response = await API.post(
    "/real-optimized-path",
    {
      source_lat: sourceLat,
      source_lon: sourceLon,
      dest_lat: destLat,
      dest_lon: destLon,
    }
  );

  return response.data;
};

// -----------------------------------
// SIMULATE REAL TRAFFIC
// -----------------------------------

export const simulateRealTraffic =
  async () => {

    const response = await API.post(
      "/simulate-real-traffic"
    );

    return response.data;
};
