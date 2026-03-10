import { useState } from "react";
import { Login } from "../components/Login";
import { api } from "@/lib/axios";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async (data: any): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await api.post(`/login`, data);
      console.log(res);

      // TODO : save the accesstoken to the redux
      toast.success("login successfull");
      await new Promise((res) => setTimeout(res, 1000));
      // redirect the user into home page
      navigate("/");
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
