"use client";

import { useTransition } from "react";
import { updateOrderStatusAction } from "@/lib/admin-actions";

interface OrderStatusSelectProps {
  orderId: string;
  initialStatus: string;
  className?: string;
}

export function OrderStatusSelect({
  orderId,
  initialStatus,
  className,
}: OrderStatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={initialStatus}
      disabled={isPending}
      onChange={(e) => {
        const newStatus = e.target.value;
        startTransition(async () => {
          const res = await updateOrderStatusAction(orderId, newStatus);
          if (res?.error) {
            alert(res.error);
          }
        });
      }}
      className={
        className ||
        "px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-zinc-100 border border-zinc-200 text-zinc-800 focus:outline-none disabled:opacity-50"
      }
    >
      <option value="paid">Paid</option>
      <option value="processing">Processing</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}
