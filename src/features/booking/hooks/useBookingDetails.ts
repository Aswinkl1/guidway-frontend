// useSessionDetail.ts
// This is the file to wire up to your real API — the rest of the components
// only depend on the shape of `MenteeBookingDetailsOutput`.

import { useQuery } from "@tanstack/react-query";
import type { MenteeBookingDetailsOutput } from "../types/bookingDetails.types";
import { api } from "@/lib/axios";

async function fetchSessionDetail(
  bookingId: string,
): Promise<MenteeBookingDetailsOutput> {
  // TODO(Asiwn): replace with your real API client call, e.g.
  //
  //   const res = await api.get(`/bookings/${bookingId}`);
  //   return res.data;
  //
  // `startDateTime` / `endDateTime` come back as strings over JSON — convert
  // them to Date instances (as done below) before handing data to the UI.

  const res = await api.get(`/api/v1/mentor/bookings/${bookingId}`);

  const json = res.data.result as MenteeBookingDetailsOutput;

  return {
    ...json,
    startDateTime: new Date(json.startDateTime),
    endDateTime: new Date(json.endDateTime),
  };
}

export function useSessionDetail(bookingId: string) {
  return useQuery({
    queryKey: ["session-detail", bookingId],
    queryFn: () => fetchSessionDetail(bookingId),
    enabled: !!bookingId,
  });
}
