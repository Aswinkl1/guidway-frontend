import { useSelector } from "react-redux";
import BookingPageComponent from "../components/BookingComponent";
import { useState } from "react";
import { useSlots } from "../hooks/useSlots";
import { useParams } from "react-router";
import { format } from "date-fns";

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );
  const { id } = useParams();
  const { data, isPending } = useSlots(id, selectedDate);

  function handleDateChange(date: Date) {
    const formattedDate = format(date, "yyyy-MM-dd");
    setSelectedDate(formattedDate);
    console.log("yep");
  }

  function handleOnBook(date, slots) {
    console.log(data);
  }
  return (
    <>
      <BookingPageComponent
        availableSlots={data ?? []}
        mentor={{ name: "adkfkl", title: "kldfkladkl" }}
        onAddNote={() => {}}
        onBookNow={handleOnBook}
        onDateChange={handleDateChange}
        session={{
          durationPerSlot: 40,
          pricePerSlot: 123,
          type: "session",
          currencySymbol: "$",
        }}
      />
    </>
  );
};

export default BookingPage;
