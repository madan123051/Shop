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
  dateOfBirth?: string;
  gender?: string;
  mainLocation?: string;
  profilePhoto?: string; // base64 data URL or remote URL for profile picture
  addresses: Address[];
  createdAt: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ isAdmin: boolean }>;
  loginWithGoogle: () => Promise<{ isAdmin: boolean }>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  addAddress: (address: Omit<Address, "id">) => Promise<void>;
  updateAddress: (
    id: string,
    updates: Partial<Omit<Address, "id">>
  ) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "naveen@mail.com";
const LOCAL_FIELDS = [
  "firstName",
  "lastName",
  "phone",
  "dateOfBirth",
  "gender",
  "mainLocation",
  "profilePhoto",
  "addresses",
] as const;

function getLocalProfile(uid: string): Record<string, any> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(`shopUserProfile_${uid}`);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveLocalProfile(uid: string, data: Record<string, any>) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalProfile(uid);
    localStorage.setItem(
      `shopUserProfile_${uid}`,
      JSON.stringify({ ...existing, ...data })
    );
  } catch {}
}

function toUser(fbUser: FirebaseUser): User {
  const parts = (fbUser.displayName ?? "").split(" ");
  const local = getLocalProfile(fbUser.uid);
  return {
    id: fbUser.uid,
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName,
    photoURL: fbUser.photoURL,
    firstName: local.firstName ?? parts[0] ?? "",
    lastName: local.lastName ?? parts.slice(1).join(" ") ?? "",
    phone: local.phone ?? "",
    dateOfBirth: local.dateOfBirth ?? "",
    gender: local.gender ?? "",
    mainLocation: local.mainLocation ?? "",
    profilePhoto: local.profilePhoto ?? fbUser.photoURL ?? "",
    addresses: local.addresses ?? [],
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

  const login = async (
    email: string,
    password: string
  ): Promise<{ isAdmin: boolean }> => {
    await signInWithEmailAndPassword(auth, email, password);
    return { isAdmin: !!ADMIN_EMAIL && email === ADMIN_EMAIL };
  };

  const loginWithGoogle = async (): Promise<{ isAdmin: boolean }> => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const email = result.user.email ?? "";
    return { isAdmin: !!ADMIN_EMAIL && email === ADMIN_EMAIL };
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const { user: fbUser } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await fbUpdateProfile(fbUser, {
      displayName: `${firstName} ${lastName}`.trim(),
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!auth.currentUser) throw new Error("Not logged in");
    // Sync name to Firebase Auth display name
    if (
      updates.firstName !== undefined ||
      updates.lastName !== undefined
    ) {
      const first = updates.firstName ?? user?.firstName ?? "";
      const last = updates.lastName ?? user?.lastName ?? "";
      await fbUpdateProfile(auth.currentUser, {
        displayName: `${first} ${last}`.trim(),
      });
    }
    // Persist extra profile fields to localStorage
    const fieldsToSave: Record<string, any> = {};
    LOCAL_FIELDS.forEach((field) => {
      if ((updates as any)[field] !== undefined) {
        fieldsToSave[field] = (updates as any)[field];
      }
    });
    if (Object.keys(fieldsToSave).length > 0) {
      saveLocalProfile(auth.currentUser.uid, fieldsToSave);
    }
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const addAddress = async (addressData: Omit<Address, "id">) => {
    const newAddress: Address = {
      ...addressData,
      id: `addr_${Date.now()}`,
    };
    setUser((prev) => {
      if (!prev) return prev;
      const addresses = addressData.isDefault
        ? [
            ...prev.addresses.map((a) => ({ ...a, isDefault: false })),
            newAddress,
          ]
        : [...prev.addresses, newAddress];
      saveLocalProfile(prev.uid, { addresses });
      return { ...prev, addresses };
    });
  };

  const updateAddress = async (
    id: string,
    updates: Partial<Omit<Address, "id">>
  ) => {
    setUser((prev) => {
      if (!prev) return prev;
      const addresses = prev.addresses.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      );
      saveLocalProfile(prev.uid, { addresses });
      return { ...prev, addresses };
    });
  };

  const deleteAddress = async (id: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const addresses = prev.addresses.filter((a) => a.id !== id);
      saveLocalProfile(prev.uid, { addresses });
      return { ...prev, addresses };
    });
  };

  const setDefaultAddress = async (id: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const addresses = prev.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }));
      saveLocalProfile(prev.uid, { addresses });
      return { ...prev, addresses };
    });
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
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
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
