# Design Standards

Guidelines for creating consistent, beautiful, and user-friendly interfaces across all agency projects.

## Design System Principles

### 1. Consistency
- Use consistent spacing, colors, and typography across all pages
- Reuse components rather than creating variations
- Maintain consistent interaction patterns

### 2. Hierarchy
- Clear visual hierarchy guides user attention
- Use size, color, and spacing to establish importance
- Ensure primary actions are visually prominent

### 3. Simplicity
- Remove unnecessary elements
- One primary action per screen/section
- White space is a design element, not wasted space

### 4. Accessibility First
- Design for all users, including those with disabilities
- Ensure sufficient color contrast (WCAG AA minimum)
- Support keyboard navigation and screen readers

---

## Color System

### Primary Colors

Define your brand's primary color palette:

```css
/* Example - Customize for your brand */
--primary-50: #f0f9ff;
--primary-100: #e0f2fe;
--primary-500: #0ea5e9;  /* Main brand color */
--primary-600: #0284c7;
--primary-700: #0369a1;
```

### Usage Guidelines

- **Primary**: Main brand actions (CTA buttons, links, key UI elements)
- **Secondary**: Supporting actions, less prominent features
- **Accent**: Highlights, notifications, badges
- **Neutral**: Text, backgrounds, borders
- **Semantic**: Success (green), Warning (yellow), Error (red), Info (blue)

### Color Contrast

All text must meet WCAG AA standards:
- **Normal text**: 4.5:1 contrast ratio minimum
- **Large text** (18px+ or 14px+ bold): 3:1 contrast ratio minimum
- **Interactive elements**: 3:1 contrast ratio for UI components

Test contrast at: https://webaim.org/resources/contrastchecker/

---

## Typography

### Font Families

```css
/* Example - Next.js with Google Fonts */
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-serif: 'Merriweather', Georgia, serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

### Type Scale

Use a consistent type scale across all projects:

```css
/* Recommended scale (based on 16px base) */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

### Font Weights

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Usage Guidelines

- **Headings**: Use semibold (600) or bold (700)
- **Body text**: Use normal (400) or medium (500)
- **Captions/labels**: Use normal (400) or medium (500) at smaller sizes
- **Line height**: 1.5 for body text, 1.2-1.3 for headings

---

## Spacing System

Use a consistent spacing scale (8px base unit):

```css
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-5: 1.25rem;  /* 20px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-10: 2.5rem;  /* 40px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
--spacing-20: 5rem;    /* 80px */
--spacing-24: 6rem;    /* 96px */
```

### Spacing Guidelines

- **Component padding**: Use 4, 6, or 8 (16px, 24px, 32px)
- **Gap between elements**: Use 3, 4, or 6 (12px, 16px, 24px)
- **Section spacing**: Use 12, 16, or 20 (48px, 64px, 80px)
- **Page margins**: Use 4-8 on mobile, 8-16 on desktop

---

## Responsive Breakpoints

Use mobile-first responsive design:

```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

### Design for These Viewports

1. **Mobile**: 375px - 639px (iPhone SE to large phones)
2. **Tablet**: 640px - 1023px (iPad, Android tablets)
3. **Desktop**: 1024px+ (Laptops and desktops)

### Responsive Guidelines

- Design mobile-first, then scale up
- Test on actual devices, not just browser resize
- Ensure touch targets are at least 44x44px on mobile
- Stack layouts vertically on mobile, use grid/flex on desktop

---

## Component Design Patterns

### Buttons

#### Primary Button
```tsx
<Button variant="default" size="default">
  Primary Action
</Button>
```
- Use for main actions (Submit, Save, Continue)
- Limit to 1-2 per screen
- High contrast with background

#### Secondary Button
```tsx
<Button variant="outline" size="default">
  Secondary Action
</Button>
```
- Use for less important actions (Cancel, Back)
- Can have multiple per screen

#### Destructive Button
```tsx
<Button variant="destructive" size="default">
  Delete
</Button>
```
- Use for irreversible actions (Delete, Remove)
- Always require confirmation

#### Button Sizes
- **Small**: Compact spaces, table actions
- **Default**: Standard UI interactions
- **Large**: Hero sections, primary CTAs

### Cards

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Supporting text</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
```

#### Card Guidelines
- Use consistent border radius (8px recommended)
- Include subtle shadow for depth
- Ensure adequate padding (16-24px)
- Keep card content focused and scannable

### Forms

#### Input Fields
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="you@example.com"
    aria-describedby="email-description"
  />
  <p id="email-description" className="text-sm text-muted-foreground">
    We'll never share your email.
  </p>
</div>
```

#### Form Guidelines
- Always associate labels with inputs
- Provide helpful placeholder text
- Show clear validation errors
- Use appropriate input types (email, tel, url)
- Group related fields together

### Navigation

#### Header Navigation
```tsx
<nav className="flex items-center justify-between">
  <Logo />
  <div className="hidden md:flex gap-6">
    <NavLink href="/about">About</NavLink>
    <NavLink href="/services">Services</NavLink>
    <NavLink href="/contact">Contact</NavLink>
  </div>
  <MobileMenu className="md:hidden" />
</nav>
```

#### Navigation Guidelines
- Keep main navigation to 5-7 items max
- Use mega menus for complex navigation
- Ensure mobile menu is easily accessible
- Highlight current page in navigation
- Include skip navigation link for accessibility

### Modals/Dialogs

```tsx
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Supporting description text
      </DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Modal Guidelines
- Use for important actions requiring focus
- Include clear title and description
- Provide obvious close/cancel option
- Prevent body scroll when modal is open
- Trap keyboard focus within modal

---

## Imagery & Media

### Images

#### Optimization
- Use Next.js `<Image>` component for automatic optimization
- Provide `width` and `height` attributes
- Use `priority` for above-the-fold images
- Lazy load images below the fold

```tsx
<Image
  src="/hero.jpg"
  alt="Descriptive alt text"
  width={1200}
  height={630}
  priority
  quality={85}
/>
```

#### Formats
- **WebP**: Modern format, great compression
- **AVIF**: Better compression, growing support
- **JPEG**: Fallback for older browsers
- **PNG**: Logos, icons, images requiring transparency
- **SVG**: Icons, logos, illustrations

#### Best Practices
- Always include descriptive alt text
- Use aspect ratio placeholders to prevent layout shift
- Compress images before upload (TinyPNG, ImageOptim)
- Use CDN for image delivery (Cloudinary, Imgix)

### Icons

- Use consistent icon set (Lucide, Heroicons, Font Awesome)
- Size icons appropriately (16px, 20px, 24px)
- Ensure sufficient contrast
- Use ARIA labels for icon-only buttons

```tsx
import { Search } from "lucide-react"

<Button variant="ghost" size="icon" aria-label="Search">
  <Search className="h-5 w-5" />
</Button>
```

### Video

- Autoplay only if muted
- Provide playback controls
- Include captions/subtitles
- Optimize video file size
- Use poster image for video thumbnails

---

## Animation & Motion

### Principles

1. **Purposeful**: Animations should serve a purpose (feedback, direction, hierarchy)
2. **Subtle**: Keep animations understated and quick
3. **Performant**: Use CSS transforms and opacity (GPU-accelerated)
4. **Respectful**: Honor `prefers-reduced-motion` setting

### Duration

```css
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;
```

### Easing

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Common Animations

#### Fade In
```tsx
<div className="animate-in fade-in duration-200">
  Content
</div>
```

#### Slide In
```tsx
<div className="animate-in slide-in-from-bottom duration-300">
  Content
</div>
```

#### Reduced Motion
```tsx
<div className="transition-opacity duration-200 motion-reduce:transition-none">
  Content
</div>
```

---

## Layout Patterns

### Hero Section

```tsx
<section className="relative py-20 md:py-32">
  <div className="container mx-auto px-4">
    <div className="max-w-3xl">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Hero Headline
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-8">
        Supporting description text
      </p>
      <div className="flex gap-4">
        <Button size="lg">Primary CTA</Button>
        <Button size="lg" variant="outline">Secondary CTA</Button>
      </div>
    </div>
  </div>
</section>
```

### Feature Grid

```tsx
<section className="py-16">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <FeatureCard />
      <FeatureCard />
      <FeatureCard />
    </div>
  </div>
</section>
```

### Content with Sidebar

```tsx
<div className="container mx-auto px-4 py-12">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <main className="lg:col-span-2">
      {/* Main content */}
    </main>
    <aside className="lg:col-span-1">
      {/* Sidebar */}
    </aside>
  </div>
</div>
```

---

## Brand Consistency

### Logo Usage

- Maintain clear space around logo (minimum = logo height × 0.5)
- Use SVG format when possible
- Provide light and dark versions
- Never distort or rotate logo
- Specify minimum size (usually 120px wide)

### Brand Voice in Design

- **Professional**: Clean layouts, sophisticated typography
- **Friendly**: Rounded corners, warm colors, casual imagery
- **Innovative**: Bold colors, asymmetric layouts, modern fonts
- **Trustworthy**: Classic typography, structured layouts, muted colors

---

## Dark Mode Support

### Implementation

```tsx
// Use CSS variables that adapt to theme
<div className="bg-background text-foreground">
  {/* Content adapts to light/dark mode */}
</div>
```

### Color Variables

```css
/* Light mode */
--background: 0 0% 100%;
--foreground: 222.2 47.4% 11.2%;

/* Dark mode */
.dark {
  --background: 222.2 47.4% 11.2%;
  --foreground: 210 40% 98%;
}
```

### Guidelines

- Reduce contrast in dark mode (use grays instead of pure black/white)
- Test all components in both modes
- Use `dark:` prefix in Tailwind for dark mode styles
- Consider user preference with `prefers-color-scheme`

---

## Design Tools & Resources

### Recommended Tools

- **Design**: Figma (preferred), Adobe XD, Sketch
- **Prototyping**: Figma, Framer
- **Color**: Coolors, Adobe Color, Realtime Colors
- **Typography**: Google Fonts, Adobe Fonts
- **Icons**: Lucide, Heroicons, Phosphor Icons
- **Illustrations**: unDraw, Humaaans, Storyset

### Design Handoff

When handing off designs to developers:

1. **Use Figma Dev Mode** for accurate spacing and styles
2. **Name layers clearly** matching component names
3. **Create component variants** for different states
4. **Document interactions** and animation timing
5. **Export assets** in multiple sizes (1x, 2x, 3x)
6. **Specify fonts** and how to load them
7. **Include accessibility notes** (focus states, ARIA labels)

---

## Checklist for New Designs

Before finalizing any design:

- [ ] All text meets contrast requirements (4.5:1 minimum)
- [ ] Touch targets are at least 44x44px
- [ ] Focus states are clearly visible
- [ ] Design works on mobile (375px), tablet (768px), and desktop (1024px+)
- [ ] Consistent spacing using 8px grid
- [ ] Typography uses defined type scale
- [ ] Colors match brand palette
- [ ] Images have appropriate alt text guidance
- [ ] Interactive elements have clear hover/active states
- [ ] Forms have clear labels and error states
- [ ] Loading states are designed
- [ ] Empty states are designed
- [ ] Error states are designed
- [ ] Success states are designed
- [ ] Dark mode (if applicable) is designed

---

## Common Design Mistakes to Avoid

1. ❌ Too many font families (stick to 2 max)
2. ❌ Inconsistent spacing (use spacing scale)
3. ❌ Poor color contrast (test accessibility)
4. ❌ Too many colors (limit palette to 5-7 colors)
5. ❌ Unclear visual hierarchy
6. ❌ Too much content above the fold
7. ❌ Missing empty/error/loading states
8. ❌ Ignoring mobile experience
9. ❌ Not designing for different content lengths
10. ❌ Forgetting focus states for keyboard navigation
