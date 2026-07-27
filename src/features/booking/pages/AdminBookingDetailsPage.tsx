import { useState } from "react";

import {
  MoreVertical,
  ArrowLeft,
  Calendar,
  Clock,
  IndianRupee,
  Star,
  User,
  UserCog,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BOOKING_STATUS, type BookingStatus } from "../types/booking.types";
import type {
  AdminBookingDetailsOutput,
  BookingEventType,
} from "../types/adminBooking.types";
import { useParams } from "react-router";
import { useAdminBookingDetailUsecase } from "../hooks/useAdminBookingDetails.usecase";

// TODO(Asiwn): swap these for your RTK Query hooks
// const { data, isLoading, isError } = useGetAdminBookingDetailsQuery(bookingId);
// const [updateStatus] = useUpdateBookingStatusMutation();
// const [refundMentor] = useRefundMentorMutation();
// const [refundUser] = useRefundUserMutation();

const STATUS_STYLES: Record<BookingStatus, string> = {
  // [BOOKING_STATUS.PENDING]: "bg-amber-50 text-amber-700 border-amber-200",
  [BOOKING_STATUS.CONFIRMED]: "bg-blue-50 text-blue-700 border-blue-200",
  [BOOKING_STATUS.COMPLETED]:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  [BOOKING_STATUS.CANCELLED]: "bg-slate-100 text-slate-600 border-slate-200",
  // [BookingStatus.REFUNDED]: "bg-rose-50 text-rose-700 border-rose-200",
  // [BookingStatus.NO_SHOW]: "bg-orange-50 text-orange-700 border-orange-200",
};

const STATUS_OPTIONS = Object.values(BOOKING_STATUS) as BookingStatus[];

function formatDateTime(date: Date) {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function PersonCard({
  role,
  name,
  profileImageKey,
}: {
  role: "Mentee" | "Mentor";
  name: string;
  profileImageKey: string | null;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
      <Avatar className="h-11 w-11">
        <AvatarImage src={profileImageKey ?? undefined} alt={name} />
        <AvatarFallback className="bg-violet-100 text-violet-700">
          {initials(name)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {role}
        </p>
        <p className="text-sm font-semibold text-slate-900">{name}</p>
      </div>
    </div>
  );
}

function bookingEventLabel(type: BookingEventType) {
  // TODO(Asiwn): confirm final copy per event type
  return type
    .toString()
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

interface AdminBookingDetailsPageProps {
  booking?: AdminBookingDetailsOutput;
  isLoading?: boolean;
  isError?: boolean;
}

export default function AdminBookingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // TODO(Asiwn): replace props above with your query hook result, e.g.
  // const { data: booking, isLoading, isError } = useGetAdminBookingDetailsQuery(bookingId!);
  const {
    data: booking,
    isLoading,
    isError,
  } = useAdminBookingDetailUsecase(id ?? "");

  const handleStatusChange = async (status: BookingStatus) => {
    setIsUpdatingStatus(true);
    try {
      // TODO(Asiwn): await updateStatus({ bookingId, status }).unwrap();
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRefundMentor = async () => {
    // TODO(Asiwn): await refundMentor({ bookingId }).unwrap();
  };

  const handleRefundUser = async () => {
    // TODO(Asiwn): await refundUser({ bookingId }).unwrap();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-400">
        Loading booking details…
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-center">
        <p className="text-sm font-medium text-slate-600">
          Couldn't load this booking.
        </p>
        <p className="text-sm text-slate-400">
          Check the booking ID or try again.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" className="mt-0.5">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-slate-900">
                {booking.sessionTitle}
              </h1>
              <Badge
                variant="outline"
                className={STATUS_STYLES[booking.status]}
              >
                {booking.status}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Booking ID: {booking.id}
            </p>
          </div>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isUpdatingStatus}
              className="gap-1.5"
            >
              Actions
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <p className="px-2 py-1.5 text-xs font-medium text-slate-400">
              Change status
            </p>
            {STATUS_OPTIONS.map((status) => (
              <DropdownMenuItem
                key={status}
                disabled={status === booking.status}
                onClick={() => handleStatusChange(status)}
              >
                {status}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleRefundMentor}>
              Refund mentor
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleRefundUser}
              className="text-rose-600 focus:text-rose-600"
            >
              Refund user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Participants */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <PersonCard
          role="Mentee"
          name={booking.user.name}
          profileImageKey={booking.user.profileImageKey}
        />
        <PersonCard
          role="Mentor"
          name={booking.mentor.name}
          profileImageKey={booking.mentor.profileImageKey}
        />
      </div>

      {/* Session info */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">
          Session details
        </h2>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <Calendar className="mt-0.5 h-4 w-4 text-slate-400" />
            <div>
              <dt className="text-xs text-slate-400">Starts</dt>
              <dd className="text-sm text-slate-700">
                {formatDateTime(booking.startDateTime)}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="mt-0.5 h-4 w-4 text-slate-400" />
            <div>
              <dt className="text-xs text-slate-400">Ends</dt>
              <dd className="text-sm text-slate-700">
                {formatDateTime(booking.endDateTime)}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="mt-0.5 h-4 w-4 text-slate-400" />
            <div>
              <dt className="text-xs text-slate-400">Duration</dt>
              <dd className="text-sm text-slate-700">{booking.duration}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <IndianRupee className="mt-0.5 h-4 w-4 text-slate-400" />
            <div>
              <dt className="text-xs text-slate-400">Amount</dt>
              <dd className="text-sm text-slate-700">
                {formatAmount(booking.amount, booking.currency)}
              </dd>
            </div>
          </div>
        </dl>

        {booking.note && (
          <div className="mt-4 rounded-md bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-400">Note</p>
            <p className="mt-1 text-sm text-slate-700">{booking.note}</p>
          </div>
        )}
      </div>

      {/* Review */}
      {booking.review && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-900">Review</h2>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < booking.review!.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-200"
                }`}
              />
            ))}
          </div>
          {booking.review.comment && (
            <p className="mt-2 text-sm text-slate-600">
              {booking.review.comment}
            </p>
          )}
        </div>
      )}

      {/* Event timeline */}
      {booking.bookingEvent && booking.bookingEvent.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">
            Activity Log
          </h2>

          {/* Added relative positioning and a 'before' pseudo-element to create a vertical timeline line */}
          <ul className="relative space-y-4 before:absolute before:left-[15px] before:top-2 before:-z-10 before:h-[calc(100%-24px)] before:w-[2px] before:bg-slate-100">
            {booking.bookingEvent.map((event) => (
              <li key={event.id} className="relative flex items-start gap-3">
                {/* Improved icon container with a white ring to cut out the timeline line behind it */}
                <div className="relative z-10 mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 text-violet-600 ring-4 ring-white">
                  {event.actorId === booking.mentorId ? (
                    <UserCog className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>

                <div className="flex-1 pb-2">
                  <p className="text-sm text-slate-700">
                    <span className="font-medium text-slate-900">
                      {event.actorName}
                    </span>{" "}
                    {bookingEventLabel(event.type)}
                  </p>

                  {/* Render metadata as a flex grid of clean, readable badges */}
                  {Object.keys(event.metaData || {}).length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {Object.entries(event.metaData || {}).map(([k, v]) => (
                        <div
                          key={k}
                          className="flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1.5 text-[11px] sm:text-xs ring-1 ring-inset ring-slate-200/60"
                        >
                          {/* The Regex puts a space before capitals, and 'capitalize' handles the casing */}
                          <span className="font-medium capitalize text-slate-500">
                            {k.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span className="font-medium text-slate-700">
                            {formatDateTime(new Date(v))}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
