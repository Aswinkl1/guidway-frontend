import type { MentorStatus } from "@/features/profile/types/profile.types";
import { useRef, useState } from "react";
import { useMentorProfile } from "./useMentorProfile";
import { useMentorVerifyMutation } from "./useMentorVerifyMutation";
import { useMentorStatus } from "./useMentorStatusMutation";

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
  const { mutateAsync: mutateAsyncForMentorStatus } = useMentorStatus();
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

  const handleStatusChange = (id, v) => {
    console.log(v);
    setStatus(v);
    mutateAsyncForMentorStatus({ id, status: v });
  };

  return {
    mentor,
    status,
    isPendingForVerifyMentor,
    isVerified,
    isPending,
    verifying,
    handleVerify,
    handleStatusChange,
  };
};
