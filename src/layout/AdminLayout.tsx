import { useAppSelector } from "@/app/store/store";
import { CLIENT_ROUTES } from "@/constants/clientRoutes";
import { Navbar } from "@/features/admin/components/Navbar";
import { Role } from "@/types/role";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export function AdminRootLayout() {
  const auth = useAppSelector((state) => state.auth);
  const naviage = useNavigate();
  useEffect(() => {
    if (!auth.token) naviage(CLIENT_ROUTES.AUTH.ADMIN_LOGIN, { replace: true });
    if (auth.role !== Role.ADMIN)
      naviage(CLIENT_ROUTES.ADMIN.ROOT, { replace: true });
  }, [auth, naviage]);

  return (
    <>
      <div
        className="flex h-screen bg-gray-50 overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
        // onClick={() => {
        //   setStatusDropdownOpen(false);
        //   setVerifyDropdownOpen(false);
        // }}
      >
        <Navbar />

        <Outlet />
      </div>
    </>
  );
}
