export interface MentorCardDto {
  userId: string;
  name: string;
  avgRating: number;
  domainId: string;
  headline: string | null;
  isVerified: boolean;
  profileImageKey: string | null;
  reviewCount: number;
  startingAt: number;
}
