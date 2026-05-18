import type {
  BlockStatusProb,
  filterProb,
} from "@/features/admin/hooks/useUsers";
import { api } from "@/lib/axios";
import { ROUTES } from "@/constants/apiRoutes";

export const getUsers = async (filter: filterProb) => {
  const {
    page = 1,
    search = "",
    status = undefined,
    limit = 2,
    Verified,
    role,
  } = filter;

  const query: Record<string, any> = {
    page,
    limit,
  };

  if (search) {
    query.search = search;
  }

  if (status === "blocked") {
    query.isBlocked = true;
  } else if (status === "active") {
    query.isBlocked = false;
  }

  if (Verified === "true") {
    query.isVerified = true;
  } else if (Verified === "false") {
    query.isVerified = false;
  }

  if (role) {
    query.role = role;
  }

  const response = await api.get(ROUTES.ADMIN.USERS, { params: query });
  return response.data.result;
};

export const updateBlockStatus = async (data: BlockStatusProb) => {
  const response = await api.patch(ROUTES.ADMIN.BLOCK_STATUS, data);
  return response.data.result;
};

export const verifyMentor = async (data: { mentorId: string }) => {
  const response = await api.patch(ROUTES.ADMIN.VERIFY_MENTOR, data);
  return response.data.result;
};

export const getMentorProfile = async (data: { id: string }) => {
  const response = await api.get("/api/v1/admin/mentor/" + data.id);
  return response.data.result;
};

export const updateMentorBlockstatus = async (data: {}) => {
  // const response = await api.
};
