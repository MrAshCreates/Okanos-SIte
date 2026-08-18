# Okanos Ethereal Depths: Dynamic Immersion Guide

## Overview

The **Okanos Ethereal Depths: Dynamic Immersion** theme transforms your financial application into a living, breathing underwater sanctuary. This guide explains how to leverage the dynamic effects, animations, and visual enhancements to create an emotionally resonant user experience.

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Color Palette](#color-palette)
3. [Light Mode: Shimmering Sunlit Shallows](#light-mode-shimmering-sunlit-shallows)
4. [Dark Mode: Bioluminescent Mysterious Deep](#dark-mode-bioluminescent-mysterious-deep)
5. [Dynamic Immersion Utilities](#dynamic-immersion-utilities)
6. [Animation Guidelines](#animation-guidelines)
7. [Accessibility Considerations](#accessibility-considerations)
8. [Best Practices](#best-practices)

---

## Core Concepts

### Living Environment

The theme creates a **living underwater environment** through:

- **Ambient Motion**: Subtle global animations that simulate ocean currents
- **Interactive Shimmer**: Elements respond to user interaction with water-like effects
- **Contextual Glows**: Success states glow like bioluminescent organisms
- **Fluid Transitions**: Smooth, physics-based animations throughout

### Metaphorical Accents

**Coral (Danger/Warning):**
- Light Mode: Incandescent orangey coral (#FF8563) - like lava in sunlight
- Dark Mode: Pulsating purplish coral (#C47AC0) - like hydrothermal vents
- Usage: Errors, warnings, negative financial indicators

**Plants (Success/Positive):**
- Light Mode: Swaying light green plants (#7EC9A3) - gentle movement
- Dark Mode: Glowing dark green flora (#3FA887) - upward drifting
- Usage: Success messages, positive indicators, growth

**Wave Blue (Neutral Actions):**
- Consistent color (#4A81C9 light, #2A7FB8 dark)
- Represents trustworthy, calm actions
- Enhanced with shimmer in light, deeper glow in dark

---

## Color Palette

### Core Palette

```css
--okanos-sand-light: #F5EDE0        /* Sun-drenched sand */
--okanos-foam: #E8F4F8              /* Light foamy water */
--okanos-coral-warm: #FF8563        /* Orangey coral (light lava) */
--okanos-coral-purple: #C47AC0      /* Purplish coral (dark lava) */
--okanos-plant-light: #7EC9A3       /* Light fresh green */
--okanos-plant-dark: #4A8B6F        /* Dark rich green */
--okanos-deep-blue: #1A2F45         /* Deep ocean blue */
--okanos-stone: #2D3540             /* Dark stone */
--okanos-wave-action: #4A81C9       /* Wave Blue */
--okanos-driftwood: #DDE6EA         /* Driftwood Gray */
```

### Expanded Dynamic Palette

```css
--okanos-sun-flare: #FFD98E         /* Warm yellow-gold sunlight */
--okanos-abyssal-glow-blue: #2A7FB8 /* Rich saturated blue */
--okanos-abyssal-glow-emerald: #3FA887 /* Rich emerald */
--okanos-abyssal-glow-purple: #9B6BC4  /* Deeper purple */
```

---

## Light Mode: Shimmering Sunlit Shallows

### Visual Characteristics

**Aesthetic:** Bright, inviting, sun-drenched shallow waters with soft sand and swaying plants.

**Key Features:**
- Very light sandy beige backgrounds (#FDFBF8)
- Foamy water translucency (#E8F4F8)
- Ultra-soft shadows (0.5-7% opacity)
- Minimal surface shimmer effects
- Sun flare accents on interactive elements

### Background Effects

**Global Ambient Current:**
```css
/* Automatically applied to body::before */
animation: ocean-current 20s ease-in-out infinite;
background: var(--gradient-refraction);
opacity: 0.4;
```

**Refraction Shimmer:**
```css
.refraction-shimmer {
  /* Creates gentle light refraction effect */
}
```

### Shadow System

```css
--shadow-1: Ultra-soft (2% opacity)
--shadow-2: Soft with secondary glow (3% + 1.5%)
--shadow-6: Spread soft shadow (7% + 3.5%)
```

### Glow Effects

```css
--glow-wave: 12px + 24px + 36px blur (sun flare accent)
--glow-coral: 10px + 20px + 30px blur (incandescent)
--glow-plant: 10px + 20px + 30px blur (gentle shimmer)
--glow-sun-flare: 8px + 16px blur (warm yellow-gold)
```

---

## Dark Mode: Bioluminescent Mysterious Deep

### Visual Characteristics

**Aesthetic:** Rich deep-sea environment with dark stone formations, mysterious blue depths, and glowing bioluminescent elements.

**Key Features:**
- Dark stone backgrounds (#2D3540)
- Deep ocean blue surfaces (#1A2F45)
- Multi-layered deep shadows (55-80% opacity)
- Pronounced bioluminescent glows
- Pulsating animations on interactive elements

### Background Effects

**Global Bioluminescent Pulse:**
```css
/* Automatically applied to body::before */
animation: ocean-current 30s ease-in-out infinite;
background: var(--gradient-bioluminescence);
opacity: 0.3;
```

**Hydrothermal Vent Gradients:**
```css
--gradient-hydrothermal: radial-gradient from center
/* Creates dramatic light and shadow from deep sources */
```

### Shadow System

```css
--shadow-1: Deep with color tint (55% + blue tint)
--shadow-2: Deep with dual glow (60% + 25% + blue tint)
--shadow-6: Profound depth (80% + 45% + blue tint)
```

### Glow Effects

```css
--glow-wave: 24px + 48px + 72px blur (bioluminescent blue)
--glow-coral: 22px + 44px + 66px blur (pulsating violet)
--glow-plant: 20px + 40px + 60px blur (emerald glow)
--glow-abyssal: 16px + 32px blur (purple mystery)
```

---

## Dynamic Immersion Utilities

Import: `app/styles/dynamic-immersion.css`

### Translucent Water Layers

**Frosted Glass Effects:**

```html
<!-- Standard translucent water layer -->
<div class="translucent-water">
  <!-- Content with backdrop blur -->
</div>

<!-- Strong translucency -->
<div class="translucent-water-strong">
  <!-- Heavily blurred background -->
</div>

<!-- Subtle translucency -->
<div class="translucent-water-subtle">
  <!-- Light blur effect -->
</div>
```

### Shimmer & Glow Effects

**Refraction Shimmer (Light Mode):**

```html
<div class="refraction-shimmer">
  <!-- Animated light refraction background -->
  <p>Content appears above shimmer</p>
</div>
```

**Bioluminescent Pulse (Dark Mode):**

```html
<div class="bioluminescent-pulse">
  <!-- Pulsates in dark mode only -->
</div>
```

**Wave Shimmer (Action Buttons):**

```html
<button class="wave-shimmer">
  <!-- Ripple effect on hover -->
  Click Me
</button>
```

### Plant Animations (Success States)

**Light Mode - Gentle Swaying:**

```html
<div class="plant-sway">
  <!-- Sways gently like underwater plants -->
  +$500
</div>
```

**Dark Mode - Upward Drift:**

```html
<div class="plant-drift">
  <!-- Drifts upward in dark mode -->
  Success!
</div>
```

**Combined Effect:**

```html
<div class="plant-animated">
  <!-- Automatically adapts to theme -->
  Growth Indicator
</div>
```

### Coral Animations (Danger States)

**Light Mode - Incandescent Glow:**

```html
<div class="coral-incandescent">
  <!-- Glows like hot lava -->
  Warning!
</div>
```

**Dark Mode - Hydrothermal Pulse:**

```html
<div class="coral-pulsate">
  <!-- Pulsates like volcanic vent -->
  Error
</div>
```

**Combined Effect:**

```html
<div class="coral-animated">
  <!-- Automatically adapts to theme -->
  Critical Alert
</div>
```

### Surface Ripple Effect

**Interaction Ripple:**

```html
<button class="surface-ripple">
  <!-- Ripple emanates from click point -->
  Submit
</button>
```

### Gradient Backgrounds

**Wave Crest (Light Mode):**

```html
<section class="wave-crest-bg">
  <!-- Animated wave crest gradient -->
</section>
```

**Hydrothermal Vent (Dark Mode):**

```html
<section class="hydrothermal-bg">
  <!-- Radial gradient from center -->
</section>
```

**Shimmer Overlay:**

```html
<div class="shimmer-overlay">
  <!-- Gradient appears on hover -->
</div>
```

### Depth Layering

**Multi-layered Shadows:**

```html
<div class="depth-layer-1">Minimal depth</div>
<div class="depth-layer-2">Slight elevation</div>
<div class="depth-layer-3">Medium depth</div>
<div class="depth-layer-4">Pronounced depth</div>
<div class="depth-layer-5">Maximum depth</div>
```

**Elevated with Glow (Dark Mode):**

```html
<div class="elevated-glow">
  <!-- Shadow + glow in dark mode -->
</div>
```

### Fluid Borders

**Liquid Border:**

```html
<div class="liquid-border">
  <!-- Border color transitions smoothly -->
</div>
```

**Gradient Border (Animated):**

```html
<div class="gradient-border">
  <!-- Animated gradient border -->
</div>
```

### Accent Highlights

**Sun Flare (Light Mode Only):**

```html
<div class="sun-flare-accent">
  <!-- Small golden glow in top-right corner -->
</div>
```

**Abyssal Glow (Dark Mode Only):**

```html
<div class="abyssal-glow-accent">
  <!-- Bioluminescent halo in dark mode -->
</div>
```

### Responsive Fluid Sizing

**Typography:**

```html
<p class="fluid-text">Standard body text</p>
<h2 class="fluid-heading">Section heading</h2>
<h1 class="fluid-display">Hero display text</h1>
```

**Spacing:**

```html
<div class="fluid-gap">Responsive gap</div>
<div class="fluid-padding">Responsive padding</div>
<div class="fluid-margin">Responsive margin</div>
```

---

## Animation Guidelines

### Keyframe Animations Available

**Ocean Current:**
```css
@keyframes ocean-current {
  /* Smooth background position shift */
  /* Duration: 8-30s depending on context */
}
```

**Refraction Shimmer:**
```css
@keyframes refraction-shimmer {
  /* Light refraction effect (light mode) */
  /* Duration: 15s */
}
```

**Bioluminescent Pulse:**
```css
@keyframes bioluminescent-pulse {
  /* Opacity and brightness pulse (dark mode) */
  /* Duration: 3-4s */
}
```

**Plant Sway:**
```css
@keyframes plant-sway {
  /* Gentle swaying motion (light mode) */
  /* Duration: 6s */
}
```

**Plant Drift:**
```css
@keyframes plant-drift {
  /* Upward floating (dark mode) */
  /* Duration: 5s */
}
```

**Coral Incandescent:**
```css
@keyframes coral-incandescent {
  /* Glow intensity pulse (light mode) */
  /* Duration: 3s */
}
```

**Hydrothermal Pulse:**
```css
@keyframes hydrothermal-pulse {
  /* Volcanic vent pulse (dark mode) */
  /* Duration: 2.5s */
}
```

**Surface Ripple:**
```css
@keyframes surface-ripple {
  /* Click ripple effect */
  /* Duration: 0.6s */
}
```

### Animation Duration Best Practices

| Context | Recommended Duration | Easing |
|---------|---------------------|--------|
| Global ambient | 20-30s | ease-in-out |
| Background shimmer | 12-15s | ease-in-out |
| Interactive hover | 0.3-0.6s | var(--ease-3) |
| State transitions | 0.4-0.5s | var(--ease-3) |
| Success animations | 5-6s (loop) | ease-in-out |
| Danger animations | 2.5-3s (loop) | ease-in-out |
| Ripple effects | 0.6s | ease-out |

---

## Accessibility Considerations

### Reduced Motion Support

All animations automatically respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  /* All animations are disabled */
  /* Surface ripple becomes instant feedback */
  /* Transitions reduced to 0.01ms */
}
```

### What Happens with Reduced Motion

- Ocean current animations: **Disabled**
- Shimmer effects: **Disabled**
- Plant sway/drift: **Disabled**
- Coral pulses: **Disabled**
- Surface ripple: **Becomes static scale effect**
- Hover transitions: **Near-instant**

### Color Contrast

All color combinations meet **WCAG AA standards**:

- Light mode text: 4.5:1+ contrast ratio
- Dark mode text: 7:1+ contrast ratio
- Interactive elements: Clear focus states with glows
- Danger/warning states: High contrast maintained

### Focus States

```css
*:focus-visible {
  outline: 2px solid var(--okanos-wave-action);
  outline-offset: 2px;
  box-shadow: var(--glow-wave);
  border-radius: var(--radius-squircle-xs);
}
```

---

## Best Practices

### When to Use Dynamic Effects

**✅ DO Use:**
- Hero sections (refraction-shimmer)
- Primary CTAs (wave-shimmer, surface-ripple)
- Success confirmations (plant-animated)
- Error alerts (coral-animated)
- Card components (translucent-water)
- Major sections (depth-layer-*)

**❌ DON'T Use:**
- Body text containers (too distracting)
- Form inputs (accessibility concern)
- Every single element (performance impact)
- Navigation items (should be stable)

### Layering Strategy

**Background Layer:**
```css
/* Global ocean current on body::before */
z-index: 0;
```

**Content Layer:**
```css
/* All actual content */
z-index: 1;
position: relative;
```

**Interactive Layer:**
```css
/* Cards, buttons with effects */
z-index: 2-5 (depth-layer-*)
```

**Modal/Overlay Layer:**
```css
/* Alerts, dialogs */
z-index: var(--layer-important);
```

### Performance Optimization

**GPU Acceleration:**
```css
/* Most animations use transform and opacity */
/* These properties leverage GPU acceleration */
transform: translateY(-2px); /* GPU */
opacity: 0.5; /* GPU */
```

**Avoid:**
```css
/* These trigger layout recalculation */
width: 100px; /* Avoid animating */
margin-left: 20px; /* Avoid animating */
```

**Prefer:**
```css
/* These are performant */
transform: scale(1.1); /* GPU accelerated */
opacity: 1; /* GPU accelerated */
filter: blur(12px); /* GPU accelerated */
```

### Combining Effects

**Example: Enhanced Card Component**

```html
<div class="translucent-water depth-layer-3 refraction-shimmer">
  <h3>Card Title</h3>
  <p>Card content with multiple effects</p>
</div>
```

**Example: Success Notification**

```html
<div class="translucent-water-strong plant-animated elevated-glow">
  <p>Transaction successful! +$500</p>
</div>
```

**Example: Danger Alert**

```html
<div class="translucent-water coral-animated depth-layer-4">
  <p>Payment failed. Please try again.</p>
</div>
```

---

## Component-Specific Usage

### Buttons

```tsx
import { Button } from '~/components/ui/button/button';

// Automatically includes wave shimmer and glow on hover
<Button variant="default">Primary Action</Button>

// Danger button includes coral pulse in dark mode
<Button variant="destructive">Delete</Button>
```

### Cards

```tsx
<div className="translucent-water depth-layer-2">
  <Card>
    {/* Frosted glass effect with depth */}
  </Card>
</div>
```

### Hero Sections

```tsx
<section className="refraction-shimmer">
  <h1 className="fluid-display">Your Title</h1>
  <p className="fluid-text">Your description</p>
</section>
```

### Success Messages

```tsx
<div className="plant-animated translucent-water-strong">
  <p>Successfully saved!</p>
</div>
```

### Error Messages

```tsx
<div className="coral-animated translucent-water-strong">
  <p>An error occurred</p>
</div>
```

---

## Theme Variables Reference

### Gradients

```css
/* Light Mode */
--gradient-brand: Multi-stop foam to sand
--gradient-ocean: App background with sun flare
--gradient-wave-crest: Diagonal wave effect
--gradient-shimmer: Full spectrum shimmer
--gradient-depth: Translucent overlay
--gradient-refraction: Animated light refraction

/* Dark Mode */
--gradient-brand: Stone to deep blue
--gradient-ocean: Stone with bioluminescence
--gradient-hydrothermal: Radial vent glow
--gradient-shimmer: Abyssal spectrum
--gradient-depth: Dark translucent overlay
--gradient-bioluminescence: Dual radial glows
```

### Custom Properties

```css
/* Border Radius */
--radius-squircle-xs: 6px
--radius-squircle-sm: 10px
--radius-squircle-md: 16px
--radius-squircle-lg: 20px
--radius-squircle-xl: 28px
--radius-squircle-2xl: 36px
```

---

## Migration from Static Theme

### Step 1: Import Dynamic Immersion

```tsx
// app/root.tsx
import "./styles/dynamic-immersion.css";
```

### Step 2: Add Classes to Components

**Before:**
```tsx
<div className={styles.card}>
  <h3>Title</h3>
</div>
```

**After:**
```tsx
<div className={`${styles.card} translucent-water depth-layer-2`}>
  <h3>Title</h3>
</div>
```

### Step 3: Enable Global Ambient Motion

**Automatic:** Global ocean current is applied to `body::before`

**To Disable Globally:**
```css
body::before {
  animation: none !important;
}
```

### Step 4: Test Reduced Motion

**Browser DevTools:**
1. Open DevTools
2. Cmd/Ctrl + Shift + P
3. Type "Emulate CSS prefers-reduced-motion"
4. Select "prefers-reduced-motion: reduce"

---

## Troubleshooting

### Animations Not Playing

**Check:**
1. Is `dynamic-immersion.css` imported?
2. Is `prefers-reduced-motion` enabled?
3. Are classes correctly applied?
4. Does parent have `overflow: hidden` blocking effects?

### Performance Issues

**Solutions:**
1. Reduce number of animated elements on screen
2. Use `will-change` sparingly on critical animations
3. Ensure animations use `transform` and `opacity`
4. Consider disabling ambient background on low-end devices

### Unexpected Visual Behavior

**Common Issues:**
- **Z-index conflicts:** Check stacking context
- **Blur not working:** Ensure backdrop-filter is supported
- **Gradients not animating:** Check background-size property
- **Glows not visible:** Verify CSS variable values in DevTools

---

## Advanced Customization

### Creating Custom Glows

```css
.custom-glow {
  box-shadow: 
    0 0 20px rgba(YOUR_COLOR, 0.5),
    0 0 40px rgba(YOUR_COLOR, 0.25),
    0 0 60px rgba(YOUR_COLOR, 0.12);
}
```

### Custom Animation Duration

```css
.faster-shimmer {
  composes: refraction-shimmer;
  animation-duration: 8s !important;
}

.slower-pulse {
  composes: bioluminescent-pulse;
  animation-duration: 6s !important;
}
```

### Theme-Specific Overrides

```css
.custom-element {
  background: var(--color-base-bg);
}

:global(.dark-theme) .custom-element {
  background: var(--okanos-deep-blue);
  box-shadow: var(--glow-wave);
}
```

---

## Resources

- **Theme File:** `app/styles/theme.css`
- **Utilities:** `app/styles/dynamic-immersion.css`
- **Tokens:** `app/styles/tokens/*.css`
- **Animation Reference:** `app/styles/tokens/animations.css`
- **Example Usage:** `app/routes/home.tsx` and `app/routes/home.module.css`

---

**Built with love for Okanos - Navigate the sea of your finances with dynamic immersion.** 🌊✨
