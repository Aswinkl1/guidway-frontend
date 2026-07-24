import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAdminBookingDetails } from "../services/adminBooking.service";

export const useAdminBookingDetailUsecase = (id: string) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => getAdminBookingDetails(id),
    placeholderData: keepPreviousData,
  });
};
