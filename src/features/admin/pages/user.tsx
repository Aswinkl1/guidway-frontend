// MentorAdminUsers.jsx
// Requirements: tailwindcss, lucide-react, react-hook-form
// Install: npm install lucide-react react-hook-form

import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarDays,
  FileText,
  Settings,
  Bell,
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Menu,
  X,
  Eye,
  Pencil,
  ShieldOff,
  ShieldCheck,
  Trash2,
  Check,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────
const USERS = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.c@example.com",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    joined: "Aug 12, 2026",
    joinedDate: new Date("2026-08-12"),
    booked: 5,
    completed: 3,
    membership: "Active",
    status: "Active",
  },
  {
    id: 2,
    name: "Alex Rivera",
    email: "alex.r@example.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    joined: "Aug 10, 2026",
    joinedDate: new Date("2026-08-10"),
    booked: 12,
    completed: 10,
    membership: "Active",
    status: "Active",
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma.w@example.com",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    joined: "Aug 08, 2026",
    joinedDate: new Date("2026-08-08"),
    booked: 0,
    completed: 0,
    membership: "Pending",
    status: "Blocked",
  },
  {
    id: 4,
    name: "Michael Ross",
    email: "mike.ross@example.com",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    joined: "Aug 05, 2026",
    joinedDate: new Date("2026-08-05"),
    booked: 2,
    completed: 1,
    membership: "Active",
    status: "Active",
  },
  {
    id: 5,
    name: "Lisa Patel",
    email: "lisa.p@example.com",
    avatar: "https://randomuser.me/api/portraits/women/26.jpg",
    joined: "Jul 28, 2026",
    joinedDate: new Date("2026-07-28"),
    booked: 8,
    completed: 8,
    membership: "Active",
    status: "Active",
  },
  {
    id: 6,
    name: "David Kim",
    email: "david.kim@example.com",
    avatar: "https://randomuser.me/api/portraits/men/83.jpg",
    joined: "Jul 20, 2026",
    joinedDate: new Date("2026-07-20"),
    booked: 1,
    completed: 0,
    membership: "Suspended",
    status: "Blocked",
  },
];

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Users", icon: Users },
  { label: "Mentors", icon: GraduationCap },
  { label: "Sessions", icon: CalendarDays },
  { label: "Report", icon: FileText },
];

const STATUS_OPTIONS = ["Active", "Blocked"];
const JOINED_OPTIONS = ["This Month", "Last Month", "Older"];
const ACTIVITY_OPTIONS = ["High (8+)", "Medium (2–7)", "Low (0–1)"];

// ─────────────────────────────────────────────────────────────────
// Hook: close on outside click
// ─────────────────────────────────────────────────────────────────
function useClickOutside(cb) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) cb();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [cb]);
  return ref;
}

// ─────────────────────────────────────────────────────────────────
// Hook: filter logic
// ─────────────────────────────────────────────────────────────────
function useFilteredUsers({ search, status, joined, activity }) {
  return USERS.filter((u) => {
    const q = search.toLowerCase();
    if (
      q &&
      !u.name.toLowerCase().includes(q) &&
      !u.email.toLowerCase().includes(q)
    )
      return false;
    if (status && u.status !== status) return false;
    if (joined === "This Month" && u.joinedDate < new Date("2026-08-01"))
      return false;
    if (
      joined === "Last Month" &&
      (u.joinedDate < new Date("2026-07-01") ||
        u.joinedDate >= new Date("2026-08-01"))
    )
      return false;
    if (joined === "Older" && u.joinedDate >= new Date("2026-07-01"))
      return false;
    if (activity === "High (8+)" && u.booked < 8) return false;
    if (activity === "Medium (2–7)" && (u.booked < 2 || u.booked >= 8))
      return false;
    if (activity === "Low (0–1)" && u.booked > 1) return false;
    return true;
  });
}

// ─────────────────────────────────────────────────────────────────
// Dropdown
// ─────────────────────────────────────────────────────────────────
function Dropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(useCallback(() => setOpen(false), []));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={[
          "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border font-medium transition-all duration-150 whitespace-nowrap cursor-pointer",
          open
            ? "border-blue-400 text-slate-800 ring-2 ring-blue-100 bg-white"
            : value
              ? "border-blue-300 bg-blue-50 text-blue-700"
              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700",
        ].join(" ")}
      >
        {value || label}
        <ChevronDown
          size={12}
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""} text-current opacity-60`}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 min-w-39 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 z-50 overflow-hidden py-1">
          <button
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className="w-full text-left px-3.5 py-2 text-xs text-slate-400 hover:bg-slate-50 transition-colors"
          >
            All {label}
          </button>
          <div className="h-px bg-slate-100 mx-2 mb-1" />
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={[
                "w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors",
                value === opt
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-700 hover:bg-slate-50",
              ].join(" ")}
            >
              {opt}
              {value === opt && <Check size={11} className="text-blue-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// StatusBadge
// ─────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide",
        status === "Active"
          ? "bg-emerald-50 text-emerald-600"
          : "bg-red-50 text-red-500",
      ].join(" ")}
    >
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────
// RowMenu
// ─────────────────────────────────────────────────────────────────
function RowMenu({ user, open, onToggle }) {
  const ref = useClickOutside(useCallback(() => onToggle(null), [onToggle]));

  const actions = [
    {
      label: "View Profile",
      icon: Eye,
      className: "text-slate-700 hover:bg-slate-50",
    },
    {
      label: "Edit User",
      icon: Pencil,
      className: "text-slate-700 hover:bg-slate-50",
    },
    {
      label: user.status === "Active" ? "Block User" : "Unblock User",
      icon: user.status === "Active" ? ShieldOff : ShieldCheck,
      className:
        user.status === "Active"
          ? "text-amber-600 hover:bg-amber-50"
          : "text-emerald-600 hover:bg-emerald-50",
    },
    {
      label: "Delete",
      icon: Trash2,
      className: "text-red-500 hover:bg-red-50",
    },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => onToggle(user.id)}
        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
        aria-label="More options"
      >
        <MoreHorizontal size={15} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] w-44 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/60 z-50 overflow-hidden py-1">
          {actions.map(({ label, icon: Icon, className }, i) => (
            <button
              key={label}
              onClick={() => onToggle(null)}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs transition-colors ${className} ${i < actions.length - 1 ? "border-b border-slate-50" : ""}`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Desktop UserRow
// ─────────────────────────────────────────────────────────────────
function UserRow({ user, openMenu, onToggleMenu }) {
  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors group">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
          />
          <div>
            <p className="text-sm font-medium text-slate-800 leading-tight">
              {user.name}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
        {user.joined}
      </td>
      <td className="px-5 py-3.5">
        <div className="space-y-0.5">
          {[
            `Booked: ${user.booked}`,
            `Completed: ${user.completed}`,
            `Membership: ${user.membership}`,
          ].map((line) => {
            const [label, val] = line.split(": ");
            return (
              <p key={label} className="text-xs text-slate-500">
                {label}:{" "}
                <span className="font-medium text-slate-700">{val}</span>
              </p>
            );
          })}
        </div>
      </td>
      <td className="px-5 py-3.5">
        <StatusBadge status={user.status} />
      </td>
      <td className="px-5 py-3.5">
        <RowMenu
          user={user}
          open={openMenu === user.id}
          onToggle={onToggleMenu}
        />
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────────────────────────────
// Mobile UserCard
// ─────────────────────────────────────────────────────────────────
function UserCard({ user, openMenu, onToggleMenu }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
          />
          <div>
            <p className="text-sm font-semibold text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <StatusBadge status={user.status} />
          <RowMenu
            user={user}
            open={openMenu === user.id}
            onToggle={onToggleMenu}
          />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-50 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
            Joined
          </p>
          <p className="text-xs text-slate-600">{user.joined}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
            Activity
          </p>
          <div className="space-y-0.5">
            <p className="text-xs text-slate-500">
              Booked:{" "}
              <span className="font-medium text-slate-700">{user.booked}</span>
            </p>
            <p className="text-xs text-slate-500">
              Completed:{" "}
              <span className="font-medium text-slate-700">
                {user.completed}
              </span>
            </p>
            <p className="text-xs text-slate-500">
              Membership:{" "}
              <span className="font-medium text-slate-700">
                {user.membership}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────────────
function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={[
          "fixed top-0 left-0 h-full z-50 w-[200px] bg-white border-r border-slate-100 flex flex-col",
          "transition-transform duration-300 ease-in-out",
          "lg:static lg:translate-x-0 lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <GraduationCap size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800 leading-tight">
                MentorAdmin
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Control Center
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3 flex flex-col gap-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              className={[
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer",
                active
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
              ].join(" ")}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2.5 py-3 border-t border-slate-100">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors text-left">
            <Settings size={15} />
            Settings
          </button>
        </div>
      </aside>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────────
export default function MentorAdminUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [joinedFilter, setJoinedFilter] = useState(null);
  const [activityFilter, setActivityFilter] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const { register, watch } = useForm({ defaultValues: { search: "" } });
  const search = watch("search");

  const filtered = useFilteredUsers({
    search,
    status: statusFilter,
    joined: joinedFilter,
    activity: activityFilter,
  });
  const handleToggleMenu = useCallback(
    (id) => setOpenMenu((p) => (p === id ? null : id)),
    [],
  );
  const hasActiveFilters = !!(
    statusFilter ||
    joinedFilter ||
    activityFilter ||
    search
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* ── Topbar ── */}
          <header className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                aria-label="Open sidebar"
              >
                <Menu size={18} />
              </button>
              <nav className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-medium">Admin</span>
                <ChevronRight size={12} className="text-slate-300" />
                <span className="text-slate-700 font-semibold">Users</span>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              {[
                { Icon: Bell, label: "Notifications" },
                { Icon: HelpCircle, label: "Help" },
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 hover:border-slate-300 transition-all"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </header>

          {/* ── Scrollable content ── */}
          <main className="flex-1 overflow-y-auto">
            <div className="px-4 sm:px-6 py-6 max-w-screen-xl mx-auto w-full">
              {/* Page heading */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Users
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage mentee accounts and platform access.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    2,340
                  </span>
                  <span className="text-xs text-slate-400 ml-1.5">users</span>
                </div>
              </div>

              {/* ── Search + Filters ── */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <div className="relative flex-1 min-w-[180px] max-w-xs">
                  <Search
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    {...register("search")}
                    type="search"
                    placeholder="Search by name or email..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 ml-auto flex-wrap">
                  <Dropdown
                    label="Status"
                    options={STATUS_OPTIONS}
                    value={statusFilter}
                    onChange={setStatusFilter}
                  />
                  <Dropdown
                    label="Joined"
                    options={JOINED_OPTIONS}
                    value={joinedFilter}
                    onChange={setJoinedFilter}
                  />
                  <Dropdown
                    label="Activity"
                    options={ACTIVITY_OPTIONS}
                    value={activityFilter}
                    onChange={setActivityFilter}
                  />

                  {hasActiveFilters && (
                    <button
                      onClick={() => {
                        setStatusFilter(null);
                        setJoinedFilter(null);
                        setActivityFilter(null);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                    >
                      <X size={11} /> Clear
                    </button>
                  )}
                </div>
              </div>

              {/* ── Desktop Table ── */}
              <div className="hidden md:block bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      {["USER", "JOINED", "ACTIVITY", "STATUS", ""].map(
                        (h, i) => (
                          <th
                            key={i}
                            className="px-5 py-3 text-left text-[10.5px] font-bold text-slate-400 uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-16 text-center text-sm text-slate-400"
                        >
                          No users match your filters.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((user) => (
                        <UserRow
                          key={user.id}
                          user={user}
                          openMenu={openMenu}
                          onToggleMenu={handleToggleMenu}
                        />
                      ))
                    )}
                  </tbody>
                </table>

                {filtered.length > 0 && (
                  <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-400">
                      Showing{" "}
                      <span className="font-semibold text-slate-600">
                        {filtered.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-slate-600">
                        2,340
                      </span>{" "}
                      users
                    </p>
                    <div className="flex items-center gap-1">
                      {["1", "2", "3", "…"].map((p) => (
                        <button
                          key={p}
                          className={[
                            "w-7 h-7 rounded-lg text-xs font-semibold transition-colors",
                            p === "1"
                              ? "bg-blue-500 text-white shadow-sm"
                              : "text-slate-400 hover:bg-slate-100 hover:text-slate-700",
                          ].join(" ")}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Mobile Cards ── */}
              <div className="md:hidden space-y-3">
                {filtered.length === 0 ? (
                  <div className="bg-white border border-slate-100 rounded-xl p-12 text-center text-sm text-slate-400 shadow-sm">
                    No users match your filters.
                  </div>
                ) : (
                  filtered.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      openMenu={openMenu}
                      onToggleMenu={handleToggleMenu}
                    />
                  ))
                )}

                {filtered.length > 0 && (
                  <p className="text-center text-xs text-slate-400 pt-1">
                    Showing {filtered.length} of 2,340 users
                  </p>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
