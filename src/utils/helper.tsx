import Image from "next/image";

export function getFeaturesFromDescription(htmlDescription: string): string[] {
  if (typeof document === "undefined") return []; // For SSR compatibility

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlDescription;

  // Extract all <p> tags within the <li> (or directly if no <li> exists)
  const paragraphs = Array.from(tempDiv.querySelectorAll("li p"));

  // Clean up the text content of each paragraph
  return paragraphs
    .map((p) => {
      let text = p.textContent || "";
      // Skip empty paragraphs or those with only <br>
      if (!text.trim() || text.trim() === "<br>") return "";
      // Remove extra whitespace
      text = text.replace(/\s+/g, " ").trim();
      return text;
    })
    .filter((text) => text.length > 0); // Filter out empty strings
}

export const formatCurrency = (
  amount,
  locale: string,
  size: number = 20
) => {
  return (
    <div
      className={`flex justify-center items-center gap-1 ${locale === "en" ? "flex-row-reverse" : ""}`}
    >
      {amount && (
        <span className={`${locale === "ar" ? "mt-1" : ""}`}>
          {amount}
        </span>
      )}

      <Image
        src="/aed.svg"
        width={size}
        height={size}
        alt="AED currency symbol"
        style={{ verticalAlign: "middle" }}
        className="hover:scale-110 transition-transform duration-200"
      />
    </div>
  );
};

export const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-green-200 text-green-800";
    case "pending":
      return " text-yellow-800 !bg-yellow-500 ";
    case "cancelled":
      return "bg-red-200 text-red-800";
    case "refunded":
      return "bg-red-200 text-red-800";
    case "approved":
      return "bg-blue-200 text-blue-800 ";
    case "in progress":
      return "bg-orange-200 text-orange-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export const getStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "paid";
    case "pending":
      return "pending";
    case "cancelled":
      return "cancelled";
    case "approved":
      return "approved";
    case "refunded":
      return "refunded";
    case "in progress":
      return "in_progress";
    default:
      return "pending";
  }
};
export const getInitial = (name: string) =>
  name && typeof name === "string" ? name.charAt(0).toUpperCase() : "U";

export const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};
