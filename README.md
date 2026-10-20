<div align="center">
  <br />
  <a href="https://github.com/Elinez19/anora-store">
    <img src="public/readme/readme-hero.webp" alt="Anoralite Store Banner" width="100%" style="border-radius: 8px;">
  </a>
  <br />
  <br />

  <div>
    <img src="https://img.shields.io/badge/Next.js%2016-black?style=for-the-badge&logo=Next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind%20CSS%20v4-06B6D4?style=for-the-badge&logo=Tailwind-CSS&logoColor=white" alt="Tailwind CSS" />
    <br/>
    <img src="https://img.shields.io/badge/Neon%20Postgres-00E599?style=for-the-badge&logo=neon&logoColor=black" alt="Neon" />
    <img src="https://img.shields.io/badge/Drizzle%20ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" alt="Drizzle ORM" />
    <img src="https://img.shields.io/badge/Better%20Auth-4F46E5?style=for-the-badge&logo=auth0&logoColor=white" alt="Better Auth" />
    <img src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
    <img src="https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white" alt="Resend" />
  </div>

  <h2 align="center">Anoralite — Premium Computer Gadgets & Accessories</h2>

  <p align="center">
    A high-performance full-stack e-commerce platform and administrative ecosystem engineered for computer gadgets, laptops, desktops, wearables, and high-end tech accessories.
  </p>

  <p align="center">
    <a href="#-key-features">Features</a> •
    <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-database--seeding">Database</a> •
    <a href="#-admin-portal">Admin Portal</a> •
    <a href="#-environment-variables">Configuration</a>
  </p>
</div>

---

## 📋 <a name="table-of-contents">Table of Contents</a>

1. [✨ Introduction](#-introduction)
2. [⚙️ Tech Stack](#%EF%B8%8F-tech-stack)
3. [🔋 Key Features](#-key-features)
4. [🛡️ Admin Portal](#-admin-portal)
5. [🤸 Quick Start](#-quick-start)
6. [🔐 Environment Variables](#-environment-variables)
7. [🗄️ Database & Seeding](#-database--seeding)
8. [📜 Available Scripts](#-available-scripts)
9. [🔒 Security & Role-Based Access](#-security--role-based-access)

---

## ✨ <a name="introduction">Introduction</a>

**Anoralite** is a modern, responsive e-commerce web application engineered with **Next.js 16**, **React 19**, **Drizzle ORM**, and **Neon Serverless PostgreSQL**. Designed specifically for tech enthusiasts and modern professionals, Anoralite features a curated catalogue spanning high-performance workstations, ultrabooks, AI wearables, and accessories.

Beyond a beautiful storefront, Anoralite provides a complete operational backend featuring:
- **Resilient Shopping Architecture**: Seamless guest and authenticated cart synchronization.
- **Secure Financial Flow**: Stripe Checkout Session lifecycle with webhook idempotency.
- **Enterprise Customer Support Desk**: Built-in support ticketing with two-way email synchronization via Resend.
- **Marketing Automation**: Newsletter subscriptions and segment broadcasting.
- **Full Operational Admin Suite**: Real-time sales telemetry, order fulfillment, product & collection editors, and customer directory.

---

## ⚙️ <a name="tech-stack">Tech Stack</a>

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Actions) | Full-stack architecture, SSR/SSG rendering, and server actions |
| **Frontend** | [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/) | Type-safe UI components and concurrent client state |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Cutting-edge utility styling with customized typography system (`Inter` & `Plus Jakarta Sans`) |
| **Database** | [Neon Postgres](https://neon.tech/) | Serverless PostgreSQL with connection pooling |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) | End-to-end type-safe SQL query generation and schema migrations |
| **Authentication** | [Better Auth](https://www.better-auth.com/) | Secure cookie sessions, password hashing, and role-based permissions |
| **Payments** | [Stripe](https://stripe.com/) | Hosted checkout sessions, customer portal, and verified webhook idempotency |
| **Email & Marketing** | [Resend](https://resend.com/) | Transactional emails, support ticket reply delivery, and newsletter campaigns |

---

## 🔋 <a name="key-features">Key Features</a>

### 💻 Modern Tech Storefront
- **Categorized Browsing**: Dynamic filtering and navigation for **Laptops**, **Desktops**, **Smart Gadgets**, and **Accessories**.
- **Interactive Product Galleries**: Multi-perspective product photography with interactive carousel and thumbnail scroll controls.
- **Real-Time Stock Availability**: Derived stock indicators (`In Stock`, `Low Stock`, `Made to Order`, `Sold Out`) with live quantity tracking.
- **Specs & Details**: Structured technical spec sheets and care guides embedded directly in product pages.
- **Pricing & Discounts**: Clear MSRP comparisons (`compareAtPrice`) and promotion badges (`Save ₦...`).

### 🛒 Flexible Bag & Cart System
- **Dual-Mode Persistence**: Unauthenticated visitors can add items via cookie-backed guest carts; registered customers maintain database-synced bags.
- **Live Price Verification**: Prices are dynamically recalculated against current database records to prevent stale client submissions.

### 💳 Stripe Checkout & Order Safeguards
- **Hosted Checkout**: Secure Stripe payment processing with support for multiple payment methods.
- **Webhook Idempotency**: Resilient webhook listener preventing duplicate order creation across concurrent payment updates.
- **Denormalized Receipts**: Historical purchases retain snapshot records of unit prices, product names, SKUs, and imagery as they were at the instant of transaction.

### 👤 Customer Experience & Portal
- **Account Dashboard**: Personal profile overview, shipping information, and order tracking.
- **Order Receipts**: Detailed itemized invoice breakdown with fulfillment states (`paid`, `fulfilled`, etc.).
- **Customer Support**: Direct contact form generating trackable support tickets.

---

## 🛡️ <a name="admin-portal">Admin Portal (`/admin`)</a>

The administrative control center offers store owners a comprehensive workspace protected by role-based access control (RBAC):

1. **Telemetry & KPI Dashboard** (`/admin`):
   - Real-time revenue, total order volume, and active customer counts.
   - Quick activity feeds showing recent transactions and support requests.
2. **Product Catalog Manager** (`/admin/products`):
   - Create, edit, and archive products.
   - Configure pricing, compare-at discounts, SKU designations, colors, and stock levels.
   - Manage multi-image upload galleries and gallery positioning.
3. **Category Management** (`/admin/categories`):
   - Manage collections, display positions, and landing page collection strips.
4. **Order Fulfillment** (`/admin/orders`):
   - Review incoming customer purchases, payment confirmations, and update fulfillment states.
5. **Customer Directory** (`/admin/customers`):
   - Search customer accounts, review registration dates, and inspect purchase histories.
6. **Email Marketing & Broadcasts** (`/admin/marketing`):
   - Monitor newsletter subscribers.
   - Compose and send marketing newsletters and promotional announcements via Resend.
7. **Support Helpdesk** (`/admin/support`):
   - Track open, in-progress, and resolved support tickets.
   - Respond directly to customer inquiries; outgoing replies automatically dispatch formatted emails via Resend.

---

## 🤸 <a name="quick-start">Quick Start</a>

Follow these instructions to clone, configure, and launch the application locally.

### Prerequisites

Ensure you have the following installed on your development machine:
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/) (v20+ recommended)
- [npm](https://www.npmjs.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Elinez19/anora-store.git
cd anora-store
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Populate the values inside `.env` with your service credentials (see [Environment Variables](#-environment-variables)).

---

## 🔐 <a name="environment-variables">Environment Variables</a>

Here is a breakdown of the required environment variables:

```env
# Database (Neon Serverless Postgres - Pooled connection string)
DATABASE_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Better Auth Authentication
# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET="your-32-byte-base64-secret"
BETTER_AUTH_URL="http://localhost:3000"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Admin Access Control (comma-separated list of emails granted /admin access)
ADMIN_EMAILS="admin@anorastore.com,owner@anorastore.com"

# Stripe Payments
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend Email & Communications
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="Anoralite <notifications@yourdomain.com>"
RESEND_RECEIVING_EMAIL="support@yourdomain.com"
RESEND_WEBHOOK_SECRET="whsec_..."
RESEND_MARKETING_SEGMENT_ID=""
```

---

## 🗄️ <a name="database--seeding">Database & Seeding</a>

The database schema is managed via Drizzle ORM.

### Push Schema to Neon Database
```bash
npm run db:push
```

### Seed Initial Gadgets Catalog
Populate the database with default categories (Laptops, Desktops, Smart Gadgets, Accessories) and a rich catalog of products with high-resolution photography:

```bash
npm run db:seed
```

### Explore Database with Drizzle Studio
Launch an interactive web UI to inspect and manage your tables:
```bash
npm run db:studio
```

---

## 🚀 Running the Application

Start the local development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to view the storefront.

To access the Admin Portal (`http://localhost:3000/admin`), sign up or sign in using an email defined in your `ADMIN_EMAILS` environment variable.

---

## 📜 <a name="available-scripts">Available Scripts</a>

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with hot-reload |
| `npm run build` | Compiles the production build |
| `npm run start` | Boots the compiled Next.js production server |
| `npm run lint` | Runs ESLint to check for code quality and syntax issues |
| `npm run db:generate`| Generates migration files based on schema changes |
| `npm run db:migrate` | Runs pending Drizzle migrations against the database |
| `npm run db:push` | Directly synchronizes the schema with the database |
| `npm run db:studio` | Launches Drizzle Studio in the browser |
| `npm run db:seed` | Runs `scripts/seed.ts` to populate demo categories and products |

---

## 🔒 <a name="security--role-based-access">Security & Role-Based Access</a>

- **Session Security**: Better Auth issues HTTP-only, secure cookies with cryptographic signatures.
- **Admin Verification**: Access to `/admin` routes and sensitive actions is verified on every request using `ADMIN_EMAILS` whitelist checks and role validation.
- **Payment Verification**: Stripe webhooks utilize cryptographic signature verification with the `STRIPE_WEBHOOK_SECRET` before processing order records.
- **Price Tamper Resistance**: Cart checkouts recalculate totals exclusively on the server directly from active catalog database entries.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

