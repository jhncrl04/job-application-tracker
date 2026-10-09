"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

export default function LoadingBoundary({
  fallback,
  children,
}: {
  fallback: React.ReactNode;
  children: React.ReactNode;
}) {
  const key = useSearchParams().toString();
  return (
    <Suspense key={key} fallback={fallback}>
      {children}
    </Suspense>
  );
}
