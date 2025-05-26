import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "./globals.css";
import { Bungee_Spice, Cairo, El_Messiri, Exo_2 } from "next/font/google";
import QueryProvider from "@/actions/QueryProvider";
import { arMetaData } from "@/meta/meta-data";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/home/Footer";
import { Toaster } from "react-hot-toast";
import ScrollToTopButton from "@/components/ui/ScrollTopArrow";

//================ Font settings =================
const cairo = Exo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const elmesiri = El_Messiri({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

//================ Metadata configuration =================
export function generateMetadata({ params }) {
  const metadata = arMetaData;
  return metadata;
}
//================ Main layout component =================
export default async function LocaleLayout({ children, params: { locale } }) {
  //================ Fetch localized messages =================
  const messages = await getMessages();

  //================ RTL (Right-to-left) setup =================
  const isRTL = locale === "ar";
  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className={`${isRTL ? elmesiri.className : cairo.className} `}
    >
      <QueryProvider>
        <NextIntlClientProvider messages={messages}>
          <body
            className={`${isRTL ? "font-tajawal" : "font-roboto"} bg-gradient-to-r from-white via-[#fde9df] to-white`}
            suppressHydrationWarning={true}
          >
            <Navbar />
            <div className="min-h-[600px]">{children}</div>
            <Footer />
            <ScrollToTopButton />

            <ReactQueryDevtools initialIsOpen={false} />
            <Toaster position="top-center" />
          </body>
        </NextIntlClientProvider>
      </QueryProvider>
    </html>
  );
}
