// lib/admin.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const list = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  const ok = !!session?.user?.email && list.includes(session.user.email.toLowerCase());
  if (!ok) throw new Error("FORBIDDEN");
  return session;
}
