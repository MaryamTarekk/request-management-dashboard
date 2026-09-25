import { useQuery } from "@tanstack/react-query";
import { getRequests } from "../api/requests.api";

export function useRequests() {
  return useQuery({
    queryKey: ["requests"],
    queryFn: getRequests,

    // Automatically refresh every 15 seconds
    refetchInterval: 15 * 1000,
  });
}
