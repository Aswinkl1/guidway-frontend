import { useQuery } from "@tanstack/react-query";
import { getAllDomain } from "../services/mentorServices";
import { domainQueryKeys } from "./keys";

export const useFetchDomain = (startFetch: boolean) => {
  return useQuery({
    queryKey: domainQueryKeys.list(),
    queryFn: getAllDomain,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: startFetch,
    select: (data) => data?.result ?? [],
  });
};
