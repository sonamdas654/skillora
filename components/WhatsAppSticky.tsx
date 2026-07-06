import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./Header";

export default function WhatsAppSticky() {
  return (
    <a
      href={whatsappLink("Hi! I want to discuss a project with Skillora.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] hover:scale-110 transition-transform"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
