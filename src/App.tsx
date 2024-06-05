import { useMemo, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "./App.css";
import polyline from "@mapbox/polyline";
import { Element } from "react-scroll";
import { MapLayers } from "./MapLayers";
import {
  useBusData,
  useRouteData,
  useShapeData,
  useStopData,
  useTripData,
} from "./api";
import { Footer } from "./components/Footer";
import { Title } from "./components/Title";
import { getInfo } from "./utils";
import { ChangeView } from "./components/ChangeView";

function App() {
  const { data: busData, status: busStatus } = useBusData();
  const { data: tripData } = useTripData(busData);
  const { data: shapeData } = useShapeData(tripData);
  const { data: routeData } = useRouteData(busData);
  const { data: stopData } = useStopData(busData);
  const [zoom, setZoom] = useState(14);

  const { status, routeId, stopName } = getInfo(busData, routeData, stopData);

  const formattedPolyline = useMemo(() => {
    if (shapeData?.data) {
      const decodedPolyline = polyline.decode(
        shapeData.data.attributes.polyline,
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

  const center = useMemo(
    () =>
      busStatus === "success"
        ? {
            lat: busData?.data.attributes.latitude,
            lng: busData?.data.attributes.longitude,
          }
        : // Default to city center
          { lat: 42.361145, lng: -71.057083 },
    [
      busData?.data.attributes.latitude,
      busData?.data.attributes.longitude,
      busStatus,
    ],
  );

  return (
    <>
      <Title />
      <div className="flex h-screen flex-col bg-stone-100">
        <MapContainer
          zoom={zoom}
          center={center}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          dragging={true}
        >
          <ChangeView center={center} zoom={zoom} />
          <Element name="center">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {busStatus === "success" && busData.data && (
              <MapLayers
                setZoom={setZoom}
                formattedPolyline={formattedPolyline}
                position={[
                  busData?.data.attributes.latitude,
                  busData?.data.attributes.longitude,
                ]}
                destination={
                  routeData?.data.attributes.direction_destinations[
                    busData?.data.attributes.direction_id
                  ]
                }
                routeId={routeId}
              />
            )}
          </Element>
        </MapContainer>
        <Footer
          routeId={routeId}
          busStatus={busStatus}
          status={status}
          stopName={stopName}
          direction={
            routeData?.data.attributes.direction_names[
              busData?.data.attributes.direction_id
            ]
          }
        />
      </div>
    </>
  );
}

export default App;
