import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection 
} from 'firebase/firestore';
import { auth } from '../firebase/config';
import app from '../firebase/config';

// Initialize Firestore
const db = getFirestore(app);

interface UserData {
  age?: string;
  sex?: string;
  bloodPressure?: string;
  existingConditions?: string;
  bloodGlucose?: string;
  hemoglobin?: string;
  serumCreatinine?: string;
  albumin?: string;
  updatedAt?: string;
  [key: string]: any; // Allow for additional fields
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  updateUserData: (userData: UserData) => Promise<void>;
  getUserData: () => Promise<UserData | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string, displayName: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user's profile with the display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        
        // Create a user document in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          displayName,
          email,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  async function resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  }

  async function updateUserProfile(displayName: string) {
    try {
      if (currentUser) {
        await updateProfile(currentUser, { displayName });
        // Force refresh the user to get the updated profile
        setCurrentUser({ ...currentUser });
        
        // Update the displayName in Firestore as well
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, { displayName });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }
  
  async function updateUserData(userData: UserData) {
    try {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, userData);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  }
  
  async function getUserData(): Promise<UserData | null> {
    try {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          return userSnap.data() as UserData;
        }
      }
      return null;
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserData,
    getUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}