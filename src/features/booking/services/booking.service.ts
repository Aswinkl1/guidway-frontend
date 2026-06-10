import { ROUTES } from "@/constants/apiRoutes";
import { api } from "@/lib/axios";

export const getSlots = async (mentorId: string, date: string) => {
  console.log("jkdfkladjlk");
  const response = await api.get(
    `${ROUTES.MENTOR.ROOT}/${mentorId}/slots?date=${date}`,
  );
  console.log(response.data.result);
  return response.data.result;
};
