import BookingPageComponent from "../components/BookingComponent";
import { useState } from "react";
import { useSlots } from "../hooks/useSlots";
import { useParams, useSearchParams } from "react-router";
import { constructNow, format } from "date-fns";
import { useBookingSetupDetails } from "../hooks/useGetBookingSetupDetails";
import { holdSlotSchema } from "../dto/createOrder.dto";
import useCreateOrderMutation from "../hooks/useCreateOrder";
import { loadDynamicScript } from "@/helpers/DynamicScriptLoder";
import type { CreateOrderResponse } from "../types/booking.types";

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId") || "sessionId";
  console.log(searchParams, "searchParams");
  const { id } = useParams();

  // if (!id || !sessionId) {
  //   // Option A: Render a clean error component
  //   return (
  //     <div className="flex flex-col items-center justify-center h-screen">
  //       <h2>Invalid Booking Link</h2>
  //       <p>This booking link is broken or missing information.</p>
  //       <a href="/">Go back home</a>
  //     </div>
  //   );
  // }

  const { mutateAsync: createOrderMutation, isLoading: isCreatingOrder } =
    useCreateOrderMutation();
  const { data, isPending } = useSlots(id, selectedDate);
  const { data: bookingSetupDetails, isPending: isBookingSetupDetailsPending } =
    useBookingSetupDetails(id, sessionId);
  function handleDateChange(date: Date) {
    const formattedDate = format(date, "yyyy-MM-dd");
    setSelectedDate(formattedDate);
    console.log("yep");
  }
  async function guessCurrencyByIP(): Promise<string> {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      return data.currency; // Returns "INR", "USD", "EUR", etc.
    } catch (error) {
      return "INR"; // Always provide a fallback
    }
  }

  async function handleOnBook(date, slots) {
    console.log(" date adn slots", date, slots);
    const isScriptLoaded = await loadDynamicScript(
      "https://checkout.razorpay.com/v1/checkout.js",
    );
    if (!isScriptLoaded) return alert("Failed to load payment gateway.");
    const totalPrice = (bookingSetupDetails?.session.price ?? 0) * slots.length;
    const curency = await guessCurrencyByIP(); // Call the function to get the currency
    const startTime = Math.min(...slots.map((slot) => slot.startTime));
    const endTime = Math.max(...slots.map((slot) => slot.endTime));
    const bookingData = holdSlotSchema.parse({
      mentorId: id,
      sessionId: sessionId,
      date: date,
      startTime,
      endTime,
      price: totalPrice,
      currency: curency ?? "USD",
    });

    console.log("bookingData", bookingData);
    try {
      const orderResponse = await createOrderMutation(bookingData);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.amount_due.toString(),
        currency: orderResponse.currency,
        order_id: orderResponse.orderId,
        handler: async function (response: any) {
          // You could even use a SECOND useMutation here for verifying the payment!

          alert("Booking Successful!");
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error creating order:", error);
    }
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
