import { useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  List,
  MessageSquare,
  BookOpenIcon,
  User,
  CalendarCheck,
  Settings,
  DollarSign,
  Users,
  Star,
} from "lucide-react";
import { NavItem } from "@/components/shared";
import { CLIENT_ROUTES } from "@/constants/clientRoutes";

const navLinks = [
  {
    icon: <LayoutDashboard size={16} />,
    label: "Dashboard",
    path: "/mentor/dashboard",
  },

  {
    icon: <MessageSquare size={16} />,
    label: "Messages",
    path: "/mentor/messages",
  },
  {
    icon: <BookOpenIcon size={16} />,
    label: "My Bookings",
    path: "/mentor/bookings",
  },
  {
    icon: <User size={16} />,
    label: "My Profile",
    path: CLIENT_ROUTES.MENTOR.PROFILE,
  },

  { icon: <Settings size={16} />, label: "Settings", path: "/mentor/settings" },

  {
    icon: <Users size={16} />,
    label: "Membership Plans",
    path: "/mentor/plans",
  },
  { icon: <Star size={16} />, label: "Reviews", path: "/mentor/reviews" },
];

console.log("location", location);

export const UserSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <aside className="w-56  bg-white border-r border-slate-200 flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-100">
        <span className="text-lg font-bold text-slate-900 tracking-tight">
          MentorSpace
        </span>
      </div>

      {/* User chip */}
      {/* <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100">
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={`${import.meta.env.VITE_S3_BASE_URL}${profileImageKey}`}
            alt="Sarah Jenkins"
          />
          <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
            SJ
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">
            {name}
          </p>
          <p className="text-xs text-slate-400 truncate">Mentor Workspace</p>
        </div>
      </div> */}

      {/* Nav links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navLinks.map(({ icon, label, path }) => (
          <div key={label} onClick={() => navigate(path)}>
            <NavItem
              icon={icon}
              label={label}
              active={location.pathname === path}
            />
          </div>
        ))}
      </nav>

      {/* <div className="px-3 pb-4">
        <NavItem icon={<LogOut size={16} />} label="Log out" />
      </div> */}
    </aside>
  );
};
