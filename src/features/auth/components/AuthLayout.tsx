import { useAppSelector } from "@/app/store/store";
import { useEffect } from "react";

import { Outlet, useNavigate } from "react-router";

const GuidwayIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="3" fill="#3B82F6" />
    <circle cx="12" cy="4" r="2" fill="#3B82F6" />
    <circle cx="12" cy="20" r="2" fill="#3B82F6" />
    <circle cx="4" cy="8" r="2" fill="#3B82F6" />
    <circle cx="20" cy="8" r="2" fill="#3B82F6" />
    <circle cx="4" cy="16" r="2" fill="#3B82F6" />
    <circle cx="20" cy="16" r="2" fill="#3B82F6" />
    <line x1="12" y1="9" x2="12" y2="6" stroke="#3B82F6" strokeWidth="1" />
    <line x1="12" y1="15" x2="12" y2="18" stroke="#3B82F6" strokeWidth="1" />
    <line x1="9" y1="10.5" x2="5.5" y2="9" stroke="#3B82F6" strokeWidth="1" />
    <line x1="15" y1="10.5" x2="18.5" y2="9" stroke="#3B82F6" strokeWidth="1" />
    <line x1="9" y1="13.5" x2="5.5" y2="15" stroke="#3B82F6" strokeWidth="1" />
    <line
      x1="15"
      y1="13.5"
      x2="18.5"
      y2="15"
      stroke="#3B82F6"
      strokeWidth="1"
    />
  </svg>
);
export function AuthLayout() {
  const authState = useAppSelector((state) => state.auth);
  const naviage = useNavigate();
  useEffect(() => {
    if (authState.token) {
      if (authState.role === "admin") naviage("/admin", { replace: true });
      else naviage("/", { replace: true });
    }
  }, [authState, naviage]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="px-6 py-4 flex items-center gap-2">
        <GuidwayIcon />
        <span className="text-gray-800 font-semibold text-base tracking-tight">
          Guidway
        </span>
      </nav>
      <Outlet />
    </div>
  );
  1;
}
