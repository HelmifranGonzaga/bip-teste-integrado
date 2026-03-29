# Design Tokens - GitHub Primer Inspired

BIP Benefícios now uses a comprehensive design token system based on CSS custom properties. This ensures consistency, maintainability, and easy theme switching across the entire application.

## Overview

Design tokens are centralized style values (colors, spacing, typography) defined as CSS custom properties. They eliminate hardcoded values and make the design system scalable.

**Files:**
- `src/styles/tokens.css` - Core tokens (light mode)
- `src/styles/tokens-dark.css` - Dark mode overrides
- `src/styles/github-palette.css` - Extended palette & utilities

## Token Categories

### 1. Color Tokens

#### Neutral Scale (Grayscale)
```css
--color-neutral-50: #f8fafc;    /* Lightest */
--color-neutral-950: #020617;   /* Darkest */
```

Light mode ranges from 50 (lightest) to 950 (darkest). Dark mode inverts the scale.

#### Primary Color (BIP Green)
```css
--color-primary-500: #00b8a8;   /* Main green */
--color-primary: var(--color-primary-600); /* Alias for base */
```

#### Semantic Colors
```css
--color-success: var(--color-success-500);   /* Green (#10b981) */
--color-danger: var(--color-danger-500);     /* Red (#ef4444) */
--color-warning: var(--color-warning-500);   /* Amber (#f59e0b) */
--color-info: var(--color-info-500);         /* Blue (#3b82f6) */
```

#### Component-Specific Colors
```css
--color-background: var(--color-neutral-50);
--color-surface: var(--color-surface-50);
--color-text: var(--color-neutral-900);
--color-text-secondary: var(--color-neutral-600);
```

### 2. Typography Tokens

#### Font Families
```css
--font-family-base: "Montserrat", -apple-system, ...;
--font-family-mono: "Monaco", "Menlo", ...;
```

#### Font Sizes
```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */
```

#### Font Weights
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

#### Line Heights
```css
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
--line-height-loose: 2;
```

### 3. Spacing Tokens

8px scale (consistent with GitHub Primer):

```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */

/* Semantic aliases */
--spacing-xs: var(--spacing-2);    /* 8px */
--spacing-sm: var(--spacing-3);    /* 12px */
--spacing-md: var(--spacing-4);    /* 16px */
--spacing-lg: var(--spacing-6);    /* 24px */
--spacing-xl: var(--spacing-8);    /* 32px */
--spacing-2xl: var(--spacing-12);  /* 48px */
```

### 4. Border Radius Tokens

```css
--radius-sm: 4px;     /* Small buttons, badges */
--radius-md: 6px;     /* Form inputs */
--radius-lg: 8px;     /* Buttons, cards */
--radius-xl: 12px;    /* Large cards, modals */
--radius-2xl: 16px;   /* Extra large elements */
--radius-full: 9999px;/* Fully rounded (pill) */
```

### 5. Shadow Tokens

Elevation levels for depth:

```css
--shadow-none: none;
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);      /* Cards, inputs */
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);      /* Dropdowns */
--shadow-xl: 0 10px 30px rgba(0, 0, 0, 0.15);     /* Modals */
--shadow-2xl: 0 20px 60px rgba(0, 0, 0, 0.3);     /* Login card */

/* Component-specific */
--shadow-toast: 0 8px 24px rgba(0, 0, 0, 0.12);
--shadow-card: var(--shadow-md);
--shadow-modal: var(--shadow-2xl);
```

### 6. Z-Index Scale

```css
--z-base: 0;           /* Default */
--z-dropdown: 100;     /* Dropdowns, popovers */
--z-sticky: 200;       /* Sticky header */
--z-fixed: 300;        /* Fixed elements */
--z-modal: 400;        /* Modals, overlays */
--z-tooltip: 500;      /* Tooltips */
--z-notification: 600; /* Notifications, toasts */
```

### 7. Transitions & Animations

```css
--transition-fast: 0.1s ease;
--transition-base: 0.2s ease;
--transition-slow: 0.3s ease;
--easing-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--easing-ease-in-out: cubic-bezier(0.34, 1.56, 0.64, 1);
```

## Usage Examples

### In Styles.css

**Before:**
```css
body {
  background: #f4f4f5;
  color: #003641;
  font-family: 'Montserrat', sans-serif;
}

.card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 54, 65, 0.08);
  padding: 1.5rem;
}
```

**After:**
```css
body {
  background: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-family-base);
}

.card {
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-card);
  padding: var(--spacing-6);
}
```

### In Component Styles

**Before:**
```typescript
template: `...`,
styles: [`
  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem 2rem;
    gap: 1.5rem;
  }
`]
```

**After:**
```typescript
template: `...`,
styles: [`
  .header {
    background: linear-gradient(135deg, var(--color-accent-1) 0%, var(--color-accent-2) 100%);
    padding: var(--spacing-4) var(--spacing-8);
    gap: var(--spacing-6);
  }
`]
```

## Dark Mode Support

Dark mode colors are automatically applied when `prefers-color-scheme: dark` is detected:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0f172a;
    --color-text: #f8fafc;
    /* ... other dark mode overrides ... */
  }
}
```

No component changes needed! Just use `var(--color-*)` and dark mode adapts automatically.

## Accessibility

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-fast: 0s;
    --transition-base: 0s;
  }
}
```

### High Contrast
```css
@media (prefers-contrast: more) {
  :root {
    --color-border: var(--color-neutral-400);
    --shadow-md: 0 0 0 1px var(--color-neutral-400);
  }
}
```

## Color Combinations (GitHub Palette)

Pre-defined background + border + text combinations for consistent UI:

```css
--color-success-bg-light: #ecfdf5;
--color-success-border-light: #34d399;
--color-success-text-light: #065f46;

--color-danger-bg-light: #ffebee;
--color-danger-border-light: #f87171;
--color-danger-text-light: #7f1d1d;

/* Dark mode versions */
--color-success-bg-dark: #0d3817;
--color-success-border-dark: #238636;
--color-success-text-dark: #a6f3d0;
```

Use with utility classes:
```html
<div class="bg-success-light">Success state with proper contrast</div>
```

## Adding New Tokens

1. **Identify the category** (color, spacing, typography, radius, shadow)
2. **Add to appropriate file**:
   - Core values → `tokens.css`
   - Dark mode → `tokens-dark.css`
   - Component utilities → `github-palette.css`
3. **Use semantic naming**: `--category-semantic-weight`
   - Bad: `--teal-200`
   - Good: `--color-primary-200`

Example:
```css
/* tokens.css */
--color-accent-purple: #a855f7;

/* tokens-dark.css */
@media (prefers-color-scheme: dark) {
  :root {
    --color-accent-purple: #9333ea;
  }
}
```

## Browser Support

CSS custom properties supported in all modern browsers:
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+

Graceful fallback in older browsers (tokens simply don't apply).

## Performance

- Zero runtime overhead
- Compiled into browser-optimized CSS
- Smaller bundle than duplicate hardcoded values
- Faster theme switching (no JavaScript needed)

## Best Practices

✅ **DO:**
- Use semantic aliases (`--spacing-md` instead of `--spacing-4`)
- Group related tokens by category
- Document token purposes with comments
- Test dark mode regularly (`@media (prefers-color-scheme: dark)`)
- Use transitions/animations tokens consistently

❌ **DON'T:**
- Create arbitrary tokens without design justification
- Mix hardcoded values and tokens in same file
- Override tokens in component styles (defeats purpose)
- Skip dark mode support
- Use token names disassociated from purpose

## Links

- **GitHub Primer Design System**: https://primer.style/foundations/
- **CSS Custom Properties Spec**: https://www.w3.org/TR/css-variables-1/
- **Token Design Patterns**: https://css-tricks.com/what-are-design-tokens/
