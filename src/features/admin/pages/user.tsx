import { useState } from "react";
import { Navbar } from "../components/Navbar";
import {
  useUpdateBlockStatus,
  useUserFilter,
  useUsers,
} from "../hooks/useUsers";
import { CircleUser } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
interface User {
  id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isVerified: boolean;
  profileImageUrl: string;
}

// ─── Icon Components ──────────────────────────────────────────────────────────

const EyeIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeWidth="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" strokeWidth="2" />
  </svg>
);

const BlockIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path strokeWidth="2" strokeLinecap="round" d="M4.93 4.93l14.14 14.14" />
  </svg>
);

const UnblockIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeWidth="2"
      strokeLinecap="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeWidth="2"
      strokeLinecap="round"
      d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
    />
  </svg>
);

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg
    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeWidth="2" strokeLinecap="round" d="M6 9l6 6 6-6" />
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminUsersPanel() {
  const { filter, setFilter } = useUserFilter();
  const { data, isLoading } = useUsers(filter);
  const { mutate: updateBlockStatus, isPending } = useUpdateBlockStatus();

  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [verifyDropdownOpen, setVerifyDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setFilter({ search: value });
  }, 500);
  if (isLoading) return <h1>Loading...</h1>;

  const { users, totalItems: totalUsers, totalPages, currentPage } = data;
  console.log("we got data again", data);
  const getPageNums = (): (number | "...")[] => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage < 3) return [1, 2, 3, "...", totalPages];

    if (currentPage >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];

    // Window of 3 starting from currentPage
    return [currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const toggleBlock = (user: User) => {
    updateBlockStatus({ userId: user.id, newBlockStatus: !user.isBlocked });
  };

  const statusLabel = filter.status
    ? filter.status.charAt(0).toUpperCase() + filter.status.slice(1)
    : "All";

  const verifyLabel = filter.Verified
    ? filter.Verified === "true"
      ? "Verified"
      : "Not Verified"
    : "All";

  return (
    <div
      className="flex h-screen bg-gray-50 overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
      onClick={() => {
        setStatusDropdownOpen(false);
        setVerifyDropdownOpen(false);
      }}
    >
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        {/* Page header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Users
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Manage mentee accounts and platform access.
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-gray-900">
              {totalUsers}
            </span>
            <span className="text-sm text-gray-400 ml-1.5">users</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path
                strokeWidth="2"
                strokeLinecap="round"
                d="M21 21l-4.35-4.35"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                debouncedSearch(e.target.value);
                setSearch(e.target.value);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-400"
            />
          </div>

          {/* Status filter */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                setStatusDropdownOpen((o) => !o);
                setVerifyDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-500">Status:</span>
              <span className="font-medium text-gray-800">{statusLabel}</span>
              <ChevronDown open={statusDropdownOpen} />
            </button>

            {statusDropdownOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                {(["All", "Active", "blocked"] as const).map((opt) => {
                  const display = opt.charAt(0).toUpperCase() + opt.slice(1);
                  const isActive =
                    opt === "All" ? !filter.status : filter.status === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        setFilter({ status: opt === "All" ? undefined : opt });
                        setStatusDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {display}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Verified filter */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                setVerifyDropdownOpen((o) => !o);
                setStatusDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-500">Verify:</span>
              <span className="font-medium text-gray-800">{verifyLabel}</span>
              <ChevronDown open={verifyDropdownOpen} />
            </button>

            {verifyDropdownOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                {(
                  [
                    { label: "All", value: null },
                    { label: "Verified", value: "true" },
                    { label: "Not Verified", value: "false" },
                  ] as const
                ).map(({ label, value }) => {
                  const isActive = filter.Verified === value;
                  return (
                    <button
                      key={label}
                      onClick={() => {
                        setFilter({ Verified: value });
                        setVerifyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col style={{ width: "40%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>

            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Verify
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-16 text-gray-400 text-sm"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user: User, idx: number) => (
                  <tr
                    key={user.id}
                    className={`transition-colors hover:bg-gray-50 ${
                      idx < users.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: "black" }}
                        >
                          <CircleUser />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          !user.isBlocked
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            !user.isBlocked ? "bg-green-500" : "bg-red-400"
                          }`}
                        />
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    {/* verified */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          user.isVerified
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {user.isVerified ? "✓ Verified" : "X Unverified"}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
                          <EyeIcon />
                          View
                        </button>

                        {user.isBlocked ? (
                          <button
                            disabled={isPending}
                            onClick={() => toggleBlock(user)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors whitespace-nowrap"
                          >
                            <UnblockIcon />
                            Unblock
                          </button>
                        ) : (
                          <button
                            disabled={isPending}
                            onClick={() => toggleBlock(user)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
                          >
                            <BlockIcon />
                            Block
                          </button>
                        )}

                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 border border-red-100 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap">
                          <TrashIcon />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-1.5 mt-5">
          <button
            onClick={() => setFilter({ page: currentPage - 1 })}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {getPageNums().map((n, i) =>
            n === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="text-gray-400 text-sm px-1"
              >
                ...
              </span>
            ) : (
              <button
                key={n}
                onClick={() => setFilter({ page: n })}
                className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${
                  currentPage === n
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {n}
              </button>
            ),
          )}

          <button
            onClick={() => setFilter({ page: currentPage + 1 })}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
