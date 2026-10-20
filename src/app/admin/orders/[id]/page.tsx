import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminOrderById } from "@/lib/admin-data";
import { formatCents } from "@/lib/format";
import { updateOrderStatusAction } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) {
    notFound();
  }

  const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
          <Link href="/admin/orders" className="hover:text-white transition">
            Orders
          </Link>
          <span>/</span>
          <span className="text-cyan-400">Order #{order.id.slice(0, 8)}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Order #{order.id.slice(0, 8)}
            </h1>
            <p className="text-sm text-zinc-400 mt-1">Placed on {dateStr}</p>
          </div>

          <form
            action={async (formData: FormData) => {
              "use server";
              const status = formData.get("status") as string;
              await updateOrderStatusAction(order.id, status);
            }}
            className="flex items-center gap-3"
          >
            <span className="text-xs font-mono text-zinc-400">Fulfillment:</span>
            <select
              name="status"
              defaultValue={order.fulfillmentStatus}
              onChange={(e) => e.target.form?.requestSubmit()}
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-white text-zinc-950 border border-zinc-200 focus:outline-none shadow-sm"
            >
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Purchased Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm text-zinc-950 space-y-6">
          <h2 className="text-lg font-bold tracking-tight text-zinc-950 font-sans">
            Purchased Hardware ({order.items.length})
          </h2>

          <div className="divide-y divide-zinc-100">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="py-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover bg-zinc-100 border border-zinc-200"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center font-mono text-xs text-zinc-400">
                      Hardware
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold text-sm text-zinc-950">
                      {item.name}
                    </h3>
                    <div className="text-xs text-zinc-500 font-mono mt-0.5">
                      <span>SKU: {item.sku}</span>
                      <span className="mx-1.5">•</span>
                      <span>{item.colour}</span>
                    </div>
                    <div className="text-xs text-zinc-700 font-mono mt-1">
                      {formatCents(item.unitPriceCents)} × {item.quantity}
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono font-bold text-sm text-zinc-950">
                  {formatCents(item.lineTotalCents)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-200 pt-4 flex justify-between items-center font-mono">
            <span className="text-sm font-semibold text-zinc-600">
              Total Charged
            </span>
            <span className="text-xl font-bold text-zinc-950">
              {formatCents(order.totalCents)} {order.currency.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Right 1 Col: Customer & Payment Details */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm text-zinc-950">
            <h2 className="text-base font-bold text-zinc-950 font-sans mb-4">
              Customer Account
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="block font-mono uppercase text-[10px] text-zinc-400 mb-0.5">
                  Name
                </span>
                <span className="font-semibold text-zinc-950">
                  {order.user?.name || "Customer"}
                </span>
              </div>

              <div>
                <span className="block font-mono uppercase text-[10px] text-zinc-400 mb-0.5">
                  Contact Email
                </span>
                <span className="font-mono text-zinc-800">{order.email}</span>
              </div>

              <div>
                <span className="block font-mono uppercase text-[10px] text-zinc-400 mb-0.5">
                  Customer ID
                </span>
                <span className="font-mono text-[11px] text-zinc-500">
                  {order.userId}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Processor Details */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm text-zinc-950">
            <h2 className="text-base font-bold text-zinc-950 font-sans mb-4">
              Payment Telemetry
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="block font-mono uppercase text-[10px] text-zinc-400 mb-0.5">
                  Checkout Reference ID
                </span>
                <span className="font-mono text-[11px] text-zinc-800 break-all">
                  {order.stripeCheckoutSessionId}
                </span>
              </div>

              {order.stripePaymentIntentId && (
                <div>
                  <span className="block font-mono uppercase text-[10px] text-zinc-400 mb-0.5">
                    Payment Intent ID
                  </span>
                  <span className="font-mono text-[11px] text-zinc-800 break-all">
                    {order.stripePaymentIntentId}
                  </span>
                </div>
              )}

              <div>
                <span className="block font-mono uppercase text-[10px] text-zinc-400 mb-0.5">
                  Payment Gateway Status
                </span>
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[11px] font-semibold">
                  Captured & Settled
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
