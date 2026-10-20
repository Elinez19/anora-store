"use client";

import { signOutAction } from "@/lib/auth-actions";

interface AdminHeaderProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-zinc-200/80 px-6 flex items-center justify-between shadow-[0_1px_15px_rgba(0,0,0,0.02)]">
      {/* Search / Context info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-zinc-200/90 text-xs text-zinc-600 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] text-zinc-700 font-medium">Live Production Neon DB</span>
        </div>
      </div>

      {/* Admin User controls & Actions */}
      <div className="flex items-center gap-4">
        {/* User Pill */}
        <div className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full bg-white/90 border border-zinc-200/90 text-xs shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <div className="w-6 h-6 rounded-full bg-zinc-950 text-white font-bold text-[10px] flex items-center justify-center shadow-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-zinc-900 font-semibold leading-none">{user.name}</span>
            <span className="text-[10px] text-zinc-400 font-mono capitalize">{user.role}</span>
          </div>
          <form action={signOutAction} className="ml-1">
            <button
              type="submit"
              className="px-2.5 py-1 rounded-md text-[11px] font-medium text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
              title="Sign Out"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
