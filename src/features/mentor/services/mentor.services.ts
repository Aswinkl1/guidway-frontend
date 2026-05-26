import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/apiResponse";
import type { fetchMentorApiResponse } from "../types/mentor.types";
import { ROUTES } from "@/constants/apiRoutes";
import type { filterProps } from "../hooks/useMentorListing";

export const fetchMentors = async (
  filter: filterProps & { pageParam: string },
) => {
  console.log(filter.pageParam || undefined);
  const response = await api.get<ApiResponse<fetchMentorApiResponse>>(
    ROUTES.MENTOR.ROOT,
    {
      params: {
        limit: 10,
        search: filter.search || undefined,
        domainId: filter.domainId || undefined,
        cursor: filter.pageParam || null,
      },
    },
  );
  console.log(response.data.result);
  return response.data.result;
};
