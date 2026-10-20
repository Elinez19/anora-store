"use client";

import { useState, useTransition } from "react";
import { updateUserRoleAction } from "@/lib/admin-actions";

interface CustomerRoleSelectProps {
  userId: string;
  initialRole: string;
}

export function CustomerRoleSelect({
  userId,
  initialRole,
}: CustomerRoleSelectProps) {
  const [role, setRole] = useState(
    initialRole === "admin" ? "admin" : "customer",
  );
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={role}
      disabled={isPending}
      onChange={(e) => {
        const newRole = e.target.value as "admin" | "customer";
        const previousRole = role;
        setRole(newRole);
        startTransition(async () => {
          const res = await updateUserRoleAction(userId, newRole);
          if (res?.error) {
            alert(res.error);
            setRole(previousRole);
          }
        });
      }}
      className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
        role === "admin"
          ? "bg-cyan-50 border-cyan-200 text-cyan-800"
          : "bg-zinc-100 border-zinc-200 text-zinc-800"
      } focus:outline-none disabled:opacity-50`}
    >
      <option value="customer">Customer</option>
      <option value="admin">Admin</option>
    </select>
  );
}
