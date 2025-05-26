import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../(allRoutes)/globals.css";
import { El_Messiri } from "next/font/google";
import QueryProvider from "@/actions/QueryProvider";
import { arMetaData } from "@/meta/meta-data";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const elmesiri = El_Messiri({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

//================ Metadata configuration =================
export function generateMetadata({ params }) {
  const locale = params.locale;
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
      className={`${isRTL ? elmesiri.className : "font-sans"} `}
    >
      <QueryProvider>
        <NextIntlClientProvider messages={messages}>
          <body
            className={`${isRTL ? "font-tajawal" : "font-roboto"} bg-gradient-to-r from-white via-[#fde9df] to-white`}
            suppressHydrationWarning={true}
          >
            <div className=" absolute top-0 left-0 bottom-0 leading-5 h-full w-full">
              <div className="">
                {children}
                <div className="flex justify-center self-center z-10"></div>
              </div>

              <svg
                className="absolute bottom-0 left-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
              >
                <path
                  fill="#4D002e"
                  fillOpacity="1"
                  d="M0,0L40,42.7C80,85,160,171,240,197.3C320,224,400,192,480,154.7C560,117,640,75,720,74.7C800,75,880,117,960,154.7C1040,192,1120,224,1200,213.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
                ></path>
              </svg>
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
          </body>
        </NextIntlClientProvider>
      </QueryProvider>
    </html>
  );
}
