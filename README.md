# Solution CSS

A class-light CSS micro-framework with a cascade-reactive grid and zero-runtime theming. Under 10 KB minified.

---

## Overview

Most modern CSS setups force you to choose between two extremes: heavy design systems that ship hundreds of kilobytes of unused styles, or utility-first engines that bloat your markup with dozens of classes just to align three cards.

Solution CSS takes a different approach:
* **HTML-first:** sensible, clean defaults for standard elements (`<dialog>`, `<details>`, `<form>`, `<table>`, `<blockquote>`).
* **Cascade-reactive grid:** responsive layouts driven by CSS custom properties, not generated utility classes.
* **Standards-compliant theming:** automatic dark mode via `prefers-color-scheme`, manual override via `[data-theme]`, and zero reliance on experimental browser features.
* **Tiny footprint:** ~9.5 KB uncompressed, ~2.8 KB gzipped.

---

## Live Demo & Documentation

A full interactive showcase and stress-test lab are hosted directly on GitHub Pages:

* **Docs & Component Showcase:** [https://YOUR_USER.github.io/solucion-css/](https://YOUR_USER.github.io/solucion-css/)
* **Grid & Flex Testing Lab:** [https://YOUR_USER.github.io/solucion-css/test.html](https://YOUR_USER.github.io/solucion-css/test.html)

---

## Quick Start

Link the minified stylesheet inside your `<head>`:

```html
<link rel="stylesheet" href="solution.min.css">
```

Or clone the repository to run locally:

```bash
bun install
bun run dev
```

---

## The Reactive Grid (`.is-grid-r`)

Instead of defining responsive columns through class cascades (`.col-12 .col-md-6 .col-lg-4`), `.is-grid-r` delegates column math directly to CSS custom properties. Child breakpoints inherit from parent breakpoints automatically.

### Basic example

```html
<!-- Scales from 1 column on mobile to 2 on tablet and 4 on desktop -->
<div class="is-grid-r" style="--cols-xs: 1; --cols-md: 2; --cols-lg: 4;">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>
```

### Asymmetrical spans

```html
<div class="is-grid-r" style="--cols-xs: 1; --cols-md: 3;">
  <div style="--span-md: span 2;">Main content (spans 2 columns on desktop)</div>
  <div>Sidebar (1 column)</div>
</div>
```

### Breakpoints Reference

| Breakpoint | Min-width | Column variable | Span variable |
| :--- | :--- | :--- | :--- |
| `xs` | `0px` | `--cols-xs` | `--span-xs` |
| `sm` | `576px` | `--cols-sm` | `--span-sm` |
| `md` | `768px` | `--cols-md` | `--span-md` |
| `lg` | `1024px` | `--cols-lg` | `--span-lg` |
| `xl` | `1200px` | `--cols-xl` | `--span-xl` |
| `xxl` | `1400px` | `--cols-xxl` | `--span-xxl` |

### Fluid auto-fit (no media queries needed)

```html
<div class="is-grid-r" style="--cols-min-width: 180px; --cols-max-width: 1fr;">
  <div>Card A</div>
  <div>Card B</div>
  <div>Card C</div>
</div>
```

---

## Theming

Solution CSS uses direct custom property re-assignment. It avoids buggy transitions and ensures complete compatibility across older browsers and embedded WebViews.

* **Default:** Light mode defined under `:root`.
* **Automatic dark mode:** Triggered via `@media (prefers-color-scheme: dark)` unless `[data-theme="light"]` is explicitly present.
* **Manual toggle:** Handled by setting `data-theme="dark"` or `data-theme="light"` on `document.documentElement`.

### Minimal theme toggle script

```javascript
function toggleTheme() {
  const root = document.documentElement;
  const current = root.getAttribute('data-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = current === 'dark' || (!current && systemPrefersDark);

  root.setAttribute('data-theme', isDark ? 'light' : 'dark');
}
```

---

## Key Utilities

* **Layout:** `.is-container`, `.is-container-f`
* **Flex helpers:** `.is-center`, `.is-horizontal-list`, `.is-vertical-list`
* **Buttons:** `.is-btn`, `.is-outline`, `.is-primary`, `.is-rounded`
* **Tables:** `.is-table-scroll`, `table.row-hoverable`, `table.first-column-bold`
* **Inspection:** `.is-dev` (highlights container bounding box via non-intrusive box-shadow)

---

## Development

Built and compiled using [Bun](https://bun.sh) and [LightningCSS](https://lightningcss.dev).

```bash
bun run dev    # Local development server with instant hot-reload
bun run build  # Minifies solution.css into solution.min.css (root and docs/)
```

---

## License

MIT
