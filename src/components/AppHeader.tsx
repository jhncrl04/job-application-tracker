import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default function AppHeader({
  title,
  switchTo,
  children,
}: {
  title: string;
  switchTo: { href: string; label: string };
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-4">
        <Link
          href={switchTo.href}
          className="text-sm font-medium hover:underline"
        >
          {switchTo.label}
        </Link>
        <SignOutButton />
        {children}
      </div>
    </header>
  );
}
