import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-braces: middleware guards this too, but never render for a
  // signed-out user.
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="workspace-shell">
      <Nav email={user.email ?? ""} />
      <main className="workspace-main">{children}</main>
    </div>
  );
}

