import { useState } from "react";
import { Navbar } from "../components/Navbar";

interface User {
  id: number;
  name: string;
  email: string;
  status: "Unblocked" | "Blocked";
  avatar: string;
  color: string;
}

const initialUsers: User[] = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.c@example.com",
    status: "Unblocked",
    avatar: "SC",
    color: "#ec4899",
  },
  {
    id: 2,
    name: "Alex Rivera",
    email: "alex.r@example.com",
    status: "Unblocked",
    avatar: "AR",
    color: "#3b82f6",
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma.w@example.com",
    status: "Blocked",
    avatar: "EW",
    color: "#a855f7",
  },
  {
    id: 4,
    name: "Michael Ross",
    email: "mike.ross@example.com",
    status: "Unblocked",
    avatar: "MR",
    color: "#f59e0b",
  },
  {
    id: 5,
    name: "Lisa Patel",
    email: "lisa.p@example.com",
    status: "Unblocked",
    avatar: "LP",
    color: "#14b8a6",
  },
  {
    id: 6,
    name: "David Kim",
    email: "david.kim@example.com",
    status: "Blocked",
    avatar: "DK",
    color: "#64748b",
  },
];

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
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Unblocked" | "Blocked"
  >("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModal, setViewModal] = useState<User | null>(null);
  const [deleteModal, setDeleteModal] = useState<User | null>(null);

  const USERS_PER_PAGE = 6;
  const TOTAL_USERS = 2340;

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / USERS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE,
  );

  const toggleBlock = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Blocked" ? "Unblocked" : "Blocked" }
          : u,
      ),
    );
  };

  const confirmDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteModal(null);
  };

  const pageNums = [1, 2, 3];

  return (
    <div
      className="flex h-screen bg-gray-50 overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
      onClick={() => setDropdownOpen(false)}
    >
      {/* ── Sidebar ── */}
      <Navbar />

      {/* ── Main Content ── */}
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
              {TOTAL_USERS.toLocaleString()}
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
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-400"
            />
          </div>

          {/* Status filter */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-500">Status:</span>
              <span className="font-medium text-gray-800">{statusFilter}</span>
              <ChevronDown open={dropdownOpen} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                {(["All", "Unblocked", "Blocked"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setStatusFilter(opt);
                      setDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      statusFilter === opt
                        ? "bg-indigo-50 text-indigo-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
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
              <col style={{ width: "40%" }} />
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
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-16 text-gray-400 text-sm"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                paginated.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`transition-colors hover:bg-gray-50 ${
                      idx < paginated.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: user.color }}
                        >
                          {user.avatar}
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
                          user.status === "Unblocked"
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            user.status === "Unblocked"
                              ? "bg-green-500"
                              : "bg-red-400"
                          }`}
                        />
                        {user.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {/* View */}
                        <button
                          onClick={() => setViewModal(user)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
                        >
                          <EyeIcon />
                          View
                        </button>

                        {/* Block / Unblock */}
                        {user.status === "Blocked" ? (
                          <button
                            onClick={() => toggleBlock(user.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors whitespace-nowrap"
                          >
                            <UnblockIcon />
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleBlock(user.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
                          >
                            <BlockIcon />
                            Block
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteModal(user)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 border border-red-100 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
                        >
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
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {pageNums.map((n) => (
            <button
              key={n}
              onClick={() => setCurrentPage(n)}
              className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${
                currentPage === n
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {n}
            </button>
          ))}

          <span className="text-gray-400 text-sm px-1">...</span>

          <button
            onClick={() => setCurrentPage(10)}
            className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${
              currentPage === 10
                ? "bg-indigo-600 text-white"
                : "text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            10
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </main>

      {/* ── View Modal ── */}
      {viewModal && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setViewModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0"
                style={{ backgroundColor: viewModal.color }}
              >
                {viewModal.avatar}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{viewModal.name}</h3>
                <p className="text-sm text-gray-500">{viewModal.email}</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-5 ${
                viewModal.status === "Unblocked"
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-500"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  viewModal.status === "Unblocked"
                    ? "bg-green-500"
                    : "bg-red-400"
                }`}
              />
              {viewModal.status}
            </span>
            <button
              onClick={() => setViewModal(null)}
              className="w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteModal && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setDeleteModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <TrashIcon />
            </div>
            <h3 className="text-center font-bold text-gray-900 mb-1">
              Delete User
            </h3>
            <p className="text-center text-sm text-gray-500 mb-5">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700">
                {deleteModal.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteModal.id)}
                className="flex-1 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
