# 🚀 Deployment Guide - Portfolio with Backend

This guide will walk you through deploying your portfolio with a working contact form.

## 📊 Architecture Overview

```
Frontend (React) → GitHub Pages (Free)
Backend (Node.js) → Render/Railway/Vercel (Free)
```

GitHub Pages only serves static files, so we need to deploy the backend separately.

---

## ✅ Option 1: Render (Recommended - Easiest)

### Why Render?
- ✅ Free tier for web services
- ✅ Automatic deployments from GitHub
- ✅ Easy environment variable management
- ✅ Good for Node.js backends
- ✅ Doesn't sleep as much as Heroku free tier

### Step-by-Step: Deploy Backend to Render

#### 1. Prepare Your Repository

Make sure your code is on GitHub:

```powershell
# Navigate to your project
cd C:\Users\PC\OneDrive\Documents\GitHub\asadali-portfolio\asadali-portfolio

# Check git status
git status

# Add all changes
git add .

# Commit
git commit -m "Add Node.js backend for contact form"

# Push to GitHub
git push origin main
```

#### 2. Sign Up for Render

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with your GitHub account

#### 3. Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `Twoos123/asadali-portfolio`
3. Click "Connect" next to your repository

#### 4. Configure Web Service

Fill in these settings:

- **Name**: `asadali-portfolio-backend`
- **Root Directory**: `asadali-portfolio/backend`
- **Environment**: `Node`
- **Branch**: `main`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Instance Type**: `Free`

#### 5. Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these one by one:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `EMAIL_USER` | `masadbali190@gmail.com` |
| `EMAIL_PASS` | `ppdz bdtz ritr ikeg` |
| `RECIPIENT_EMAIL` | `masadbali190@gmail.com` |
| `PORT` | `5000` |

**⚠️ Important**: Never commit your `.env` file to GitHub!

#### 6. Deploy

1. Click **"Create Web Service"**
2. Wait 2-3 minutes for deployment
3. Your backend will be live at: `https://asadali-portfolio-backend.onrender.com`

#### 7. Test Your Backend

Open your browser or use curl:
```
https://asadali-portfolio-backend.onrender.com/api/health
```

You should see:
```json
{
  "success": true,
  "message": "Portfolio backend server is running!",
  "timestamp": "2025-10-06T..."
}
```

#### 8. Update Frontend with Backend URL

Edit `src/pages/Contact.js` line ~43:

```javascript
const apiUrl = process.env.NODE_ENV === 'production' 
  ? 'https://asadali-portfolio-backend.onrender.com/api/contact'  // ✅ Your actual Render URL
  : 'http://localhost:5000/api/contact';
```

#### 9. Deploy Frontend to GitHub Pages

```powershell
# Build and deploy
npm run deploy
```

#### 10. Test Everything

1. Visit: https://twoos123.github.io/asadali-portfolio
2. Go to Contact page
3. Fill out the form
4. Submit
5. Check your email!

---

## ✅ Option 2: Railway (Alternative - Also Easy)

Railway is similar to Render and also has a generous free tier.

### Deploy to Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Configure:
   - **Root Directory**: `asadali-portfolio/backend`
   - **Start Command**: `node server.js`
6. Add environment variables (same as Render)
7. Deploy!

Railway URL will be like: `https://asadali-portfolio-backend.up.railway.app`

---

## ✅ Option 3: Vercel (For Serverless)

Vercel can host both frontend and backend, but requires some code changes.

### Using Vercel

#### Deploy Backend as Serverless Function

1. Install Vercel CLI:
   ```powershell
   npm install -g vercel
   ```

2. Create `vercel.json` in your project root:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "backend/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "backend/server.js"
       }
     ]
   }
   ```

3. Deploy:
   ```powershell
   vercel
   ```

4. Your backend will be at: `https://your-project.vercel.app/api/contact`

**Note**: Vercel serverless functions have cold starts (slower first request).

---

## 📝 Complete Deployment Checklist

### Backend (Choose One Platform)

- [ ] Code pushed to GitHub
- [ ] Signed up for Render/Railway/Vercel
- [ ] Created web service/project
- [ ] Configured root directory as `asadali-portfolio/backend`
- [ ] Set build command: `npm install`
- [ ] Set start command: `node server.js`
- [ ] Added all environment variables:
  - [ ] NODE_ENV=production
  - [ ] EMAIL_USER
  - [ ] EMAIL_PASS
  - [ ] RECIPIENT_EMAIL
  - [ ] PORT=5000
- [ ] Deployed successfully
- [ ] Tested health endpoint: `/api/health`
- [ ] Got backend URL

### Frontend

- [ ] Updated `src/pages/Contact.js` with production backend URL
- [ ] Committed changes
- [ ] Pushed to GitHub
- [ ] Ran `npm run deploy`
- [ ] Tested contact form on live site

### Final Testing

- [ ] Visited live site: https://twoos123.github.io/asadali-portfolio
- [ ] Navigated to Contact page
- [ ] Filled out contact form
- [ ] Submitted successfully
- [ ] Received email at masadbali190@gmail.com
- [ ] Sender received auto-reply

---

## 🔧 Troubleshooting Production Issues

### Issue: CORS Error in Production

**Symptom**: Contact form fails with CORS error

**Solution**: Make sure your backend CORS includes your GitHub Pages URL:

Edit `backend/server.js`:
```javascript
origin: process.env.NODE_ENV === 'production' 
  ? ['https://twoos123.github.io'] 
  : ['http://localhost:3000']
```

### Issue: Backend Sleeps on Render Free Tier

**Symptom**: First request after inactivity is slow (15-30 seconds)

**Explanation**: Render free tier spins down after 15 minutes of inactivity

**Solutions**:
1. Accept the delay (it's free!)
2. Use Railway (less sleep)
3. Upgrade to Render paid tier ($7/month)
4. Use a ping service to keep it awake (not recommended)

### Issue: Email Not Sending in Production

**Symptom**: Form submits but no email received

**Solutions**:
1. Check Render logs for errors
2. Verify environment variables are set correctly
3. Make sure EMAIL_PASS is your Gmail App Password, not regular password
4. Check Gmail sent folder
5. Check spam folder

### Issue: 404 on Backend Routes

**Symptom**: `https://your-backend.onrender.com/api/contact` returns 404

**Solutions**:
1. Make sure root directory is set to `asadali-portfolio/backend`
2. Check Render deployment logs
3. Verify `server.js` is in the backend folder

---

## 💰 Cost Comparison

| Platform | Free Tier | Limitations | Best For |
|----------|-----------|-------------|----------|
| **Render** | 750 hours/month | Spins down after 15 min inactivity | Simple backends |
| **Railway** | $5 credit/month | ~500 hours/month | Active projects |
| **Vercel** | Unlimited | Cold starts on serverless | Serverless APIs |
| **Heroku** | No free tier | N/A (was free until Nov 2022) | N/A |

**Recommendation**: Start with **Render** (easiest) or **Railway** (better uptime).

---

## 🎯 Quick Commands Reference

### Local Development
```powershell
# Run both frontend and backend
npm run dev

# Or run separately:
# Terminal 1 - Frontend
npm start

# Terminal 2 - Backend
npm run backend
```

### Deploy Frontend to GitHub Pages
```powershell
npm run deploy
```

### Check Backend Logs (Render)
1. Go to Render dashboard
2. Click your web service
3. Click "Logs" tab

### Update Backend Environment Variables (Render)
1. Go to Render dashboard
2. Click your web service
3. Click "Environment" tab
4. Edit variables
5. Save (auto-redeploys)

---

## 🔐 Security Best Practices

1. ✅ Never commit `.env` file
2. ✅ Use Gmail App Password (not regular password)
3. ✅ Set CORS to specific origins only
4. ✅ Keep rate limiting enabled (5 requests per 15 min)
5. ✅ Use environment variables for all secrets
6. ✅ Regularly update npm packages
7. ✅ Monitor backend logs for suspicious activity

---

## 📞 Need Help?

If you run into issues:

1. Check Render/Railway deployment logs
2. Check browser console for errors
3. Test backend health endpoint
4. Verify all environment variables are set
5. Check email credentials

---

## 🎉 You're Done!

Once deployed, your portfolio will have:
- ✅ Beautiful React frontend on GitHub Pages
- ✅ Working contact form with email delivery
- ✅ Professional auto-reply emails
- ✅ Secure backend with rate limiting
- ✅ All for FREE! 💰

Good luck with your deployment! 🚀