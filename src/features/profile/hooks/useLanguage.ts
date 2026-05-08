import { useMutation, useQuery } from "@tanstack/react-query";

import { languageQueryKeys } from "./keys";

import {
  addOrUpdateMentorLanguage,
  getAllLanguages,
  removeMentorLanguage,
} from "../services/mentorServices";

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
  return useMutation({
    mutationFn: addOrUpdateMentorLanguage,

    onSuccess: () => {
      console.log("language added successfully");

      // invalidate profile query
    },
  });
};

export const useRemoveMentorLanguage = () => {
  return useMutation({
    mutationFn: removeMentorLanguage,

    onSuccess: () => {
      console.log("language removed successfully");
    },
  });
};
