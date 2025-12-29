# Issue Tracker Application

A modern, full-stack issue tracking application built with React, TypeScript, Firebase, and deployed on Vercel.

## 🚀 Features

- **Authentication**: User sign up and login with Firebase Auth (Email/Password)
- **Create Issues**: Create issues with Title, Description, Priority, Status, Assigned To, Created Time, and Created By
- **Similar Issue Detection**: Intelligent detection of similar issues when creating new ones
- **Issue List**: View all issues with filtering by Status and Priority, sorted by newest first
- **Status Rules**: Prevents direct transition from "Open" to "Done" status

## 🛠️ Tech Stack

### Frontend
- **React 18** with **TypeScript** - Modern, type-safe UI development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router** - Client-side routing

### Backend/Database
- **Firebase Firestore** - NoSQL database for storing issues
- **Firebase Auth** - Authentication service

### Deployment
- **Vercel** - Hosting platform
- **GitHub** - Code repository

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore and Auth enabled
- Vercel account (for deployment)

## 🔧 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd issue-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Get your Firebase configuration from Project Settings

4. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🚀 Deployment to Vercel

### ⚠️ IMPORTANT: Before Deploying to Production

**You MUST update Firestore security rules!** Test mode is NOT secure for production.

1. **Update Firestore Security Rules**
   - Go to Firebase Console → Firestore Database → Rules tab
   - Replace test mode rules with production rules (see `FIRESTORE_SECURITY_RULES.md`)
   - Rules should require authentication for all operations
   - Click "Publish"

2. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel project settings:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
   - Deploy!

4. **Verify Production Deployment**
   - Test authentication (sign up/login)
   - Test creating issues
   - Test reading/updating issues
   - Monitor Firebase Console for any errors

## 📚 Why This Frontend Stack?

I chose **React + TypeScript + Tailwind CSS** for the following reasons:

1. **React**: Industry-standard library with excellent ecosystem, component reusability, and strong community support. It's perfect for building interactive UIs with state management.

2. **TypeScript**: Provides type safety, better IDE support, and catches errors at compile-time rather than runtime. This is crucial for maintaining code quality in a production application.

3. **Vite**: Modern build tool that offers lightning-fast development experience with HMR (Hot Module Replacement) and optimized production builds.

4. **Tailwind CSS**: Utility-first CSS framework that allows rapid UI development without writing custom CSS. It's perfect for building modern, responsive interfaces quickly while maintaining consistency.

5. **React Router**: Essential for handling client-side routing and navigation between login and dashboard pages.

This stack provides an excellent balance of developer experience, performance, and maintainability.

## 🗄️ Firestore Data Structure

The application uses a single collection called `issues` in Firestore. Each document has the following structure:

```typescript
{
  id: string,                    // Document ID (auto-generated)
  title: string,                 // Issue title
  description: string,           // Issue description
  priority: "Low" | "Medium" | "High",
  status: "Open" | "In Progress" | "Done",
  assignedTo: string,           // Email or name of assignee
  createdBy: string,            // Email of the user who created the issue
  createdTime: Timestamp        // Firebase Timestamp of creation
}
```

### Design Decisions:

1. **Single Collection**: All issues are stored in one collection for simplicity and easy querying.

2. **Timestamp Field**: Using Firebase `Timestamp` type for `createdTime` allows for proper sorting and querying by date.

3. **String-based Enums**: Priority and Status are stored as strings with specific values, making filtering straightforward.

4. **No Nested Collections**: Keeping the structure flat makes queries simpler and more performant.

5. **Indexing**: Firestore automatically indexes fields used in queries (status, priority, createdTime), ensuring fast queries.

## 🔍 Similar Issue Handling

The application implements intelligent similar issue detection using a combination of techniques:

### Approach:

1. **Keyword Matching**: When a user types a title, the system extracts keywords (words longer than 3 characters) from both the title and description.

2. **Fuzzy Matching**: Uses a Levenshtein distance algorithm to calculate similarity between the new issue title and existing issue titles.

3. **Threshold-based Detection**: An issue is considered similar if:
   - At least 2 keywords match between the new and existing issues, OR
   - The title similarity score exceeds 60% (using Levenshtein distance)

4. **User Experience**: When similar issues are detected:
   - A warning banner appears showing up to 3 similar issues
   - Each similar issue displays its title, status, and priority
   - The user can choose to "Continue Anyway" if they still want to create the issue
   - The check is debounced (500ms) to avoid excessive API calls while typing

### Why This Approach:

- **Non-blocking**: Users aren't prevented from creating issues, just warned
- **Fast**: Keyword matching is quick and doesn't require complex NLP
- **User-friendly**: Shows relevant information without being intrusive
- **Scalable**: Can be enhanced with more sophisticated algorithms (like TF-IDF, cosine similarity) as the dataset grows

### Future Improvements:

- Use Firebase's full-text search capabilities
- Implement machine learning-based similarity detection
- Add user feedback to improve similarity detection accuracy
- Cache similarity results for better performance

## 🎯 Challenges and Confusing Aspects

### Challenges:

1. **Firestore Query Limitations**: Firestore doesn't support complex queries with multiple `where` clauses on different fields without composite indexes. I had to implement client-side filtering for combined status and priority filters.

2. **Similar Issue Detection**: Implementing an efficient similarity algorithm that works well with Firestore's query limitations was challenging. The current implementation loads all issues and filters client-side, which may not scale well with thousands of issues.

3. **Status Transition Rules**: Ensuring the UI properly prevents invalid status transitions while providing clear feedback to users required careful state management.

4. **Real-time Updates**: While not implemented, adding real-time updates with Firestore listeners would require careful consideration of performance and cost.

### Confusing Aspects:

1. **Firebase Environment Variables**: Understanding that Vite requires the `VITE_` prefix for environment variables to be accessible in the browser was initially confusing.

2. **Firestore Timestamps**: Converting between Firestore Timestamps and JavaScript Date objects required careful handling, especially when sorting and displaying dates.

3. **React Router with Firebase Auth**: Managing authentication state and route protection required understanding React context and Firebase auth state listeners.

## 🚀 Next Improvements

If I were to build this again or continue development, here's what I would improve:

1. **Real-time Updates**: Implement Firestore listeners to update the issue list in real-time without manual refresh.

2. **Advanced Similarity Detection**: 
   - Use Firebase Extensions for full-text search
   - Implement TF-IDF or cosine similarity for better accuracy
   - Add machine learning-based similarity scoring

3. **Pagination**: Implement pagination for the issue list to handle large datasets efficiently.

4. **Issue Details Page**: Add a dedicated page for viewing and editing individual issues with full details.

5. **User Management**: 
   - Add user profiles
   - Implement role-based access control
   - Add user avatars and better user identification

6. **Search Functionality**: Add full-text search across issue titles and descriptions.

7. **Issue Comments**: Allow users to add comments and updates to issues.

8. **Email Notifications**: Send email notifications when issues are assigned or status changes.

9. **Issue History**: Track and display the history of status changes and updates.

10. **Better Mobile Experience**: Improve responsive design for mobile devices.

11. **Performance Optimization**:
    - Implement virtual scrolling for large issue lists
    - Add caching strategies
    - Optimize Firestore queries with proper indexes

12. **Testing**: Add unit tests, integration tests, and E2E tests for better code reliability.

13. **Accessibility**: Improve keyboard navigation and screen reader support.

14. **Internationalization**: Add support for multiple languages.

## 📝 License

This project is open source and available for use.

## 👤 Author

Built as part of an internship project demonstrating full-stack development skills with modern technologies.

