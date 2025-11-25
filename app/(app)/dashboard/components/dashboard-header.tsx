import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import DashboardHeaderClient from "./dashboard-header-client";

interface DashboardHeaderProps {
  userId: string;
}

export default async function DashboardHeader({ userId }: DashboardHeaderProps) {
  // Fetch user session data
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user) {
    return null;
  }

  return <DashboardHeaderClient user={session.user} />;
}
