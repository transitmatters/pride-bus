/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMap } from "react-leaflet";

export const ChangeView = ({ center, zoom }: any) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};
