import { createKeys } from "@/helpers/queryKeyFactor";
import { getAllDomain } from "@/services/domain.services";
import { useQuery } from "@tanstack/react-query";

const domainQueryKeys = createKeys("domain");
export const useFetchDomain = (startFetch: boolean) => {
  return useQuery({
    queryKey: domainQueryKeys.lists(),
    queryFn: getAllDomain,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: startFetch,
    select: (data) => data?.result ?? [],
  });
};
