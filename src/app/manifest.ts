import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Job Application Tracker",
    short_name: "Applications",
    description: "Track my job applications",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#EEF1F6",
    theme_color: "#2F4B7C",
    icons: [
      {
        src: "/pwa-icon?size=192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-icon?size=512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-icon?size=512&maskable=1",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
