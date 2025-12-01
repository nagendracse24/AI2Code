# Deployment Guide

This guide walks you through deploying AI2Code to production using Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub account with your AI2Code repo
- Vercel account (free): https://vercel.com/signup
- Render account (free): https://render.com/register
- Your OpenAI API key and Figma Personal Access Token

---

## Step 1: Deploy Backend to Render

1. **Sign in to Render**  
   Go to https://dashboard.render.com

2. **Create a new Web Service**  
   - Click **New** → **Web Service**
   - Connect your GitHub account if prompted
   - Select the `AI2Code` repository

3. **Configure the service**  
   - **Name**: `ai2code-backend` (or any name you prefer)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

4. **Add Environment Variables**  
   Click "Advanced" → "Add Environment Variable" and add:
   - `PORT` = `3001`
   - `NODE_ENV` = `production`
   - `OPENAI_API_KEY` = `your-actual-openai-key`
   - `FIGMA_PERSONAL_ACCESS_TOKEN` = `your-figma-token` (optional, for live mode)

5. **Deploy**  
   Click "Create Web Service". Render will build and deploy your backend.  
   Once live, copy the URL (e.g., `https://ai2code-backend.onrender.com`).

---

## Step 2: Deploy Frontend to Vercel

1. **Sign in to Vercel**  
   Go to https://vercel.com and sign in with GitHub

2. **Import your repository**  
   - Click **Add New** → **Project**
   - Select your `AI2Code` repository from the list

3. **Configure build settings**  
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Update API proxy**  
   Before deploying, update `vercel.json` in the project root:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://YOUR-RENDER-BACKEND-URL.onrender.com/api/:path*"
       }
     ]
   }
   ```
   Replace `YOUR-RENDER-BACKEND-URL` with the actual Render URL from Step 1.

5. **Deploy**  
   Click "Deploy". Vercel will build and deploy your frontend.  
   Once live, you'll get a URL like `https://ai2code-xyz.vercel.app`.

---

## Step 3: Update CORS on Backend

After deploying the frontend, update the backend CORS settings to allow requests from your Vercel domain:

1. Edit `backend/src/index.ts`:
   ```typescript
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
     credentials: true
   }));
   ```

2. Add `FRONTEND_URL` environment variable on Render:
   - Go to your Render dashboard → ai2code-backend → Environment
   - Add `FRONTEND_URL` = `https://ai2code-xyz.vercel.app` (your Vercel URL)

3. Render will auto-redeploy with the new settings.

---

## Step 4: Test the Live App

1. Visit your Vercel URL (e.g., `https://ai2code-xyz.vercel.app`)
2. Submit a generation request
3. Verify the backend responds and OpenAI integration works
4. Check the Live Preview tab renders correctly

---

## Troubleshooting

### Frontend can't reach backend
- Check the `vercel.json` rewrite URL matches your Render backend URL exactly
- Verify CORS is configured on the backend to allow your Vercel domain

### Backend environment variables not working
- Make sure all env vars are set in Render dashboard (not just `.env` locally)
- Restart the backend service after adding variables

### Build failures
- Check build logs in Render/Vercel dashboards
- Ensure `package.json` scripts are correct (`npm run build`, `npm start`)

---

## Updating Your Deployment

Both platforms auto-deploy on git push to `main`:
1. Make changes locally
2. `git add .` → `git commit -m "..."` → `git push`
3. Vercel and Render will automatically rebuild and redeploy

---

## Custom Domain (Optional)

Both Vercel and Render support custom domains:
- **Vercel**: Dashboard → Project → Settings → Domains
- **Render**: Dashboard → Service → Settings → Custom Domain

---

You're live! 🚀 Share your URL in your resume, LinkedIn, and portfolio.

