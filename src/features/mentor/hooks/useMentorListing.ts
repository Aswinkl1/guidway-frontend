import { createKeys } from "@/helpers/queryKeyFactor";
import { useInfiniteQuery } from "@tanstack/react-query";

const mentorListKeys = createKeys("mentorListing");
export const useMentorListing = () => {
  return useInfiniteQuery({
    queryKey: mentorListKeys.list({}),
    queryFn: () => {},
  });
};
