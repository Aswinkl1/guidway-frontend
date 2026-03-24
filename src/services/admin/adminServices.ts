import type { filterProb } from "@/features/admin/hooks/useUsers";
import { api } from "@/lib/axios";

export const getUsers = async (filter: filterProb) => {
  // console.log("filet skldkfj dkl", filter);
  const {
    page = 1,
    search = "",
    status = undefined,
    limit = 2,
    Verified,
  } = filter;
  const query: Record<string, any> = {
    page,
    limit,
  };

  if (search) {
    query.search = search;
  }
  if (status == "blocked") {
    query.isBlocked = true;
  } else if (status == "active") {
    query.isBlocked = false;
  }

  if (Verified == "true") {
    console.log("Verified", Verified);
    query.isVerified = true;
  } else if (Verified == "false") {
    query.isVerified = false;
  }

  const response = await api.get(`/admin/users`, { params: query });
  return response.data.result;
};
