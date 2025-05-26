import { LatLngTuple } from "leaflet";
import { Marker, useMapEvent, Tooltip } from "react-leaflet";
import { Hotline } from "react-leaflet-hotline";
import * as L from "leaflet";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

interface MapLayersProps {
  formattedPolyline: Array<{ lat: number; lng: number; value: number }>;
  position: LatLngTuple;
  setZoom: (zoom: number) => void;
  destination: string;
  routeId: string;
}

export const MapLayers = ({
  formattedPolyline,
  position,
  setZoom,
  destination,
  routeId,
}: MapLayersProps) => {
  useMapEvent("zoom", (event) => {
    setZoom(event.target.getZoom());
  });

  const icon = L.icon({ iconUrl: "../pride-logo.png", iconSize: [24, 24] });
  return (
    <>
      <Marker position={position} icon={icon}>
        <Tooltip
          direction="top"
          offset={[0, -13]}
          className="flex flex-row justify-between items-center"
        >
          {routeId} <ArrowRightIcon className="mx-1 h-3 w-3" />
          {destination}
        </Tooltip>
      </Marker>

      {formattedPolyline && (
        <Hotline
          data={formattedPolyline}
          getLat={(t: any) => t.point.lat}
          getLng={(t: any) => t.point.lng}
          getVal={(t: any) => t.point.value}
          options={{
            outlineWidth: 8,
            outlineColor: "black",
            weight: 5,
            max: 10,
            min: 1,
            palette: [
              { r: 228, g: 3, b: 3, t: 0 },
              { r: 255, g: 140, b: 0, t: 0.1 },
              { r: 255, g: 255, b: 0, t: 0.2 },
              { r: 0, g: 128, b: 38, t: 0.3 },
              { r: 36, g: 64, b: 142, t: 0.4 },
              { r: 115, g: 41, b: 130, t: 0.5 },
              { r: 255, g: 255, b: 255, t: 0.6 },
              { r: 255, g: 175, b: 200, t: 0.7 },
              { r: 116, g: 215, b: 238, t: 0.8 },
              { r: 97, g: 57, b: 21, t: 0.9 },
              { r: 0, g: 0, b: 0, t: 1 },
            ],
          }}
        />
      )}
    </>
  );
};
