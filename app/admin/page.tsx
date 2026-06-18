import { getIsAdmin } from "@/lib/admin";
import { getBenchmarks } from "@/lib/benchmarks/getBenchmarks";
import { getToolMetasWithSettings } from "@/lib/tools/settings";
import { AdminDashboard } from "./AdminDashboard";

export const metadata = { title: "Admin — CreatorSuite" };

export default async function AdminPage() {
  const admin = await getIsAdmin();
  if (!admin) {
    return (
      <div className="flex flex-col gap-3 max-w-md">
        <h1 className="font-display text-cs-32">Admin</h1>
        <p className="font-mono text-cs-fg-muted">
          Restricted. Sign in with an owner account (set ADMIN_EMAILS) to manage
          benchmarks and tools.
        </p>
      </div>
    );
  }

  const [bench, tools] = await Promise.all([
    getBenchmarks(),
    getToolMetasWithSettings(),
  ]);

  return <AdminDashboard initialBench={bench} initialTools={tools} />;
}
