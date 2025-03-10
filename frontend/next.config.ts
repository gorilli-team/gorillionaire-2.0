import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  images: {
    loader: "imgix",
    path: "",
    disableStaticImages: true,
  }
};

export default nextConfig;
