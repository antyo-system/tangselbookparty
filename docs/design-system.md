# Tangsel Book Party — Brand Design System & Style Guide

This document defines the official design system, color palette, typography rules, and component guidelines for the **Tangsel Book Party** community library platform. All developers and designers must adhere to these tokens to ensure absolute visual consistency across the codebase.

---

## 🎨 Official Color Palette

The brand identity uses a high-contrast, warm community aesthetic built around deep emerald greens, vibrant gold accents, and lime highlights.

| Color Name | Token / CSS Variable | Hex Code | Usage & Role |
| :--- | :--- | :--- | :--- |
| **Light Slate Base** | `--color-slate-50` | `#F8FAFC` | Main application body background for crisp, comfortable reading |
| **Pure White** | `--color-white` | `#FFFFFF` | Card backgrounds, modal bodies, input forms, QR code labels |
| **Forest Green** | `--color-tbp-forest` | `#053D27` | Brand headers, navbar background, hero banner gradient base, active tabs |
| **Dark Emerald** | `--color-tbp-dark` | `#03321F` | Deep brand contrast accents, secondary dark badges |
| **Gold / Amber** | `--color-tbp-gold` | `#FFBF00` | Primary action buttons, rating stars, logo highlight, badges |
| **Lime / Yellow** | `--color-tbp-lime` | `#D0DF00` | Status indicators, role badges, quote subtitles |

### Tailwind CSS Color Utilities Mapping

```html
<!-- Primary Deep Emerald Background -->
<div class="bg-[#03321F] text-white font-sans">

<!-- Forest Green Card -->
<div class="bg-[#053D27] border border-[#FFBF00]/30 rounded-3xl p-6">

<!-- Gold Primary Action Button -->
<button class="bg-[#FFBF00] text-[#03321F] font-extrabold px-4 py-2 rounded-xl shadow-md hover:bg-[#D0DF00]">
  Borrow Book
</button>

<!-- Lime Secondary / Status Badge -->
<span class="bg-[#D0DF00] text-[#03321F] font-extrabold px-3 py-1 rounded-full text-xs">
  Available
</span>
```

---

## 🔤 Typography Guidelines

Tangsel Book Party uses two primary font families loaded from Google Fonts:

### 1. Primary Display / Impact Font: **Anton**
- **Font Family**: `'Anton', 'Montserrat', sans-serif`
- **Utility Class**: `.font-anton`
- **Usage**: Main page hero titles, section headers, brand logo text, key numerical callouts. Always uppercase with loose letter-spacing (`tracking-wide` / `tracking-wider`).

```html
<h1 class="font-anton text-4xl sm:text-5xl text-white tracking-wide">
  READ, BORROW & SHARE BOOKS ACROSS <span class="text-[#FFBF00]">TANGSEL</span>
</h1>
```

### 2. Primary Body & Interface Font: **Montserrat**
- **Font Family**: `'Montserrat', Arial, sans-serif`
- **Utility Class**: `font-sans` (default body font)
- **Weights Used**:
  - `400 (Regular)`: Body copy, synopsis text, descriptions
  - `600 (SemiBold)`: Subtitles, search inputs, dates
  - `700 (Bold)`: Book titles, card subheadings, modal titles
  - `800 (ExtraBold)`: Badges, buttons, active tab indicators

---

## 📚 Minimalist User Card Principles & Phase Roadmap

Tangsel Book Party prioritizes a clean, high-density, uncluttered browsing experience:

### 1. High-Density Compact Book Card Grid
- **Crisp Corner Radius**: Border corners updated to sharp, modern `rounded-xl` / `rounded-lg` (8px-12px) instead of overly rounded styles.
- **High Grid Density**: Responsive grid displaying **up to 6 columns** on large screens (`grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6`), allowing users to preview significantly more books at once.
- **Compact Padding**: Tight padding (`p-3`), crisp badge overlays, and clean action triggers.

### 2. Phase 2 & 3 Roadmap
Refer to [UPCOMING_FEATURES.md](file:///d:/01_Projects/tangselbookparty/UPCOMING_FEATURES.md) for the phased feature checklist.

---

## 🧩 UI Component Tokens & Rules

### 1. Buttons & Triggers
- **Primary CTA (Borrow / Request)**: `bg-[#FFBF00] text-[#03321F] hover:bg-[#D0DF00] rounded-xl font-extrabold shadow-md`
- **Secondary / Queue CTA**: `bg-[#D0DF00] text-[#03321F] hover:bg-[#FFBF00] rounded-xl font-extrabold shadow-md`
- **Outline / Secondary**: `bg-[#03321F] text-[#D0DF00] border border-[#FFBF00]/30 hover:bg-[#FFBF00] hover:text-[#03321F] rounded-xl font-bold`

### 2. Status Badges
- **Available**: `bg-[#D0DF00] text-[#03321F] font-extrabold rounded-full px-3 py-1`
- **Borrowed**: `bg-[#FFBF00] text-[#03321F] font-extrabold rounded-full px-3 py-1`
- **In Queue**: `bg-[#03321F] text-[#D0DF00] border border-[#D0DF00]/30 font-extrabold rounded-full px-2.5 py-0.5`

### 3. Modal Dialogs
- **Backdrop**: `bg-[#03321F]/80 backdrop-blur-md`
- **Modal Container**: `bg-[#053D27] text-white border border-[#FFBF00]/30 rounded-3xl shadow-2xl`
- **Header**: `bg-[#03321F] border-b border-[#FFBF00]/20`

---

## 📐 Spacing & Layout Rules

1. **Card Radius**: `rounded-3xl` (24px) for cards, `rounded-2xl` for modals and inner containers.
2. **Borders**: Always use translucent gold border overlays (`border-[#FFBF00]/20` or `border-[#FFBF00]/30`) on dark green backgrounds to create rich depth.
3. **Icons**: Use `lucide-react` icons styled with `#FFBF00` (Gold) or `#D0DF00` (Lime) accents.

---

*Last Updated: August 2026 — Tangsel Book Party Core Design System*
