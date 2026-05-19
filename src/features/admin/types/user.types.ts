export interface User {
  id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isVerified: boolean;
  profileImageUrl: string;
  mentorId: string | null;
  mentorIsVerified: boolean | null;
  mentorStatus: string | null;
  averageRating: number | null;
}
