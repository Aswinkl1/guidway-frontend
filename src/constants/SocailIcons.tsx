import type { JSX } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaGithub,
  FaTiktok,
  FaPinterest,
  FaGlobe,
} from "react-icons/fa";

export const SOCIAL_ICONS: Record<string, JSX.Element> = {
  facebook: <FaFacebook color="#1877F2" />,
  instagram: <FaInstagram color="#E4405F" />,
  twitter: <FaTwitter color="#1DA1F2" />,
  linkedin: <FaLinkedin color="#0A66C2" />,
  youtube: <FaYoutube color="#FF0000" />,
  github: <FaGithub color="#181717" />,
  tiktok: <FaTiktok color="#000000" />,
  pinterest: <FaPinterest color="#E60023" />,
  website: <FaGlobe color="#555555" />,
};

export function getSocialIcon(platform: string): JSX.Element {
  return SOCIAL_ICONS[platform] ?? SOCIAL_ICONS["website"]; // fallback
}
