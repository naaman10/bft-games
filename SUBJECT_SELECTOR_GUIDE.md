# Subject Selector Guide

## 🎯 When Does the Subject Selector Show?

The selector **only appears** when ALL these conditions are met:

- ✅ Accessing game directly (not in iframe)
- ✅ No `?token=...` in URL
- ✅ No `?yearGroup=...` in URL
- ✅ No `?subject=...` in URL

---

## 🧪 How to Access the Selector

### Method 1: Direct Clean URL ✅ (Best)

Visit exactly (no query params):

**Local:**
```
http://localhost:3000/game/gem-hunt
```

**Production:**
```
https://your-app.vercel.app/game/gem-hunt
```

You'll see:
- Purple gradient background
- Year dropdown (Year 1-6)
- Subject dropdown (dynamic based on year)
- "Start Game" button

---

### Method 2: Use "Change Subject" Button ✅ (New!)

When playing in **local mode**, you'll see a banner:

```
Local test — unlimited lives & moves  [Change Subject]
```

**Click "Change Subject"** → Returns to selector screen

---

### Method 3: Clear Query Params

If your URL looks like:
```
http://localhost:3000/game/gem-hunt?yearGroup=Year+6&subject=Percentages
```

Remove everything after the `?`:
```
http://localhost:3000/game/gem-hunt
```

Then reload.

---

## ❌ When Selector WON'T Show

### 1. Embedded in Parent App (bft-learn)
If game is iframed with PostMessage auth, the parent app sends year/subject.

**Workaround:** Play standalone at `/game/gem-hunt`

### 2. URL Has Query Parameters
```
?token=abc123           ❌ Uses auth year/subject
?yearGroup=Year+5       ❌ Uses Year 5
?subject=Fractions      ❌ Uses Fractions
```

**Workaround:** Remove all params

### 3. Authenticated Mode
If you have a JWT token (via parent or query), it uses the token's year/subject.

**Workaround:** Click "Change Subject" button (local mode only)

---

## 🎮 How to Play Different Subjects

### Standalone Testing (Easy)

1. Visit: `http://localhost:3000/game/gem-hunt`
2. Select year and subject
3. Click "Start Game"
4. Play!
5. To change: Click "Change Subject" button in banner

### Production/Vercel (Authenticated)

**If accessing via bft-learn:**
- Year/subject determined by parent app
- No selector available (by design)
- Parent app should let user choose before launching game

**If accessing directly:**
- Same as standalone testing above

---

## 🔧 Available Subject Combinations

Based on your question bank:

| Year | Subjects Available |
|------|--------------------|
| Year 1 | Addition, Subtraction |
| Year 2 | Addition, Multiplication |
| Year 3 | Addition, Multiplication, Division |
| Year 4 | Multiplication, Division, Fractions |
| Year 5 | Multiplication, Fractions, Decimals |
| Year 6 | Percentages, Fractions, Decimals, Ratio |

The subject dropdown **automatically updates** when you change the year!

---

## 📝 Technical Details

### Selector Trigger Logic

```typescript
// In useGameSession.ts
if (query.token) {
  // Has token → Skip selector, use auth
  applyAuthPayload(query);
} else if (isEmbeddedInParent()) {
  // In iframe → Skip selector, wait for parent
  waitForParentMessage();
} else if (query.yearGroup || query.subject) {
  // Has params → Skip selector, use params
  startLocal();
} else {
  // No token, not embedded, no params → SHOW SELECTOR
  setNeedsSelection(true);
}
```

### Subject Mapping

```typescript
const SUBJECTS_BY_YEAR = {
  'Year 1': ['Addition', 'Subtraction'],
  'Year 2': ['Addition', 'Multiplication'],
  'Year 3': ['Addition', 'Multiplication', 'Division'],
  'Year 4': ['Multiplication', 'Division', 'Fractions'],
  'Year 5': ['Multiplication', 'Fractions', 'Decimals'],
  'Year 6': ['Percentages', 'Fractions', 'Decimals', 'Ratio'],
};
```

---

## 🎨 Selector Features

- ✨ Beautiful gradient purple design
- ✨ Animated bouncing sun logo
- ✨ Dynamic subject options based on year
- ✨ Shows what you'll practice before starting
- ✨ Fully responsive on mobile
- ✨ Smooth animations

---

## 🐛 Troubleshooting

### "I don't see the selector"

**Check:**
1. Is your URL clean? (no `?` or params)
2. Are you accessing directly? (not in iframe)
3. Hard refresh (Ctrl+Shift+R)

### "Subjects don't change when I pick a year"

**This is a bug.** The dropdown should update automatically.

**Workaround:** Refresh the page.

### "I'm in authenticated mode and can't change"

**By design.** In auth mode, year/subject come from token.

**Workaround:** 
- Click "Change Subject" (local mode only)
- Or access at clean URL without token

---

## 💡 Tips

1. **For Testing**: Use clean URL `/game/gem-hunt`
2. **For Quick Switch**: Use "Change Subject" button (local mode)
3. **For Production**: Parent app (bft-learn) controls year/subject
4. **For Demos**: Use query params to preset: `?yearGroup=Year+5&subject=Fractions`

---

## 🎯 Summary

**Want selector?** → Visit `/game/gem-hunt` (clean URL, no params)

**Already playing?** → Click "Change Subject" button (local mode banner)

**In bft-learn?** → Selector not available (parent controls subject)

---

**The selector is working - you just need to access it the right way!** ✅
