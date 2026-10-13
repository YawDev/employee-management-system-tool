import LoginView from "@/components/ui/Auth/LoginView";
import { getInitialUser } from "@/lib/data/identity/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getInitialUser();
  if (user) redirect("/");
  return <LoginView />;
}
