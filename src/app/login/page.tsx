"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setPending(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto mt-24 max-w-sm p-6">
      <h1 className="mb-4 text-2xl font-bold">Sign in</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border p-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border p-2"
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={pending}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-[#263d66] disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
