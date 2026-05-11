import axios from "axios";

// Backend API base URL
const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
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