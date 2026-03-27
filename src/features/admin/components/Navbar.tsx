import { useNavigate } from "react-router";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
        <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
        <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
      </svg>
    ),
  },
  {
    label: "Users",
    active: true,
    icon: (
      <svg
        className="w-[18px] h-[18px]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeWidth="2"
          strokeLinecap="round"
          d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
        />
        <circle cx="9" cy="7" r="4" strokeWidth="2" />
        <path
          strokeWidth="2"
          strokeLinecap="round"
          d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
        />
      </svg>
    ),
  },
  {
    label: "Mentors",
    icon: (
      <svg
        className="w-[18px] h-[18px]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeWidth="2"
          strokeLinecap="round"
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>
    ),
  },
  {
    label: "Bookings",
    icon: (
      <svg
        className="w-[18px] h-[18px]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
        <path strokeWidth="2" strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    label: "Earnings",
    icon: (
      <svg
        className="w-[18px] h-[18px]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="9" strokeWidth="2" />
        <path strokeWidth="2" strokeLinecap="round" d="M12 7v5l3 3" />
      </svg>
    ),
  },
];

export const Navbar = () => {
  const naviagate = useNavigate();
  function handleClick(label: string) {
    naviagate(`/admin/${label}`);
  }
  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-100 flex flex-col py-5 px-3">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
        </div>
        <div className="leading-tight">
          <p className="text-[16px] font-bold text-gray-900">Admin Panel</p>
          <p className="text-[13px] text-gray-400">Mentor Booking</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => handleClick(item.label)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[15px] w-full text-left transition-colors ${
              item.active
                ? "bg-indigo-50 text-indigo-600 font-semibold"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Settings */}
      <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors w-full text-left">
        <svg
          className="w-4.5 h-4.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="3" strokeWidth="2" />
          <path
            strokeWidth="2"
            d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
          />
        </svg>
        Settings
      </button>

      {/* Admin user */}
      <div className="flex items-center gap-2.5 px-2 pt-3 mt-2 border-t border-gray-100">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
          style={{ backgroundColor: "#6366f1" }}
        >
          AU
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-gray-800 truncate">
            Admin User
          </p>
          <p className="text-[11px] text-gray-400 truncate">admin@...</p>
        </div>
      </div>
    </aside>
  );
};
