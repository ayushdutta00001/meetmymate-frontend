# 🧪 DROPDOWN VISIBILITY TESTING GUIDE

## Quick Verification Checklist

Use this guide to verify all dropdowns meet WCAG AA standards across both portals.

---

## 🎯 WHAT TO TEST

### **1. Visual Readability Test**

**Light Mode:**
- [ ] Open any dropdown → All options clearly visible
- [ ] Text color is dark (#0B0B0C) on white background (#FFFFFF)
- [ ] Border is visible (#D1D5DB)
- [ ] No text blends into background

**Dark Mode:**
- [ ] Open any dropdown → All options clearly visible
- [ ] Text color is light (#F9FAFB) on dark background (#1F2937)
- [ ] Border is visible (#4B5563)
- [ ] No text blends into background

---

### **2. Interaction States Test**

**Hover:**
- [ ] Hover over dropdown → Border color changes
- [ ] Cursor changes to pointer
- [ ] Smooth transition (200ms)

**Focus:**
- [ ] Tab to dropdown → Blue ring appears (3px)
- [ ] Border changes to blue (#3C82F6)
- [ ] Shadow elevation visible
- [ ] Clear visual indication

**Selected:**
- [ ] Select an option → Blue background (#3C82F6)
- [ ] White text on blue background
- [ ] High contrast maintained

**Disabled:**
- [ ] Disabled dropdown → 60% opacity
- [ ] Text still readable
- [ ] Cursor shows "not-allowed"
- [ ] Background slightly grayed

---

### **3. Dropdown Menu Test**

**When Opened:**
- [ ] Menu "floats" above page content
- [ ] Clear shadow/elevation visible
- [ ] All options readable instantly
- [ ] No overlap issues

**Scroll Test:**
- [ ] If > 10 options → Scrollbar appears
- [ ] Scrollbar is visible (not hidden)
- [ ] Smooth scroll behavior
- [ ] Hover on scrollbar → Thumb darkens

---

### **4. Keyboard Navigation Test**

- [ ] Tab → Selects dropdown
- [ ] Enter/Space → Opens menu
- [ ] Arrow Up/Down → Navigate options
- [ ] Enter → Select option
- [ ] Esc → Close menu
- [ ] All actions have visual feedback

---

### **5. Size & Spacing Test**

**Measurements:**
- [ ] Text size ≥ 14px
- [ ] Row height ≥ 40px
- [ ] Padding left: 16px (1rem)
- [ ] Padding right: 40px (for icon)
- [ ] Padding top/bottom: 10px (0.625rem)
- [ ] Comfortable tap targets on mobile

---

### **6. Cross-Portal Consistency Test**

**Admin Portal Locations:**
- [ ] Dashboard filters
- [ ] Users & Identity Control (status, role, verification filters)
- [ ] Rent-a-Friend Operations (status, city filters)
- [ ] Blind Date Payments (status filter)
- [ ] Business Meetup Disputes (severity, category filters)
- [ ] P2P Match Settings (configuration dropdowns)
- [ ] Find Investor Operations (industry filter)
- [ ] Find Experienced Disputes (status filter)
- [ ] Audit Logs (action type, user filter)
- [ ] Internal Legal (category filter)

**User Portal Locations:**
- [ ] Profile settings (gender, interests)
- [ ] Availability selectors
- [ ] Search filters (service type, location)
- [ ] Booking forms (date, time, duration)

**Verification:**
- [ ] All look the same
- [ ] All use same styling
- [ ] All meet contrast standards
- [ ] No visual inconsistencies

---

### **7. Theme Switch Test**

**Steps:**
1. Open dropdown in light mode
2. Switch to dark mode (system preference or toggle)
3. Verify dropdown adapts correctly

**Check:**
- [ ] Background changes to dark (#1F2937)
- [ ] Text changes to light (#F9FAFB)
- [ ] Border changes to lighter gray (#4B5563)
- [ ] All states still clear
- [ ] No flash or visual glitch

---

### **8. Error State Test**

**With Error Message:**
- [ ] Error text is red (#DC2626 / #F87171)
- [ ] Error text has sufficient contrast
- [ ] Positioned below dropdown
- [ ] Doesn't break layout
- [ ] Icon indicates error if present

---

### **9. Mobile Responsive Test**

**On Mobile Device:**
- [ ] Dropdown triggers native picker (iOS/Android)
- [ ] Or custom dropdown is touch-friendly
- [ ] Tap targets ≥ 44x44px
- [ ] Options readable on small screen
- [ ] No horizontal scroll

---

### **10. Contrast Ratio Test**

**Use Browser DevTools or Contrast Checker:**

**Light Mode:**
- [ ] Default: #0B0B0C on #FFFFFF → Should be ~16:1 ✅
- [ ] Hover: #0B0B0C on #F9FAFB → Should be ~15:1 ✅
- [ ] Selected: #FFFFFF on #3C82F6 → Should be ~8.6:1 ✅
- [ ] Disabled: #6B7280 on #F3F4F6 → Should be ~5.8:1 ✅

**Dark Mode:**
- [ ] Default: #F9FAFB on #1F2937 → Should be ~15.8:1 ✅
- [ ] Hover: #F9FAFB on #374151 → Should be ~13.9:1 ✅
- [ ] Selected: #FFFFFF on #3C82F6 → Should be ~8.6:1 ✅
- [ ] Disabled: #9CA3AF on #111827 → Should be ~5.5:1 ✅

**All should exceed 4.5:1 (WCAG AA minimum)**

---

## 🚨 RED FLAGS TO WATCH FOR

### ❌ **FAILURES:**

1. **Text disappears** when dropdown opens
2. **Low contrast** between text and background
3. **No visual feedback** on hover/focus
4. **Scrollbar hidden** when options overflow
5. **Disabled items invisible** (completely grayed out)
6. **Inconsistent styling** across portals
7. **Text too small** (< 14px)
8. **Rows too short** (< 40px)
9. **No shadow/elevation** (dropdown doesn't "float")
10. **Theme doesn't adapt** properly

### ✅ **If you see any of these, refer to:**
- `/components/ui/Select.tsx` for component implementation
- `/styles/globals.css` for global select styling
- `/DROPDOWN_SYSTEM_IMPLEMENTATION.md` for specifications

---

## 🛠️ QUICK FIX REFERENCE

### **Problem: Dropdown text invisible**
**Fix:** Check if global CSS is loaded. Verify `<select>` element has proper classes.

### **Problem: Dark mode doesn't work**
**Fix:** Verify `.dark` class on parent or `prefers-color-scheme` detection working.

### **Problem: Options not visible when opened**
**Fix:** Check browser compatibility. Some browsers handle `<option>` styling differently.

### **Problem: Scrollbar not visible**
**Fix:** Verify custom scrollbar CSS is applied. Check browser support.

### **Problem: Focus ring missing**
**Fix:** Ensure `:focus` styles are not overridden. Check `outline: none` isn't blocking it.

---

## 📊 BROWSER TESTING MATRIX

| Browser | Light Mode | Dark Mode | Keyboard Nav | Mobile |
|---------|------------|-----------|--------------|--------|
| Chrome  | ✅ Test    | ✅ Test   | ✅ Test      | ✅ Test |
| Firefox | ✅ Test    | ✅ Test   | ✅ Test      | ✅ Test |
| Safari  | ✅ Test    | ✅ Test   | ✅ Test      | ✅ Test |
| Edge    | ✅ Test    | ✅ Test   | ✅ Test      | ✅ Test |

**All browsers should pass all tests.**

---

## 📸 VISUAL REGRESSION CHECKLIST

**Before/After Screenshots:**
- [ ] Admin Portal filter dropdowns (light)
- [ ] Admin Portal filter dropdowns (dark)
- [ ] User Portal form dropdowns (light)
- [ ] User Portal form dropdowns (dark)
- [ ] Hover state (light)
- [ ] Hover state (dark)
- [ ] Focus state (light)
- [ ] Focus state (dark)
- [ ] Disabled state (light)
- [ ] Disabled state (dark)

**Compare:**
- [ ] All options clearly readable
- [ ] No visual regressions
- [ ] Consistent styling
- [ ] Professional appearance

---

## 🎯 ACCEPTANCE CRITERIA

### **Dropdown is APPROVED if:**

✅ **Visibility:** All text readable in all states  
✅ **Contrast:** Meets/exceeds WCAG AA (4.5:1)  
✅ **Consistency:** Same styling across all portals  
✅ **Interaction:** Hover, focus, disabled states clear  
✅ **Elevation:** Visual separation from page  
✅ **Scrolling:** Scrollbar visible when needed  
✅ **Size:** ≥14px text, ≥40px rows  
✅ **Keyboard:** Full keyboard navigation support  
✅ **Theme:** Works in light and dark mode  
✅ **Professional:** Clean, stable, enterprise-grade  

### **Dropdown is REJECTED if:**

❌ Any text is invisible or hard to read  
❌ Contrast ratio < 4.5:1  
❌ Inconsistent styling across portals  
❌ No visual feedback on interaction  
❌ Scrollbar hidden when needed  
❌ Text < 14px or rows < 40px  
❌ Keyboard navigation broken  
❌ Theme switching causes issues  
❌ Looks unprofessional or unstable  

---

## 🚀 AUTOMATED TESTING (Optional)

### **Accessibility Testing Tools:**
- **axe DevTools** → Check WCAG compliance
- **Lighthouse** → Accessibility score
- **WAVE** → Contrast and structure analysis
- **Color Contrast Analyzer** → Verify ratios

### **Visual Regression Tools:**
- **Percy** → Screenshot comparison
- **Chromatic** → Component visual testing
- **BackstopJS** → Automated visual regression

---

## 📋 FINAL SIGN-OFF

**Tester Name:** _________________  
**Date:** _________________  

**I confirm that all dropdowns across User Portal and Admin Portal:**
- [ ] Meet WCAG AA contrast standards
- [ ] Are fully visible in light and dark modes
- [ ] Have clear interaction states
- [ ] Are consistent across all screens
- [ ] Feel professional and stable
- [ ] Are production-ready

**Signature:** _________________

---

## 🎉 TESTING COMPLETE

If all checkboxes are ticked and no red flags found:

**✅ DROPDOWN SYSTEM IS APPROVED FOR PRODUCTION**

The dropdown visibility and readability system is now fully compliant with WCAG AA standards and ready for deployment across both User and Admin Portals.
