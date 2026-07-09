// useBookings.ts
// This is the ONE place you need to touch to wire this up to your real API.
// The rest of the components below only depend on the shape of `GetAllBookingOutput`.

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import type {
  GetAllBookingParams,
  GetAllBookingOutput,
} from "../types/booking.types";

import { api } from "@/lib/axios";

type FetchBookingsParams = Omit<GetAllBookingParams, "page"> & { page: number };

async function fetchBookings(
  params: FetchBookingsParams,
): Promise<GetAllBookingOutput> {
  // TODO(Asiwn): replace this block with your real API client call, e.g.
  //
  //   const res = await api.get(`/bookings/${params.role}`, {
  //     params: {
  //       search: params.search,
  //       page: params.page,
  //       limit: params.limit,
  //       status: params.status,
  //     },
  //   });
  //   return res.data;
  //
  // Remember `startTime` / `endTime` come back as strings over JSON — convert
  // them to Date instances (as done below) before handing data to the UI.

  const searchParams = new URLSearchParams({
    search: params.search,
    page: String(params.page),
    limit: String(params.limit),
    status: params.status,
  });

  const res = await api.get(
    `/api/v1/mentor/bookings/?${searchParams.toString()}`,
  );
  console.log(res.data);
  const json = res.data.result as GetAllBookingOutput;
  console.log(json);
  return {
    ...json,
    data: json.data.map((booking) => ({
      ...booking,
      startTime: new Date(booking.startTime),
      endTime: new Date(booking.endTime),
    })),
  };
}

/**
 * Infinite-scroll / "load more" query for one tab (hosting or attending).
 * Each tab should call this with its own `role`, `search`, and `status` state
 * so the two tabs stay fully independent.
 */
export function useBookings(params: Omit<GetAllBookingParams, "page">) {
  return useInfiniteQuery({
    queryKey: [
      "bookings",
      params.role,
      params.search,
      params.status,
      params.limit,
    ],
    queryFn: ({ pageParam }) => fetchBookings({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined,
    placeholderData: keepPreviousData,
  });
}
