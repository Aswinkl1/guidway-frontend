import { ROUTES } from "@/constants/apiRoutes";
import { api } from "@/lib/axios";
import type {
  CreateSessionDTO,
  DeleteSessionDTO,
  editSessionDTO,
} from "../schema/session.dto";
import type { filterProps } from "../types/session.types";

export const addSession = async (data: CreateSessionDTO) => {
  const response = await api.post(ROUTES.MENTOR.SESSION.ROOT, data);
  return response.data;
};

export const editSession = async (data: editSessionDTO) => {
  const response = await api.put(
    `${ROUTES.MENTOR.SESSION.ROOT}/${data.id}`,
    data,
  );
  return response.data;
};

export const deleteSession = async (data: DeleteSessionDTO) => {
  const response = await api.delete(`${ROUTES.MENTOR.SESSION.ROOT}/${data.id}`);
  return response.data;
};

export const getAllSessions = async (filter: filterProps) => {
  const response = await api.get(
    `${ROUTES.MENTOR.SESSION.ROOT}?search=${filter.search}&page=${filter.page}&limit=${filter.limit}`,
  );
  return response.data;
};
