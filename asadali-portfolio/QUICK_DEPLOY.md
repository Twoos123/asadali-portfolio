# Quick Deployment Helper

## 🚀 After You Deploy Backend to Render

Once you have your Render backend URL, run this command to update your frontend:

### Your Backend URL will look like:
```
https://asadali-portfolio-backend.onrender.com
```

### Update Contact.js

Replace line 43 in `src/pages/Contact.js`:

**FROM:**
```javascript
? 'https://your-backend-url.com/api/contact'
```

**TO:**
```javascript
? 'https://asadali-portfolio-backend.onrender.com/api/contact'
```

### Then Deploy Frontend:

```powershell
npm run deploy
```

---

## ✅ Full Workflow Summary

1. **Push to GitHub**
   ```powershell
   git add .
   git commit -m "Add backend for contact form"
   git push origin main
   ```

2. **Deploy Backend to Render**
   - Go to https://render.com
   - Create Web Service from your GitHub repo
   - Root Directory: `asadali-portfolio/backend`
   - Add environment variables
   - Deploy!

3. **Update Frontend**
   - Copy your Render URL
   - Update `src/pages/Contact.js` line 43
   - Save file

4. **Deploy Frontend**
   ```powershell
   git add .
   git commit -m "Update backend URL for production"
   git push origin main
   npm run deploy
   ```

5. **Test**
   - Visit: https://twoos123.github.io/asadali-portfolio
   - Try the contact form!

---

## 🔥 Pro Tip: Test Backend First

Before deploying frontend, test your backend URL:

```
https://your-backend-url.onrender.com/api/health
```

Should return:
```json
{
  "success": true,
  "message": "Portfolio backend server is running!"
}
```

If this works, your backend is ready! ✅