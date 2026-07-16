import z from "zod";

export const rescheduleBookingSchema = z.object({
  bookingId: z.uuid(),
  startTime: z.coerce.number(),
  endTime: z.coerce.number(),
  date: z.coerce.date(),
});

export type rescheduleBookingDto = z.infer<typeof rescheduleBookingSchema>;
