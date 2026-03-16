import { useState } from "react";
import { Login } from "../components/Login";
import { api } from "@/lib/axios";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/app/store/store";
import { setCredentials } from "../redux/UserAuthSlice";
export function LoginPage() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async (data: any): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await api.post(`/login`, data);
      console.log(res);

      // saving the token in redux
      dispatch(
        setCredentials({
          role: res.data.result.role,
          token: res.data.result.accessToken,
        }),
      );

      toast.success("login successfull");
      await new Promise((res) => setTimeout(res, 1000));
      // redirect the user into home page
      navigate("/", { replace: true });
    } catch (error) {
      toast.error("please try again");

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
