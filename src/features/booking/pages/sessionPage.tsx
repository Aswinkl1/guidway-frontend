import {
  RoleTabs,
  StatusFilter,
  SessionSearchBar,
  SessionCardSkeleton,
  EmptySessionState,
  SessionCard,
  LoadMoreButton,
} from "@/components/shared/sessions";
import { useState } from "react";
import { useBookings } from "../hooks/useBookings";
import {
  type SessionFilterState,
  DEFAULT_SESSION_FILTER_STATE,
  type SessionRole,
  DEFAULT_PAGE_LIMIT,
} from "../types/booking.types";
import { useNavigate } from "react-router";

/**
 * Each tab (hosting / attending) keeps its own search + status filter state,
 * so switching tabs never resets or mixes up the other tab's filters.
 */
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
  const naviagate = useNavigate();
  const [role, setRole] = useState<SessionRole>("hosting");
  const tabState = useSessionTabState();
  const { filter, setFilter } = tabState[role];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useBookings({
      role,
      search: filter.search,
      status: filter.status,
      limit: DEFAULT_PAGE_LIMIT,
    });

  const bookings = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">My Sessions</h1>
      <p className="mt-1 text-sm text-slate-500">
        Manage your upcoming and past sessions
      </p>

      <div className="mt-6">
        <RoleTabs value={role} onChange={setRole} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <StatusFilter
          value={filter.status}
          onChange={(status) => setFilter((prev) => ({ ...prev, status }))}
        />
        <SessionSearchBar
          value={filter.search}
          onChange={(search) => setFilter((prev) => ({ ...prev, search }))}
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
                // TODO(Asiwn): open/redirect to the session's video room.
                console.log("join", b.id);
              }}
              onReschedule={(b) => {
                // TODO(Asiwn): open reschedule modal.
                console.log("reschedule", b.id);
              }}
              onCancel={(b) => {
                // TODO(Asiwn): call cancel mutation, then invalidate ["bookings", role, ...].
                console.log("cancel", b.id);
              }}
              onViewDetails={(b) => {
                // TODO(Asiwn): navigate to session details page.
                naviagate("/mentor/bookings/" + b.id);
                console.log("view details", b.id);
              }}
            />
          ))}
      </div>

      {hasNextPage && (
        <div className="mt-6">
          <LoadMoreButton
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
          />
        </div>
      )}
    </div>
  );
}
