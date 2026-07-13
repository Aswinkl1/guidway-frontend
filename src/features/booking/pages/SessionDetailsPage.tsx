// pages/SessionDetailPage.tsx
import { useState } from "react";
import { ArrowLeft, StickyNote } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  MentorInfoCard,
  SessionInfoGrid,
  InfoCard,
  MentorFeedbackCard,
  ReviewCard,
  ManageSessionPanel,
  PaymentCard,
} from "@/components/session-details";
import { StatusBadge } from "@/components/shared/sessions";
import { useSessionDetail } from "../hooks/useBookingDetails";
import { useLocation, useNavigate, useParams } from "react-router";
import { SessionRole } from "../types/booking.types";

interface SessionDetailPageProps {
  bookingId: string;
  /** Called from the "‹ My Sessions" breadcrumb / back arrow. */
  onBack: () => void;
}

export function BookingDetailPage() {
  const params = useParams();
  const location = useLocation();
  const role: SessionRole = location.pathname.includes("/user/")
    ? SessionRole.ATTENDING
    : SessionRole.HOSTING;
  const { data: session, isLoading } = useSessionDetail(params.id, role);
  const [isReviewOpen, setReviewOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  if (isLoading || !session) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-slate-400">
        Loading session…
      </div>
    );
  }

  /* --------------------------------------------------------------
   * Button actions — each one documents what it SHOULD do.
   * Wire the actual mutation / navigation logic where marked TODO.
   * ------------------------------------------------------------ */

  function handleViewProfile() {
    // TODO(Asiwn): navigate to the mentor's public profile page, e.g.
    // navigate(`/mentors/${session.mentorId}`)
  }

  function handleReport() {
    // TODO(Asiwn): open a "Report Session" modal (reason + description),
    // then POST to something like /bookings/:id/report.
    // This should NOT change booking status — it just flags it for admin review.
  }

  function handleMessageMentor() {
    // TODO(Asiwn): navigate to /messages?with=<mentorId>, opening (or creating)
    // the DM thread with this mentor.
  }

  function handleReschedule() {
    // TODO(Asiwn): open your existing reschedule flow (TimeRangeModal etc.)
    // scoped to this booking. On confirm, call a `rescheduleBooking` mutation
    // with the new start/end time, then invalidate:
    //   queryClient.invalidateQueries({ queryKey: ["session-detail", bookingId] })
    //   queryClient.invalidateQueries({ queryKey: ["bookings"] })
    // Only enable this button while status is CONFIRMED.
  }

  function handleCancel() {
    // TODO(Asiwn): show a confirmation dialog ("Are you sure you want to
    // cancel this session?"), then call a `cancelBooking` mutation with
    // bookingId. On success, invalidate the same two query keys as above.
    // Only enable this button while status is CONFIRMED.
  }

  function handleSubmitReview(values: LeaveReviewDto) {
    // TODO(Asiwn): call a `submitReview` mutation with { bookingId, ...values }.
    // This endpoint doesn't exist on MenteeBookingDetailsOutput yet — you'll
    // need a POST /bookings/:id/review, and to either add the saved review
    // to this response or fetch it separately in useSessionDetail.
    // On success, invalidate:
    //   queryClient.invalidateQueries({ queryKey: ["session-detail", bookingId] })
    setReviewOpen(false);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <button
        type="button"
        onClick={() => {
          navigate(-1);
        }}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        My Sessions
      </button>

      <div className="mt-3 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Session Details
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Booking ID: #{session.id}
          </p>
        </div>
        <StatusBadge status={session.status} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <MentorInfoCard
            user={session.user}
            onViewProfile={handleViewProfile}
          />
          <SessionInfoGrid
            sessionTitle={session.sessionTitle}
            duration={session.duration}
            startDateTime={session.startDateTime}
            endDateTime={session.endDateTime}
            status={session.status}
          />

          {/*
					  The design also has a "What This Session Covers" card, but
					  MenteeBookingDetailsOutput has no field for it (only `note`
					  below) — add one on the backend if you want it back, then
					  drop a second InfoCard next to this one.
					*/}
          <InfoCard
            icon={StickyNote}
            title="Your Note to Mentor"
            text={session.note}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/*
						  Neither feedback nor review exist on this DTO yet — see
						  the comment in session-detail.types.ts. Passing undefined
						  renders each card's empty state.
						*/}
            <MentorFeedbackCard feedback={undefined} />
            <ReviewCard
              review={undefined}
              onLeaveReview={() => setReviewOpen(true)}
            />
          </div>
        </div>

        <div>
          <ManageSessionPanel
            onReport={handleReport}
            onMessageMentor={handleMessageMentor}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
          />
          <PaymentCard amount={session.amount} currency={session.currency} />
        </div>
      </div>

      {/* <LeaveReviewModal
        isOpen={isReviewOpen}
        onClose={() => setReviewOpen(false)}
        onSubmit={handleSubmitReview}
      /> */}
    </div>
  );
}
