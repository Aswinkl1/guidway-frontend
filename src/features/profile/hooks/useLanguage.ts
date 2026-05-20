import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { languageQueryKeys, QUERYKEY } from "./keys";

import {
  addOrUpdateMentorLanguage,
  getAllLanguages,
  removeMentorLanguage,
} from "../services/mentorServices";
import toast from "react-hot-toast";

export const useFetchLanguage = (startFetch: boolean) => {
  return useQuery({
    queryKey: languageQueryKeys.list(),

    queryFn: getAllLanguages,

    staleTime: 5 * 60 * 1000,

    refetchOnWindowFocus: false,

    enabled: startFetch,

    select: (data) => data?.result ?? [],
  });
};

export const useAddOrUpdateMentorLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addOrUpdateMentorLanguage,

    onSuccess: () => {
      toast.success("language added successgull ");
      queryClient.invalidateQueries({ queryKey: QUERYKEY.all });
    },
  });
};

export const useRemoveMentorLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeMentorLanguage,

    onSuccess: () => {
      console.log("language removed successfully");
      queryClient.invalidateQueries({ queryKey: QUERYKEY.all });
    },
  });
};
