import { useAppSelector } from "@/app/store/store";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function AdminRoot() {
  const auth = useAppSelector((state) => state.auth);
  const naviage = useNavigate();
  useEffect(() => {
    if (!auth.token) naviage("/admin/login", { replace: true });
    if (auth.role !== "admin") naviage("/", { replace: true });
  }, [auth.token, naviage]);

  return <h1>i am admin</h1>;
}
