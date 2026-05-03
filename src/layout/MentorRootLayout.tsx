import { useAppSelector } from "@/app/store/store";
import { CLIENT_ROUTES } from "@/constants/clientRoutes";
import { Role } from "@/types/role";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export function AdminRootLayout() {
  const auth = useAppSelector((state) => state.auth);
  const naviage = useNavigate();
  useEffect(() => {
    if (!auth.token) naviage(CLIENT_ROUTES.AUTH.LOGIN, { replace: true });
    if (auth.role !== Role.MENTOR)
      naviage(CLIENT_ROUTES.MENTOR.ROOT, { replace: true });
  }, [auth, naviage]);

  return (
    <>
      <Outlet />
    </>
  );
}
