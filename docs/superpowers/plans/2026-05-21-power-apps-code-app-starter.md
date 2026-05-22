# Power Apps Code App Starter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Power Apps Code Apps starter repo for a field crew replacement parts request app.

**Architecture:** Start from the Microsoft Power Apps Code Apps starter template, then add a small React app organized around catalog, cart, submission, and request status screens. Keep list access behind a mock data adapter so local Vite testing works before tenant wiring exists.

**Tech Stack:** Power Apps Code Apps, React, TypeScript, Vite, Tailwind, shadcn-style UI primitives, lucide-react, Vitest, GitHub Actions, Power Platform CLI.

---

## File Structure

The implementation will create or modify these files:

- Create from template: `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `src/main.tsx`, `src/App.tsx`, and Power Apps Code Apps config files provided by the Microsoft starter.
- Modify: `package.json` to add scripts, tests, and UI dependencies.
- Modify or create: `tailwind.config.js` and `src/index.css` for the app theme.
- Create: `components.json` for shadcn-compatible component settings.
- Create: `src/lib/utils.ts` for class name merging.
- Create: `src/lib/format.ts` for currency/date formatting.
- Create: `src/lib/format.test.ts` for formatting tests.
- Create: `src/features/parts/types.ts` for app domain types.
- Create: `src/features/parts/mock-data.ts` for local parts and requests.
- Create: `src/features/parts/cart.ts` for cart reducer and totals.
- Create: `src/features/parts/cart.test.ts` for cart behavior tests.
- Create: `src/features/parts/request-store.ts` for mock request creation.
- Create: `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/input.tsx` for UI primitives.
- Create: `src/screens/PartsCatalogScreen.tsx`, `src/screens/CartScreen.tsx`, `src/screens/RequestStatusScreen.tsx` for page-level UI.
- Create: `src/app/AppShell.tsx` for mobile-first app navigation and state composition.
- Create: `.env.example` for required environment names and IDs.
- Create: `.github/workflows/ci.yml` for install, lint, test, and build.
- Create: `README.md` with local run and Power Apps deploy steps.

## Task 1: Scaffold Power Apps Code Apps Starter

**Files:**
- Create from template: project baseline files in repo root
- Modify: `package.json`
- Modify: `src/App.tsx`

- [ ] **Step 1: Fetch the Microsoft starter into a temporary folder**

Run:

```bash
npx degit microsoft/PowerAppsCodeApps/templates/starter#main .starter-template
```

Expected: `.starter-template` contains the starter app files.

- [ ] **Step 2: Copy starter files into the repo root without deleting docs or git data**

Run:

```bash
rsync -a .starter-template/ ./
rm -rf .starter-template
```

Expected: repo root contains the starter app plus the existing `docs/` directory.

- [ ] **Step 3: Install dependencies**

Run:

```bash
npm install
```

Expected: `node_modules/` and `package-lock.json` are created.

- [ ] **Step 4: Verify the untouched starter builds**

Run:

```bash
npm run build
```

Expected: build exits with code 0. If the starter exposes a different build script, use the generated script name and record it in the final notes.

- [ ] **Step 5: Commit when commits are requested**

Run only if the user asks for commits:

```bash
git add .
git commit -m "build: add code apps starter"
```

## Task 2: Add UI and Test Tooling

**Files:**
- Modify: `package.json`
- Create: `components.json`
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/input.tsx`

- [ ] **Step 1: Add dependencies**

Run:

```bash
npm install lucide-react @tanstack/react-query class-variance-authority clsx tailwind-merge
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

Expected: `package.json` and `package-lock.json` include the packages.

- [ ] **Step 2: Update scripts in `package.json`**

Ensure the scripts include these entries while preserving template-specific scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "preview": "vite preview",
    "powerapps:init": "pac code init --displayName \"$POWER_APPS_APP_DISPLAY_NAME\" --environment \"$POWER_PLATFORM_ENVIRONMENT_ID\"",
    "powerapps:push": "npm run build && pac code push"
  }
}
```

- [ ] **Step 3: Add `components.json`**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

- [ ] **Step 4: Add `src/lib/utils.ts`**

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 5: Add `src/components/ui/button.tsx`**

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-slate-950 text-white hover:bg-slate-800",
        secondary: "bg-slate-100 text-slate-950 hover:bg-slate-200",
        outline: "border border-slate-300 bg-white text-slate-950 hover:bg-slate-50",
        danger: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        default: "px-4 py-3",
        sm: "min-h-10 px-3 py-2",
        lg: "min-h-14 px-5 py-4 text-base",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";
```

- [ ] **Step 6: Add Radix Slot dependency used by the button**

Run:

```bash
npm install @radix-ui/react-slot
```

- [ ] **Step 7: Add card, badge, and input primitives**

Use these minimal files:

`src/components/ui/card.tsx`

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-slate-200 bg-white shadow-sm", className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1.5 p-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold text-slate-950", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 pt-0", className)} {...props} />;
}
```

`src/components/ui/badge.tsx`

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger";

const variants: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-800",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-900",
  danger: "bg-red-100 text-red-800",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", variants[variant], className)}
      {...props}
    />
  );
}
```

`src/components/ui/input.tsx`

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";
```

- [ ] **Step 8: Run build and tests**

Run:

```bash
npm run build
npm run test
```

Expected: build passes and Vitest runs with no tests or passing tests depending on the starter state.

- [ ] **Step 9: Commit when commits are requested**

Run only if the user asks for commits:

```bash
git add package.json package-lock.json components.json src/lib/utils.ts src/components/ui
git commit -m "feat: add app ui primitives"
```

## Task 3: Add Domain Types, Mock Data, and Cart Tests

**Files:**
- Create: `src/features/parts/types.ts`
- Create: `src/features/parts/mock-data.ts`
- Create: `src/features/parts/cart.ts`
- Create: `src/features/parts/cart.test.ts`
- Create: `src/lib/format.ts`
- Create: `src/lib/format.test.ts`

- [ ] **Step 1: Write failing cart tests**

`src/features/parts/cart.test.ts`

```ts
import { describe, expect, it } from "vitest";

import { addPartToCart, changeCartQuantity, getCartTotal, removeCartItem } from "./cart";
import type { Part } from "./types";

const pump: Part = {
  id: "part-1",
  title: "Hydraulic Pump",
  partNumber: "HP-204",
  category: "Hydraulics",
  description: "Primary pump for lift assemblies",
  availability: "Available",
  unitCost: 245.5,
};

describe("cart", () => {
  it("adds parts and combines matching line items", () => {
    const once = addPartToCart([], pump, 2);
    const twice = addPartToCart(once, pump, 3);

    expect(twice).toHaveLength(1);
    expect(twice[0]).toMatchObject({ partId: "part-1", quantity: 5, lineTotal: 1227.5 });
  });

  it("changes quantity and removes items", () => {
    const cart = addPartToCart([], pump, 2);
    const changed = changeCartQuantity(cart, "part-1", 4);
    const removed = removeCartItem(changed, "part-1");

    expect(changed[0].quantity).toBe(4);
    expect(changed[0].lineTotal).toBe(982);
    expect(removed).toEqual([]);
  });

  it("calculates total estimated cost", () => {
    const cart = addPartToCart([], pump, 2);

    expect(getCartTotal(cart)).toBe(491);
  });
});
```

- [ ] **Step 2: Run cart test and verify it fails**

Run:

```bash
npm run test -- src/features/parts/cart.test.ts
```

Expected: fails because `cart.ts` and `types.ts` do not exist yet.

- [ ] **Step 3: Add domain types**

`src/features/parts/types.ts`

```ts
export type Availability = "Available" | "Out of Stock";
export type RequestStatus = "Pending" | "Approved" | "Rejected";

export interface Part {
  id: string;
  title: string;
  partNumber: string;
  category: string;
  description: string;
  availability: Availability;
  unitCost: number;
}

export interface CartItem {
  partId: string;
  title: string;
  partNumber: string;
  quantity: number;
  unitCost: number;
  lineTotal: number;
}

export interface EquipmentRequest {
  requestId: string;
  requestorName: string;
  requestorEmail: string;
  requestedParts: CartItem[];
  totalEstimatedCost: number;
  status: RequestStatus;
  submissionDate: string;
  approvalDate?: string;
  approverComments?: string;
}
```

- [ ] **Step 4: Add cart logic**

`src/features/parts/cart.ts`

```ts
import type { CartItem, Part } from "./types";

function toLineItem(part: Part, quantity: number): CartItem {
  return {
    partId: part.id,
    title: part.title,
    partNumber: part.partNumber,
    quantity,
    unitCost: part.unitCost,
    lineTotal: Number((quantity * part.unitCost).toFixed(2)),
  };
}

export function addPartToCart(items: CartItem[], part: Part, quantity: number): CartItem[] {
  const safeQuantity = Math.max(1, quantity);
  const existing = items.find((item) => item.partId === part.id);

  if (!existing) {
    return [...items, toLineItem(part, safeQuantity)];
  }

  return items.map((item) =>
    item.partId === part.id ? toLineItem(part, item.quantity + safeQuantity) : item,
  );
}

export function changeCartQuantity(items: CartItem[], partId: string, quantity: number): CartItem[] {
  if (quantity <= 0) {
    return removeCartItem(items, partId);
  }

  return items.map((item) =>
    item.partId === partId
      ? { ...item, quantity, lineTotal: Number((quantity * item.unitCost).toFixed(2)) }
      : item,
  );
}

export function removeCartItem(items: CartItem[], partId: string): CartItem[] {
  return items.filter((item) => item.partId !== partId);
}

export function getCartTotal(items: CartItem[]): number {
  return Number(items.reduce((total, item) => total + item.lineTotal, 0).toFixed(2));
}
```

- [ ] **Step 5: Add mock data**

`src/features/parts/mock-data.ts`

```ts
import type { EquipmentRequest, Part } from "./types";

export const mockParts: Part[] = [
  {
    id: "part-1",
    title: "Hydraulic Pump",
    partNumber: "HP-204",
    category: "Hydraulics",
    description: "Primary pump for lift assemblies",
    availability: "Available",
    unitCost: 245.5,
  },
  {
    id: "part-2",
    title: "Air Filter Kit",
    partNumber: "AF-118",
    category: "Filters",
    description: "Replacement intake filter kit",
    availability: "Available",
    unitCost: 38.75,
  },
  {
    id: "part-3",
    title: "Drive Belt",
    partNumber: "DB-550",
    category: "Belts",
    description: "Heavy-duty drive belt",
    availability: "Out of Stock",
    unitCost: 64.2,
  },
  {
    id: "part-4",
    title: "Control Relay",
    partNumber: "CR-321",
    category: "Electrical",
    description: "Relay for control panel assemblies",
    availability: "Available",
    unitCost: 27.99,
  },
];

export const mockRequests: EquipmentRequest[] = [
  {
    requestId: "REQ-1007",
    requestorName: "Field Crew User",
    requestorEmail: "crew@example.com",
    requestedParts: [
      {
        partId: "part-2",
        title: "Air Filter Kit",
        partNumber: "AF-118",
        quantity: 2,
        unitCost: 38.75,
        lineTotal: 77.5,
      },
    ],
    totalEstimatedCost: 77.5,
    status: "Pending",
    submissionDate: "2026-05-18T14:30:00.000Z",
  },
];
```

- [ ] **Step 6: Write failing format tests**

`src/lib/format.test.ts`

```ts
import { describe, expect, it } from "vitest";

import { formatCurrency, formatDate } from "./format";

describe("format", () => {
  it("formats currency for field request totals", () => {
    expect(formatCurrency(77.5)).toBe("$77.50");
  });

  it("formats submitted dates", () => {
    expect(formatDate("2026-05-18T14:30:00.000Z")).toContain("May");
  });
});
```

- [ ] **Step 7: Add format helpers**

`src/lib/format.ts`

```ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
```

- [ ] **Step 8: Run tests**

Run:

```bash
npm run test
```

Expected: cart and format tests pass.

- [ ] **Step 9: Commit when commits are requested**

Run only if the user asks for commits:

```bash
git add src/features/parts src/lib/format.ts src/lib/format.test.ts
git commit -m "feat: add parts cart model"
```

## Task 4: Add Request Store

**Files:**
- Create: `src/features/parts/request-store.ts`
- Create: `src/features/parts/request-store.test.ts`

- [ ] **Step 1: Write failing request store tests**

`src/features/parts/request-store.test.ts`

```ts
import { describe, expect, it } from "vitest";

import { createEquipmentRequest } from "./request-store";
import type { CartItem } from "./types";

const cartItems: CartItem[] = [
  {
    partId: "part-1",
    title: "Hydraulic Pump",
    partNumber: "HP-204",
    quantity: 2,
    unitCost: 245.5,
    lineTotal: 491,
  },
];

describe("request store", () => {
  it("creates a pending equipment request", () => {
    const request = createEquipmentRequest({
      cartItems,
      requestorName: "Field Crew User",
      requestorEmail: "crew@example.com",
      now: new Date("2026-05-21T10:00:00.000Z"),
      nextRequestNumber: 42,
    });

    expect(request).toMatchObject({
      requestId: "REQ-0042",
      requestorName: "Field Crew User",
      requestorEmail: "crew@example.com",
      status: "Pending",
      totalEstimatedCost: 491,
    });
  });
});
```

- [ ] **Step 2: Run request store test and verify it fails**

Run:

```bash
npm run test -- src/features/parts/request-store.test.ts
```

Expected: fails because `request-store.ts` does not exist yet.

- [ ] **Step 3: Add request creation logic**

`src/features/parts/request-store.ts`

```ts
import { getCartTotal } from "./cart";
import type { CartItem, EquipmentRequest } from "./types";

interface CreateEquipmentRequestInput {
  cartItems: CartItem[];
  requestorName: string;
  requestorEmail: string;
  now?: Date;
  nextRequestNumber: number;
}

export function createEquipmentRequest({
  cartItems,
  requestorName,
  requestorEmail,
  now = new Date(),
  nextRequestNumber,
}: CreateEquipmentRequestInput): EquipmentRequest {
  return {
    requestId: `REQ-${String(nextRequestNumber).padStart(4, "0")}`,
    requestorName,
    requestorEmail,
    requestedParts: cartItems,
    totalEstimatedCost: getCartTotal(cartItems),
    status: "Pending",
    submissionDate: now.toISOString(),
  };
}
```

- [ ] **Step 4: Run tests**

Run:

```bash
npm run test
```

Expected: all tests pass.

- [ ] **Step 5: Commit when commits are requested**

Run only if the user asks for commits:

```bash
git add src/features/parts/request-store.ts src/features/parts/request-store.test.ts
git commit -m "feat: add request creation"
```

## Task 5: Build Screens

**Files:**
- Create: `src/screens/PartsCatalogScreen.tsx`
- Create: `src/screens/CartScreen.tsx`
- Create: `src/screens/RequestStatusScreen.tsx`

- [ ] **Step 1: Add parts catalog screen**

`src/screens/PartsCatalogScreen.tsx`

```tsx
import { PackagePlus, Search } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Part } from "@/features/parts/types";
import { formatCurrency } from "@/lib/format";

interface PartsCatalogScreenProps {
  parts: Part[];
  onAddToCart: (part: Part, quantity: number) => void;
}

export function PartsCatalogScreen({ parts, onAddToCart }: PartsCatalogScreenProps) {
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const filteredParts = parts.filter((part) => {
    const term = search.toLowerCase();
    return [part.title, part.partNumber, part.category].some((value) => value.toLowerCase().includes(term));
  });

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Parts catalog</p>
        <h1 className="text-3xl font-bold text-slate-950">Request replacement parts</h1>
      </div>

      <label className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
        <Input
          className="pl-12"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, part number, or category"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredParts.map((part) => {
          const quantity = quantities[part.id] ?? 1;
          const isAvailable = part.availability === "Available";

          return (
            <Card key={part.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{part.title}</CardTitle>
                    <p className="text-sm font-medium text-slate-500">{part.partNumber}</p>
                  </div>
                  <Badge variant={isAvailable ? "success" : "danger"}>{part.availability}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">{part.description}</p>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <span className="text-sm font-semibold text-slate-600">{part.category}</span>
                  <span className="text-lg font-bold text-slate-950">{formatCurrency(part.unitCost)}</span>
                </div>
                <div className="grid grid-cols-[104px_1fr] gap-3">
                  <Input
                    min={1}
                    type="number"
                    value={quantity}
                    onChange={(event) =>
                      setQuantities((current) => ({
                        ...current,
                        [part.id]: Number(event.target.value) || 1,
                      }))
                    }
                    aria-label={`Quantity for ${part.title}`}
                  />
                  <Button disabled={!isAvailable} onClick={() => onAddToCart(part, quantity)} size="lg">
                    <PackagePlus className="size-5" />
                    Add to cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add cart screen**

`src/screens/CartScreen.tsx`

```tsx
import { Minus, Plus, Send, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CartItem } from "@/features/parts/types";
import { formatCurrency } from "@/lib/format";

interface CartScreenProps {
  items: CartItem[];
  total: number;
  onChangeQuantity: (partId: string, quantity: number) => void;
  onRemove: (partId: string) => void;
  onSubmit: () => void;
}

export function CartScreen({ items, total, onChangeQuantity, onRemove, onSubmit }: CartScreenProps) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Cart</p>
        <h1 className="text-3xl font-bold text-slate-950">Review request</h1>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-slate-600">Your cart is empty.</CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.partId}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <p className="text-sm font-medium text-slate-500">{item.partNumber}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>{formatCurrency(item.unitCost)} each</span>
                  <span className="text-lg font-bold text-slate-950">{formatCurrency(item.lineTotal)}</span>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="icon" onClick={() => onChangeQuantity(item.partId, item.quantity - 1)}>
                      <Minus className="size-5" />
                    </Button>
                    <span className="min-w-12 text-center text-xl font-bold">{item.quantity}</span>
                    <Button variant="secondary" size="icon" onClick={() => onChangeQuantity(item.partId, item.quantity + 1)}>
                      <Plus className="size-5" />
                    </Button>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => onRemove(item.partId)} aria-label={`Remove ${item.title}`}>
                    <Trash2 className="size-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="sticky bottom-24 border-slate-300">
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-slate-600">Total estimated cost</span>
            <span className="text-2xl font-bold text-slate-950">{formatCurrency(total)}</span>
          </div>
          <Button className="w-full" size="lg" disabled={items.length === 0} onClick={onSubmit}>
            <Send className="size-5" />
            Submit request
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
```

- [ ] **Step 3: Add request status screen**

`src/screens/RequestStatusScreen.tsx`

```tsx
import { CheckCircle2, Clock3, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EquipmentRequest, RequestStatus } from "@/features/parts/types";
import { formatCurrency, formatDate } from "@/lib/format";

const statusIcon: Record<RequestStatus, typeof Clock3> = {
  Pending: Clock3,
  Approved: CheckCircle2,
  Rejected: XCircle,
};

const statusVariant: Record<RequestStatus, "warning" | "success" | "danger"> = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
};

interface RequestStatusScreenProps {
  requests: EquipmentRequest[];
}

export function RequestStatusScreen({ requests }: RequestStatusScreenProps) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Status</p>
        <h1 className="text-3xl font-bold text-slate-950">My requests</h1>
      </div>

      <div className="space-y-3">
        {requests.map((request) => {
          const Icon = statusIcon[request.status];

          return (
            <Card key={request.requestId}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{request.requestId}</CardTitle>
                    <p className="text-sm text-slate-500">Submitted {formatDate(request.submissionDate)}</p>
                  </div>
                  <Badge variant={statusVariant[request.status]}>
                    <Icon className="mr-1 size-4" />
                    {request.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <span className="font-semibold text-slate-600">Total</span>
                  <span className="text-lg font-bold text-slate-950">{formatCurrency(request.totalEstimatedCost)}</span>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  {request.requestedParts.map((part) => (
                    <div className="flex justify-between gap-3" key={`${request.requestId}-${part.partId}`}>
                      <span>{part.title}</span>
                      <span className="font-semibold">Qty {part.quantity}</span>
                    </div>
                  ))}
                </div>
                {request.approvalDate ? <p className="text-sm text-slate-500">Decision {formatDate(request.approvalDate)}</p> : null}
                {request.approverComments ? <p className="text-sm text-slate-600">{request.approverComments}</p> : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run build**

Run:

```bash
npm run build
```

Expected: build passes after screens compile.

- [ ] **Step 5: Commit when commits are requested**

Run only if the user asks for commits:

```bash
git add src/screens
git commit -m "feat: add field crew screens"
```

## Task 6: Wire App Shell and Mobile Navigation

**Files:**
- Create: `src/app/AppShell.tsx`
- Modify: `src/App.tsx`
- Modify: `src/main.tsx` if the starter requires provider wiring there
- Modify: `src/index.css`

- [ ] **Step 1: Add app shell**

`src/app/AppShell.tsx`

```tsx
import { ClipboardList, PackageSearch, ShoppingCart } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { addPartToCart, changeCartQuantity, getCartTotal, removeCartItem } from "@/features/parts/cart";
import { mockParts, mockRequests } from "@/features/parts/mock-data";
import { createEquipmentRequest } from "@/features/parts/request-store";
import type { CartItem, EquipmentRequest, Part } from "@/features/parts/types";
import { CartScreen } from "@/screens/CartScreen";
import { PartsCatalogScreen } from "@/screens/PartsCatalogScreen";
import { RequestStatusScreen } from "@/screens/RequestStatusScreen";

type Screen = "catalog" | "cart" | "status";

const currentUser = {
  name: "Field Crew User",
  email: "crew@example.com",
};

export function AppShell() {
  const [activeScreen, setActiveScreen] = useState<Screen>("catalog");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [requests, setRequests] = useState<EquipmentRequest[]>(mockRequests);

  const cartTotal = getCartTotal(cartItems);

  function handleAddToCart(part: Part, quantity: number) {
    setCartItems((items) => addPartToCart(items, part, quantity));
    setActiveScreen("cart");
  }

  function handleSubmitRequest() {
    const request = createEquipmentRequest({
      cartItems,
      requestorName: currentUser.name,
      requestorEmail: currentUser.email,
      nextRequestNumber: requests.length + 1008,
    });

    setRequests((items) => [request, ...items]);
    setCartItems([]);
    setActiveScreen("status");
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <main className="mx-auto min-h-screen w-full max-w-5xl px-4 pb-28 pt-5 md:px-6">
        {activeScreen === "catalog" ? <PartsCatalogScreen parts={mockParts} onAddToCart={handleAddToCart} /> : null}
        {activeScreen === "cart" ? (
          <CartScreen
            items={cartItems}
            total={cartTotal}
            onChangeQuantity={(partId, quantity) => setCartItems((items) => changeCartQuantity(items, partId, quantity))}
            onRemove={(partId) => setCartItems((items) => removeCartItem(items, partId))}
            onSubmit={handleSubmitRequest}
          />
        ) : null}
        {activeScreen === "status" ? <RequestStatusScreen requests={requests} /> : null}
      </main>

      <nav className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-2">
          <Button variant={activeScreen === "catalog" ? "default" : "secondary"} onClick={() => setActiveScreen("catalog")}>
            <PackageSearch className="size-5" />
            Catalog
          </Button>
          <Button variant={activeScreen === "cart" ? "default" : "secondary"} onClick={() => setActiveScreen("cart")}>
            <ShoppingCart className="size-5" />
            Cart {cartItems.length ? `(${cartItems.length})` : ""}
          </Button>
          <Button variant={activeScreen === "status" ? "default" : "secondary"} onClick={() => setActiveScreen("status")}>
            <ClipboardList className="size-5" />
            Status
          </Button>
        </div>
      </nav>
    </div>
  );
}
```

- [ ] **Step 2: Replace the starter app content**

`src/App.tsx`

```tsx
import { AppShell } from "./app/AppShell";

export default function App() {
  return <AppShell />;
}
```

- [ ] **Step 3: Set global styles**

Ensure `src/index.css` includes Tailwind directives and these globals:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #020617;
  background: #f1f5f9;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
input {
  font: inherit;
}
```

- [ ] **Step 4: Run tests and build**

Run:

```bash
npm run test
npm run build
```

Expected: all tests pass and production build succeeds.

- [ ] **Step 5: Commit when commits are requested**

Run only if the user asks for commits:

```bash
git add src/app/AppShell.tsx src/App.tsx src/index.css
git commit -m "feat: wire mobile app shell"
```

## Task 7: Add Environment Docs and CI

**Files:**
- Create: `.env.example`
- Create: `.github/workflows/ci.yml`
- Create: `README.md`

- [ ] **Step 1: Add `.env.example`**

```dotenv
POWER_APPS_APP_DISPLAY_NAME="Replacement Parts"
POWER_PLATFORM_ENVIRONMENT_ID="00000000-0000-0000-0000-000000000000"
POWER_PLATFORM_SOLUTION_NAME="replacement_parts"
REPLACEMENT_PARTS_LIST_NAME="Replacement Parts"
EQUIPMENT_REQUESTS_LIST_NAME="Equipment Requests"
```

- [ ] **Step 2: Add CI workflow**

`.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm run test

      - name: Build
        run: npm run build
```

- [ ] **Step 3: Add README**

`README.md`

```md
# Replacement Parts Power App

Starter repo for a Power Apps Code Apps field crew app. Field crews can search replacement parts, add items to a cart, submit a request, and track request status.

## Local Development

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal. Use browser device mode to check phone and tablet layouts.

## Verify

```bash
npm run lint
npm run test
npm run build
```

## Power Apps Setup

Install the Power Platform CLI, sign in, and initialize the code app:

```bash
pac auth create
POWER_APPS_APP_DISPLAY_NAME="Replacement Parts" POWER_PLATFORM_ENVIRONMENT_ID="your-environment-id" npm run powerapps:init
```

Push the app after it builds:

```bash
npm run powerapps:push
```

After push, open the app in make.powerapps.com, share it with the field crew security group, and test it in Power Apps mobile.

## Lists

The app is built to connect to these Microsoft Lists after tenant wiring is added:

- Replacement Parts
- Equipment Requests

The current starter uses mock data so local development works before tenant access is configured.
```

- [ ] **Step 4: Run final verification**

Run:

```bash
npm run lint
npm run test
npm run build
```

Expected: lint, tests, and build pass.

- [ ] **Step 5: Commit when commits are requested**

Run only if the user asks for commits:

```bash
git add .env.example .github/workflows/ci.yml README.md
git commit -m "chore: add repo automation"
```

## Task 8: Local Visual Check

**Files:**
- Modify only files needed to fix issues found during visual testing

- [ ] **Step 1: Start the dev server**

Run:

```bash
npm run dev
```

Expected: Vite prints a local URL.

- [ ] **Step 2: Verify app flows in browser**

Manual checks:

- Catalog loads with mock parts.
- Search filters by part name, part number, and category.
- Out of Stock parts cannot be added.
- Quantity can be set before adding to cart.
- Cart can increase, decrease, and remove items.
- Submit request creates a Pending request and clears cart.
- Status screen shows submitted requests as read-only cards.

- [ ] **Step 3: Check mobile and tablet sizes**

Use browser device mode:

- iPhone-sized viewport at 390px wide.
- Tablet-sized viewport at 768px wide.
- Bottom navigation remains tappable.
- Submit button is visible and large enough.

- [ ] **Step 4: Stop the dev server**

Stop the terminal process with `Ctrl+C`.

- [ ] **Step 5: Commit when commits are requested**

Run only if the user asks for commits and visual fixes changed files:

```bash
git add src
git commit -m "fix: polish mobile app layout"
```

## Self-Review

Spec coverage:

- Power Apps Code Apps starter is covered by Task 1.
- React, Vite, shadcn-style UI, lucide icons, and local visual testing are covered by Tasks 2, 5, 6, and 8.
- Catalog, cart, submission, and status screens are covered by Tasks 3 through 6.
- Mock data before Microsoft Lists wiring is covered by Tasks 3 and 6.
- Power Apps CLI scripts, env docs, README, and GitHub Actions are covered by Tasks 2 and 7.
- Tests and build verification are covered by Tasks 3, 4, 6, 7, and 8.

Placeholder scan:

- The plan has no incomplete requirement markers.
- Future tenant wiring is intentionally out of scope for the first starter, matching the approved design.

Type consistency:

- `Part`, `CartItem`, and `EquipmentRequest` are defined once in `src/features/parts/types.ts`.
- Cart and request functions use those same types.
- Screen props match the functions wired in `src/app/AppShell.tsx`.
