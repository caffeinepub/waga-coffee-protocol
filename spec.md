# OburugoAgroChain

## Current State

The app uses a dark coffee-themed palette with amber/gold as the primary action color, warm cream as accent, and dark brown backgrounds. Custom tokens include `--amber`, `--cream`, `--coffee`, `--coffee-dark`, `--success`, `--warning`, `--info`.

## Requested Changes (Diff)

### Add
- New `--yellow` token for accent use (highlights, tags, secondary indicators)
- New `--green` token as the primary CTA/action/verified badge color

### Modify
- `--background` and card surfaces: shift to deep espresso brown (darker, richer brown — like dark roasted espresso)
- `--primary`: change from amber/gold to earthy green (for buttons, CTAs, active states)
- `--accent`: change from warm cream to yellow (for highlights, tags, accents)
- `--ring`: update to green to match new primary
- `--sidebar-primary`: update to green
- All amber-glow utilities and badge-amber references: replace with yellow equivalents
- `step-active` color: change from amber to yellow
- Timeline line gradient: update from amber to yellow
- Step circle: update from amber to green
- Hero mesh gradient: update to use espresso brown tones
- `gradient-text`: update to use green-to-yellow gradient
- Scrollbar hover: update to yellow
- Chart tokens: update to use new green/yellow palette
- All component files using `text-amber`, `bg-amber`, `border-amber`, `glow-amber`, `badge-amber`, `step-active` classes: replace with green/yellow equivalents

### Remove
- Old amber-centric custom tokens and utilities (replaced by green/yellow)

## Implementation Plan

1. Update `index.css`:
   - Deep espresso brown backgrounds: `--background: 0.10 0.018 35` (very dark brown, hue ~35)
   - Card surfaces slightly lighter espresso: `--card: 0.14 0.02 35`
   - `--primary`: earthy green `0.55 0.14 145` (muted forest green)
   - `--primary-foreground`: near-white `0.96 0.01 80`
   - `--accent`: warm yellow `0.82 0.14 80` (earthy amber-yellow)
   - `--accent-foreground`: dark espresso `0.10 0.018 35`
   - `--ring`: green `0.55 0.14 145`
   - Custom tokens: `--espresso`, `--green`, `--green-dim`, `--yellow`, `--yellow-dim`
   - Replace amber utility classes with green/yellow equivalents
   - Update step-circle, timeline-line, hero-mesh, gradient-text

2. Update `tailwind.config.js`:
   - Replace `amber` and `cream` custom colors with `green` and `yellow` tokens
   - Update box-shadow tokens to use green/yellow

3. Update all step components and App.tsx/Hero.tsx/StepNav.tsx/NextStepButton.tsx to use new color classes

