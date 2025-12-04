# Color Palette

Complete color documentation for the plant care application, including both CSS variable system (OKLCH) and Tailwind color utilities used throughout the project.

---

## Color System Overview

This project uses a **dual color system**:
1. **CSS Variables (OKLCH)**: Semantic theme colors that adapt to light/dark mode
2. **Tailwind Colors**: Direct color utilities for specific components and gradients

---

## Part 1: CSS Variables (Theme System)

All theme colors use **OKLCH color space** for perceptually uniform colors.

### Light Mode Theme

#### Foundation Colors
```css
--background: oklch(0.9889 0.0053 17.2475);      /* Near white with warm tint */
--foreground: oklch(0.2977 0.0425 31.1162);      /* Dark brown-green text */
--card: oklch(0.9711 0.0074 80.7211);            /* Off-white with green undertone */
--card-foreground: oklch(0.3000 0.0358 30.2042); /* Dark text on cards */
--popover: oklch(0.9711 0.0074 80.7211);         /* Same as card */
--popover-foreground: oklch(0.3000 0.0358 30.2042);
```

#### Brand Colors
```css
--primary: oklch(0.5234 0.1347 144.1672);           /* Soft leaf green */
--primary-foreground: oklch(1.0000 0 0);            /* White */
--secondary: oklch(0.9571 0.0210 147.6360);         /* Pale mint */
--secondary-foreground: oklch(0.4254 0.1159 144.3078); /* Dark green */
--accent: oklch(0.8952 0.0504 146.0366);            /* Soft teal */
--accent-foreground: oklch(0.4254 0.1159 144.3078); /* Dark green */
```

#### UI Elements
```css
--muted: oklch(0.9370 0.0142 74.4218);              /* Light gray-green */
--muted-foreground: oklch(0.4495 0.0486 39.2110);   /* Dimmed text */
--border: oklch(0.8805 0.0208 74.6428);             /* Subtle border */
--input: oklch(0.8805 0.0208 74.6428);              /* Input border */
--ring: oklch(0.5234 0.1347 144.1672);              /* Focus ring (primary) */
--destructive: oklch(0.5386 0.1937 26.7249);        /* Warm red */
--destructive-foreground: oklch(1.0000 0 0);        /* White */
```

#### Chart Colors (Green Gradient)
```css
--chart-1: oklch(0.6731 0.1624 144.2083);  /* Brightest */
--chart-2: oklch(0.5752 0.1446 144.1813);  /* Medium-bright */
--chart-3: oklch(0.5234 0.1347 144.1672);  /* Medium (primary) */
--chart-4: oklch(0.4254 0.1159 144.3078);  /* Darker */
--chart-5: oklch(0.2157 0.0453 145.7256);  /* Darkest */
```

### Dark Mode Theme

```css
--background: oklch(0.2683 0.0279 150.7681);        /* Dark green-gray */
--foreground: oklch(0.9423 0.0097 72.6595);         /* Light text */
--primary: oklch(0.6731 0.1624 144.2083);           /* Brighter green */
--primary-foreground: oklch(0.2157 0.0453 145.7256); /* Very dark green */
/* ... similar adaptations for all tokens */
```

**Usage in Code:**
```tsx
<div className="bg-background text-foreground">
<Button className="bg-primary text-primary-foreground">
<Card className="bg-card text-card-foreground border-border">
```

---

## Part 2: Tailwind Color Utilities (Actual Usage)

These are the **hardcoded Tailwind colors** actively used throughout the project.

### Green Palette (Primary Theme - ~40% of usage)

**Shades Used:** 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

#### Background Colors
- `bg-green-50` - Lightest green backgrounds
- `bg-green-100` - Light green surfaces
- `bg-green-200` - Medium-light green
- `bg-green-500` - Primary action backgrounds
- `bg-green-600` - Hover states for primary actions

#### Text Colors
- `text-green-600` - Links, positive indicators
- `text-green-700` - Medium-contrast text
- `text-green-800` - High-contrast text
- `text-green-900` - Maximum contrast

#### Borders
- `border-green-200` - Light borders on green surfaces
- `border-green-300` - Medium borders

#### Gradients
- `from-green-50 to-emerald-50` - Light backgrounds
- `from-green-100 to-emerald-50` - Icon containers
- `from-green-500 to-emerald-500` - Primary buttons
- `from-green-600 to-emerald-600` - Hover states

**Where Used:**
- Landing page hero button
- Plants page header and actions
- Profile avatar, status badges
- Bottom navigation (active state)
- Optimal plant health indicators
- Primary CTAs throughout app

---

### Blue & Cyan Palette (Actions & Identification)

**Shades Used:** 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

#### Background Colors
- `bg-blue-50` - Info backgrounds
- `bg-blue-100` - Light blue surfaces
- `bg-blue-500` - Action buttons

#### Text Colors
- `text-blue-700`, `text-blue-800`, `text-blue-900` - Blue text variations

#### Borders
- `border-blue-200`, `border-blue-300` - Blue element borders

#### Gradients
- `from-blue-50 to-cyan-50` - Light backgrounds
- `from-blue-100 to-cyan-50` - Icon containers
- `from-blue-500 to-cyan-500` - Action buttons
- `from-blue-600 to-cyan-600` - Hover states

**Where Used:**
- Identify/scanner page header and buttons
- Quick action cards on dashboard
- Watering indicators
- Temperature/humidity displays
- Tab triggers in result displays

---

### Purple & Pink Palette (Health & Analytics)

**Shades Used:** 50, 100, 200, 300, 500, 600, 700, 800, 900

#### Background Colors
- `bg-purple-50` - Info boxes
- `bg-purple-100` - Light surfaces
- `bg-purple-500` - Primary actions

#### Gradients
- `from-purple-50 to-pink-50` - Light backgrounds
- `from-purple-100 to-pink-50` - Header icons
- `from-purple-500 to-pink-500` - Action buttons
- `from-purple-600 to-pink-600` - Hover states

#### Borders
- `border-purple-200`, `border-purple-300`

**Where Used:**
- Health check page (header, inputs, buttons)
- Analytics page header and cards
- Profile page info sections
- Quick action cards

---

### Yellow, Amber & Orange Palette (Light & Warnings)

**Shades Used:** 50, 200, 400

#### Background Colors
- `bg-yellow-50` - Warning backgrounds
- `bg-yellow-200` - Light indicators
- `bg-yellow-400` - Active warnings

#### Gradients
- `from-yellow-50 to-orange-50` - Light backgrounds
- `from-yellow-400 to-orange-400` - Progress bars
- `from-amber-50 to-yellow-50` - Warning surfaces

#### Text Colors
- `text-yellow-*`, `text-amber-*`, `text-orange-*` - Warning text

#### Borders
- `border-yellow-200`, `border-amber-200`

**Where Used:**
- Light requirement cards (lux thresholds)
- Warning indicators (medium confidence)
- Analytics progress bars
- Plant care warnings
- Temperature indicators

---

### Red & Pink Palette (Critical & Destructive)

**Shades Used:** 50, 200, 400, 500, 600, 700, 800, 900

#### Background Colors
- `bg-red-50` - Error backgrounds
- `bg-red-500`, `bg-red-600` - Destructive buttons

#### Text Colors
- `text-red-600`, `text-red-700`, `text-red-800` - Error text

#### Borders
- `border-red-200`, `border-red-500`

#### Gradients
- `from-red-50 to-pink-50` - Error surfaces
- `from-red-400 to-pink-400` - Progress indicators

**Where Used:**
- Low confidence indicators
- Sign out button
- Critical plant health alerts
- Delete/destructive actions
- Error states

---

### Slate & Gray Palette (Neutrals)

**Shades Used:** 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

#### Background Colors
- `bg-slate-50`, `bg-slate-100` - Subtle backgrounds
- `bg-slate-600` - Dark elements

#### Text Colors
- `text-slate-400` - Placeholder text
- `text-slate-500` - Dimmed text
- `text-slate-600` - Secondary text
- `text-slate-700`, `text-slate-800`, `text-slate-900` - Primary text variations

#### Borders
- `border-slate-200`, `border-slate-300` - Neutral borders

#### Gradients
- `from-slate-50 to-white` - Page backgrounds
- `from-slate-100 to-slate-200` - Inactive navigation
- `from-slate-500 to-slate-700` - Dark tab triggers

**Where Used:**
- Landing page background
- Dashboard background
- Bottom navigation (inactive state)
- Form inputs
- Settings buttons
- Secondary elements throughout

---

### Emerald Palette (Secondary Green)

**Shades Used:** 50, 100, 200, 500, 600

#### Gradients (Primary Use)
- `to-emerald-50` - Pairs with green/blue/cyan
- `to-emerald-500`, `to-emerald-600` - Action button gradients

**Where Used:**
- Always paired with green in gradients
- Primary action buttons
- Active states
- Positive indicators

---

### Sky Palette (Light/Water)

**Shades Used:** 50, 200, 800

#### Gradients
- `from-sky-50 to-blue-50` - Humidity indicators
- `border-sky-200`, `text-sky-800`

**Where Used:**
- Humidity display cards
- Water-related indicators

---

## Part 3: Gradient Patterns

The app uses three main gradient patterns:

### 1. Light Pastel Gradients (Backgrounds)
```tsx
className="from-[color]-50 to-[color2]-50"
```
**Examples:**
- `from-white to-green-50/30` - Card overlays
- `from-blue-50 to-cyan-50` - Info surfaces
- `from-purple-50 to-pink-50` - Feature sections

### 2. Action Gradients (Buttons)
```tsx
className="from-[color]-500 to-[color2]-500"
```
**Examples:**
- `from-green-500 to-emerald-500` - Primary buttons
- `from-blue-500 to-cyan-500` - Scan button
- `from-purple-500 to-pink-500` - Health check button

### 3. Hover Gradients
```tsx
className="hover:from-[color]-600 hover:to-[color2]-600"
```
**Examples:**
- `hover:from-green-600 hover:to-emerald-600`
- `hover:from-blue-600 hover:to-cyan-600`

### 4. Progress Bar Gradients
```tsx
className="from-[color]-400 to-[color2]-400"
```
Used in analytics for progress indicators.

---

## Part 4: Semantic Color Usage

### Plant Health States

| State | Background | Border | Text | Usage |
|-------|-----------|--------|------|-------|
| **Optimal** | `bg-green-50` | `border-green-200` | `text-green-700/800` | Healthy plants, good conditions |
| **Safe** | `from-green-50 to-emerald-50` | `border-green-300` | `text-green-900` | Non-toxic plants |
| **Warning** | `bg-yellow-50` or `bg-amber-50` | `border-yellow-200` or `border-amber-200` | `text-yellow-800` or `text-amber-800` | Attention needed, medium confidence |
| **Critical** | `bg-red-50` | `border-red-200` | `text-red-700/800` | Unhealthy, low confidence |
| **Toxic** | `from-red-50 to-orange-50` | `border-red-300` | `text-red-900` | Dangerous plants |

### Confidence Levels (Identification)

| Confidence | Background | Border | Text |
|-----------|-----------|--------|------|
| **High (85%+)** | `bg-green-50` | `border-green-200` | `text-green-700` |
| **Medium (60-84%)** | `bg-emerald-50` | `border-emerald-200` | `text-emerald-700` |
| **Low (35-59%)** | `bg-amber-50` | `border-amber-200` | `text-amber-800` |
| **Very Low (<35%)** | `bg-red-50` | `border-red-200` | `text-red-700` |

### Feature Pages Color Coding

| Page | Primary Gradient | Icon Container | Purpose |
|------|-----------------|----------------|---------|
| **Plants** | Green-Emerald | `from-green-100 to-emerald-50` | Plant management |
| **Identify** | Blue-Cyan | `from-blue-100 to-cyan-50` | Camera/scanning |
| **Health** | Purple-Pink | `from-purple-100 to-pink-50` | Health diagnosis |
| **Analytics** | Purple-Pink | `from-purple-100 to-pink-50` | Data visualization |
| **Profile** | Green | `from-white to-green-50/30` | User settings |

### Environmental Indicators

| Indicator | Gradient | Border | Text | Icon Color |
|-----------|----------|--------|------|-----------|
| **Light** | `from-yellow-50 to-amber-50` | `border-yellow-200` | `text-yellow-800` | Yellow |
| **Water** | `from-blue-50 to-cyan-50` | `border-blue-200` | `text-blue-800` | Blue |
| **Temperature** | `from-orange-50 to-red-50` | `border-orange-200` | `text-orange-800` | Orange |
| **Humidity** | `from-sky-50 to-blue-50` | `border-sky-200` | `text-sky-800` | Sky |

---

## Part 5: Component-Specific Colors

### Bottom Navigation
```tsx
// Active state
className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl"

// Inactive state
className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 border border-slate-300"
```

### Button Variants (shadcn/ui)
```tsx
// Primary
<Button variant="default" className="bg-primary text-primary-foreground">

// Secondary
<Button variant="secondary" className="bg-secondary text-secondary-foreground">

// Destructive
<Button variant="destructive" className="bg-destructive text-destructive-foreground">

// Outline
<Button variant="outline" className="border bg-background hover:bg-accent">

// Ghost
<Button variant="ghost" className="hover:bg-accent hover:text-accent-foreground">
```

### Cards
```tsx
// Standard card
<Card className="bg-card text-card-foreground border-border">

// Gradient overlay cards
className="from-white to-green-50/30"
className="from-white to-blue-50/30"
className="from-white to-purple-50/30"
className="from-white to-slate-50/30"
```

### Forms & Inputs
```tsx
// Standard input
<Input className="border-border focus:ring-ring">

// Health check input (special)
className="border-purple-200 from-purple-50/50 to-white focus:border-purple-400 focus:ring-purple-100"

// Login/signup inputs
className="border-slate-300 focus:ring-green-500"
```

### Profile Elements
```tsx
// Avatar
className="border-green-200 bg-green-100 text-green-700"

// Status badge
className="from-green-100 to-emerald-50 border-green-300"

// Toggle ON
className="bg-green-500"

// Toggle OFF
className="bg-slate-300"

// Device indicator (online)
className="bg-green-500"
```

---

## Part 6: Hardcoded Values

### Chart-Specific Colors
```tsx
// Green line (primary data)
color: "hsl(142, 76%, 36%)"  // or #10b981
strokeColor: "#10b981"

// Warning line
strokeColor: "#f59e0b"  // Amber

// Grid
gridColor: "#f0f0f0"  // Light gray
```

### Overlays & Shadows
```css
/* Scanner overlay */
bg-black/50

/* Shadows (defined in CSS) */
--shadow-color: oklch(0 0 0);
--shadow-opacity: 0.1;
box-shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.10)
```

---

## Part 7: Usage Guidelines

### When to Use CSS Variables vs. Tailwind Colors

**Use CSS Variables (`bg-primary`, etc.) when:**
- Building reusable UI components
- Need automatic dark mode adaptation
- Creating semantic elements (buttons, cards, inputs)
- Want theme consistency

**Use Tailwind Colors (`bg-green-500`, etc.) when:**
- Creating specific feature pages with unique branding
- Building gradients
- Semantic states (success, warning, error)
- One-off custom designs

### Color Pairing Rules

1. **Gradient Backgrounds** → Use matching border & text
   ```tsx
   className="from-green-50 to-emerald-50 border-green-200 text-green-800"
   ```

2. **Action Buttons** → Use -500 background, -600 hover
   ```tsx
   className="from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
   ```

3. **Icon Containers** → Use -100 + -50 gradient with -300 border
   ```tsx
   className="from-green-100 to-emerald-50 border-green-300"
   ```

### Accessibility Standards

All color combinations meet **WCAG AA** standards:
- Normal text: 4.5:1 contrast minimum ✓
- Large text: 3:1 contrast minimum ✓
- UI components: 3:1 contrast minimum ✓

Test at: https://webaim.org/resources/contrastchecker/

---

## Part 8: Quick Reference

### Most Common Color Combinations

```tsx
// Primary button
"from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"

// Secondary button
"bg-white border-slate-200 text-slate-700 hover:bg-slate-50"

// Icon container (green)
"from-green-100 to-emerald-50 border-green-300"

// Icon container (blue)
"from-blue-100 to-cyan-50 border-blue-300"

// Success message
"from-green-50 to-emerald-50 border-green-200 text-green-800"

// Warning message
"from-amber-50 to-yellow-50 border-amber-200 text-amber-800"

// Error message
"from-red-50 to-pink-50 border-red-200 text-red-700"

// Info box
"from-blue-50 to-cyan-50 border-blue-200 text-blue-800"

// Page background
"bg-gradient-to-b from-slate-50 to-white"

// Card overlay
"from-white to-green-50/30"
```

---

## Design Philosophy

The color system follows these principles:

1. **Nature-Inspired**: Green as primary color represents plants, growth, health
2. **Semantic Clarity**: Each color has clear meaning (green=good, yellow=warning, red=critical)
3. **Gradient Consistency**: All gradients follow same pattern (light: -50/-50, action: -500/-500, hover: -600/-600)
4. **Accessibility First**: All combinations meet WCAG AA standards
5. **Dark Mode Ready**: CSS variables adapt automatically
6. **Visual Hierarchy**: Color saturation indicates importance

---

## Tools & Resources

- **OKLCH Converter**: https://oklch.com/
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Tailwind Colors**: https://tailwindcss.com/docs/customizing-colors
- **Gradient Generator**: https://hypercolor.dev/
