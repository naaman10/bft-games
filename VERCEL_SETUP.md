# Setting Up Gem Hunt on Vercel

## 🎯 The Issue

When deployed to Vercel, the frontend defaults to `http://localhost:4000` which doesn't work in production. You need to tell Vercel where your bft-api backend is.

---

## ✅ Solution: Set Environment Variable in Vercel

### Step 1: Deploy or Expose Your bft-api

You have three options:

#### **Option A: Deploy bft-api to Production** (Recommended)
Deploy your backend to:
- **Vercel** (add `vercel.json` config)
- **Railway** / **Render** / **Fly.io**
- **Your own server**

Example URLs:
- `https://api.brighterfuturestutoring.com`
- `https://bft-api.vercel.app`
- `https://bft-api.railway.app`

#### **Option B: Use Ngrok for Testing**
Temporarily expose localhost:
```bash
# In terminal where bft-api is running:
ngrok http 4000

# You'll get a URL like:
# https://abc123.ngrok.io
```

⚠️ Ngrok URLs change on restart and have limits on free plan

#### **Option C: Local Development Only**
Skip Vercel deployment, only test locally with:
```bash
npm run dev  # Uses localhost:4000
```

---

### Step 2: Configure Vercel Environment Variable

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select project: `bft-games`

2. **Open Settings**
   - Click **Settings** tab
   - Click **Environment Variables** in left sidebar

3. **Add Variable**
   - **Name**: `VITE_BFT_API_URL`
   - **Value**: Your API URL (from Step 1)
     - Example: `https://api.brighterfuturestutoring.com`
     - Example: `https://abc123.ngrok.io`
   - **Environments**: Check ALL three:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development

4. **Save**
   - Click **Save** button
   - Vercel will auto-redeploy

5. **Wait for Redeploy**
   - Go to **Deployments** tab
   - Wait for "Building" → "Ready"
   - Takes 1-2 minutes

---

### Step 3: Verify It's Working

#### Check Browser Console

1. Open your Vercel deployment: `https://your-app.vercel.app/game/gem-hunt`
2. Press **F12** (Dev Tools)
3. Go to **Console** tab
4. Look for these logs on page load:

**✅ Correct (API URL is set):**
```
[API Config] Base URL: https://api.your-domain.com
[API Config] Env variable: https://api.your-domain.com
```

**❌ Wrong (Not set, using default):**
```
[API Config] Base URL: http://localhost:4000
[API Config] Env variable: not set
```

#### Test API Connection

When you start a game and reach questions:

**✅ Using Database:**
```
[API] Fetching questions from https://api.your-domain.com/gem-hunt/questions?...
[API] Successfully fetched 5 questions from database
```

**❌ Using Local Fallback:**
```
[API] Failed to fetch from database: Error...
[API] Falling back to local question bank for Year 6 Percentages
```

---

## 🔧 Troubleshooting

### "Environment variable not set"

**Problem**: Console shows `[API Config] Env variable: not set`

**Solutions**:
1. Check you named it exactly: `VITE_BFT_API_URL` (with VITE_ prefix)
2. Check all three environments are selected in Vercel
3. Wait for redeploy to finish (1-2 min)
4. Hard refresh browser (Ctrl+Shift+R)

### "Failed to fetch from database"

**Problem**: API call fails even with correct URL

**Check**:
1. **Is bft-api running?**
   ```bash
   curl https://your-api-url.com/health
   ```

2. **Are CORS headers set in bft-api?**
   Your API needs to allow requests from Vercel:
   ```typescript
   // In bft-api
   app.use(cors({
     origin: [
       'https://your-app.vercel.app',
       'http://localhost:3000'
     ]
   }));
   ```

3. **Are questions in database?**
   ```sql
   SELECT COUNT(*) FROM gem_hunt_questions;
   -- Should return 245
   ```

4. **Is the route registered?**
   Check `bft-api/src/app.ts` has:
   ```typescript
   app.route("/gem-hunt", gemHunt);
   ```

### "localhost:4000 not found"

**Problem**: Deployed app trying to reach localhost

**Cause**: Environment variable not set in Vercel

**Solution**: Follow Step 2 above

---

## 📋 Quick Checklist

Before deploying to Vercel:

- [ ] bft-api is deployed somewhere publicly accessible
- [ ] OR using ngrok for testing
- [ ] bft-api CORS allows your Vercel domain
- [ ] Questions populated in database (245 questions)
- [ ] `/gem-hunt` routes registered in bft-api
- [ ] `VITE_BFT_API_URL` set in Vercel dashboard
- [ ] All 3 environments checked (Prod, Preview, Dev)
- [ ] Waited for Vercel redeploy to finish
- [ ] Hard refreshed browser

---

## 🎯 Summary

**For Local Development:**
```bash
# File: .env
VITE_BFT_API_URL=http://localhost:4000

# Then:
npm run dev
```

**For Vercel Production:**
```
1. Deploy bft-api (or use ngrok)
2. Add VITE_BFT_API_URL in Vercel settings
3. Value: https://your-api-url.com
4. Check all 3 environments
5. Save (auto-redeploys)
6. Check console logs in deployed app
```

---

## 🆘 Still Not Working?

Share these from your deployed Vercel app (F12 → Console):

1. `[API Config]` logs (API URL being used)
2. `[API]` logs (fetch attempt and result)
3. `[QuestionPhase]` logs (token status)
4. Network tab showing the failed request

This will show exactly where the issue is!
