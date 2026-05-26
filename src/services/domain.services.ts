import { ROUTES } from "@/constants/apiRoutes";
import { api } from "@/lib/axios";

export const getAllDomain = async () => {
  const response = await api.get(ROUTES.MENTOR.DOMAIN.ROOT);
  console.log(response.data);
  return response.data;
};
