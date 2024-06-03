/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";

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
    queryFn: () => fetchJSON(`/api/${endpoint}/${id}`),
    enabled: enabled && !!id,
  });

export const useBusData = () =>
  useQuery({
    queryKey: ["pride-bus"],
    queryFn: () => fetchJSON(`/api/bus`),
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
