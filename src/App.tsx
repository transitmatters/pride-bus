/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  HeartIcon,
} from "@heroicons/react/20/solid";
import { useMemo } from "react";
import { MapContainer } from "react-leaflet";
import "./App.css";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
// @ts-expect-error untyped
import polyline from "@mapbox/polyline";
import { Element, Link } from "react-scroll";
import { MapLayers } from "./MapLayers";
import {
  useBusData,
  useRouteData,
  useShapeData,
  useStopData,
  useTripData,
} from "./api";
import { STATUSES, STATUS_TO_BG, getInfo, useScreenDetector } from "./utils";

function App() {
  const { data: busData, status: busStatus } = useBusData();
  const { data: tripData } = useTripData(busData);
  const { data: shapeData } = useShapeData(tripData);
  const { data: routeData } = useRouteData(busData);
  const { data: stopData } = useStopData(busData);

  const { isMobile } = useScreenDetector();

  const { status, routeId, stopName } = getInfo(busData, routeData, stopData);

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
        <div className="flex flex-row items-center">
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
          <Link to="center" smooth={true} duration={500} offset={1000}>
            Bring me to the pride bus
          </Link>
          <ChevronDoubleLeftIcon
            className="-ml-0.5 h-5 w-5"
            aria-hidden="true"
          />
        </button>
      </div>

      {busStatus === "success" && busData.data && (
        <>
          <div className="flex h-screen flex-col  bg-stone-100">
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
              <Element name="center">
                <MapLayers
                  formattedPolyline={formattedPolyline}
                  position={[
                    busData.data?.attributes.latitude,
                    busData.data?.attributes.longitude,
                  ]}
                />
              </Element>
            </MapContainer>
            <div className="sticky bottom-0 z-[1000] bg-white p-2 border-t-2 border-gray-600 md:gap-2 flex flex-row justify-between font-bold drop-shadow-2xl">
              <div className="flex flex-row">
                <p className="flex flex-row justify-between items-center">
                  <span
                    className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium ${STATUS_TO_BG[status]}`}
                  >
                    {STATUSES[status]}
                  </span>
                  <ArrowRightIcon className="mx-2 h-5 w-5" />

                  <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                    {stopName}
                  </span>
                  <ArrowRightIcon className="mx-2 h-5 w-5" />
                  <span className="inline-flex items-center rounded-md bg-yellow-300 px-2 py-1 text-xs font-medium ">
                    Route {routeId}
                  </span>
                </p>
              </div>
              {!isMobile && (
                <div className="flex flex-row justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center gap-x-2 rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Donate
                    <HeartIcon className="h-5 w-5" />
                  </button>

                  <div className="w-32 md:w-42 lg:w-52 pl-1 md:pl-2 flex flex-row items-center ">
                    <a href="https://transitmatters.org ">
                      <img src={"Logo_wordmark.png"} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;
