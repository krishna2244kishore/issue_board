import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from '../firebase/config';

const checkAuth = () => {
  if (!auth) {
    throw new Error('Firebase is not configured. Please check your .env file.');
  }
  return auth;
};

export const signUp = async (email: string, password: string): Promise<User> => {
  const authInstance = checkAuth();
  const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
  return userCredential.user;
};

export const signIn = async (email: string, password: string): Promise<User> => {
  const authInstance = checkAuth();
  const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
  return userCredential.user;
};

export const logout = async (): Promise<void> => {
  const authInstance = checkAuth();
  await signOut(authInstance);
};

