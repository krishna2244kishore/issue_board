# Firebase Setup Guide

Follow these steps to set up Firebase for the Issue Tracker application:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "issue-tracker")
4. Click **Continue**
5. (Optional) Disable Google Analytics if you don't need it
6. Click **Create project**
7. Wait for the project to be created, then click **Continue**

## Step 2: Enable Authentication

1. In your Firebase project, click on **Authentication** in the left sidebar
2. Click **Get started**
3. Click on the **Sign-in method** tab
4. Click on **Email/Password**
5. Toggle **Enable** to ON
6. Click **Save**

## Step 3: Create Firestore Database

1. In your Firebase project, click on **Firestore Database** in the left sidebar
2. Click **Create database**
3. Select **Start in test mode** (for development)
4. Choose a location for your database (choose the closest to your users)
5. Click **Enable**

**Important:** For production, you'll need to set up proper Firestore security rules. For now, test mode will work for development.

## Step 4: Get Your Firebase Configuration

1. In your Firebase project, click on the **gear icon** (⚙️) next to "Project Overview"
2. Select **Project settings**
3. Scroll down to the **"Your apps"** section
4. Click on the **Web icon** (</>) to add a web app
5. Register your app with a nickname (e.g., "Issue Tracker Web")
6. Click **Register app**
7. You'll see your Firebase configuration object. It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Step 5: Update Your .env File

1. Open the `.env` file in the project root
2. Replace the placeholder values with your actual Firebase configuration:

```env
VITE_FIREBASE_API_KEY=AIzaSy... (your apiKey)
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Step 6: Restart the Development Server

After updating the `.env` file:

1. Stop the current dev server (Ctrl+C in the terminal)
2. Restart it with: `npm run dev`
3. Refresh your browser

## Troubleshooting

- **"Firebase configuration is missing"**: Make sure your `.env` file is in the project root (same folder as `package.json`)
- **"Permission denied"**: Check that Firestore is enabled and in test mode
- **"Auth domain not authorized"**: Make sure you've enabled Email/Password authentication
- **Environment variables not loading**: Restart the dev server after creating/updating `.env`

## Security Note

- Never commit your `.env` file to Git (it's already in `.gitignore`)
- For production on Vercel, add these environment variables in the Vercel project settings

