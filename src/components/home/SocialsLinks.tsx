import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";

const SocialLinks = ({ width, sizeIcon }) => {
  // Format the WhatsApp number: remove '+' and spaces
  const whatsappNumber = "971506164629"; // Remove '+' and spaces from +971 50 616 4629

  return (
    <div className={`flex justify-between items-center ${width}`}>
      <Link href="https://www.facebook.com/hpower.ae" aria-label="Facebook">
        <FaFacebook
          size={sizeIcon}
          className="text-interactive_color hover:text-blue-700"
        />
      </Link>
      {/* <Link href="/" aria-label="Twitter">
        <RiTwitterXFill
          size={sizeIcon}
          className="text-interactive_color hover:text-black"
        />
      </Link> */}
      <Link href="https://www.instagram.com/hpower.ae" aria-label="Instagram">
        <FaInstagram
          size={sizeIcon}
          className="text-interactive_color hover:text-active_color"
        />
      </Link>
      {/* <Link href="/" aria-label="LinkedIn">
        <FaLinkedin
          size={sizeIcon}
          className="text-interactive_color hover:text-blue-400"
        />
      </Link> */}
      <Link
        href={`https://wa.me/${whatsappNumber}`} // WhatsApp link
        target="_blank" // Open in new tab
        rel="noopener noreferrer" // Security for external links
        aria-label="WhatsApp"
      >
        <FaWhatsapp
          size={sizeIcon}
          className="text-interactive_color hover:text-green-500"
        />
      </Link>
    </div>
  );
};

export default SocialLinks;
