# Firestore Security Rules for Production

## ⚠️ Important: Test Mode is NOT Production-Ready

**Test mode allows anyone to read and write to your database** - this is a security risk!

## Production-Ready Security Rules

Before deploying to Vercel, you MUST update your Firestore security rules.

### Step 1: Open Firestore Rules

1. Go to Firebase Console → Your Project
2. Click **Firestore Database** in the left sidebar
3. Click on the **"Rules"** tab

### Step 2: Replace with Production Rules

Copy and paste these rules into the Rules editor:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Issues collection rules
    match /issues/{issueId} {
      // Allow read if user is authenticated
      allow read: if isAuthenticated();
      
      // Allow create if user is authenticated
      allow create: if isAuthenticated() 
        && request.resource.data.createdBy == request.auth.token.email;
      
      // Allow update if user is authenticated (any authenticated user can update)
      // You can restrict this further if needed
      allow update: if isAuthenticated();
      
      // Allow delete if user created the issue
      allow delete: if isAuthenticated() 
        && resource.data.createdBy == request.auth.token.email;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Step 3: Publish the Rules

1. Click **"Publish"** button
2. Wait for confirmation that rules are published

### Step 4: Test the Rules

1. Go to **"Rules Playground"** tab (if available)
2. Test different scenarios to ensure rules work correctly

## Alternative: Simpler Rules (Less Secure but Easier)

If you want simpler rules that still require authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /issues/{issueId} {
      allow read, write: if request.auth != null;
    }
    
    // Deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## What These Rules Do

✅ **Require authentication** - Only logged-in users can access data
✅ **Allow reading issues** - Any authenticated user can view issues
✅ **Allow creating issues** - Users can create issues (with their email as creator)
✅ **Allow updating issues** - Users can update issue status, etc.
✅ **Prevent unauthorized access** - Blocks all other operations

## Before Deploying to Vercel

1. ✅ Update Firestore security rules (above)
2. ✅ Test your app locally with the new rules
3. ✅ Make sure authentication works
4. ✅ Verify users can create/read/update issues
5. ✅ Deploy to Vercel

## Testing Rules Locally

After updating rules:
1. Refresh your browser
2. Try signing up/logging in
3. Create an issue
4. Try to read issues
5. If everything works, you're ready for production!

## Important Notes

- **Test mode expires after 30 days** - You MUST update rules before then
- **Production rules are permanent** - They stay active until you change them
- **Always test rules** before deploying to production
- **Monitor Firebase Console** for any rule violations

