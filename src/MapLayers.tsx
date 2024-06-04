import { LatLngTuple } from "leaflet";
import { useEffect } from "react";
import { useMap, useMapEvent } from "react-leaflet";
import { Hotline } from "react-leaflet-hotline";
import { MarkerLayer, Marker } from "react-leaflet-marker";

interface MapLayersProps {
  formattedPolyline: [{ lat: string; lng: string; value: number }];
  position: LatLngTuple;
  setZoom: (zoom: number) => void;
}

export const MapLayers = ({
  formattedPolyline,
  position,
  setZoom,
}: MapLayersProps) => {
  const map = useMap();

  useMapEvent("zoom", (event) => {
    setZoom(event.target.getZoom());
  });

  useEffect(() => {
    // Create a custom pane with a high zIndex
    const pane = map.createPane("markerPane");
    pane.style.zIndex = "650";
  }, [map]);

  return (
    <>
      <MarkerLayer
        pane="markerPane"
        attribution={
          '&copy; <a href="https://transitmatters.org">TransitMatters</a>'
        }
      >
        <Marker position={position} size={[24, 24]}>
          <img className="h-6" src={"pride-logo.png"} />
        </Marker>
      </MarkerLayer>
      {formattedPolyline && (
        <Hotline
          data={formattedPolyline}
          getLat={(t: any) => t.lat}
          getLng={(t: any) => t.lng}
          getVal={(t: any) => t.value}
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
