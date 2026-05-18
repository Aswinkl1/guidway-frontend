import type { MentorStatus } from "@/features/profile/types/profile.types";
import { useRef, useState } from "react";
import { useMentorProfile } from "./useMentorProfile";
import { useMentorVerifyMutation } from "./useMentorVerifyMutation";

export const useMentorProfileState = (id: string) => {
  const { data: mentor, isPending } = useMentorProfile(id);

  const [status, setStatus] = useState<MentorStatus | undefined>(undefined);
  const [isVerified, setIsVerified] = useState<boolean | undefined>(undefined);
  const [verifying, setVerifying] = useState(false);
  const {
    mutateAsync: mutateAsyncForVerifyMentor,
    isPending: isPendingForVerifyMentor,
  } = useMentorVerifyMutation();
  const initialized = useRef(false);
  console.log(mentor);
  if (mentor && !initialized.current) {
    initialized.current = true;
    setStatus(mentor.status);
    setIsVerified(mentor.isVerified);
  }

  const handleVerify = async (id: string) => {
    console.log(id);
    setVerifying(true);
    try {
      await mutateAsyncForVerifyMentor(id);
      setIsVerified(true);
    } finally {
      setVerifying(false);
    }
  };

  return {
    mentor,
    status,
    isPending,
    isVerified,
    verifying,
    handleVerify,
  };
};
