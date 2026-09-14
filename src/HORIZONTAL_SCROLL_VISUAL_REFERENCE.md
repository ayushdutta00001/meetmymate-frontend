# 🎨 HORIZONTAL SCROLL — VISUAL REFERENCE GUIDE

## Quick Visual Reference for Developers & Designers

---

## 📐 COMPONENT ANATOMY

### **HorizontalScroll Component**

```
┌─────────────────────────────────────────────────────────┐
│ ┌──────┐                                      ┌──────┐  │
│ │ [<]  │  [Content that extends beyond...]    │ [>]  │  │
│ └──────┘                                      └──────┘  │
│ ▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓  │ ← Fade edges
│ ═══════════════════════════════════════════════════    │ ← Scrollbar (10px)
└─────────────────────────────────────────────────────────┘

Legend:
[<] [>] = Scroll buttons (optional)
▓       = Fade edge gradient (48px)
═══     = Scrollbar (visible, 10px height)
```

### **ScrollableTable Component**

```
┌─────────────────────────────────────────────────────────────────┐
│ ┏━━━━━━━━┯━━━━━━━┯━━━━━━━┯━━━━━━━┯━━━━━━━┯━━━━━━━┓  ← Sticky   │
│ ┃ ID     │ Name  │ Email │ Phone │ City  │ ...   ┃    Header   │
│ ┡━━━━━━━━┿━━━━━━━┿━━━━━━━┿━━━━━━━┿━━━━━━━┿━━━━━━━┩            │
│ │ 001    │ John  │ j@... │ 555...│ NYC   │ ...   │            │
│ │ 002    │ Emma  │ e@... │ 555...│ LA    │ ...   │            │
│ │ 003    │ Mike  │ m@... │ 555...│ SF    │ ...   │            │
│ │  ↕     │   ↕   │   ↕   │   ↕   │   ↕   │   ↕   │ ← 40px min │
│ └────────┴───────┴───────┴───────┴───────┴───────┘            │
│ ▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓  │
│ ═════════════════════════════════════════════════════           │
└─────────────────────────────────────────────────────────────────┘
   ↑
   Sticky first column (optional)

Legend:
┏━━━┓ = Sticky header (stays on vertical scroll)
│     = Sticky first column (stays on horizontal scroll)
▓     = Fade edge gradient
═     = Scrollbar
↕     = Minimum 40px row height
```

### **FilterBar Component**

```
┌─────────────────────────────────────────────────────────┐
│ ┌─────┐ ┌────────┐ ┌───────┐ ┌────────┐ ┌──────────┐   │
│ │ All │ │ Active │ │ Pend. │ │ Comp.  │ │ Cancel...│   │
│ └─────┘ └────────┘ └───────┘ └────────┘ └──────────┘   │
│ ▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓  │
│ ════════════════════════════════════════════════         │
└─────────────────────────────────────────────────────────┘

Legend:
┌─────┐ = Filter chip (40px min height)
▓       = Fade edge (shown when overflow)
════    = Thinner scrollbar (6px for filters)
```

---

## 🎨 COLOR SPECIFICATIONS

### **Light Mode**

#### **Scrollbar**
```
Track:      #F3F4F6  ████████  (gray-100)
Thumb:      #9CA3AF  ████████  (gray-400)
Hover:      #6B7280  ████████  (gray-500)
Height:     10px
Radius:     5px
```

#### **Fade Edges**
```
Start:  rgba(255, 255, 255, 1.0)  ██████████  100% white
End:    rgba(255, 255, 255, 0.0)  ░░░░░░░░░░    0% white
Width:  48px
```

#### **Sticky Header**
```
Background: #F9FAFB  ████████  (gray-50)
Text:       #374151  ████████  (gray-700)
Border:     #E5E7EB  ────────  (gray-200)
```

#### **Sticky Column**
```
Background: #FFFFFF  ████████  (white)
Text:       #111827  ████████  (gray-900)
Border:     #E5E7EB  ────────  (gray-200)
```

### **Dark Mode**

#### **Scrollbar**
```
Track:      #1F2937  ████████  (gray-800)
Thumb:      #4B5563  ████████  (gray-600)
Hover:      #6B7280  ████████  (gray-500)
Height:     10px
Radius:     5px
```

#### **Fade Edges**
```
Start:  rgba(17, 24, 39, 1.0)  ██████████  100% dark
End:    rgba(17, 24, 39, 0.0)  ░░░░░░░░░░    0% dark
Width:  48px
```

#### **Sticky Header**
```
Background: #111827  ████████  (gray-900)
Text:       #D1D5DB  ████████  (gray-300)
Border:     #374151  ────────  (gray-700)
```

#### **Sticky Column**
```
Background: #1F2937  ████████  (gray-800)
Text:       #F9FAFB  ████████  (gray-50)
Border:     #374151  ────────  (gray-700)
```

---

## 📏 SPACING & SIZING

### **Touch Targets**
```
Minimum Height:     40px  ▐████████████▌
Minimum Width:      40px  ▐████████████▌
Recommended Gap:     8px  ▐██▌
Filter Chip Padding: 16px horizontal, 8px vertical
```

### **Scrollbar Dimensions**
```
Desktop Table:      10px height  ▐███████████▌
Mobile Filter:       6px height  ▐███████▌
Track Padding:       2px border  ▐█▌
Thumb Radius:        5px         ▐████▌
```

### **Fade Edges**
```
Width:              48px  ▐████████████████████████████████████▌
Gradient Start:      0px  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━○
Gradient End:       48px  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━○
                           100%                            0%
```

### **Sticky Elements**
```
Header Z-index:     10   ▐══════════▌
Column Z-index:      5   ▐═════▌
Intersection:       20   ▐════════════════════▌
Fade Edge Z-index:   5   ▐═════▌
```

---

## 🎯 INTERACTION STATES

### **Scrollbar States**

#### **Default**
```
┌──────────────────────────────────────┐
│ ████████████████░░░░░░░░░░░░░░░░░░░░ │ ← Thumb position
└──────────────────────────────────────┘
  Track: #F3F4F6  Thumb: #9CA3AF
```

#### **Hover**
```
┌──────────────────────────────────────┐
│ ████████████████░░░░░░░░░░░░░░░░░░░░ │ ← Thumb darker
└──────────────────────────────────────┘
  Track: #F3F4F6  Thumb: #6B7280 (darker)
```

#### **Active (Dragging)**
```
┌──────────────────────────────────────┐
│ ████████████████░░░░░░░░░░░░░░░░░░░░ │ ← Thumb darkest
└──────────────────────────────────────┘
  Track: #F3F4F6  Thumb: #4B5563 (darkest)
```

### **Fade Edge States**

#### **No Overflow (None Visible)**
```
┌────────────────────────┐
│ All content fits here  │
└────────────────────────┘
```

#### **Overflow Right Only**
```
┌────────────────────────────░▒▓█┐
│ Content extends to the right... │
└─────────────────────────────────┘
                           ↑ Right fade
```

#### **Overflow Left Only**
```
┌█▓▒░────────────────────────┐
│ ...scrolled from the left  │
└────────────────────────────┘
  ↑ Left fade
```

#### **Overflow Both Sides**
```
┌█▓▒░──────────────────░▒▓█┐
│ ...content in middle...  │
└──────────────────────────┘
  ↑                      ↑
  Left fade        Right fade
```

---

## 📱 RESPONSIVE BREAKPOINTS

### **Desktop (≥1024px)**
```
┌───────────────────────────────────────────────┐
│  [Table with 10+ columns]                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ ← 10px scrollbar
│  Hover: Scroll buttons appear                 │
│  Fade edges: 48px width                       │
└───────────────────────────────────────────────┘
```

### **Tablet (768px - 1023px)**
```
┌─────────────────────────────────┐
│  [Table with 6-8 columns]       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ ← 10px scrollbar
│  Touch: Swipe to scroll         │
│  Fade edges: 48px width         │
└─────────────────────────────────┘
```

### **Mobile (≤767px)**
```
┌─────────────────────┐
│  [Essential cols]   │
│  ━━━━━━━━━━━━━━━━━  │ ← 6px scrollbar
│  Touch swipe        │
│  Snap to columns    │
│  Fade: 32px width   │
└─────────────────────┘
```

---

## 🎭 ANIMATION TIMING

### **Scroll Behavior**
```
scroll-behavior: smooth;
transition: scroll-position 300ms ease-out;
```

### **Fade Edge Transition**
```
opacity: 0 → 1 (200ms ease-in)
When content starts overflowing
```

### **Scrollbar Hover**
```
background-color: 200ms ease
#9CA3AF → #6B7280
```

### **Focus Indicator**
```
outline: 2px solid #3C82F6
transition: outline 150ms ease
```

---

## 🔤 TYPOGRAPHY IN TABLES

### **Header Cells**
```
Font:         Inter
Size:         12px (0.75rem)
Weight:       600 (semibold)
Transform:    UPPERCASE
Tracking:     0.05em (wider)
Color:        #374151 (gray-700)
Line Height:  40px (matches row height)
```

### **Data Cells**
```
Font:         Inter
Size:         14px (0.875rem)
Weight:       400 (regular)
Transform:    none
Tracking:     normal
Color:        #111827 (gray-900)
Line Height:  40px (matches row height)
```

### **Sticky Column (Important Data)**
```
Font:         Inter
Size:         14px
Weight:       500 (medium)
Color:        #3B82F6 (blue-500)
```

---

## 🎨 VISUAL HIERARCHY

### **Z-Index Stack (Top to Bottom)**
```
Z-index: 20   ███  Sticky header + sticky column intersection
Z-index: 10   ██   Sticky header
Z-index: 5    █    Sticky column, Fade edges
Z-index: 0    ░    Table content, Scrollbar track
```

### **Elevation (Shadow Depth)**
```
Sticky Header:    0 1px 3px rgba(0,0,0,0.1)  ▓▒░
Sticky Column:    1px 0 3px rgba(0,0,0,0.05) ▒░
Scrollbar Track:  inset 0 1px 2px rgba(0,0,0,0.05)
```

---

## 🔄 STATE DIAGRAM

### **Horizontal Scroll States**

```
              ┌──────────────┐
              │  No Overflow │
              │  (Initial)   │
              └──────────────┘
                      │
         Content width > Container width
                      │
                      ↓
              ┌──────────────┐
              │  Scrollable  │
              │   (Ready)    │
              └──────────────┘
                      │
            ┌─────────┴─────────┐
            ↓                   ↓
    ┌──────────────┐    ┌──────────────┐
    │   Scrolling  │    │   Hover on   │
    │   (Active)   │    │   Scrollbar  │
    └──────────────┘    └──────────────┘
            │                   │
            └─────────┬─────────┘
                      ↓
              ┌──────────────┐
              │  Scrolled    │
              │  (Fade L/R)  │
              └──────────────┘
```

---

## 🎯 QUICK REFERENCE CHECKLIST

### **When Implementing Horizontal Scroll:**

✅ **Setup**
- [ ] Import component or add class
- [ ] Set min-width for content
- [ ] Test content overflows

✅ **Scrollbar**
- [ ] Visible (not hidden)
- [ ] 10px height (6px for filters)
- [ ] Styled (light/dark mode)
- [ ] Hover state works

✅ **Sticky Elements**
- [ ] Header sticks on vertical scroll
- [ ] Column sticks on horizontal scroll
- [ ] Z-index correct
- [ ] Background matches theme

✅ **Fade Edges**
- [ ] Appear when overflow
- [ ] 48px width
- [ ] Match theme
- [ ] Don't obscure text

✅ **Touch Targets**
- [ ] Rows ≥40px height
- [ ] Buttons ≥40px x 40px
- [ ] Spacing ≥8px gap

✅ **Interactions**
- [ ] Mouse scroll works
- [ ] Touch swipe works (mobile)
- [ ] Keyboard tab works
- [ ] Focus visible

✅ **Performance**
- [ ] Smooth scrolling
- [ ] No layout shift
- [ ] No jank
- [ ] GPU accelerated

✅ **Accessibility**
- [ ] Keyboard accessible
- [ ] Screen reader compatible
- [ ] WCAG AA contrast
- [ ] Focus indicators

---

## 🎊 VISUAL EXAMPLES

### **Example 1: Admin Bookings Table**
```
┏━━━━━━━┯━━━━━━┯━━━━━━━┯━━━━━━━━┯━━━━━━┯━━━━━━┯━━━━━━┓
┃ ID    │ Date │ User  │ Provid │ Serv │ Amt  │ Stat ┃ ← Sticky
┡━━━━━━━┿━━━━━━┿━━━━━━━┿━━━━━━━━┿━━━━━━┿━━━━━━┿━━━━━━┩
│ BK001 │ 12/2 │ John  │ Sarah  │ RAF  │ $150 │ ✓    │
│ BK002 │ 12/2 │ Emma  │ Mike   │ BD   │ $75  │ ⏳   │
│ BK003 │ 12/2 │ Dave  │ Lisa   │ BM   │ $300 │ ✓    │
└───────┴──────┴───────┴────────┴──────┴──────┴──────┘
▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓
═══════════════════════════════════════════════════
```

### **Example 2: Service Filter Bar**
```
┌─────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌────────┐
│ All │ │ Rent-a-F │ │ Blind Dat │ │ Business │ │ P2P... │
└─────┘ └──────────┘ └───────────┘ └──────────┘ └────────┘
▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓
═══════════════════════════════════════════════════════
```

---

🎨 **END OF VISUAL REFERENCE GUIDE** 🎨

This guide provides quick visual references for implementing and verifying the horizontal scroll system across the "Meet my Mate in" platform.
