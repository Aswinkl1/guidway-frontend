import { useState } from "react";
import { Login, type LoginPayload } from "../components/Login";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/app/store/store";
import { setCredentials } from "../redux/UserAuthSlice";
import { userLogin } from "@/features/auth/services/authService";
import { CLIENT_ROUTES } from "@/constants/clientRoutes";
export function LoginPage() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async (data: LoginPayload): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await userLogin(data);

      // saving the token in redux
      dispatch(
        setCredentials({
          role: res.result.role,
          token: res.result.accessToken,
        }),
      );

      toast.success("login successfull");
      await new Promise((res) => setTimeout(res, 1000));
      // redirect the user into home page
      navigate(CLIENT_ROUTES.HOME, { replace: true });
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
