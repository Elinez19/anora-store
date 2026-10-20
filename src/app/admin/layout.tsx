import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Control Studio | Anoraa Store",
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await requireAdmin("/admin");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans antialiased selection:bg-cyan-500 selection:text-zinc-950">
      {/* Permanent / Responsive Side Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminHeader
          user={{
            name: admin.name,
            email: admin.email,
            role: admin.role,
          }}
        />

        {/* Dynamic Page Container: Crisp glossy surfaces against deep obsidian background */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
