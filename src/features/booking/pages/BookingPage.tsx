import BookingPageComponent from "../components/BookingComponent";
import { useState } from "react";
import { useSlots } from "../hooks/useSlots";
import { useParams, useSearchParams } from "react-router";
import { format } from "date-fns";
import { useBookingSetupDetails } from "../hooks/useGetBookingSetupDetails";

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId") || "sessionId";
  console.log(searchParams, "searchParams");
  const { id } = useParams();
  if (!id || !sessionId) {
    // Option A: Render a clean error component
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2>Invalid Booking Link</h2>
        <p>This booking link is broken or missing information.</p>
        <a href="/">Go back home</a>
      </div>
    );
  }
  const { data, isPending } = useSlots(id, selectedDate);
  const { data: bookingSetupDetails, isPending: isBookingSetupDetailsPending } =
    useBookingSetupDetails(id, sessionId);
  function handleDateChange(date: Date) {
    const formattedDate = format(date, "yyyy-MM-dd");
    setSelectedDate(formattedDate);
    console.log("yep");
  }

  function handleOnBook(date, slots) {
    console.log(" date adn slots", date, slots);
    const totalPrice = (bookingSetupDetails?.session.price ?? 0) * slots.length;
  }
  return (
    <>
      <BookingPageComponent
        availableSlots={data ?? []}
        mentor={{
          name: bookingSetupDetails?.mentor.name ?? "",
          title: "kldfkladkl",
          avatarUrl: bookingSetupDetails?.mentor.avatarUrl ?? "",
        }}
        onAddNote={() => {}}
        onBookNow={handleOnBook}
        onDateChange={handleDateChange}
        session={{
          durationPerSlot: bookingSetupDetails?.mentor.slotDurationMinutes ?? 0,
          pricePerSlot: bookingSetupDetails?.session.price ?? 0,
          type: bookingSetupDetails?.session.title ?? "",
          currencySymbol: "$",
        }}
      />
    </>
  );
};

export default BookingPage;
