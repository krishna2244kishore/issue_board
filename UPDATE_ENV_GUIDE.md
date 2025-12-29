# How to Update Your .env File with Firebase Config

## Step-by-Step Instructions

### Step 1: Get Firebase Config Values

1. **Open Firebase Console**: Go to https://console.firebase.google.com/
2. **Select Your Project**: Click on your project name
3. **Open Project Settings**: 
   - Click the **gear icon (⚙️)** next to "Project Overview"
   - Select **"Project settings"**
4. **Find Your Web App Config**:
   - Scroll down to **"Your apps"** section
   - If you see a web app already, click on it
   - If not, click the **Web icon `</>`** to add a new web app
   - Register with a nickname (e.g., "Issue Tracker")
   - Click **"Register app"**
5. **Copy the Config Values**: You'll see a code snippet like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz",
  authDomain: "my-project.firebaseapp.com",
  projectId: "my-project-12345",
  storageBucket: "my-project-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### Step 2: Open Your .env File

**In VS Code/Cursor:**
- Look in the left sidebar for `.env` file
- Click on it to open
- If you don't see it, it might be hidden - click "Show All Files" or use Ctrl+P and type `.env`

**In File Explorer:**
- Navigate to: `C:\Users\kisho\intern`
- Right-click on `.env` file
- Choose "Open with" → Notepad or any text editor

### Step 3: Replace the Values

Your `.env` file currently looks like this:
```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Replace each line** with the corresponding value from Firebase:

**Example mapping:**

| .env File Line | Firebase Config Value | Example |
|---------------|----------------------|---------|
| `VITE_FIREBASE_API_KEY=` | `apiKey` | `AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz` |
| `VITE_FIREBASE_AUTH_DOMAIN=` | `authDomain` | `my-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID=` | `projectId` | `my-project-12345` |
| `VITE_FIREBASE_STORAGE_BUCKET=` | `storageBucket` | `my-project-12345.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID=` | `messagingSenderId` | `123456789012` |
| `VITE_FIREBASE_APP_ID=` | `appId` | `1:123456789012:web:abcdef123456` |

**After updating, your .env should look like this:**
```
VITE_FIREBASE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz
VITE_FIREBASE_AUTH_DOMAIN=my-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-project-12345
VITE_FIREBASE_STORAGE_BUCKET=my-project-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### Step 4: Important Notes

✅ **DO:**
- Copy the values EXACTLY as shown (including quotes if they appear, but remove them in .env)
- Make sure there are NO spaces around the `=` sign
- Save the file after editing

❌ **DON'T:**
- Don't include quotes in the .env file (remove them if Firebase shows them)
- Don't add extra spaces
- Don't change the variable names (VITE_FIREBASE_...)

### Step 5: Restart the Dev Server

After saving the `.env` file:

1. **Stop the current server**: Press `Ctrl+C` in the terminal where `npm run dev` is running
2. **Start it again**: Run `npm run dev`
3. **Refresh your browser**: The Firebase configuration message should disappear!

### Quick Visual Example

**From Firebase Console:**
```javascript
apiKey: "AIzaSyEXAMPLE123"
authDomain: "myapp.firebaseapp.com"
projectId: "myapp-12345"
```

**To .env file:**
```
VITE_FIREBASE_API_KEY=AIzaSyEXAMPLE123
VITE_FIREBASE_AUTH_DOMAIN=myapp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=myapp-12345
```

Notice: No quotes, no spaces, just the value after the `=` sign!

