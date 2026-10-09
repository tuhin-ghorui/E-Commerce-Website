# Render Backend Deployment Guide

## Overview
This guide walks you through deploying the ASTRA E-Commerce backend to **Render** so your Vercel frontend can communicate with it for authentication, products, and orders.

---

## Prerequisites

1. **GitHub Repository** - Your code pushed to GitHub (already done)
2. **MongoDB Atlas Account** - Free tier at [mongodb.com/atlas](https://www.mongodb.com/atlas)
3. **Render Account** - Free tier at [render.com](https://render.com)
4. **Vercel Frontend URL** - Your deployed frontend URL (e.g., `https://your-app.vercel.app`)

---

## Step 1: Set Up MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new **M0 Free Cluster** (choose a region close to your users)
3. **Database Access**: Create a database user with username/password
4. **Network Access**: Add `0.0.0.0/0` (Allow access from anywhere) for Render
5. **Connect**: Choose "Drivers" → Copy the connection string
   - Replace `<db_username>` and `<db_password>` with your credentials
   - Replace `<dbname>` with `astra-ecommerce`
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/astra-ecommerce?retryWrites=true&w=majority`

---

## Step 2: Deploy Backend to Render

### Option A: Using render.yaml (Recommended)

1. Push the new `render.yaml` file to your GitHub repository
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **New +** → **Blueprint**
4. Connect your GitHub repository
5. Render will detect `render.yaml` and show the service configuration
6. Click **Apply** to create the service

### Option B: Manual Service Creation

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `astra-ecommerce-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

---

## Step 3: Configure Environment Variables on Render

In your Render service dashboard, go to **Environment** and add:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Already in render.yaml |
| `PORT` | `10000` | Already in render.yaml (Render uses port 10000) |
| `MONGO_URI` | `your-mongodb-atlas-connection-string` | **Required** - from Step 1 |
| `JWT_SECRET` | *(auto-generated)* | render.yaml has `generateValue: true` |
| `FRONTEND_URL` | `https://your-app.vercel.app` | **Required** - Your Vercel URL |

> **Important**: After adding `FRONTEND_URL`, the CORS will be configured to only allow your Vercel frontend.

---

## Step 4: Update Vercel Frontend Environment Variables

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → **Settings** → **Environment Variables**
3. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-render-app.onrender.com/api`
   - **Environments**: Production, Preview, Development
4. Redeploy the frontend (Vercel will auto-deploy on next push, or trigger manually)

---

## Step 5: Verify Deployment

1. **Backend Health Check**: Visit `https://your-render-app.onrender.com/`
   - Should show: `{"message":"ASTRA E-Commerce REST API is active and running."}`
2. **Frontend Test**: Visit your Vercel URL
   - Try signing up / signing in
   - Browse products
   - Add to cart and checkout

---

## Step 6: Seed Database (Optional)

If you want sample products in production:

1. In Render dashboard, go to your service → **Shell** tab
2. Run: `npm run seed`

---

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in Render matches your Vercel URL exactly (including `https://`)
- Check browser console for exact origin being blocked

### MongoDB Connection Failed
- Verify MongoDB Atlas Network Access allows `0.0.0.0/0`
- Check username/password in connection string
- Ensure database name is `astra-ecommerce`

### Build Fails
- Check Render build logs for missing dependencies
- Ensure `package.json` has correct `start` script: `node src/server.js`

### Environment Variables Not Loading
- Restart the Render service after adding env vars
- Check that variable names match exactly (case-sensitive)

---

## Free Tier Limitations

- **Render Free Tier**: Spins down after 15 min inactivity (cold start ~30-60s)
- **MongoDB Atlas Free Tier**: 512MB storage, shared RAM
- For production, consider upgrading both to paid plans

---

## Quick Commands Reference

```bash
# Local development (with local MongoDB)
cd backend && npm run dev

# Seed local database
cd backend && npm run seed

# Test production build locally
cd backend && NODE_ENV=production npm start
```