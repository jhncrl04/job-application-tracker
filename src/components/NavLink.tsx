"use client";

import Link, { useLinkStatus } from "next/link";

function Pending({ children }: { children: React.ReactNode }) {
  const { pending } = useLinkStatus();
  return (
    <span
      className={pending ? "opacity-60 motion-safe:animate-pulse" : undefined}
    >
      {children}
    </span>
  );
}

export default function NavLink({
  children,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link {...props}>
      <Pending>{children}</Pending>
    </Link>
  );
}
