import Sidebar from "@/components/ui/Nav/Sidebar";
import { getCurrentUser } from "@/lib/session";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getCurrentUser();

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 px-10 py-12">{children}</main>
    </div>
  );
}
