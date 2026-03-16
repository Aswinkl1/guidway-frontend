import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "./store/store";

export function Root() {
  const token = useAppSelector((state) => state.auth.token);
  const naviage = useNavigate();
  useEffect(() => {
    if (!token) naviage("/auth/login", { replace: true });
  }, [token, naviage]);
  return <h1>Hello world</h1>;
}
