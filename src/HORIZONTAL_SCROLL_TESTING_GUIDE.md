# 🧪 HORIZONTAL SCROLL TESTING GUIDE

## Quick Verification Checklist for User & Admin Portals

---

## 🎯 WHAT TO TEST

### **1. Scrollbar Visibility Test**

**Desktop:**
- [ ] Open a wide table (Admin Portal bookings, transactions, etc.)
- [ ] Scrollbar appears at the bottom
- [ ] Scrollbar is visible (not hidden)
- [ ] Scrollbar track is light gray (light mode) or dark gray (dark mode)
- [ ] Scrollbar thumb is darker gray
- [ ] Hover over scrollbar → Thumb darkens
- [ ] Scrollbar height is 10px (comfortable to click)

**Mobile:**
- [ ] Open a wide table on mobile
- [ ] Native scrollbar appears during scroll
- [ ] Smooth swipe gesture works
- [ ] No accidental vertical scroll

---

### **2. Horizontal Scroll Interaction Test**

**Mouse/Trackpad:**
- [ ] Click and drag scrollbar → Scrolls horizontally
- [ ] Scroll wheel over horizontal container → May scroll horizontally
- [ ] Shift + Scroll wheel → Scrolls horizontally (browser-dependent)
- [ ] Smooth scrolling (no jank)

**Touch (Mobile/Tablet):**
- [ ] Swipe left → Content scrolls right
- [ ] Swipe right → Content scrolls left
- [ ] Smooth momentum scrolling
- [ ] Can scroll vertically and horizontally independently
- [ ] No scroll lock

**Keyboard:**
- [ ] Tab to scroll container
- [ ] Left/Right arrow keys → Scroll horizontally
- [ ] Focus visible (blue outline)
- [ ] Tab through focusable elements inside

---

### **3. Sticky Header Test**

**Vertical Scroll:**
- [ ] Scroll down in a long table
- [ ] Table header remains visible (sticky)
- [ ] Header background matches theme
- [ ] Header doesn't flicker or jump

**Horizontal Scroll:**
- [ ] Scroll left/right in table
- [ ] Header scrolls with content
- [ ] Header remains sticky during horizontal scroll

**Combined:**
- [ ] Scroll down then right → Header stays at top
- [ ] Scroll right then down → Header stays at top
- [ ] No layout issues

---

### **4. Sticky Column Test (Optional)**

**If First Column is Sticky:**
- [ ] Scroll right → First column stays in place
- [ ] First column background matches theme
- [ ] No visual gap between sticky column and rest of table
- [ ] Sticky column + sticky header intersection works (z-index correct)

---

### **5. Fade Edge Indicator Test**

**Left Fade:**
- [ ] Scroll right → Left fade edge appears
- [ ] Fade is subtle gradient (48px wide)
- [ ] Fade matches background (white or dark)
- [ ] Fade doesn't obscure text
- [ ] Fade is non-intrusive

**Right Fade:**
- [ ] When content overflows right → Right fade edge visible
- [ ] Scroll to far right → Right fade disappears
- [ ] Fade is subtle and professional

**Both:**
- [ ] Scroll to middle position → Both fades visible
- [ ] Fades adapt to light/dark theme
- [ ] Fades don't interfere with interaction

---

### **6. Filter Bar Horizontal Scroll Test**

**Desktop:**
- [ ] Open page with many filter chips
- [ ] Filter bar scrolls horizontally
- [ ] Scrollbar is thinner (6px)
- [ ] Smooth scroll
- [ ] Filter chips don't wrap to next line

**Mobile:**
- [ ] Swipe filter bar left/right
- [ ] Smooth momentum scroll
- [ ] Chips maintain 40px minimum height
- [ ] No accidental taps

**Interaction:**
- [ ] Click filter chip → Activates
- [ ] Active chip shows blue background
- [ ] Scrolling doesn't prevent clicking
- [ ] All chips are accessible via scroll

---

### **7. Content Cut-Off Test**

**Wide Tables:**
- [ ] Add 10+ columns to table
- [ ] Scroll all the way right
- [ ] All columns are accessible
- [ ] Nothing is cut off
- [ ] Last column fully visible

**Filter Bars:**
- [ ] Add 15+ filter chips
- [ ] Scroll all the way right
- [ ] All chips are accessible
- [ ] Last chip fully visible

**Forms:**
- [ ] Open wide form on mobile
- [ ] All fields accessible via scroll
- [ ] No hidden inputs
- [ ] Submit button reachable

---

### **8. Layout Stability Test**

**During Scroll:**
- [ ] Scroll horizontally → No vertical layout shift
- [ ] Scroll vertically → No horizontal layout shift
- [ ] Smooth scrolling (no stuttering)
- [ ] Content doesn't jump

**Window Resize:**
- [ ] Resize browser window
- [ ] Scroll container adapts
- [ ] Scrollbar appears/disappears correctly
- [ ] No layout break

---

### **9. Performance Test**

**Large Datasets:**
- [ ] Table with 100+ rows and 10+ columns
- [ ] Horizontal scroll is smooth
- [ ] No frame drops
- [ ] No lag or delay
- [ ] GPU acceleration working (check DevTools)

**Filter Bars:**
- [ ] 20+ filter chips
- [ ] Scroll is smooth
- [ ] No jank
- [ ] Render performance good

---

### **10. Touch Target Test**

**Table Rows:**
- [ ] Measure row height → ≥40px
- [ ] Easy to tap on mobile
- [ ] No mis-taps

**Filter Chips:**
- [ ] Measure chip height → ≥40px
- [ ] Easy to tap on mobile
- [ ] Adequate spacing between chips (8px gap)
- [ ] No mis-taps

**Scroll Buttons (if enabled):**
- [ ] Buttons appear on hover (desktop)
- [ ] Buttons are 40x40px minimum
- [ ] Easy to click
- [ ] Scroll left/right works

---

### **11. Theme Switch Test**

**Light to Dark:**
- [ ] Switch to dark mode
- [ ] Scrollbar track changes to dark gray
- [ ] Scrollbar thumb changes to lighter gray
- [ ] Fade edges change to dark gradient
- [ ] Sticky header background changes
- [ ] Sticky column background changes
- [ ] All text remains readable

**Dark to Light:**
- [ ] Switch to light mode
- [ ] Scrollbar track changes to light gray
- [ ] Scrollbar thumb changes to darker gray
- [ ] Fade edges change to light gradient
- [ ] All backgrounds adapt
- [ ] No visual glitches

---

### **12. Cross-Portal Consistency Test**

**Admin Portal:**
- [ ] Test bookings table → Horizontal scroll works
- [ ] Test payout table → Horizontal scroll works
- [ ] Test dispute table → Horizontal scroll works
- [ ] Test audit logs → Horizontal scroll works
- [ ] Test user management → Horizontal scroll works
- [ ] All use same scrollbar styling
- [ ] All use same interaction pattern

**User Portal:**
- [ ] Test service filters → Horizontal scroll works
- [ ] Test category chips → Horizontal scroll works
- [ ] Test provider carousels → Horizontal scroll works
- [ ] All use same scrollbar styling
- [ ] All use same interaction pattern

**Verification:**
- [ ] Both portals feel consistent
- [ ] No unexpected behavior differences
- [ ] Professional UX maintained

---

### **13. Accessibility Test**

**Screen Reader:**
- [ ] Navigate to table with screen reader
- [ ] Table structure announced correctly
- [ ] Headers announced
- [ ] Can navigate cells with keyboard
- [ ] Scrolling container is focusable

**Keyboard Only:**
- [ ] Navigate site with Tab key only
- [ ] Can reach all table cells
- [ ] Can scroll horizontally with keyboard
- [ ] Focus indicators visible
- [ ] No keyboard traps

**Contrast:**
- [ ] Scrollbar has sufficient contrast against track
- [ ] Text in table has ≥4.5:1 contrast
- [ ] Fade edges don't obscure text readability

---

### **14. Browser Testing Matrix**

| Feature | Chrome | Firefox | Safari | Edge | Mobile |
|---------|--------|---------|--------|------|--------|
| Horizontal Scroll | [ ] | [ ] | [ ] | [ ] | [ ] |
| Scrollbar Visible | [ ] | [ ] | [ ] | [ ] | [ ] |
| Sticky Headers | [ ] | [ ] | [ ] | [ ] | [ ] |
| Sticky Columns | [ ] | [ ] | [ ] | [ ] | [ ] |
| Fade Edges | [ ] | [ ] | [ ] | [ ] | [ ] |
| Touch Scroll | N/A | N/A | N/A | N/A | [ ] |
| Keyboard Nav | [ ] | [ ] | [ ] | [ ] | N/A |
| Performance | [ ] | [ ] | [ ] | [ ] | [ ] |

**All browsers should pass all tests.**

---

## 🚨 RED FLAGS TO WATCH FOR

### ❌ **FAILURES:**

1. **Scrollbar is hidden** or not visible
2. **Content is cut off** without scroll access
3. **Layout shifts** during scrolling
4. **Stuttering or lag** when scrolling
5. **Touch targets too small** (<40px)
6. **Can't scroll horizontally** with touch on mobile
7. **Sticky header doesn't stick**
8. **Sticky column doesn't stick**
9. **Fade edges obscure text** or are too harsh
10. **Theme doesn't adapt** properly
11. **Keyboard navigation broken**
12. **Scrolling causes vertical lock** on mobile

### ✅ **If you see any failures:**
- Check `/components/ui/HorizontalScroll.tsx`
- Check `/components/ui/ScrollableTable.tsx`
- Check `/styles/globals.css` horizontal scroll section
- Verify browser support

---

## 🛠️ DEBUGGING TIPS

### **Scrollbar Not Visible**
**Check:**
1. Content actually overflows? (width > container width)
2. `.horizontal-scroll` class applied?
3. CSS loaded correctly?
4. Browser supports custom scrollbars?

**Fix:**
```css
.horizontal-scroll::-webkit-scrollbar {
  height: 10px !important;
}
```

### **Sticky Header Not Sticking**
**Check:**
1. `position: sticky` supported by browser?
2. `top: 0` is set?
3. Parent has no `overflow: hidden`?
4. Z-index is sufficient?

**Fix:**
```tsx
<TableHeader sticky>
  {/* Headers */}
</TableHeader>
```

### **Fade Edges Not Showing**
**Check:**
1. Content actually overflows?
2. `fadeEdges={true}` prop set?
3. Z-index correct?
4. Background gradient matches theme?

**Fix:**
```tsx
<HorizontalScroll fadeEdges={true}>
  {/* Content */}
</HorizontalScroll>
```

### **Touch Scroll Not Working on Mobile**
**Check:**
1. `-webkit-overflow-scrolling: touch` set?
2. Parent doesn't prevent touch events?
3. `touch-action` not disabled?

**Fix:**
```css
.horizontal-scroll {
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x pan-y;
}
```

---

## 📋 COMPONENT-SPECIFIC TESTING

### **HorizontalScroll Component**

**Test Cases:**
- [ ] With `fadeEdges={true}` → Fades appear when content overflows
- [ ] With `fadeEdges={false}` → No fades shown
- [ ] With `showScrollButtons={true}` → Buttons appear on hover
- [ ] With `showScrollButtons={false}` → No buttons
- [ ] Empty content → No scroll, no fades
- [ ] Content fits exactly → No scroll, no fades
- [ ] Content overflows left only → Left fade only
- [ ] Content overflows right only → Right fade only
- [ ] Content overflows both → Both fades

### **ScrollableTable Component**

**Test Cases:**
- [ ] With `stickyHeader={true}` → Header sticks on scroll
- [ ] With `stickyHeader={false}` → Header scrolls with content
- [ ] With sticky first column → Column remains visible
- [ ] With `minWidth` → Table respects minimum width
- [ ] With `clickable` rows → Hover state works
- [ ] Empty table → No errors
- [ ] 1 column → No horizontal scroll needed
- [ ] 20 columns → Horizontal scroll works

### **FilterBar Component**

**Test Cases:**
- [ ] With 5 filters → May not need scroll
- [ ] With 15 filters → Horizontal scroll works
- [ ] Active filter → Shows blue background
- [ ] Click filter → Callback fires
- [ ] Scrolling → Can click all filters
- [ ] Mobile → Touch scroll works

---

## 📸 VISUAL REGRESSION CHECKLIST

**Capture Screenshots:**
- [ ] Admin table (light mode) — before scroll
- [ ] Admin table (light mode) — during scroll
- [ ] Admin table (light mode) — scrolled right
- [ ] Admin table (dark mode) — before scroll
- [ ] Admin table (dark mode) — during scroll
- [ ] Admin table (dark mode) — scrolled right
- [ ] Filter bar (light mode) — before scroll
- [ ] Filter bar (light mode) — during scroll
- [ ] Filter bar (dark mode) — before scroll
- [ ] Filter bar (dark mode) — during scroll
- [ ] Mobile table scroll
- [ ] Mobile filter scroll

**Compare:**
- [ ] Scrollbar visible in all cases
- [ ] Fade edges appear correctly
- [ ] Sticky headers work
- [ ] No layout breaks
- [ ] Professional appearance

---

## 🎯 ACCEPTANCE CRITERIA

### **Horizontal Scroll is APPROVED if:**

✅ **Discoverable** — Users easily understand scrolling is available  
✅ **Smooth** — No jank, lag, or stuttering  
✅ **Accessible** — All content reachable via scroll  
✅ **Visible** — Scrollbar clearly visible  
✅ **Sticky** — Headers/columns stick as expected  
✅ **Touch-Friendly** — Works on mobile/tablet  
✅ **Keyboard** — Keyboard navigation supported  
✅ **Professional** — Clean, stable, enterprise-grade  
✅ **Consistent** — Same UX across all portals  
✅ **Performant** — Smooth even with large data  

### **Horizontal Scroll is REJECTED if:**

❌ Content is cut off without scroll access  
❌ Scrollbar is hidden or invisible  
❌ Layout shifts during scroll  
❌ Touch scroll doesn't work on mobile  
❌ Sticky headers don't stick  
❌ Performance is poor (jank, lag)  
❌ Keyboard navigation broken  
❌ Inconsistent across portals  
❌ Looks unprofessional  

---

## 🚀 AUTOMATED TESTING (Optional)

### **Unit Tests**
```tsx
describe('HorizontalScroll', () => {
  it('renders children', () => {});
  it('shows fade edges when content overflows', () => {});
  it('hides fade edges when content fits', () => {});
  it('shows scroll buttons when enabled', () => {});
  it('scrolls on button click', () => {});
});

describe('ScrollableTable', () => {
  it('renders table with sticky header', () => {});
  it('renders sticky first column', () => {});
  it('maintains minimum row height', () => {});
  it('supports clickable rows', () => {});
});
```

### **Integration Tests**
```tsx
describe('Admin Bookings Table', () => {
  it('scrolls horizontally', () => {});
  it('maintains sticky header on scroll', () => {});
  it('all columns are accessible', () => {});
  it('scrollbar is visible', () => {});
});
```

### **E2E Tests**
```tsx
describe('Horizontal Scroll E2E', () => {
  it('user can scroll admin table', () => {});
  it('user can scroll filter bar', () => {});
  it('mobile user can swipe table', () => {});
  it('keyboard user can navigate', () => {});
});
```

---

## 📋 FINAL SIGN-OFF

**Tester Name:** _________________  
**Date:** _________________  

**I confirm that horizontal scrolling across User Portal and Admin Portal:**
- [ ] Is discoverable and easy to use
- [ ] Has visible scrollbars
- [ ] Works smoothly on desktop and mobile
- [ ] Maintains sticky headers/columns
- [ ] Shows fade edge indicators
- [ ] Meets 40px touch target minimum
- [ ] Is keyboard accessible
- [ ] Feels professional and stable
- [ ] Is consistent across both portals
- [ ] Is production-ready

**Signature:** _________________

---

## 🎉 TESTING COMPLETE

If all checkboxes are ticked and no red flags found:

**✅ HORIZONTAL SCROLL SYSTEM IS APPROVED FOR PRODUCTION**

The horizontal scrolling system is now fully functional, accessible, professional, and ready for deployment across both User and Admin Portals in the "Meet my Mate" application.
