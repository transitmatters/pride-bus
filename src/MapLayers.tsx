/* eslint-disable @typescript-eslint/no-explicit-any */
import { LatLngTuple } from "leaflet";
import { useEffect } from "react";
import { useMap, useMapEvent } from "react-leaflet";
import { Hotline } from "react-leaflet-hotline";
// @ts-expect-error untyped
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
      <MarkerLayer pane="markerPane">
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
          }}
        />
      )}
    </>
  );
};
