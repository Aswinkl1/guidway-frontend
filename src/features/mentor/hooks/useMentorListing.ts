import { createKeys } from "@/helpers/queryKeyFactor";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useSearchParams } from "react-router";
import { fetchMentors } from "../services/mentor.services";
import { string } from "zod";

const mentorListKeys = createKeys("mentorListing");
export interface filterProps {
  limit?: number;
  search: string | null;
  domainId: string;
}

export const userMentorFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filter: filterProps = {
    domainId: searchParams.get("domainId")?.trim() ?? "",
    search: searchParams.get("search")?.trim() ?? "",
    limit: Number(searchParams.get("limit") ?? 10),
  };

  const setFilter = (updates: Partial<filterProps>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (value == "" || value == "all" || value == undefined) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      return next;
    });
  };

  return { filter, setFilter };
};

export const useMentorListing = (filter: filterProps) => {
  return useInfiniteQuery({
    queryKey: mentorListKeys.list(filter),

    queryFn: ({ pageParam }) => {
      return fetchMentors({ ...filter, pageParam });
    },

    getNextPageParam: (lastPage) => lastPage.meta.nextCursor,
    initialPageParam: "",
  });
};
