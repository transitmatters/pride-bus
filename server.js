import express from "express";
import ViteExpress from "vite-express";

const BASE_URL = "https://api-v3.mbta.com";
const ENDPOINTS = {
  bus: (__, key) => `/vehicles/y1833?api_key=${key}`,
  shape: (id, key) => `/shapes/${id}?api_key=${key}`,
  trip: (id, key) => `/trips/${id}?api_key=${key}`,
  route: (id, key) => `/routes/${id}?api_key=${key}`,
  stop: (id, key) => `/stops/${id}?api_key=${key}`,
};

const app = express();

app.get("/api/:url/:id?", async (req, res) => {
  try {
    const { url, id } = req.params;
    const apiKey = process.env.MBTA_V3_API_KEY;
    const endpoint = ENDPOINTS[url];

    if (!endpoint) {
      return res.status(404).send({ error: "Invalid API endpoint" });
    }

    const response = await fetch(BASE_URL + endpoint(id, apiKey));

    if (response.ok) {
      const data = await response.json();
      res.json(data);
    } else {
      res.status(response.status).send({ error: "Failed to fetch data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));
