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
import { UseCancelBooking } from "../hooks/useCancelBooking";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import RescheduleModal from "../components/RescheduleModa";
import { useBookingSetupDetails } from "../hooks/useGetBookingSetupDetails";
import { format } from "date-fns/format";
import { useSlots } from "../hooks/useSlots";
import type { IAvailableSlot } from "../components/BookingComponent";
import { useReschedule } from "../hooks/useReschedule";
import { rescheduleBookingSchema } from "../dto/reschedule.dto";
import toast from "react-hot-toast";
import {
  AddReviewModal,
  type ReviewFormData,
} from "../components/AddReviewModal";
import { useReview } from "../hooks/useReview";
import { useDeleteReview } from "../hooks/useDeleteReview";

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
  const { mutateAsync } = UseCancelBooking(params.id);
  const [open, setOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const { mutateAsync: mutateAsyncForDeleteReview } = useDeleteReview();
  const { data: bookingSetupDetails, isPending: isBookingSetupDetailsPending } =
    useBookingSetupDetails(session?.mentorId, session?.sessionId);
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );
  console.log("session", session);

  const { mutateAsync: mutateAsyncForAddReview } = useReview();

  const { mutateAsync: mutateAsyncForReschedule } = useReschedule();
  const { data, isPending } = useSlots(session?.mentorId, selectedDate);
  const [openAddReview, setOpenAddReview] = useState(false);
  // if (isBookingSetupDetailsPending || isPending) {
  //   return;
  // }
  console.log(bookingSetupDetails, "bookingSetupDetails");

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

  function handleDateChange(mentorId: string, date: Date) {
    const formattedDate = format(date, "yyyy-MM-dd");
    setSelectedDate(formattedDate);
  }
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

  function handleDeleteReview(id: string) {
    mutateAsyncForDeleteReview(id);
  }

  function handleReschedule(
    mentorId: string,
    date: Date,
    slots: IAvailableSlot[],
  ) {
    const startTime = Math.min(...slots.map((slot) => slot.startTime));
    const endTime = Math.max(...slots.map((slot) => slot.endTime));

    const parsed = rescheduleBookingSchema.safeParse({
      bookingId: session.id,
      startTime,
      endTime,
      date,
    });

    const diffInMs =
      session.endDateTime.getTime() - session.startDateTime.getTime();
    const diffInMinutes = diffInMs / (1000 * 60);
    const slotDurationMinutes = endTime - startTime;
    if (diffInMinutes !== slotDurationMinutes) {
      toast.error(
        "Selected slots duration does not match the original session duration.",
      );
      return;
    }
    console.log(
      diffInMinutes,
      slotDurationMinutes,
      "diffInMinutes, slotDurationMinutes",
    );
    if (!parsed.success) {
      console.error("Invalid reschedule data:", parsed.error);
      return;
    }

    mutateAsyncForReschedule(parsed.data);
    setIsRescheduleOpen(false);
  }

  function handleCancel() {
    mutateAsync({ role, id: session.id });
  }

  function handleSubmitReview(values: ReviewFormData) {
    mutateAsyncForAddReview({
      bookingId: session?.id,
      mentorId: session?.mentorId,
      rating: values.rating,
      comment: values.comment,
    });
  }
  console.log(isRescheduleOpen);
  return (
    <>
      <AddReviewModal
        open={openAddReview}
        onClose={() => setOpenAddReview(false)}
        onSave={handleSubmitReview}
      />
      {isRescheduleOpen ?? (
        <RescheduleModal
          open={isRescheduleOpen}
          onOpenChange={setIsRescheduleOpen}
          availableSlots={data ?? []}
          timezone={Intl.DateTimeFormat().resolvedOptions().timeZone}
          mentorId={session.mentorId}
          onConfirmReschedule={handleReschedule}
          onDateChange={handleDateChange}
          // session={undefined}
          mentor={{
            name: bookingSetupDetails?.mentor.name ?? "",

            title: bookingSetupDetails?.mentor.name ?? "",
            avatarUrl: bookingSetupDetails?.mentor.avatarUrl ?? "",
          }}
          session={{
            durationPerSlot: bookingSetupDetails?.session.duration ?? 1,
            pricePerSlot: bookingSetupDetails?.session.price ?? 0,
            type: bookingSetupDetails?.session.title ?? "",
            currencySymbol: "$",
          }}
        />
      )}

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
                review={session.review}
                onLeaveReview={() => setOpenAddReview(true)}
                onDeleteReview={handleDeleteReview}
              />
            </div>
          </div>
          {open && (
            <ConfirmDialog
              description="This action cannot be undone. Are you sure you want to cancel this booking?"
              onCancel={() => setOpen(false)}
              onConfirm={handleCancel}
              open={open}
              title="Are you sure you want to cancel this booking?"
            />
          )}

          <div>
            <ManageSessionPanel
              onReport={handleReport}
              onMessageMentor={handleMessageMentor}
              onReschedule={() => setIsRescheduleOpen(true)}
              onCancel={() => setOpen(true)}
              status={session.status}
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
    </>
  );
}
