import { ROUTES } from "@/constants/apiRoutes";
import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/apiResponse";
import type {
  BookingSetupDetailsOutput,
  CreateOrderResponse,
  GetAllBookingOutput,
  GetAllBookingParams,
  VerifyPaymentPayload,
} from "../types/booking.types";
import type { HoldSlotDto } from "../dto/createOrder.dto";
import type { MenteeBookingDetailsOutput } from "../types/bookingDetails.types";

export const getSlots = async (mentorId: string, date: string) => {
  console.log("jkdfkladjlk");
  const response = await api.get(
    `${ROUTES.MENTOR.ROOT}/${mentorId}/slots?date=${date}`,
  );
  console.log(response.data.result);
  return response.data.result;
};

export const getBookingSetupDetails = async (
  mentorId: string,
  sessionId: string,
) => {
  console.log(mentorId, sessionId, "mentorId, sessionId");
  const response = await api.get<ApiResponse<BookingSetupDetailsOutput>>(
    `${ROUTES.MENTOR.ROOT}/${mentorId}/session/${sessionId}/`,
  );
  return response.data.result;
};

export const createOrder = async (data: HoldSlotDto) => {
  const response = await api.post<ApiResponse<CreateOrderResponse>>(
    "/api/v1/booking/initiate",
    data,
  );
  return response.data.result;
};

export const confirmBooking = async (data: VerifyPaymentPayload) => {
  const response = await api.post(`/api/v1/booking/confirm`, data);
  return response.data.result;
};

export const getAllHostedBooking = async (data: GetAllBookingParams) => {
  const response = await api.get<ApiResponse<GetAllBookingOutput>>(
    `/api/v1/mentor/bookings/`,
    { params: { ...data } },
  );
  const result = response.data.result;

  return {
    ...result,
    data: result.data.map((v) => {
      return {
        ...v,
        startTime: new Date(v.startTime),
        endTime: new Date(v.endTime),
      };
    }),
  };
};

export const getAllAttendingBooking = async (data: GetAllBookingParams) => {
  const response = await api.get<ApiResponse<GetAllBookingOutput>>(
    `/api/v1/user/bookings/`,
    { params: { ...data } },
  );
  const result = response.data.result;

  return {
    ...result,
    data: result.data.map((v) => {
      return {
        ...v,
        startTime: new Date(v.startTime),
        endTime: new Date(v.endTime),
      };
    }),
  };
};

export const getHostingBookingDetails = async (id: string) => {
  const res = await api.get<ApiResponse<MenteeBookingDetailsOutput>>(
    "/api/v1/mentor/bookings/" + id,
  );

  const result = res.data.result;

  return {
    ...result,
    startDateTime: new Date(result.startDateTime),
    endDateTime: new Date(result.endDateTime),
  };
};

export const getAttendeeBookingDetails = async (id: string) => {
  const res = await api.get<ApiResponse<MenteeBookingDetailsOutput>>(
    "/api/v1/user/bookings/" + id,
  );

  const result = res.data.result;

  return {
    ...result,
    startDateTime: new Date(result.startDateTime),
    endDateTime: new Date(result.endDateTime),
  };
};
