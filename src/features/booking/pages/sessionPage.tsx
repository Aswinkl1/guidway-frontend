import {
  RoleTabs,
  StatusFilter,
  SessionSearchBar,
  SessionCardSkeleton,
  EmptySessionState,
  SessionCard,
} from "@/components/shared/sessions";
import { useState } from "react";
import { useBookings } from "../hooks/useBookings";
import {
  type SessionFilterState,
  DEFAULT_SESSION_FILTER_STATE,
  DEFAULT_PAGE_LIMIT,
  SessionRole,
} from "../types/booking.types";
import { useNavigate } from "react-router"; // (or react-router-dom depending on your setup)

import { Role } from "@/types/role";
import { useAppSelector } from "@/app/store/store";

function useSessionTabState() {
  const [hostingFilter, setHostingFilter] = useState<SessionFilterState>(
    DEFAULT_SESSION_FILTER_STATE,
  );
  const [attendingFilter, setAttendingFilter] = useState<SessionFilterState>(
    DEFAULT_SESSION_FILTER_STATE,
  );

  return {
    hosting: { filter: hostingFilter, setFilter: setHostingFilter },
    attending: { filter: attendingFilter, setFilter: setAttendingFilter },
  };
}

export function SessionsPage() {
  const userRole = useAppSelector((state) => state.auth.role);
  const navigate = useNavigate();
  const DefaultSessionRole =
    userRole === Role.MENTEE ? SessionRole.ATTENDING : SessionRole.HOSTING;
  const [role, setRole] = useState<SessionRole>(DefaultSessionRole);
  const tabState = useSessionTabState();
  const { filter, setFilter } = tabState[role];

  const { data, isLoading, isFetching } = useBookings({
    role,
    search: filter.search,
    status: filter.status,
    limit: DEFAULT_PAGE_LIMIT,
    page: filter.page || 1,
  });

  const bookings = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">My Sessions</h1>
      <p className="mt-1 text-sm text-slate-500">
        Manage your upcoming and past sessions
      </p>

      <div className="mt-6">
        <RoleTabs value={role} onChange={setRole} role={userRole} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <StatusFilter
          value={filter.status}
          onChange={(status) =>
            // 3. Reset page to 1 when changing filters!
            setFilter((prev) => ({ ...prev, status, page: 1 }))
          }
        />
        <SessionSearchBar
          value={filter.search}
          onChange={(search) =>
            // Reset page to 1 when searching!
            setFilter((prev) => ({ ...prev, search, page: 1 }))
          }
        />
      </div>

      <div className="mt-6 space-y-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <SessionCardSkeleton key={i} />
          ))}

        {!isLoading && bookings.length === 0 && (
          <EmptySessionState role={role} />
        )}

        {!isLoading &&
          bookings.map((booking) => (
            <SessionCard
              key={booking.id}
              booking={booking}
              onJoin={(b) => {
                console.log("join", b.id);
              }}
              onReschedule={(b) => {
                console.log("reschedule", b.id);
              }}
              onCancel={(b) => {
                console.log("cancel", b.id);
              }}
              onViewDetails={(b) => {
                console.log(role);
                if (role === SessionRole.HOSTING) {
                  console.log("i am teh fowser os this thing", b.id);
                  navigate("/mentor/bookings/" + b.id);
                  return;
                }
                navigate("/user/bookings/" + b.id);
              }}
            />
          ))}
      </div>

      {/* 4. Pagination Controls */}
      {!isLoading && meta && meta.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-4">
          <button
            disabled={meta.page <= 1 || isFetching}
            onClick={() =>
              setFilter((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm text-slate-600 font-medium">
            Page {meta.page} of {meta.totalPages}
          </span>

          <button
            disabled={meta.page >= meta.totalPages || isFetching}
            onClick={() =>
              setFilter((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
