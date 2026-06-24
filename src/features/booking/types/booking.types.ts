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
