import { useMutation } from "@tanstack/react-query";
import { addReview } from "../services/booking.service";
import toast from "react-hot-toast";

export const useReview = () => {
  return useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      toast.success("review added successfully");
    },
  });
};
