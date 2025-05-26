//=====ar=====
const defaultMetaDataAr = {
  title: "HPOWER | H POWER FZ - LLC",
  description: "H POWER FZ - LLC",
  keywords: ["HPOWER", "الامارات"],
};

export const arMetaData = {
  title: {
    template: `HPOWER | H POWER FZ - LLC`,
    default: `HPOWER | H POWER FZ - LLC`,
  },
  description: defaultMetaDataAr.description,
  charset: "UTF-8",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  keywords: defaultMetaDataAr.keywords.join(", "),
  canonical: "",
  icons: {
    icon: ["/favicon.ico"],
  },
  og: {
    title: defaultMetaDataAr.title,
    description: defaultMetaDataAr.description,
    locale: "ar",
    site_name: `HPOWER | H POWER FZ - LLC`,
  },
  twitter: {
    card: "summary_large_image",
    site: "HPOWER",
    title: defaultMetaDataAr.title,
    description: defaultMetaDataAr.description,
    image: "",
  },
  author: `HPOWER | H POWER FZ - LLC`,
  publisher: "HPOWER",
  manifest: "/manifest.json",
  alternates: [
    { hrefLang: "en", href: "" },
    { hrefLang: "ar", href: "" },
  ],
  openGraph: {
    type: "website",
    title: `HPOWER | H POWER FZ - LLC`,
    description: "HPOWER",
    url: "",
    images: [
      {
        url: "",
        width: 800,
        height: 600,
        alt: "HPOWER",
      },
    ],
  },
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HPOWER",
    url: "",
    logo: "",
  },
};
