import { getAdminCustomers } from "@/lib/admin-data";
import { formatCents } from "@/lib/format";
import { updateUserRoleAction } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

interface CustomersPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function AdminCustomersPage({
  searchParams,
}: CustomersPageProps) {
  const { search } = await searchParams;
  const customers = await getAdminCustomers({ search });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
            Accounts
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            Customer Directory
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage registered accounts, lifetime purchasing value, and administrator permissions.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200 shadow-sm flex items-center justify-between">
        <form className="w-full flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              name="search"
              defaultValue={search || ""}
              placeholder="Search by customer name or email..."
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
            className="px-4 py-2 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden text-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/50 font-mono text-[11px] uppercase text-zinc-500">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Member Since</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4">Role Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-400">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((cust) => {
                  const joinDate = new Date(cust.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  );

                  return (
                    <tr
                      key={cust.id}
                      className="hover:bg-zinc-50/80 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
                            {cust.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-zinc-950">
                              {cust.name}
                            </div>
                            <div className="text-[11px] font-mono text-zinc-400">
                              {cust.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-zinc-600">
                        {joinDate}
                      </td>

                      <td className="py-4 px-4 font-mono font-semibold text-zinc-950">
                        {cust.totalOrders}{" "}
                        {cust.totalOrders === 1 ? "order" : "orders"}
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-zinc-950">
                        {formatCents(cust.lifetimeSpendCents)}
                      </td>

                      <td className="py-4 px-4">
                        <form
                          action={async (formData: FormData) => {
                            "use server";
                            const newRole = formData.get("role") as
                              | "admin"
                              | "customer";
                            await updateUserRoleAction(cust.id, newRole);
                          }}
                        >
                          <select
                            name="role"
                            defaultValue={cust.role}
                            onChange={(e) => e.target.form?.requestSubmit()}
                            className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
                              cust.role === "admin"
                                ? "bg-cyan-50 border-cyan-200 text-cyan-800"
                                : "bg-zinc-100 border-zinc-200 text-zinc-800"
                            } focus:outline-none`}
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </form>
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
