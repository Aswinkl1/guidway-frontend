import { useAppSelector } from "@/app/store/store";
import { UserSidebar } from "@/components/shared/UserSideBar";
import { CLIENT_ROUTES } from "@/constants/clientRoutes";
import { Role } from "@/types/role";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
// import { Sidebar } from "../../../components/shared/Sidebar";

export const UserLayout = () => {
  const auth = useAppSelector((state) => state.auth);
  const naviage = useNavigate();
  useEffect(() => {
    if (!auth.token) naviage(CLIENT_ROUTES.AUTH.LOGIN, { replace: true });
    if (auth.role !== Role.MENTEE && auth.role !== Role.MENTOR)
      naviage(CLIENT_ROUTES.HOME, { replace: true });
  }, [auth, naviage]);

  console.log("he my deat vazha");
  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <UserSidebar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};
