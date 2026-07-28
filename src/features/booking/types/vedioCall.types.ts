export const WEBRTC_EVENTS = {
  USER_JOINED: "user-joined",
  SIGNALING_MESSAGE: "signaling-message",
} as const;

export const SignalingType = {
  OFFER: "offer",
  ANSWER: "answer",
  ICE_CANDIDATE: "ice-candidate",
} as const;
export type SignalingType = (typeof SignalingType)[keyof typeof SignalingType];
export interface SignalingMessage {
  type: SignalingType;
  data: any;
}
