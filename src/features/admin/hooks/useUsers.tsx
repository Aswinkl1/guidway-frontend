import { getUsers, updateBlockStatus } from "@/services/admin/adminServices";
import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useSearchParams } from "react-router";
import type { User } from "../pages/mentor";

export interface filterProb {
  page: number;
  search: string;
  status: string | undefined;
  limit: number;
  Verified: string | null;
  role: "mentee" | "mentor";
}

export const USER_QUERY_KEYS = ["users"];

function fetchUsers(filter: filterProb) {
  return getUsers(filter);
}

const createKeys = (entity: string) => {
  const KEYS = {
    all: [entity] as const,
    lists: () => [...KEYS.all, "list"] as const,
    list: (filter: filterProb) => [...KEYS.lists(), filter] as const,
    details: (id: string) => [...KEYS.all, "details", id] as const,
  };
  return KEYS;
};

const menteeKeys = createKeys("mentee");
const mentorKeys = createKeys("mentor");
export const useUsers = (entity: "mentee" | "mentor", filter: filterProb) => {
  const keys = entity === "mentee" ? menteeKeys : mentorKeys;
  filter.role = entity;
  return useQuery({
    queryKey: keys.list(filter),
    queryFn: () => fetchUsers(filter),
    placeholderData: keepPreviousData,
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
    role: searchParams.get("role") as "mentee" | "mentor",
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

export const useUpdateBlockStatus = (entity: "mentee" | "mentor") => {
  const queryClient = useQueryClient();
  const keys = entity === "mentee" ? menteeKeys : mentorKeys;
  return useMutation({
    mutationFn: (data: BlockStatusProb) => updateBlockStatus(data),

    onSuccess: (_, variables) => {
      const { userId, newBlockStatus } = variables;
      console.log(newBlockStatus);
      queryClient.setQueriesData({ queryKey: keys.lists() }, (old: any) => {
        if (!old) return old;
        console.log("old", old);
        return {
          ...old,
          users: old.users.map((user: User) =>
            user.id === userId ? { ...user, isBlocked: newBlockStatus } : user,
          ),
        };
      });
    },
  });
};
