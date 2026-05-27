import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMentorDetails } from "../services/mentor.services";

export const useMentor = (id: string) => {
  return useQuery({
    queryKey: ["mentor", id],
    queryFn: () => getMentorDetails(id),
    placeholderData: keepPreviousData,
  });
};
