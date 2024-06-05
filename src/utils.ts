import { useEffect, useState } from "react";

export const getInfo = (busData: any, routeData: any, stopData: any) => ({
  status: busData?.data.attributes.current_status,
  routeId: routeData?.data.id,
  stopName: stopData?.data.attributes.name,
});

export const STATUSES: any = {
  INCOMING_AT: "Approaching",
  STOPPED_AT: "Stopped",
  IN_TRANSIT_TO: "In transit",
};

export const STATUS_TO_BG: any = {
  INCOMING_AT: "bg-yellow-100 text-yellow-700",
  STOPPED_AT: "bg-red-100 text-red-700",
  IN_TRANSIT_TO: "bg-green-100 text-green-700",
};

export const useScreenDetector = () => {
  const [width, setWidth] = useState(window.innerWidth);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;
  const isTablet = width <= 1024;
  const isDesktop = width > 1024;

  return { isMobile, isTablet, isDesktop };
};
