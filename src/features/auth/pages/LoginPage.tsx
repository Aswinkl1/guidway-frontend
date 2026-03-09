import { useState } from "react";
import { Login } from "../components/Login";
import { api } from "@/lib/axios";

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await api.post(`/login`, data);
      console.log(res);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
    console.log("Login data:", data);
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <Login onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
}
