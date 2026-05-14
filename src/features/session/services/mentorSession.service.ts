import { ROUTES } from "@/constants/apiRoutes";
import { api } from "@/lib/axios";
import type { CreateSessionDTO } from "../schema/session.dto";

export const addSession = async (data: CreateSessionDTO) => {
  const response = await api.post(ROUTES.MENTOR.SESSION.ROOT, data);
  return response.data;
};
