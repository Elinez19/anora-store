import Link from "next/link";
import { getAdminOrders } from "@/lib/admin-data";
import { formatCents } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

export const dynamic = "force-dynamic";

interface OrdersPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function AdminOrdersPage({
  searchParams,
}: OrdersPageProps) {
  const { search } = await searchParams;
  const orders = await getAdminOrders({ search });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-zinc-500 font-semibold">
            Fulfillment
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 mt-1">
            Orders & Shipments
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Track customer payments, dispatch parcels, and monitor financial transactions.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-zinc-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] flex items-center justify-between">
        <form className="w-full flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              name="search"
              defaultValue={search || ""}
              placeholder="Search by customer email, order ID, or checkout session..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950"
            />
            <svg
              className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition shadow-sm active:scale-[0.98]"
          >
            Search
          </button>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-zinc-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] overflow-hidden text-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 font-mono text-[11px] uppercase text-zinc-500">
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Line Items</th>
                <th className="py-3.5 px-4">Total Charged</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => {
                  const dateStr = new Date(ord.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  );

                  return (
                    <tr
                      key={ord.id}
                      className="hover:bg-zinc-50/80 transition-colors"
                    >
                      <td className="py-4 px-4 font-mono">
                        <div className="font-bold text-zinc-950">
                          #{ord.id.slice(0, 8)}
                        </div>
                        <div className="text-[10px] text-zinc-400">{dateStr}</div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-zinc-950">
                          {ord.user?.name || "Customer"}
                        </div>
                        <div className="text-[11px] font-mono text-zinc-400">
                          {ord.email}
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-zinc-600">
                        {ord.items.length}{" "}
                        {ord.items.length === 1 ? "piece" : "pieces"}
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-zinc-950">
                        {formatCents(ord.totalCents)}
                      </td>

                      <td className="py-4 px-4">
                        <OrderStatusSelect
                          orderId={ord.id}
                          initialStatus={ord.fulfillmentStatus}
                        />
                      </td>

                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/admin/orders/${ord.id}`}
                          className="px-3.5 py-1.5 rounded-lg bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-all shadow-xs active:scale-[0.98]"
                        >
                          Inspect
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
