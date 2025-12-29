# Firebase Configuration Error Troubleshooting

## Error: auth/configuration-not-found

This error typically means one of the following:

### 1. Environment Variables Not Loaded
**Solution:**
- Make sure you restarted the dev server after creating/updating `.env`
- Vite only reads `.env` files on startup
- Stop the server (Ctrl+C) and run `npm run dev` again

### 2. Firebase Authentication Not Enabled
**Check in Firebase Console:**
1. Go to https://console.firebase.google.com/
2. Select your project: **issue-tracker-68ba5**
3. Click **Authentication** in the left sidebar
4. If you see "Get started", click it
5. Go to **Sign-in method** tab
6. Click on **Email/Password**
7. Make sure it's **Enabled** (toggle should be ON)
8. Click **Save**

### 3. Firestore Database Not Created
**Check in Firebase Console:**
1. Click **Firestore Database** in the left sidebar
2. If you see "Create database", click it
3. Select **Start in test mode**
4. Choose a location
5. Click **Enable**

### 4. Verify Your Firebase Project
Make sure your project ID matches:
- Project ID: `issue-tracker-68ba5`
- Check in Firebase Console → Project Settings

### 5. Check Browser Console
Open browser DevTools (F12) and check:
- Console tab for any error messages
- Look for "Firebase Config Check" log message
- It should show `hasApiKey: true` and `hasProjectId: true`

### Quick Fix Steps:
1. ✅ Verify `.env` file exists in project root
2. ✅ Restart dev server: Stop (Ctrl+C) → `npm run dev`
3. ✅ Enable Authentication in Firebase Console
4. ✅ Create Firestore Database in Firebase Console
5. ✅ Check browser console for detailed error messages

