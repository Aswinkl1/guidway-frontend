import { api } from "@/lib/axios";

export const getUsers = async () => {
  const response = await api.get("/admin/users");
  console.log(response.data.result);
};
