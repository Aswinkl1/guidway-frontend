export interface BookingSetupDetailsOutput {
  mentor: {
    id: string;
    name: string;
    avatarUrl?: string;
    slotDurationMinutes: number;
  };
  session: {
    id: string;
    title: string;
    duration: number;
    price: number;
  };
}

export const CURRENCIES = {
  INR: "INR", // India
  USD: "USD", // United States
  EUR: "EUR", // European Union
  GBP: "GBP", // United Kingdom
  JPY: "JPY", // Japan
  CNY: "CNY", // China
  AUD: "AUD", // Australia
  CAD: "CAD", // Canada
  CHF: "CHF", // Switzerland
  SGD: "SGD", // Singapore
} as const;

export type CreateOrderResponse = {
  orderId: string;
  amount_due: number;
  currency: string;
  slotId: string;
};

export type RazorpayPaymentDetails = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type VerifyPaymentPayload = {
  provider: "RAZORPAY";
  gatewayOrderId: string;
  gatewayPaymentId: string;
  gatewaySignature: string;
};

// booking.types.ts
// Shared types for the sessions (bookings) feature — hosting & attending tabs.

export const BOOKING_STATUS = {
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
} as const;

export type BookingStatus =
  (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

// export type SessionRole = "hosting" | "attending";
export const SessionRole = {
  HOSTING: "hosting",
  ATTENDING: "attending",
} as const;

export type SessionRole = (typeof SessionRole)[keyof typeof SessionRole];

export interface BookingUser {
  name: string;
  profileImageKey: string | null;
}

export interface Booking {
  id: string;
  sessionTitle: string;
  status: BookingStatus;
  startTime: Date;
  endTime: Date;
  duration?: string;
  user: BookingUser;
}

export interface GetAllBookingMeta {
  totalPages: number;
  page: number;
  limit: number;
  totalCount: number;
}

export interface GetAllBookingOutput {
  data: Booking[];
  meta: GetAllBookingMeta;
}

/** Query params sent to the backend — mirrors getAllBookingSchema, plus `role`. */
export interface GetAllBookingParams {
  role: SessionRole;
  search: string;
  page: number;
  limit: number;
  status: BookingStatus;
}

/** Per-tab UI filter state (everything except page, which the infinite query owns). */
export interface SessionFilterState {
  search: string;
  status: BookingStatus;
  page: number;
  limit: number;
}

export const DEFAULT_SESSION_FILTER_STATE: SessionFilterState = {
  search: "",
  status: BOOKING_STATUS.CONFIRMED,
  page: 1,
  limit: 5,
};

export const DEFAULT_PAGE_LIMIT = 2;
