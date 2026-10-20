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
    <header className="sticky top-0 z-30 h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900/80 px-6 flex items-center justify-between">
      {/* Search / Context info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] text-zinc-300">Live Production Neon DB</span>
        </div>
      </div>

      {/* Admin User controls & Actions */}
      <div className="flex items-center gap-4">
        {/* User Pill */}
        <div className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full bg-zinc-900/60 border border-zinc-800/80 text-xs">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-white text-zinc-950 font-bold text-[10px] flex items-center justify-center">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-zinc-200 font-medium leading-none">{user.name}</span>
            <span className="text-[10px] text-zinc-400 font-mono capitalize">{user.role}</span>
          </div>
          <form action={signOutAction} className="ml-1">
            <button
              type="submit"
              className="px-2 py-1 rounded-md text-[11px] text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
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
