# Quick Start - Hybrid Deployment

## What You Need

1. Your Vercel app URL (after backend deployment)
2. Your GitHub username
3. A strong password for app access

## Step-by-Step Checklist

### ☐ Step 1: Install Dependencies
```bash
npm install
```

### ☐ Step 2: Deploy Backend to Vercel
1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repo
4. Add environment variables:
   - `GEMINI_API_KEY` = your Gemini API key
   - `PROXY_KEY` = your chosen password
   - `FRONTEND_URL` = `https://YOUR_USERNAME.github.io/urban-publicness`
5. Deploy
6. **Copy your Vercel URL** (e.g., `https://urban-publicness.vercel.app`)

### ☐ Step 3: Update Config File
Edit `src/config.ts`, replace with your Vercel URL:
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? '' : 'https://YOUR-VERCEL-URL.vercel.app');
```

### ☐ Step 4: Add GitHub Secret
1. GitHub repo → Settings → Secrets and variables → Actions
2. New repository secret:
   - Name: `VERCEL_API_URL`
   - Value: your Vercel URL (e.g., `https://urban-publicness.vercel.app`)

### ☐ Step 5: Enable GitHub Pages
1. GitHub repo → Settings → Pages
2. Source: GitHub Actions
3. Save

### ☐ Step 6: Push Changes
```bash
git add .
git commit -m "Configure hybrid deployment"
git push origin main
```

### ☐ Step 7: Wait for Deployment
Watch GitHub Actions tab - it will auto-deploy to:
`https://YOUR_USERNAME.github.io/urban-publicness`

### ☐ Step 8: Update Vercel FRONTEND_URL
1. Go back to Vercel → Settings → Environment Variables
2. Update `FRONTEND_URL` with your actual GitHub Pages URL
3. Redeploy Vercel

## Done! 🎉
Visit your GitHub Pages URL and login with your `PROXY_KEY` password.

## Need Help?
See full guide in [DEPLOYMENT.md](DEPLOYMENT.md)
