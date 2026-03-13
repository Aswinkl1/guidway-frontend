import type { serverErrorv } from "@/types/serverErrors";
import { AxiosError } from "axios";

export const handleServerErrors = (
  error: unknown,
  setError: any,
  data: any,
) => {
  if (error instanceof AxiosError && error?.response?.data?.errors) {
    const serializedErrors = error.response.data.errors as serverErrorv;

    serializedErrors.forEach((err) => {
      if (err.field == undefined) {
        setError("root.serverError", {
          message: err.message,
          type: "server",
        });
      } else {
        setError(err.field as keyof typeof data, {
          message: err.message,
          type: "server",
        });
      }
    });
  }
};
