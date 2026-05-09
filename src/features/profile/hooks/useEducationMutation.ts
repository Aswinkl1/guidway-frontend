import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  DeleteEducationType,
  EditEducationType,
  EducationFormData,
} from "../schemas/education.schema";
import {
  AddEducation,
  DeleteEducation,
  EditEducation,
} from "../services/mentorServices";
import toast from "react-hot-toast";
import { QUERYKEY } from "./keys";

export const useAddEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EducationFormData) => AddEducation(data),

    onSuccess: () => {
      toast.success("Education added!");
      queryClient.invalidateQueries({ queryKey: QUERYKEY.all });
    },
  });
};

export const useEditEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditEducationType) => EditEducation(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERYKEY.all });
    },
  });
};

export const useDeleteEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteEducationType) => DeleteEducation(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERYKEY.all });
    },
  });
};
