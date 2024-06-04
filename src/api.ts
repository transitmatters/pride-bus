import { useQuery } from "@tanstack/react-query";

const APP_DATA_BASE_PATH =
  process.env.NODE_ENV === "production"
    ? "https://pride-bus-api.labs.transitmatters.org"
    : "http://127.0.0.1:5000";

const fetchJSON = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const useDataQuery = (
  key: string,
  id: string | undefined,
  endpoint: string,
  enabled: boolean = true
) =>
  useQuery({
    queryKey: [key, id],
    queryFn: () => fetchJSON(`${APP_DATA_BASE_PATH}/api/${endpoint}/${id}`),
    enabled: enabled && !!id,
  });

export const useBusData = () =>
  useQuery({
    queryKey: ["pride-bus"],
    queryFn: () => fetchJSON(`${APP_DATA_BASE_PATH}/api/bus`),
    refetchInterval: 10000,
  });

export const useTripData = (busData: any) =>
  useDataQuery(
    "trips",
    busData?.data?.relationships?.trip?.data?.id,
    "trip",
    !!busData?.data
  );

export const useRouteData = (busData: any) =>
  useDataQuery(
    "route",
    busData?.data?.relationships?.route?.data?.id,
    "route",
    !!busData?.data
  );

export const useStopData = (busData: any) =>
  useDataQuery(
    "stop",
    busData?.data?.relationships?.stop?.data?.id,
    "stop",
    !!busData?.data
  );

export const useShapeData = (tripData: any) =>
  useDataQuery(
    "shapes",
    tripData?.data?.relationships?.shape?.data?.id,
    "shape",
    !!tripData?.data
  );
