import { useAppSelector } from "@/app/store/store";
import { Role } from "@/types/role";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export function AdminRootLayout() {
  const auth = useAppSelector((state) => state.auth);
  const naviage = useNavigate();
  useEffect(() => {
    if (!auth.token) naviage("/admin/login", { replace: true });
    if (auth.role !== Role.ADMIN) naviage("/", { replace: true });
  }, [auth, naviage]);

  return (
    <>
      <Outlet />
    </>
  );
}
