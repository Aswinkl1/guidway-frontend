import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMentorProfile } from "../services/mentorServices";
import { QUERYKEY } from "./keys";
import type { MentorProfileType } from "../types/profile.types";

export const useProfile = () => {
  return useQuery({
    queryKey: QUERYKEY.all,
    queryFn: getMentorProfile,
    placeholderData: keepPreviousData,
    select: (data) => data?.result ?? [],
  });
};
