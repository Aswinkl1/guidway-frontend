import { getUsers, updateBlockStatus } from "@/services/admin/adminServices";
import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useSearchParams } from "react-router";

export interface filterProb {
  page: number;
  search: string;
  status: string | undefined;
  limit: number;
  Verified: string | null;
}

export const USER_QUERY_KEYS = ["users"];

function fetchUsers(filter: filterProb) {
  return getUsers(filter);
}

const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filter: filterProb) => [...userKeys.lists(), filter] as const,
  details: (userId: string) => [...userKeys.all, "details", userId] as const,
};

export const useUsers = (filter: filterProb) => {
  console.log(filter);
  return useQuery({
    queryKey: userKeys.list(filter),
    queryFn: () => fetchUsers(filter),
    // placeholderData: keepPreviousData,
  });
};

export const useUserFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filter: filterProb = {
    search: searchParams.get("search")?.trim() ?? "",
    page: Number(searchParams.get("page") ?? 1),
    limit: Number(searchParams.get("limit") ?? 10),
    status: searchParams.get("status") ?? undefined,
    Verified: searchParams.get("Verified"),
  };

  const setFilter = (updates: Partial<filterProb>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      Object.entries(updates).forEach(([key, value]) => {
        if (value == "" || value == "all" || value == undefined) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }

        const shouldResetPage = Object.keys(updates).some(
          (key) => key != "page",
        );

        if (shouldResetPage) {
          next.set("page", "1");
        }
      });

      return next;
    });
  };

  return { filter, setFilter };
};

export type BlockStatusProb = {
  userId: string;
  newBlockStatus: boolean;
};

export const useUpdateBlockStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BlockStatusProb) => updateBlockStatus(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: userKeys.lists() }),
  });
};
