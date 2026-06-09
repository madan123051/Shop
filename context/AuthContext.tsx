"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile as fbUpdateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  addresses: Address[];
  createdAt: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  /** Email + password login — returns { isAdmin } so caller can redirect */
  login: (email: string, password: string) => Promise<{ isAdmin: boolean }>;
  /** Google OAuth login (customers) */
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";

function toUser(fbUser: FirebaseUser): User {
  const parts = (fbUser.displayName ?? "").split(" ");
  return {
    id: fbUser.uid,
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName,
    photoURL: fbUser.photoURL,
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" ") ?? "",
    phone: "",
    addresses: [],
    createdAt: fbUser.metadata.creationTime ?? new Date().toISOString(),
    isAdmin: !!ADMIN_EMAIL && fbUser.email === ADMIN_EMAIL,
  };
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser ? toUser(fbUser) : null);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<{ isAdmin: boolean }> => {
    await signInWithEmailAndPassword(auth, email, password);
    return { isAdmin: !!ADMIN_EMAIL && email === ADMIN_EMAIL };
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, password);
    await fbUpdateProfile(fbUser, { displayName: `${firstName} ${lastName}`.trim() });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!auth.currentUser) throw new Error("Not logged in");
    if (updates.firstName !== undefined || updates.lastName !== undefined) {
      const first = updates.firstName ?? user?.firstName ?? "";
      const last = updates.lastName ?? user?.lastName ?? "";
      await fbUpdateProfile(auth.currentUser, { displayName: `${first} ${last}`.trim() });
    }
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin: user?.isAdmin ?? false,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
