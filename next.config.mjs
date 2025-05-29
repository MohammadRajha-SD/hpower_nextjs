import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dashboard.hpower.ae",
      },
      {
        protocol: "https",
        hostname: "hpower.ae",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
