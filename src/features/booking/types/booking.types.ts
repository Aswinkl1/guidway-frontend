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
};
