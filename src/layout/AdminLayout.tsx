import { useAppSelector } from "@/app/store/store";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export function AdminRootLayout() {
  const auth = useAppSelector((state) => state.auth);
  const naviage = useNavigate();
  useEffect(() => {
    if (!auth.token) naviage("/admin/login", { replace: true });
    if (auth.role !== "admin") naviage("/", { replace: true });
  }, [auth, naviage]);

  return <><Outlet /></>
};