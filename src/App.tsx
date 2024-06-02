/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { MapContainer } from "react-leaflet";
import "./App.css";
// @ts-expect-error untyped
import polyline from "@mapbox/polyline";
import { MapLayers } from "./MapLayers";

const fetchJSON = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const useBusData = () =>
  useQuery({
    queryKey: ["pride-bus"],
    queryFn: () => fetchJSON(`/api/bus`),
    refetchInterval: 10000,
  });

const useTripData = (busData: any) =>
  useQuery({
    queryKey: ["trips", busData?.data?.relationships?.trip?.data?.id],
    queryFn: () =>
      fetchJSON(`/api/trip/${busData?.data?.relationships?.trip?.data?.id}`),
    enabled: !!busData?.data,
  });

const useShapeData = (tripData: any) =>
  useQuery({
    queryKey: ["shapes", tripData?.data?.relationships?.shape?.data?.id],
    queryFn: () =>
      fetchJSON(`api/shape/${tripData.data.relationships.shape.data.id}`),
    enabled: !!tripData?.data,
  });

function App() {
  const { data: busData, status: busStatus } = useBusData();
  const { data: tripData } = useTripData(busData);
  const { data: shapeData } = useShapeData(tripData);

  const formattedPolyline = useMemo(() => {
    if (shapeData?.data) {
      const decodedPolyline = polyline.decode(
        shapeData.data.attributes.polyline
      );
      const totalLength = decodedPolyline.length;

      return decodedPolyline.map(([lat, lng]: any, index: number) => ({
        lat,
        lng,
        // Map the percentage progress to the range [1, 11]
        value: 10 * (index / totalLength),
      }));
    }
    return [];
  }, [shapeData?.data]);

  return (
    <>
      <div className=" flex h-screen w-full flex-col items-center justify-center gap-4 bg-stone-100 bg-gradient">
        <h1 className="text-center text-3xl font-bold uppercase italic text-grey-100 sm:text-5xl lg:text-6xl">
          Mbta <span className="gradient-text drop-shadow-2xl">pride</span> bus
          tracker
        </h1>
        <div className="flex flex-row">
          <h1 className="text-md font-bold italic text-grey-100">by</h1>
          <div className="w-32 md:w-64 lg:w-52 pl-1 md:pl-2 flex flex-row">
            <a href="https://transitmatters.org">
              <img src={"Logo_wordmark.png"} />
            </a>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-x-2 mt-6 border-2 hover:scale-105 border-black font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
        >
          <ChevronDoubleRightIcon
            className="-ml-0.5 h-5 w-5"
            aria-hidden="true"
          />
          Bring me to the pride bus
          <ChevronDoubleLeftIcon
            className="-ml-0.5 h-5 w-5"
            aria-hidden="true"
          />
        </button>
      </div>
      {busStatus === "success" && busData.data && (
        <div className="flex h-screen flex-col gap-4 bg-stone-100">
          <MapContainer
            zoom={13}
            center={{
              lat: busData.data?.attributes.latitude,
              lng: busData.data?.attributes.longitude,
            }}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
            dragging={true}
          >
            <MapLayers
              formattedPolyline={formattedPolyline}
              position={[
                busData.data?.attributes.latitude,
                busData.data?.attributes.longitude,
              ]}
            />
          </MapContainer>
        </div>
      )}
    </>
  );
}

export default App;
