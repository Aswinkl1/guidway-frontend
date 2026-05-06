import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMentorProfile } from "../services/mentorServices";
import { QUERYKEY } from "./keys";

export const useProfile = () => {
  return useQuery({
    queryKey: QUERYKEY.all,
    queryFn: getMentorProfile,
    placeholderData: keepPreviousData,
  });
};
