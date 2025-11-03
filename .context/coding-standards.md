# Coding Standards & Conventions
## File Naming Conventions

### Component Files (.tsx)
All React component files should use **kebab-case** naming:
```
✅ Good:
- navigation-auth.tsx
- property-card.tsx
- user-profile-form.tsx
- booking-calendar.tsx

```
### Utility Files (.ts)
Utility and helper files should use **kebab-case**:

```
✅ Good:
- date-utils.ts
- validation-helpers.ts
- api-client.ts

### Hook Files (.ts/.tsx)

Custom hooks should use **kebab-case** and be prefixed with `use-`:

```
✅ Good:
- use-auth.ts
- use-booking-data.ts
- use-debounce.ts


### Type/Interface Files (.ts)

Type definition files should use **kebab-case**:

```
✅ Good:
- property-types.ts
- user-interfaces.ts
- api-responses.ts
```

## Component Structure

### Component Export

Components should use **PascalCase** for the component name and be exported as default:
```tsx
// property-card.tsx
export default function PropertyCard({ title, price }: PropertyCardProps) {
  return (
    <div className="property-card">
      <h3>{title}</h3>
      <p>{price}</p>
    </div>
  )
}
```

### Props Interface

Props interfaces should be named with the component name + `Props` suffix:

```tsx
interface PropertyCardProps {
  title: string
  price: number
  imageUrl?: string
}

export default function PropertyCard({ title, price, imageUrl }: PropertyCardProps) {
  // ...
}
```

## Directory Structure

```
rent-with-love/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Route groups use parentheses
│   │   ├── login/
│   │   └── register/
│   ├── properties/
│   ├── dashboard/
│   ├── layout.tsx
│   └── page.tsx
├── components/              # Reusable components
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── dialog.tsx
│   ├── forms/              # Form components
│   │   ├── property-form.tsx
│   │   └── booking-form.tsx
│   ├── layout/             # Layout components
│   │   ├── navigation.tsx
│   │   ├── footer.tsx
│   │   └── sidebar.tsx
│   └── features/           # Feature-specific components
│       ├── property-card.tsx
│       └── booking-calendar.tsx
├── db/                     # Database layer
│   ├── schema.ts          # Drizzle schema definitions
│   ├── index.ts           # Database client
│   └── queries/           # Database queries
│       ├── properties.ts
│       └── users.ts
├── lib/                    # Utility functions
│   ├── utils.ts           # General utilities (shadcn)
│   ├── api-client.ts
│   └── validators.ts
├── hooks/                  # Custom React hooks
│   ├── use-auth.ts
│   └── use-booking.ts
├── types/                  # TypeScript type definitions
│   ├── property.ts
│   └── user.ts
├── public/                 # Static assets
│   └── images/
└── drizzle.config.ts      # Drizzle configuration
```

## shadcn/ui Integration

### Installing Components

Always use the shadcn CLI to install components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

### Using UI Components

Import shadcn components from `@/components/ui`:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PropertyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>View Details</Button>
      </CardContent>
    </Card>
  )
}
```

### Customizing UI Components

Extend shadcn components rather than modifying them directly:

```tsx
// components/custom-button.tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomButtonProps extends React.ComponentProps<typeof Button> {
  gradient?: boolean
}

export default function CustomButton({
  gradient,
  className,
  ...props
}: CustomButtonProps) {
  return (
    <Button
      className={cn(
        gradient && "bg-gradient-to-r from-purple-500 to-pink-500",
        className
      )}
      {...props}
    />
  )
}
```

## TypeScript Guidelines

### Type Definitions

- Use `interface` for object shapes
- Use `type` for unions, intersections, and primitives
- Export types that are used in multiple files

```tsx
// Good
interface User {
  id: string
  name: string
  email: string
}

type UserRole = "admin" | "user" | "guest"

// Use the types
interface UserWithRole extends User {
  role: UserRole
}
```

### Avoid `any`

Always provide proper types. Use `unknown` if the type is truly unknown:

```tsx
// Bad
const data: any = fetchData()

// Good
interface ApiResponse {
  data: Property[]
  total: number
}

const response: ApiResponse = await fetchData()
```

## Styling with Tailwind CSS

### Class Organization

Use the `cn()` utility from `@/lib/utils` to merge classes:

```tsx
import { cn } from "@/lib/utils"

interface CardProps {
  variant?: "default" | "outlined"
  className?: string
}

export default function Card({ variant = "default", className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-4",
        variant === "default" && "bg-white shadow-md",
        variant === "outlined" && "border border-gray-300",
        className
      )}
    >
      {/* content */}
    </div>
  )
}
```

### Responsive Design
Follow mobile-first approach:

```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Mobile: full width, Tablet: half width, Desktop: third width */}
</div>
```

## Import Order

Organize imports in the following order:

1. React and Next.js imports
2. External library imports
3. Internal component imports
4. Internal utility/hook imports
5. Type imports
6. Style imports

```tsx
// 1. React/Next.js
import { useState } from "react"
import Link from "next/link"

// 2. External libraries
import { format } from "date-fns"
import { z } from "zod"

// 3. Components
import { Button } from "@/components/ui/button"
import PropertyCard from "@/components/features/property-card"

// 4. Utils/Hooks
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

// 5. Types
import type { Property } from "@/types/property"
```

## Code Style

### Use Modern JavaScript/TypeScript

```tsx
// Use arrow functions for callbacks
const filtered = properties.filter((property) => property.available)

// Use destructuring
const { id, title, price } = property

// Use optional chaining
const imageUrl = property.images?.[0]?.url

// Use nullish coalescing
const displayPrice = price ?? 0
```

### Async/Await

Prefer `async/await` over `.then()`:

```tsx
// Good
async function fetchProperties() {
  try {
    const response = await fetch("/api/properties")
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Failed to fetch properties:", error)
    throw error
  }
}

// Avoid
function fetchProperties() {
  return fetch("/api/properties")
    .then(response => response.json())
    .catch(error => {
      console.error(error)
      throw error
    })
}
```

## Component Patterns

### Server Components (Default)

By default, components in the app directory are Server Components:

```tsx
// app/properties/page.tsx
import PropertyCard from "@/components/features/property-card"

export default async function PropertiesPage() {
  const properties = await fetchProperties()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {properties.map((property) => (
        <PropertyCard key={property.id} {...property} />
      ))}
    </div>
  )
}
```

### Client Components

Use `"use client"` for interactive components:

```tsx
// components/forms/search-form.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function SearchForm() {
  const [query, setQuery] = useState("")

  return (
    <form>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit">Search</Button>
    </form>
  )
}
```

### Compound Components

For complex components with multiple parts:

```tsx
// components/ui/property-card.tsx
interface PropertyCardProps {
  children: React.ReactNode
  className?: string
}

export function PropertyCard({ children, className }: PropertyCardProps) {
  return <div className={cn("card", className)}>{children}</div>
}

PropertyCard.Image = function PropertyCardImage({ src, alt }: ImageProps) {
  return <img src={src} alt={alt} className="card-image" />
}

PropertyCard.Title = function PropertyCardTitle({ children }: TitleProps) {
  return <h3 className="card-title">{children}</h3>
}

PropertyCard.Price = function PropertyCardPrice({ amount }: PriceProps) {
  return <p className="card-price">${amount}</p>
}

// Usage
<PropertyCard>
  <PropertyCard.Image src="..." alt="..." />
  <PropertyCard.Title>Beautiful Home</PropertyCard.Title>
  <PropertyCard.Price amount={1200} />
</PropertyCard>
```

## Testing Conventions

### Test File Naming

Test files should mirror component names with `.test.tsx` or `.spec.tsx`:

```
property-card.tsx
property-card.test.tsx
```

## Git Commit Conventions

Follow conventional commits:
```
feat: add property search functionality
fix: resolve booking date validation issue
docs: update README with setup instructions
style: format code with prettier
refactor: simplify authentication logic
test: add tests for property card component
chore: update dependencies
```

## Environment Variables

- Store in `.env.local` (gitignored)
- Prefix public variables with `NEXT_PUBLIC_`
- Document all required variables in `.env.example`

```bash
# .env.local
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_API_URL="https://api.example.com"
```

## Performance Best Practices

1. **Use Server Components** when possible for better performance
2. **Lazy load** heavy client components:
   ```tsx
   import dynamic from "next/dynamic"

   const HeavyComponent = dynamic(() => import("@/components/heavy-component"))
   ```
3. **Optimize images** with Next.js Image component:
   ```tsx
   import Image from "next/image"

   <Image
     src="/property.jpg"
     alt="Property"
     width={800}
     height={600}
     priority
   />
   ```
4. **Use React Server Actions** for form submissions and mutations

## Accessibility

- Use semantic HTML elements
- Add proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper heading hierarchy

```tsx
// Good
<button aria-label="Close dialog" onClick={onClose}>
  <X className="h-4 w-4" />
</button>

// Bad
<div onClick={onClose}>
  <X className="h-4 w-4" />
</div>
```

## Database Conventions (Drizzle ORM + Neon DB)

This project uses **Drizzle ORM** with **Neon DB** (PostgreSQL) in a **centralized database** architecture. Multiple projects may share the same database, so we use **table prefixing** to isolate data.

### Project Table Prefix

All tables in this project must use the prefix: **`rent_`**

### Database Setup

#### 1. Install Dependencies

```bash
bun add drizzle-orm @neondatabase/serverless
bun add -d drizzle-kit dotenv
```

#### 2. Drizzle Configuration

Create `drizzle.config.ts` in the project root:

```typescript
import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

export default defineConfig({
  schema: "./db/schema.ts",
  dialect: "postgresql",
  tablesFilter: ["rent_*"],  // Only manage tables with rent_ prefix
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

#### 3. Environment Variables

Add to `.env.local`:

```bash
# Neon Database URL
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
```

### Table Naming Convention

Use the `pgTableCreator` to automatically prefix all tables:

```typescript
// db/schema.ts
import { pgTableCreator } from "drizzle-orm/pg-core";

// Create table creator with project prefix
export const tableCreator = pgTableCreator((name) => `rent_${name}`);

// Now use tableCreator instead of pgTable
export const users = tableCreator("users", {
  // This creates a table named "rent_users"
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Schema Definition

#### File Structure

```
db/
├── schema.ts           # Main schema file (all table definitions)
├── index.ts           # Database client initialization
└── queries/           # Query functions
    ├── properties.ts
    ├── users.ts
    └── bookings.ts
```

### Database Client

```typescript
// db/index.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
```

### Query Organization

Organize queries by entity in the `db/queries/` directory:

```typescript
// db/queries/properties.ts
import { db } from "../index";
import { properties, users } from "../schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import type { NewProperty } from "../schema";

// Get all available properties
export async function getAvailableProperties() {
  return await db
    .select()
    .from(properties)
    .where(eq(properties.isAvailable, true))
    .orderBy(desc(properties.createdAt));
}

// Get property by ID with owner
export async function getPropertyById(id: number) {
  const result = await db
    .select()
    .from(properties)
    .where(eq(properties.id, id))
    .leftJoin(users, eq(properties.ownerId, users.id));

  return result[0] ?? null;
}

// Create new property
export async function createProperty(data: NewProperty) {
  const [property] = await db
    .insert(properties)
    .values(data)
    .returning();

  return property;
}

// Update property
export async function updateProperty(id: number, data: Partial<NewProperty>) {
  const [updated] = await db
    .update(properties)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(properties.id, id))
    .returning();

  return updated;
}

// Search properties
export async function searchProperties(filters: {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
}) {
  let query = db.select().from(properties).where(eq(properties.isAvailable, true));
  // Add filters dynamically (example - use query builder properly)
  // This is a simplified example
  return await query;
}
```

### Naming Conventions for Database

#### Table Names
- Use **snake_case** for table names (handled by tableCreator)
- Use **plural** nouns (e.g., `users`, `properties`, `bookings`)
- All tables automatically prefixed with `rent_`

```typescript
// Creates: rent_users
export const users = tableCreator("users", { ... });

// Creates: rent_properties
export const properties = tableCreator("properties", { ... });

// Creates: rent_user_preferences
export const userPreferences = tableCreator("user_preferences", { ... });
```

#### Column Names
- Use **snake_case** for column names
- Use descriptive names
- Boolean columns should start with `is_`, `has_`, `can_`, etc.

```typescript
// Good
{
  firstName: text("first_name"),
  isAvailable: boolean("is_available"),
  hasParking: boolean("has_parking"),
  createdAt: timestamp("created_at"),
}

// Bad
{
  firstName: text("firstName"),  // camelCase
  available: boolean("available"),  // Missing 'is_' prefix
  parking: boolean("parking"),  // Not descriptive
}
```

#### Foreign Keys
- Name foreign key columns as `{referenced_table}_id`
- Always add references

```typescript
export const bookings = tableCreator("bookings", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id")
    .notNull()
    .references(() => properties.id),
  renterId: integer("renter_id")
    .notNull()
    .references(() => users.id),
});
```

### Migration Workflow

#### Generate Migration

```bash
# Generate migration from schema changes
bun run drizzle-kit generate
```

#### Push to Database

```bash
# Push changes directly to database (development)
bun run drizzle-kit push

# Or apply migrations (production)
bun run drizzle-kit migrate
```

#### View Database

```bash
# Open Drizzle Studio to view/edit data
bun run drizzle-kit studio
```

### Scripts to Add to package.json

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

### Using Database in Server Components

```tsx
// app/properties/page.tsx
import { getAvailableProperties } from "@/db/queries/properties";
import PropertyCard from "@/components/features/property-card";

export default async function PropertiesPage() {
  const properties = await getAvailableProperties();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
```

### Using Database in API Routes

```typescript
// app/api/properties/route.ts
import { NextResponse } from "next/server";
import { createProperty } from "@/db/queries/properties";
import { z } from "zod";

const createPropertySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  bedrooms: z.number().int().positive(),
  bathrooms: z.number().int().positive(),
  ownerId: z.number().int().positive(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createPropertySchema.parse(body);

    const property = await createProperty(validated);

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
```

### Database Best Practices

1. **Always use the tableCreator** - Never use `pgTable` directly
2. **Type safety** - Always export and use inferred types from schema
3. **Query organization** - Keep queries in `db/queries/` directory
4. **Transactions** - Use for multi-step operations
   ```typescript
   await db.transaction(async (tx) => {
     await tx.insert(users).values(userData);
     await tx.insert(properties).values(propertyData);
   });
   ```
5. **Prepared statements** - Use for repeated queries
   ```typescript
   const preparedQuery = db
     .select()
     .from(properties)
     .where(eq(properties.id, placeholder("id")))
     .prepare("get_property_by_id");

   const property = await preparedQuery.execute({ id: 123 });
   ```
6. **Index important columns** - Add indexes for frequently queried columns
   ```typescript
   import { index } from "drizzle-orm/pg-core";

   export const properties = tableCreator("properties", {
     // ... columns
   }, (table) => ({
     cityIdx: index("city_idx").on(table.city),
     priceIdx: index("price_idx").on(table.price),
   }));
   ```
7. **Timestamps** - Always include `createdAt` and `updatedAt`
8. **Soft deletes** - Consider using `deletedAt` instead of hard deletes
   ```typescript
   deletedAt: timestamp("deleted_at")
   ```

### Common Pitfalls to Avoid

1. ❌ Using `pgTable` directly instead of `tableCreator`
2. ❌ Forgetting to add `tablesFilter` in `drizzle.config.ts`
3. ❌ Using camelCase in column names
4. ❌ Not adding foreign key references
5. ❌ Hardcoding database queries in components
6. ❌ Not using prepared statements for repeated queries
7. ❌ Forgetting to handle database errors
8. ❌ Not using transactions for related operations

