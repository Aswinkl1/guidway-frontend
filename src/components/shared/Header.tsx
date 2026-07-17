import { useEffect, useRef, useState, type FC } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";
import { logout } from "@/features/auth/services/authService";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { logout as reduxLogout } from "@/features/auth/redux/UserAuthSlice";
import { useAppSelector } from "@/app/store/store";
interface HeaderProps {
  isLoggedIn?: boolean;

  isLogoHidden?: boolean;
}

interface DropdownItem {
  Icon: LucideIcon;
  label: string;
  link?: string;
}

const Logo = () => (
  <div className="flex items-center gap-2">
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="2.5" fill="#2563EB" />
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <line
          key={i}
          x1="11"
          y1="11"
          x2={11 + 8 * Math.cos((deg * Math.PI) / 180)}
          y2={11 + 8 * Math.sin((deg * Math.PI) / 180)}
          stroke="#2563EB"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ))}
    </svg>
    <span className="text-[15px] font-bold text-gray-900 tracking-tight">
      GuidWay
    </span>
  </div>
);

export const Header: FC<HeaderProps> = ({
  isLoggedIn = true,
  isLogoHidden = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { profileImageKey } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const dropdownItems: DropdownItem[] = [
    { Icon: LayoutDashboard, label: "My Dashboard" },
    { Icon: CalendarDays, label: "My Sessions" },
    { Icon: User, label: "Profile", link: "/mentor/profile" },
    { Icon: Settings, label: "Settings" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(reduxLogout());
      toast.success("Logged out successfully");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="w-full px-7 h-14 flex items-center justify-between">
        {/* Logo — hidden but preserves layout space */}
        <div className={isLogoHidden ? "invisible" : ""}>
          <Logo />
        </div>

        {/* Logged-out nav */}
        {!isLoggedIn && (
          <nav className="flex items-center gap-7">
            <a
              href="#"
              className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Browse mentors
            </a>
            <button
              onClick={() => navigate("/auth/login")}
              className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer bg-transparent border-none"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/auth/signup")}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-[13px] font-semibold px-4.5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Sign up
            </button>
          </nav>
        )}

        {/* Logged-in nav */}
        {isLoggedIn && (
          <nav className="flex items-center gap-7">
            {["Message", "Find Mentors", "My Sessions"].map((label) => (
              <a
                key={label}
                href="#"
                className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                {label}
              </a>
            ))}

            {/* Notification bell */}
            <button className="relative flex items-center justify-center p-1 cursor-pointer bg-transparent border-none">
              <Bell size={18} color="#6B7280" />
              <span className="absolute top-0.75 right-0.75 w-1.75 h-1.75 rounded-full bg-blue-600 border-[1.5px] border-white" />
            </button>

            {/* Avatar + dropdown */}
            <div className="relative" ref={dropdownRef}>
              {/* <button
                onClick={() => setOpen((prev) => !prev)}
                className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-blue-300 to-blue-600 text-white text-xs font-bold border-2 border-blue-200 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              >
                JD
              </button> */}
              <Avatar
                className="w-8 h-8"
                onClick={() => setOpen((prev) => !prev)}
              >
                <AvatarImage
                  src={`${import.meta.env.VITE_S3_BASE_URL}${profileImageKey}`}
                  alt="Sarah Jenkins"
                />
                <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                  SJ
                </AvatarFallback>
              </Avatar>
              {open && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-49 bg-white border border-gray-200 rounded-xl shadow-[0_12px_28px_rgba(0,0,0,0.10)] overflow-hidden">
                  {dropdownItems.map(({ Icon, label, link }) => (
                    <button
                      key={label}
                      onClick={() => link && navigate(link)}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left cursor-pointer bg-transparent border-none"
                    >
                      <Icon size={14} color="#9CA3AF" className="shrink-0" />
                      {label}
                    </button>
                  ))}

                  <div className="h-px bg-slate-100" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] font-medium text-red-500 hover:bg-[#FFF5F5] transition-colors cursor-pointer bg-transparent border-none"
                  >
                    <LogOut size={14} className="shrink-0" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
