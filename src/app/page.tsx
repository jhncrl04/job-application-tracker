import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase-server";
import SignOutButton from "@/components/SignOutButton";
import QuickAddForm from "@/components/QuickAddForm";

export const dynamic = "force-dynamic";

export default async function Home() {
  const auth = await createClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) redirect("/login");

  const { data: apps } = await supabase
    .from("applications")
    .select("*")
    .order("applied_at", { ascending: false });

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Applications</h1>
        <SignOutButton />
      </div>

      <QuickAddForm />

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Company</th>
            <th>Role</th>
            <th>Source</th>
            <th>Applied</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {apps?.map((a) => (
            <tr key={a.id} className="border-b">
              <td className="py-2">{a.company}</td>
              <td>
                {a.job_title}
                {a.needs_review && (
                  <span className="ml-2 rounded bg-yellow-200 px-1 text-xs">
                    Review
                  </span>
                )}
              </td>
              <td>{a.source}</td>
              <td>{new Date(a.applied_at).toLocaleDateString()}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
