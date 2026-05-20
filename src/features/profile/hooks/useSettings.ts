import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getSettings } from "../services/settings.services";
import { settingsQueryKeys } from "./keys";

export const useSettings = () => {
  return useQuery({
    queryKey: settingsQueryKeys.all,
    queryFn: getSettings,
    placeholderData: keepPreviousData,
    select: (data) => data?.result ?? {},
  });
};
