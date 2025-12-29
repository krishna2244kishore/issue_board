# How to Create Firestore Database in Firebase

## Step-by-Step Instructions

### Step 1: Open Firebase Console
1. Go to **https://console.firebase.google.com/**
2. Make sure you're logged in with your Google account
3. You should see your project list

### Step 2: Select Your Project
1. Click on your project: **issue-tracker-68ba5**
2. This will open your project dashboard

### Step 3: Navigate to Firestore Database
1. In the left sidebar, look for **"Firestore Database"**
   - It might be under "Build" section
   - Or it might be directly visible in the sidebar
2. Click on **"Firestore Database"**

### Step 4: Create the Database
1. You'll see one of two screens:

   **Option A: "Create database" button**
   - Click the **"Create database"** button
   
   **Option B: "Get started" or setup screen**
   - Click **"Get started"** or **"Create database"**

### Step 5: Choose Database Mode
1. You'll see two options:
   - **Production mode** (requires security rules)
   - **Test mode** (allows read/write for 30 days)
   
2. **For development/testing, select "Start in test mode"**
   - This allows your app to read and write data without complex security rules
   - Click **"Next"**

### Step 6: Choose Database Location
1. Select a location closest to your users
   - For most cases, **"us-central"** or **"us-east1"** works well
   - Or choose the region closest to you
   
2. **Important:** Once set, you cannot change the location later
3. Click **"Enable"**

### Step 7: Wait for Database Creation
1. Firebase will create your database
2. This usually takes 1-2 minutes
3. You'll see a loading screen

### Step 8: Verify Database is Ready
1. Once created, you'll see the Firestore Database interface
2. You should see:
   - An empty database (no collections yet)
   - Tabs: "Data", "Rules", "Indexes", "Usage"
   - A message saying "No collections yet" or similar

### Step 9: Set Up Security Rules (Important for Production)
1. Click on the **"Rules"** tab
2. You'll see default test mode rules that look like:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.time < timestamp.date(2024, 12, 31);
       }
     }
   }
   ```
3. For now, test mode is fine for development
4. **For production later**, you'll need to update these rules

## Visual Guide

**What you'll see:**

1. **Before creating:**
   - Button: "Create database" or "Get started"
   - Or a setup wizard

2. **During setup:**
   - Mode selection (Test mode / Production mode)
   - Location selection dropdown

3. **After creation:**
   - Empty database view
   - "Data" tab showing no collections
   - "Rules" tab with default rules

## Troubleshooting

**If you don't see "Firestore Database" in the sidebar:**
- Make sure you're in the correct project
- Try refreshing the page
- Check if you have the right permissions

**If "Create database" button is disabled:**
- Make sure you have billing enabled (Firebase free tier is fine)
- Check your project permissions

**If you see "Database already exists":**
- Great! Your database is already created
- You can skip to Step 8

## Next Steps After Creating Database

1. ✅ Your Firestore Database is now ready
2. ✅ Go back to your app and refresh the browser
3. ✅ Try signing up or logging in
4. ✅ Create your first issue!

## Important Notes

- **Test mode** allows anyone with your database URL to read/write (for 30 days)
- This is fine for development and testing
- For production, you MUST update security rules
- The database location cannot be changed after creation

