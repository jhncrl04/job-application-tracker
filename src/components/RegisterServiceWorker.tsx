"use client";

import { useEffect } from "react";

export default function RegisterServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return; // keep local development simple
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
