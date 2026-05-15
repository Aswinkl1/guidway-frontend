import { useMutation } from "@tanstack/react-query";
import type { UpdateVisibilityDTO } from "../types/settings.types";
import { mentorStatusChanege } from "../services/settings.services";
import { uploadProfileKey } from "../services/mentorServices";
import toast from "react-hot-toast";

export const useUploadProfileImageKey = () => {
  return useMutation({
    mutationFn: uploadProfileKey,

    onSuccess: () => {
      toast.success("profile image update ");
    },
  });
};
