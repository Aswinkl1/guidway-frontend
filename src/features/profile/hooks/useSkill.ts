import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERYKEY, skillsQueryKeys } from "./keys";
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addOrUpdateMentorSkill,
    onSuccess: () => {
      console.log("it is a success");
      queryClient.invalidateQueries({ queryKey: QUERYKEY.all });
    },
  });
};

export const useRemoveMentorSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeMentorSkill,
    onSuccess: () => {
      console.log("successfull  removed the skill");
      queryClient.invalidateQueries({ queryKey: QUERYKEY.all });
    },
  });
};
