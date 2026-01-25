# Hybrid Deployment Guide (GitHub Pages + Vercel)

This guide will help you deploy your Urban Narrative Decoder application using a hybrid approach:
- **Frontend**: GitHub Pages (free, auto-deploys from your repo)
- **Backend API**: Vercel (free, serverless functions for auth & API proxy)

This keeps your app private with password protection while using free hosting services.

## Architecture

```
User → GitHub Pages (Frontend)
         ↓
      Vercel (Backend APIs)
         ↓
      Gemini API
```

## Prerequisites

1. A [GitHub account](https://github.com/signup)
2. A [Vercel account](https://vercel.com/signup)
3. A Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
4. (Optional) Google Search API credentials

---

## Part 1: Deploy Backend to Vercel

### Step 1: Push Your Code to GitHub

```bash
git add .
git commit -m "Ready for hybrid deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Other (or Vite - it will only deploy the API functions)
   - **Root Directory**: `./`
   - **Build Command**: Leave empty (we only need the API functions)
   - **Output Directory**: Leave empty

### Step 3: Set Vercel Environment Variables

In your Vercel project settings → Environment Variables, add:

**Required:**
- `GEMINI_API_KEY` - Your Gemini API key
- `PROXY_KEY` - A strong password (this is your app login password!)
- `FRONTEND_URL` - Your future GitHub Pages URL: `https://YOUR_GITHUB_USERNAME.github.io/urban-publicness`

**Optional (for Google Search):**
- `GOOGLE_SEARCH_API_KEY`
- `GOOGLE_SEARCH_ENGINE_ID`

### Step 4: Get Your Vercel API URL

1. After deployment, Vercel will give you a URL like: `https://your-app-name.vercel.app`
2. **Copy this URL** - you'll need it for GitHub Pages setup

---

## Part 2: Deploy Frontend to GitHub Pages

### Step 5: Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: GitHub Actions
4. Click **Save**

### Step 6: Add GitHub Repository Secret

1. In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add:
   - **Name**: `VERCEL_API_URL`
   - **Value**: Your Vercel URL from Step 4 (e.g., `https://your-app-name.vercel.app`)
4. Click **Add secret**

### Step 7: Update Config File

Edit [src/config.ts](src/config.ts) and replace `'https://your-vercel-app.vercel.app'` with your actual Vercel URL:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? '' : 'https://YOUR-ACTUAL-VERCEL-URL.vercel.app');
```

### Step 8: Commit and Push

```bash
git add src/config.ts
git commit -m "Update Vercel API URL"
git push origin main
```

### Step 9: Deploy to GitHub Pages

The GitHub Action will automatically deploy your frontend to GitHub Pages. You can monitor the progress:
1. Go to your repository → **Actions** tab
2. Watch the "Deploy to GitHub Pages" workflow
3. Once complete (green checkmark), your site will be live!

### Step 10: Get Your GitHub Pages URL

Your app will be available at:
```
https://YOUR_GITHUB_USERNAME.github.io/urban-publicness
```

---

## Part 3: Final Configuration

### Step 11: Update Vercel FRONTEND_URL

Now that you know your GitHub Pages URL:
1. Go back to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `FRONTEND_URL` with your actual GitHub Pages URL
3. Redeploy your Vercel project (Deployments → click ⋯ → Redeploy)

---

## 🎉 You're Done!

Visit your GitHub Pages URL and login with the password you set as `PROXY_KEY` in Vercel.

## Security Features

✅ **Password Protection**: Login gate on GitHub Pages  
✅ **CORS Protection**: Backend only accepts requests from your GitHub Pages URL  
✅ **HttpOnly Cookies**: Secure session management  
✅ **Server-side API Key**: Gemini API key never exposed to browser  
✅ **24-hour Sessions**: Automatic logout  

## Local Development

1. Copy `.env.local.example` to `.env.local`
2. Add your `GEMINI_API_KEY`
3. Run: `npm run dev`
4. Open: http://localhost:5173

## Updating Your App

### Update Frontend:
```bash
git add .
git commit -m "Update frontend"
git push origin main
```
GitHub Actions will automatically redeploy.

### Update Backend:
Just push to GitHub - Vercel is also connected to your repo and will auto-deploy API changes.

## Troubleshooting

### "CORS error" or "Failed to fetch"
- Check that `FRONTEND_URL` in Vercel matches your GitHub Pages URL exactly
- Ensure `VITE_API_BASE_URL` secret in GitHub matches your Vercel URL
- Redeploy both Vercel and GitHub Pages after updating URLs

### "Unauthorized" errors
- Verify `PROXY_KEY` is set in Vercel
- Try clearing browser cookies and logging in again
- Check Vercel function logs for detailed errors

### GitHub Actions fails
- Check that `VERCEL_API_URL` secret is set in GitHub repository settings
- Verify the secret value is correct (no trailing slash)
- Check Actions tab for detailed error logs

### Login page shows but won't authenticate
- Confirm `PROXY_KEY` is set in Vercel environment variables
- Check browser console for CORS errors
- Verify Vercel deployment is successful

## Monitoring

- **Frontend logs**: GitHub Actions tab in your repository
- **Backend logs**: Vercel Dashboard → Your Project → Functions → View logs
- **API errors**: Browser Developer Tools → Console tab

---

## Cost Summary

✅ **GitHub Pages**: Free  
✅ **Vercel**: Free (100GB bandwidth/month, 100 serverless function invocations/day)  
✅ **Total**: $0/month

Perfect for personal use!
