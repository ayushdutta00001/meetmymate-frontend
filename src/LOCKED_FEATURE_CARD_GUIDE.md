# 🔒 Locked Feature Card - Mobile Design System

## Overview

A premium, mobile-optimized component for displaying **locked/unavailable features** in a dark-theme app. Designed to clearly communicate "Coming Soon" status while maintaining a professional, secure aesthetic.

---

## 🎨 Component Preview

### Primary Use Case: Find Investors

```
┌─────────────────────────────────────────┐
│  [🔒]  Find Investors    [● Coming Soon]│
│                                          │
│  Connect with venture capitalists and   │
│  angel investors looking to fund...     │
│                                          │
│         [📈 Icon - Faded]                │
│                                          │
│  ───────────────────────────────────────│
│  🔒 This feature is currently unavailable│
└─────────────────────────────────────────┘
        Opacity: 65% • No Interaction
```

---

## ✨ Design Features

### Visual State Indicators

✅ **Reduced Opacity** (65%)  
✅ **Lock Icon** (dual placement: container + watermark)  
✅ **Coming Soon Badge** (100% opacity, pulse animation)  
✅ **Muted Colors** (gray palette)  
✅ **No Hover/Press Feedback** (cursor-not-allowed)  
✅ **Subtle Blur** (backdrop-blur-sm)  
✅ **Locked Indicator** (bottom bar)  

### User Experience

🔐 **Clearly Disabled** - Users immediately understand it's locked  
🎯 **Coming Soon Signal** - Badge provides hope/anticipation  
📱 **Mobile-First** - Optimized touch targets and spacing  
♿ **Accessible** - Readable text despite disabled state  
🎨 **Premium Feel** - Maintains app quality standards  

---

## 📦 Component API

### Props Interface

```typescript
interface LockedFeatureCardProps {
  featureName: string;          // Required: "Find Investors"
  description?: string;          // Optional: Feature description
  icon?: React.ReactNode;        // Optional: Custom icon
  badgeText?: string;            // Default: "Coming Soon"
  variant?: 'default' | 'compact'; // Default: 'default'
}
```

---

## 🚀 Usage Examples

### Example 1: Full Card (Recommended)

```tsx
import { LockedFeatureCard } from './components/ui/LockedFeatureCard';
import { TrendingUp } from 'lucide-react';

<LockedFeatureCard
  featureName="Find Investors"
  description="Connect with venture capitalists and angel investors looking to fund innovative startups and business ideas."
  icon={<TrendingUp className="w-12 h-12 text-gray-600" strokeWidth={1.5} />}
/>
```

**Result**:
- ✅ Full card with description
- ✅ Custom icon centered
- ✅ "Coming Soon" badge (default)
- ✅ Locked indicator at bottom

---

### Example 2: Compact Variant

```tsx
<LockedFeatureCard
  featureName="Find Investors"
  variant="compact"
/>
```

**Result**:
- ✅ Smaller padding (p-4)
- ✅ No description shown
- ✅ No icon shown
- ✅ Perfect for grids

---

### Example 3: Custom Badge Text

```tsx
<LockedFeatureCard
  featureName="Premium Analytics"
  description="Advanced business insights and metrics."
  badgeText="Pro Feature"
/>
```

**Result**:
- ✅ Custom badge: "Pro Feature"
- ✅ Same pulse animation
- ✅ Blue accent styling

---

### Example 4: Minimal (No Badge)

```tsx
<LockedFeatureCard
  featureName="Legal Hub"
  description="Access legal resources and templates."
  badgeText="" // Empty string hides badge
/>
```

**Result**:
- ✅ No badge shown
- ✅ Lock icon still visible
- ✅ Locked indicator still present

---

## 🎨 Design Specifications

### Card Container

```css
• Width: 100% (mobile-responsive)
• Padding: 20px (default), 16px (compact)
• Border Radius: 12px
• Background: Gradient (gray-800/40 → gray-900/40)
• Border: 1px solid gray-700/30
• Opacity: 0.65 (entire card)
• Shadow: Large, soft
• Backdrop Filter: blur(4px)
• Cursor: not-allowed
• User Select: none
```

### Lock Icon (Container)

```css
• Size: 40×40px
• Background: gray-800/60
• Border: 1px solid gray-700/40
• Border Radius: 8px
• Icon Size: 20×20px
• Icon Color: gray-400
• Stroke Width: 2px
• Position: Top-left, next to title
```

### Lock Icon (Watermark)

```css
• Size: 96×96px
• Position: Top-right corner
• Opacity: 0.08 (very subtle)
• Stroke Width: 1px
• Purpose: Background decoration
• Non-interactive
```

### Title Text

```css
• Font Size: 16px (1rem)
• Font Weight: 500 (medium)
• Color: gray-300
• Line Height: tight
• Text Overflow: truncate
• Max Lines: 1
```

### Description Text

```css
• Font Size: 14px (0.875rem)
• Color: gray-500
• Line Height: normal
• Margin Top: 6px
• Max Lines: 2 (line-clamp-2)
• Only shown in 'default' variant
```

### Coming Soon Badge

```css
• Padding: 4px 10px
• Border Radius: 9999px (pill)
• Background: blue-500/15
• Border: 1px solid blue-400/20
• Text Color: blue-300
• Font Size: 12px
• Font Weight: 500
• Opacity: 1.0 (NOT faded!)
• Shadow: Small
• Position: Top-right
```

### Pulse Animation (Badge)

```css
• Type: ping
• Color: blue-400
• Opacity: 40%
• Size: 8×8px dot
• Duration: ~1.5s
• Repeat: infinite
• Purpose: Draw attention
```

### Locked Indicator

```css
• Margin Top: 16px
• Padding Top: 12px
• Border Top: 1px solid gray-700/30
• Font Size: 12px
• Color: gray-500
• Icon Size: 14×14px
• Display: Flex with gap
```

---

## 📐 Layout Patterns

### Single Card (Full Width)

```tsx
<div className="max-w-md mx-auto">
  <LockedFeatureCard
    featureName="Find Investors"
    description="..."
  />
</div>
```

### Vertical Stack

```tsx
<div className="space-y-4">
  <LockedFeatureCard featureName="Find Investors" />
  <LockedFeatureCard featureName="Premium Analytics" />
  <LockedFeatureCard featureName="Legal Hub" />
</div>
```

### 2-Column Grid (Compact)

```tsx
<div className="grid grid-cols-2 gap-3">
  <LockedFeatureCard featureName="Accelerator" variant="compact" />
  <LockedFeatureCard featureName="Mentorship" variant="compact" />
  <LockedFeatureCard featureName="Co-working" variant="compact" />
  <LockedFeatureCard featureName="Legal Hub" variant="compact" />
</div>
```

---

## 🎯 Use Cases

### ✅ When to Use

1. **Feature Not Ready** - Development in progress
2. **Premium Upsell** - Feature requires upgrade
3. **Beta Programs** - Limited access features
4. **Regional Restrictions** - Not available in user's location
5. **Time-Locked** - Features launching at specific date
6. **Permission Denied** - User lacks required access level

### ❌ When NOT to Use

1. **Permanently Removed Features** - Use different messaging
2. **Hidden Features** - Just don't show them
3. **Active Features** - Use regular cards
4. **Error States** - Use error components instead

---

## 🔐 Security & Trust Signals

### Visual Trust Elements

✅ **Lock Icon** - Universal symbol for security  
✅ **Muted State** - Honest about unavailability  
✅ **Clear Messaging** - "Currently unavailable"  
✅ **Coming Soon** - Sets expectation  
✅ **No Deception** - Can't accidentally click  

### Accessibility

✅ **Readable Contrast** - Text meets WCAG AA at 65% opacity  
✅ **Clear Icons** - Lock recognizable at all sizes  
✅ **Semantic HTML** - Proper cursor states  
✅ **Screen Readers** - Clear text descriptions  

---

## 📱 Mobile Optimization

### Touch Targets

- **Entire Card**: Not tappable (cursor-not-allowed)
- **No Feedback**: No :active or :hover states
- **Visual Only**: Information display only

### Responsive Behavior

```css
• Mobile (320px+): Full width, default padding
• Tablet (768px+): Max-width container
• Desktop (1024px+): Consider different layout
```

### Performance

- ✅ **Lightweight** - Minimal CSS
- ✅ **No JS** - Pure component
- ✅ **Fast Render** - Static content
- ✅ **No Images** - Icons only

---

## 🎨 Color Palette (Dark Theme)

### Backgrounds

```css
Card Background: gray-800/40 → gray-900/40 (gradient)
Lock Container: gray-800/60
Badge Background: blue-500/15
```

### Borders

```css
Card Border: gray-700/30
Lock Border: gray-700/40
Badge Border: blue-400/20
Divider: gray-700/30
```

### Text

```css
Title: gray-300
Description: gray-500
Badge Text: blue-300
Indicator: gray-500
```

### Accents

```css
Badge Glow: blue-400
Pulse Dot: blue-400
```

---

## 🧩 Customization Examples

### Purple Accent (Instead of Blue)

```tsx
<div className="...">
  <span className="... bg-purple-500/15 text-purple-300 border-purple-400/20">
    {/* Badge content */}
  </span>
</div>
```

### Different Lock Position

```tsx
{/* Top-center lock */}
<div className="flex flex-col items-center">
  <div className="w-10 h-10 ...">
    <Lock className="w-5 h-5" />
  </div>
  <h3 className="mt-2">{featureName}</h3>
</div>
```

### No Watermark

```tsx
{/* Comment out watermark section */}
{/* <div className="absolute top-4 right-4 opacity-[0.08]">
  <Lock className="w-24 h-24" />
</div> */}
```

---

## 📊 Component Variants Comparison

| Feature | Default | Compact |
|---------|---------|---------|
| Padding | 20px | 16px |
| Description | ✅ Shown | ❌ Hidden |
| Icon | ✅ Shown | ❌ Hidden |
| Badge | ✅ Shown | ✅ Shown |
| Lock Icon | ✅ Shown | ✅ Shown |
| Indicator | ✅ Shown | ✅ Shown |
| Best For | Single cards | Grids |

---

## 🎭 Animation Details

### Pulse Animation (Badge Dot)

```css
@keyframes ping {
  0% { transform: scale(1); opacity: 0.4; }
  75%, 100% { transform: scale(2); opacity: 0; }
}

Duration: ~1.5s
Iteration: infinite
Easing: ease-out
```

**Purpose**: Creates subtle movement to draw attention to "Coming Soon"

### No Other Animations

- ❌ No hover effects
- ❌ No click animations
- ❌ No transitions on disabled state
- ✅ Static, stable appearance

---

## 🛠️ Integration Guide

### Step 1: Import Component

```tsx
import { LockedFeatureCard } from '@/components/ui/LockedFeatureCard';
```

### Step 2: Add to Your Screen

```tsx
export function YourScreen() {
  return (
    <div className="p-4 bg-[#0A0F1F] min-h-screen">
      <LockedFeatureCard
        featureName="Find Investors"
        description="Connect with VCs and angel investors"
      />
    </div>
  );
}
```

### Step 3: Customize as Needed

```tsx
<LockedFeatureCard
  featureName="Your Feature"
  description="Your description"
  badgeText="Q2 2026"
  variant="compact"
/>
```

---

## 📱 Real-World Examples

### Feature List Screen

```tsx
export function FeaturesScreen() {
  return (
    <div className="space-y-4 p-4">
      {/* Active Feature */}
      <ActiveFeatureCard name="Blind Date" />
      
      {/* Locked Feature */}
      <LockedFeatureCard
        featureName="Find Investors"
        description="Coming in Q2 2026"
      />
      
      {/* Another Active */}
      <ActiveFeatureCard name="Business Meetup" />
    </div>
  );
}
```

### Service Modules Grid

```tsx
export function ServicesGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      <ServiceCard name="Rent-a-Friend" />
      <ServiceCard name="Blind Date" />
      <LockedFeatureCard 
        featureName="Find Investors" 
        variant="compact" 
      />
      <LockedFeatureCard 
        featureName="Accelerator" 
        variant="compact"
        badgeText="Soon"
      />
    </div>
  );
}
```

---

## ✅ Quality Checklist

### Visual Design
- [x] 65% opacity for disabled feel
- [x] Lock icon clearly visible
- [x] Coming Soon badge stands out (100% opacity)
- [x] Rounded corners (12px)
- [x] Dark theme compatible
- [x] Subtle shadow

### Interaction
- [x] cursor-not-allowed
- [x] No hover effects
- [x] No click feedback
- [x] user-select: none
- [x] Overlay prevents interaction

### Content
- [x] Title readable despite fading
- [x] Description supports 2 lines
- [x] Locked indicator clear
- [x] Badge text customizable

### Mobile
- [x] Touch-optimized spacing
- [x] Responsive width
- [x] Readable at all sizes
- [x] Works in grids

### Accessibility
- [x] WCAG AA contrast
- [x] Clear lock iconography
- [x] Semantic cursors
- [x] No confusion with active cards

---

## 🎨 Design Philosophy

### Honest Communication
> "Users deserve to know what's locked and why."

- ✅ Clear visual distinction from active features
- ✅ No fake interactions or misleading CTAs
- ✅ Transparent about availability

### Premium Aesthetic
> "Locked doesn't mean low-quality."

- ✅ Maintains app's design standards
- ✅ Professional, polished appearance
- ✅ Subtle, not loud

### User Respect
> "Don't frustrate users with unclear states."

- ✅ Immediate recognition of locked status
- ✅ Coming Soon creates anticipation, not frustration
- ✅ No accidental taps on disabled features

---

## 🚀 Next Steps & Extensions

### Future Enhancements

1. **Countdown Timer** - Show days until launch
2. **Notify Me Button** - Let users sign up for alerts
3. **Unlock Requirements** - Show what's needed to unlock
4. **Progress Indicator** - Development status (30%, 70%, etc.)
5. **Video Preview** - Teaser of what's coming
6. **Beta Access** - Request early access option

### Code Example (Countdown)

```tsx
<LockedFeatureCard
  featureName="Find Investors"
  badgeText="Launches in 45 days"
  description="..."
/>
```

---

## 📚 Related Components

- **ActiveFeatureCard** - For unlocked features
- **PremiumFeatureCard** - For paid upgrades
- **ComingSoonBanner** - For announcements
- **FeatureRequestCard** - For user voting

---

## 🎉 Summary

### What You Get

✨ **Mobile-optimized** locked feature card  
✨ **Dark theme** compatible design  
✨ **Premium feel** with subtle details  
✨ **Clear communication** of locked state  
✨ **Coming Soon** badge with pulse animation  
✨ **Reusable component** for any feature  
✨ **Fully accessible** and readable  
✨ **Two variants**: Default & Compact  

### Perfect For

- 🚀 Features in development
- 💎 Premium/Pro features
- 🔜 Upcoming releases
- 🎯 Beta programs
- 🌍 Regional restrictions
- 🔐 Permission-based access

---

**Component File**: `/components/ui/LockedFeatureCard.tsx`  
**Demo Screen**: `/components/screens/LockedFeatureDemo.tsx`  
**Version**: 1.0  
**Last Updated**: January 6, 2026  
**Status**: ✅ Production Ready
