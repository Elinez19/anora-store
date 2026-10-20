import "server-only";

import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  or,
  sql,
} from "drizzle-orm";

import { db } from "@/db";
import {
  categories,
  orders,
  productImages,
  products,
  user,
} from "@/db/schema";
import { stockState } from "@/lib/stock";

export interface AdminOverviewStats {
  totalRevenueCents: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockCount: number;
  recentOrders: Array<{
    id: string;
    email: string;
    totalCents: number;
    currency: string;
    fulfillmentStatus: string;
    createdAt: Date;
    itemCount: number;
  }>;
  lowStockItems: Array<{
    id: string;
    slug: string;
    name: string;
    sku: string;
    stockQuantity: number;
    madeToOrder: boolean;
    image: string | null;
  }>;
}

/**
 * Fetch executive overview KPIs for the admin dashboard.
 */
export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  // Aggregate revenue & total orders
  const [ordersSummary] = await db
    .select({
      count: count(orders.id),
      totalRevenue: sql<number>`coalesce(sum(${orders.totalCents}), 0)`,
    })
    .from(orders);

  // Total customers count
  const [customersSummary] = await db
    .select({
      count: count(user.id),
    })
    .from(user);

  // Total products count
  const [productsSummary] = await db
    .select({
      count: count(products.id),
    })
    .from(products);

  // Low stock products count (stockQuantity <= 3 and madeToOrder is false)
  const [lowStockSummary] = await db
    .select({
      count: count(products.id),
    })
    .from(products)
    .where(
      and(
        sql`${products.stockQuantity} <= 3`,
        eq(products.madeToOrder, false),
      ),
    );

  // Recent 6 orders
  const recentOrdersRaw = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    limit: 6,
    with: {
      items: true,
    },
  });

  const recentOrders = recentOrdersRaw.map((o) => ({
    id: o.id,
    email: o.email,
    totalCents: o.totalCents,
    currency: o.currency,
    fulfillmentStatus: o.fulfillmentStatus ?? "paid",
    createdAt: o.createdAt,
    itemCount: o.items.length,
  }));

  // Low stock products preview (top 5)
  const lowStockProducts = await db.query.products.findMany({
    where: and(
      sql`${products.stockQuantity} <= 3`,
      eq(products.madeToOrder, false),
    ),
    orderBy: [asc(products.stockQuantity)],
    limit: 5,
    with: {
      images: {
        orderBy: [asc(productImages.position)],
        limit: 1,
      },
    },
  });

  const lowStockItems = lowStockProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    sku: p.sku,
    stockQuantity: p.stockQuantity,
    madeToOrder: p.madeToOrder,
    image: p.images[0]?.url ?? null,
  }));

  return {
    totalRevenueCents: Number(ordersSummary?.totalRevenue ?? 0),
    totalOrders: Number(ordersSummary?.count ?? 0),
    totalCustomers: Number(customersSummary?.count ?? 0),
    totalProducts: Number(productsSummary?.count ?? 0),
    lowStockCount: Number(lowStockSummary?.count ?? 0),
    recentOrders,
    lowStockItems,
  };
}

/**
 * Filtered products list for Catalogue Management
 */
export async function getAdminProducts(params?: {
  search?: string;
  categoryId?: string;
  stock?: string;
}) {
  const whereClauses = [];

  if (params?.search) {
    const q = `%${params.search.trim()}%`;
    whereClauses.push(
      or(
        ilike(products.name, q),
        ilike(products.sku, q),
        ilike(products.slug, q),
      ),
    );
  }

  if (params?.categoryId && params.categoryId !== "all") {
    whereClauses.push(eq(products.categoryId, params.categoryId));
  }

  const rows = await db.query.products.findMany({
    where: whereClauses.length > 0 ? and(...whereClauses) : undefined,
    orderBy: [desc(products.createdAt)],
    with: {
      category: true,
      images: {
        orderBy: [asc(productImages.position)],
      },
    },
  });

  // Client-side stock filtering if requested
  let filtered = rows;
  if (params?.stock && params.stock !== "all") {
    filtered = rows.filter((row) => stockState(row) === params.stock);
  }

  return filtered;
}

/**
 * Fetch a single product for editing
 */
export async function getAdminProductById(id: string) {
  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      category: true,
      images: {
        orderBy: [asc(productImages.position)],
      },
    },
  });
}

/**
 * Fetch all categories with dynamic product count
 */
export async function getAdminCategories() {
  const allCategories = await db.query.categories.findMany({
    orderBy: [asc(categories.position), asc(categories.name)],
    with: {
      products: {
        columns: { id: true },
      },
    },
  });

  return allCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    imageUrl: c.imageUrl,
    imageAlt: c.imageAlt,
    position: c.position,
    pieceCount: c.products.length,
    createdAt: c.createdAt,
  }));
}

/**
 * Orders management list with search
 */
export async function getAdminOrders(params?: { search?: string }) {
  const allOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    with: {
      items: true,
      user: {
        columns: { id: true, name: true, email: true },
      },
    },
  });

  if (!params?.search) return allOrders;

  const q = params.search.trim().toLowerCase();
  return allOrders.filter(
    (o) =>
      o.id.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.user?.name.toLowerCase().includes(q) ||
      o.stripeCheckoutSessionId.toLowerCase().includes(q),
  );
}

/**
 * Single Order details for inspector
 */
export async function getAdminOrderById(id: string) {
  return db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      user: true,
      items: {
        with: {
          product: {
            with: {
              images: { orderBy: [asc(productImages.position)], limit: 1 },
            },
          },
        },
      },
    },
  });
}

/**
 * Customers directory with lifetime spend and order count
 */
export async function getAdminCustomers(params?: { search?: string }) {
  const allUsers = await db.query.user.findMany({
    orderBy: [desc(user.createdAt)],
    with: {
      orders: {
        columns: { id: true, totalCents: true, createdAt: true },
      },
    },
  });

  const formatted = allUsers.map((u) => {
    const totalOrders = u.orders.length;
    const lifetimeSpendCents = u.orders.reduce(
      (sum, ord) => sum + ord.totalCents,
      0,
    );
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      image: u.image,
      createdAt: u.createdAt,
      totalOrders,
      lifetimeSpendCents,
    };
  });

  if (!params?.search) return formatted;

  const q = params.search.trim().toLowerCase();
  return formatted.filter(
    (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
  );
}
