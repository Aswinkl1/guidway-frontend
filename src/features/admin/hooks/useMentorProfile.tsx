import { useQuery } from "@tanstack/react-query";
import { getMentorProfile } from "../services/adminServices";

export const useMentorProfile = (id: string) => {
  return useQuery({
    queryKey: ["admin", "mentor", id],
    queryFn: () => getMentorProfile({ id }),
  });
};
