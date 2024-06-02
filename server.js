import express from "express";
import ViteExpress from "vite-express";

const PRIDE_BUS_URL = (key) =>
  `https://api-v3.mbta.com/vehicles/y1789?api_key=${key}`;
const SHAPES_URL = (id, key) =>
  `https://api-v3.mbta.com/shapes/${id}?api_key=${key}`;
const TRIPS_URL = (id, key) =>
  `https://api-v3.mbta.com/trips/${id}?api_key=${key}`;

const app = express();

app.get("/api/:url/:id?", async (req, res) => {
  try {
    let response;
    switch (req.params.url) {
      case "bus":
        response = await fetch(PRIDE_BUS_URL(process.env.MBTA_V3_API_KEY));
        break;
      case "shape":
        response = await fetch(
          SHAPES_URL(req.params.id, process.env.MBTA_V3_API_KEY)
        );
        break;
      case "trip":
        response = await fetch(
          TRIPS_URL(req.params.id, process.env.MBTA_V3_API_KEY)
        );
        break;
      default:
        res.status(404).send({ error: "Invalid API endpoint" });
        return;
    }

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
