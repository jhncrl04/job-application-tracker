import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import RegisterServiceWorker from "@/components/RegisterServiceWorker";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Applications",
  description: "Job application tracker",
  appleWebApp: {
    capable: true,
    title: "Applications",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#2F4B7C",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${figtree.className} antialiased`}>
        {children}
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
