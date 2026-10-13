import Sidebar from "@/components/ui/Nav/Sidebar";
import { getInitialUser, login } from "@/lib/data/identity/auth";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side user fetching and authentication
  // Uncomment the following lines to enable server-side user fetching and authentication
  // BFF Endpoint needs to be available and properly configured for server-side user fetching
  const user = await getInitialUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 px-10 py-12">{children}</main>
    </div>
  );
}
