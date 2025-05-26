import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dashboard.manpowerforu.com",
      },
      {
        protocol: "https",
        hostname: "backend.manpowerforu.com",
      },
      {
        protocol: "https",
        hostname: "dashboard.hpower.ae",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
