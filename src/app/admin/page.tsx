import Link from "next/link";
import { getAdminOverviewStats } from "@/lib/admin-data";
import { formatCents } from "@/lib/format";
import { StatCard } from "@/components/admin/stat-card";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const stats = await getAdminOverviewStats();

  const averageOrderCents =
    stats.totalOrders > 0
      ? Math.round(stats.totalRevenueCents / stats.totalOrders)
      : 0;

  return (
    <div className="space-y-10">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
            System Overview
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            Store Command Center
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time telemetry, catalogue status, and revenue performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            + New Product
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 font-semibold text-xs hover:bg-zinc-800 transition"
          >
            Fulfill Orders
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Gross Revenue"
          value={formatCents(stats.totalRevenueCents)}
          subtitle="Processed volume"
          highlight
          trend={{ value: "+12.4%", isPositive: true }}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          title="Completed Orders"
          value={stats.totalOrders}
          subtitle="All-time orders"
          trend={{ value: "Stable", isPositive: true }}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
        />

        <StatCard
          title="Avg Order Value (AOV)"
          value={formatCents(averageOrderCents)}
          subtitle="Revenue / order"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />

        <StatCard
          title="Active Inventory"
          value={`${stats.totalProducts} pieces`}
          subtitle={
            stats.lowStockCount > 0
              ? `${stats.lowStockCount} items low in stock`
              : "Healthy stock levels"
          }
          trend={
            stats.lowStockCount > 0
              ? { value: `${stats.lowStockCount} alert`, isPositive: false }
              : undefined
          }
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
      </div>

      {/* Main Grid: Recent Orders & Inventory Replenishment Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Orders Feed (2 cols) */}
        <div className="lg:col-span-2 bg-white text-zinc-950 rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-zinc-950">
                Recent Orders
              </h2>
              <p className="text-xs text-zinc-500">
                Latest customer purchases and payment statuses.
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-zinc-900 hover:text-cyan-600 transition"
            >
              View all orders →
            </Link>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-100 font-mono text-[11px] uppercase text-zinc-400">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-400">
                      No customer orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3.5 px-3 font-mono text-zinc-900">
                        #{ord.id.slice(0, 8)}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-zinc-900">{ord.email}</div>
                        <div className="text-[10px] text-zinc-400">
                          {ord.itemCount} {ord.itemCount === 1 ? "item" : "items"}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-zinc-900">
                        {formatCents(ord.totalCents)}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono capitalize ${
                            ord.fulfillmentStatus === "delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : ord.fulfillmentStatus === "shipped"
                              ? "bg-cyan-100 text-cyan-800"
                              : "bg-zinc-100 text-zinc-800"
                          }`}
                        >
                          {ord.fulfillmentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Link
                          href={`/admin/orders/${ord.id}`}
                          className="px-2.5 py-1 rounded bg-zinc-100 text-zinc-800 text-[11px] hover:bg-zinc-950 hover:text-white transition"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Low Stock / Action Items */}
        <div className="bg-white text-zinc-950 rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-zinc-950">
                Low Stock Alert
              </h2>
              <p className="text-xs text-zinc-500">
                Items requiring replenishment.
              </p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-zinc-900 hover:text-cyan-600 transition"
            >
              All →
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 mt-4 flex-1">
            {stats.lowStockItems.length === 0 ? (
              <div className="py-10 text-center text-xs text-zinc-400">
                All inventory is well-stocked!
              </div>
            ) : (
              stats.lowStockItems.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-zinc-100 border border-zinc-200 flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-zinc-900 truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500">
                        {item.sku}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`font-mono text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
                      item.stockQuantity === 0
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.stockQuantity} left
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="pt-6 border-t border-zinc-100 mt-auto">
            <Link
              href="/admin/products"
              className="w-full block text-center py-2.5 rounded-xl bg-zinc-950 text-white font-semibold text-xs hover:bg-zinc-800 transition"
            >
              Manage Inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
