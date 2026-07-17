import z from "zod";

export const addReviewSchema = z.object({
  bookingId: z.string(),
  mentorId: z.uuid(),
  comment: z.string().optional(),
  rating: z.coerce.number().min(1).max(5),
});

export type addReviewDto = z.infer<typeof addReviewSchema>;
