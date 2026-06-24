import z from "zod";
import { CURRENCIES } from "../types/booking.types";

export const holdSlotSchema = z.object({
  mentorId: z.uuid(),
  sessionId: z.uuid(),

  date: z.coerce.date(),

  startTime: z.coerce.number(),
  endTime: z.coerce.number(),

  note: z.string().nullable().optional(),

  price: z.coerce.number().positive(),

  currency: z.enum(CURRENCIES),
});

export type HoldSlotDto = z.infer<typeof holdSlotSchema>;
