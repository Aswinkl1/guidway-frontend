import { getAllSkills } from "@/features/profile/services/mentorServices";
import { createKeys } from "@/helpers/queryKeyFactor";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllSessions } from "../services/mentorSession.service";
import type { filterProps } from "../types/session.types";

export const sessionKeys = createKeys("session");
export const useSessionQuery = (filter: filterProps) => {
  return useQuery({
    queryKey: sessionKeys.list(filter),
    queryFn: () => getAllSessions(filter),
    placeholderData: keepPreviousData,
    select: (data) => data.result ?? [],
  });
};
