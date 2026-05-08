import { useMutation, useQuery } from "@tanstack/react-query";
import { skillsQueryKeys } from "./keys";
import {
  addOrUpdateMentorSkill,
  getAllSkills,
  removeMentorSkill,
} from "../services/mentorServices";

export const useFetchSkill = (startFetch: boolean) => {
  return useQuery({
    queryKey: skillsQueryKeys.list(),
    queryFn: getAllSkills,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: startFetch,
    select: (data) => data?.result ?? [],
  });
};

export const useAddOrUpdateMentorSkill = () => {
  return useMutation({
    mutationFn: addOrUpdateMentorSkill,
    onSuccess: () => {
      console.log("it is a success");
      // invalidate the profiel query
    },
  });
};

export const useRemoveMentorSkill = () => {
  return useMutation({
    mutationFn: removeMentorSkill,
    onSuccess: () => {
      console.log("successfull  removed the skill");
    },
  });
};
