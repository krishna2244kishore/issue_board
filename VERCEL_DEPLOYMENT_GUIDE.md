# Complete Guide: Deploying to Vercel

## Prerequisites Checklist

Before deploying, make sure you have:
- ✅ Firebase project set up
- ✅ Firestore Database created
- ✅ Authentication enabled (Email/Password)
- ✅ Firestore security rules updated (NOT in test mode for production)
- ✅ GitHub account
- ✅ Vercel account (free tier works)

## Step 1: Update Firestore Security Rules (IMPORTANT!)

**⚠️ Do this FIRST before deploying!**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **issue-tracker-68ba5**
3. Click **Firestore Database** → **Rules** tab
4. Replace with production rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /issues/{issueId} {
      allow read, write: if request.auth != null;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Click **"Publish"**
6. Wait for confirmation

## Step 2: Prepare Your Code

### 2.1 Check Your Files

Make sure these files exist:
- ✅ `package.json`
- ✅ `vite.config.ts`
- ✅ `vercel.json`
- ✅ `.env` (with your Firebase config - this won't be committed, which is good!)

### 2.2 Remove Debug Logging (Optional)

If you added console.log statements for debugging, you can remove them from `src/firebase/config.ts`:

```typescript
// Remove or comment out these lines:
console.log('Firebase Config Check:', {...});
console.log('Firebase initialized successfully');
```

## Step 3: Initialize Git Repository (If Not Already Done)

Open terminal in your project folder and run:

```bash
# Check if git is initialized
git status

# If not initialized, run:
git init
git add .
git commit -m "Initial commit: Issue Tracker app"
```

## Step 4: Push to GitHub

### 4.1 Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click **"+"** → **"New repository"**
3. Repository name: `issue-tracker` (or any name you like)
4. Description: "Issue Tracker Application with Firebase"
5. Choose **Public** (required for free Vercel)
6. **DO NOT** check "Initialize with README" (you already have one)
7. Click **"Create repository"**

### 4.2 Push Your Code

GitHub will show you commands. Run these in your terminal:

```bash
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/issue-tracker.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**If you get authentication errors:**
- Use GitHub Personal Access Token instead of password
- Or use GitHub Desktop app
- Or use SSH keys

## Step 5: Deploy to Vercel

### 5.1 Sign Up / Login to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"** (easiest option)
4. Authorize Vercel to access your GitHub

### 5.2 Import Your Project

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories
3. Find and click **"Import"** next to your `issue-tracker` repository
4. Vercel will auto-detect it's a Vite project

### 5.3 Configure Project Settings

Vercel should auto-detect:
- **Framework Preset:** Vite
- **Root Directory:** `./` (root)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `dist` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

**Leave these as default** - they're correct!

### 5.4 Add Environment Variables

**This is CRITICAL!**

1. In the project configuration page, scroll to **"Environment Variables"**
2. Click **"Add"** for each variable:

Add these 6 environment variables:

| Name | Value (from your .env file) |
|------|----------------------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyBrBzkx7NwLAf7yFsy8SMRILaC8UqZnIjA` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `issue-tracker-68ba5.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `issue-tracker-68ba5` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `issue-tracker-68ba5.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `338239806316` |
| `VITE_FIREBASE_APP_ID` | `1:338239806316:web:45970a999c99bace00f149` |

**For each variable:**
- Paste the name (e.g., `VITE_FIREBASE_API_KEY`)
- Paste the value (from your `.env` file)
- Make sure it's added to **Production**, **Preview**, and **Development** environments
- Click **"Save"**

### 5.5 Deploy!

1. After adding all environment variables, click **"Deploy"**
2. Vercel will:
   - Install dependencies
   - Build your project
   - Deploy to a URL
3. Wait 2-3 minutes for deployment to complete

## Step 6: Verify Deployment

### 6.1 Check Deployment Status

1. You'll see a deployment page with progress
2. When complete, you'll see:
   - ✅ "Ready" status
   - A URL like: `https://issue-tracker-xxxxx.vercel.app`

### 6.2 Test Your App

1. Click on the deployment URL
2. You should see your login page
3. Test:
   - ✅ Sign up with a new account
   - ✅ Log in
   - ✅ Create an issue
   - ✅ View issues list
   - ✅ Filter issues
   - ✅ Update issue status

### 6.3 Check for Errors

- Open browser DevTools (F12)
- Check Console for any errors
- Check Network tab for failed requests

## Step 7: Custom Domain (Optional)

If you want a custom domain:

1. In Vercel project → **Settings** → **Domains**
2. Add your domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error: "Environment variable not found"**
- Double-check all 6 environment variables are added in Vercel
- Make sure variable names start with `VITE_`
- Redeploy after adding variables

### App Doesn't Work After Deployment

**Firebase errors:**
- Verify environment variables are correct
- Check Firebase Console for any errors
- Make sure Firestore rules are published

**Authentication not working:**
- Check Firebase Auth is enabled
- Verify `authDomain` in environment variables matches Firebase

**Database errors:**
- Make sure Firestore is created
- Check security rules are published (not in test mode)

### Redeploy After Changes

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
3. Vercel will automatically redeploy!

## Quick Reference: Your Firebase Config

For easy copy-paste when adding to Vercel:

```
VITE_FIREBASE_API_KEY=AIzaSyBrBzkx7NwLAf7yFsy8SMRILaC8UqZnIjA
VITE_FIREBASE_AUTH_DOMAIN=issue-tracker-68ba5.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=issue-tracker-68ba5
VITE_FIREBASE_STORAGE_BUCKET=issue-tracker-68ba5.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=338239806316
VITE_FIREBASE_APP_ID=1:338239806316:web:45970a999c99bace00f149
```

## Summary Checklist

Before deploying:
- [ ] Firestore security rules updated (NOT test mode)
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported in Vercel
- [ ] All 6 environment variables added
- [ ] Deployment successful
- [ ] App tested on production URL

After deploying:
- [ ] Can sign up/login
- [ ] Can create issues
- [ ] Can view issues
- [ ] Can filter issues
- [ ] No console errors

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Firebase Docs: https://firebase.google.com/docs
- Check deployment logs in Vercel dashboard

