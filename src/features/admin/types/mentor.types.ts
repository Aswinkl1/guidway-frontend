export const MentorStatus = {
  PENDING: "PENDING_REVIEW",
  ACTIVE: "ACTIVE",
  DRAFT: "DRAFT",
  PAUSED: "PAUSED",
  SUSPENDED: "SUSPENDED",
} as const;
export type MentorStatus = (typeof MentorStatus)[keyof typeof MentorStatus];

export const VALID_TRANSITIONS: Record<MentorStatus, MentorStatus[]> = {
  [MentorStatus.DRAFT]: [MentorStatus.PENDING],
  [MentorStatus.PENDING]: [MentorStatus.ACTIVE, MentorStatus.SUSPENDED],
  [MentorStatus.ACTIVE]: [MentorStatus.PAUSED, MentorStatus.SUSPENDED],
  [MentorStatus.PAUSED]: [MentorStatus.ACTIVE, MentorStatus.SUSPENDED],
  [MentorStatus.SUSPENDED]: [MentorStatus.ACTIVE],
};
