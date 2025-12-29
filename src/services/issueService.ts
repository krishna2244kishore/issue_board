import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const checkDb = () => {
  if (!db) {
    throw new Error('Firebase is not configured. Please check your .env file.');
  }
  return db;
};
import { Issue, IssueFormData, Priority, Status } from '../types';

export const createIssue = async (
  issueData: IssueFormData,
  createdBy: string
): Promise<string> => {
  const dbInstance = checkDb();
  const docRef = await addDoc(collection(dbInstance, 'issues'), {
    ...issueData,
    createdBy,
    createdTime: Timestamp.now(),
  });
  return docRef.id;
};

export const getAllIssues = async (): Promise<Issue[]> => {
  const dbInstance = checkDb();
  const q = query(collection(dbInstance, 'issues'), orderBy('createdTime', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdTime: doc.data().createdTime.toDate(),
  })) as Issue[];
};

export const getIssuesByStatus = async (status: Status): Promise<Issue[]> => {
  const dbInstance = checkDb();
  const q = query(
    collection(dbInstance, 'issues'),
    where('status', '==', status),
    orderBy('createdTime', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdTime: doc.data().createdTime.toDate(),
  })) as Issue[];
};

export const getIssuesByPriority = async (
  priority: Priority
): Promise<Issue[]> => {
  const dbInstance = checkDb();
  const q = query(
    collection(dbInstance, 'issues'),
    where('priority', '==', priority),
    orderBy('createdTime', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdTime: doc.data().createdTime.toDate(),
  })) as Issue[];
};

export const getIssuesByStatusAndPriority = async (
  status: Status,
  priority: Priority
): Promise<Issue[]> => {
  const dbInstance = checkDb();
  const q = query(
    collection(dbInstance, 'issues'),
    where('status', '==', status),
    where('priority', '==', priority),
    orderBy('createdTime', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdTime: doc.data().createdTime.toDate(),
  })) as Issue[];
};

export const updateIssueStatus = async (
  issueId: string,
  newStatus: Status
): Promise<void> => {
  const dbInstance = checkDb();
  await updateDoc(doc(dbInstance, 'issues', issueId), {
    status: newStatus,
  });
};

export const findSimilarIssues = async (
  title: string,
  description: string
): Promise<Issue[]> => {
  const allIssues = await getAllIssues();
  
  // Simple similarity check based on title and description keywords
  const titleWords = title.toLowerCase().split(/\s+/);
  const descriptionWords = description.toLowerCase().split(/\s+/);
  const allWords = [...titleWords, ...descriptionWords].filter(
    (word) => word.length > 3
  );

  const similarIssues = allIssues.filter((issue) => {
    const issueTitle = issue.title.toLowerCase();
    const issueDescription = issue.description.toLowerCase();
    
    // Check for matching keywords
    const matchingWords = allWords.filter(
      (word) => issueTitle.includes(word) || issueDescription.includes(word)
    );
    
    // Consider similar if at least 2 keywords match or title is very similar
    const titleSimilarity = calculateSimilarity(title.toLowerCase(), issueTitle);
    
    return matchingWords.length >= 2 || titleSimilarity > 0.6;
  });

  return similarIssues.slice(0, 5); // Return top 5 similar issues
};

// Simple Levenshtein-based similarity calculation
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

