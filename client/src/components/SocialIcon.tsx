import { FaDiscord, FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { Globe, Mail } from "lucide-react";

/** Picks an icon from the social network's name, with a sensible fallback. */
export default function SocialIcon({ name, className = "size-4" }: { name: string; className?: string }) {
  const key = name.toLowerCase();
  if (key.includes("github")) return <FaGithub className={className} />;
  if (key.includes("linkedin")) return <FaLinkedinIn className={className} />;
  if (key === "x" || key.includes("twitter")) return <FaXTwitter className={className} />;
  if (key.includes("youtube")) return <FaYoutube className={className} />;
  if (key.includes("discord")) return <FaDiscord className={className} />;
  if (key.includes("instagram")) return <FaInstagram className={className} />;
  if (key.includes("mail")) return <Mail className={className} />;
  return <Globe className={className} />;
}
