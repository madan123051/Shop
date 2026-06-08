"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

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
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  addresses: Address[];
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  addAddress: (address: Omit<Address, "id">) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    // Initialize demo user if no users exist
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    if (existingUsers.length === 0) {
      const demoUser = {
        id: "demo-user-id",
        email: "demo@example.com",
        password: "demo123",
        firstName: "Demo",
        lastName: "User",
        phone: "9876543210",
        addresses: [
          {
            id: "demo-addr-id",
            firstName: "Demo",
            lastName: "User",
            address: "123 NewTech Street, Sector 62",
            city: "Noida",
            state: "Uttar Pradesh",
            zip: "201301",
            country: "India",
            phone: "9876543210",
            isDefault: true,
          },
        ],
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("users", JSON.stringify([demoUser]));
    }

    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    if (existingUsers.some((u: any) => u.email === email)) {
      throw new Error("Email already registered");
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      firstName,
      lastName,
      phone: "",
      addresses: [],
      createdAt: new Date().toISOString(),
    };

    // Store password separately (in real app, hash it on backend)
    const userWithPassword = { ...newUser, password };
    existingUsers.push(userWithPassword);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    setUser(newUser);
  };

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (!foundUser) {
      throw new Error("Invalid email or password");
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error("Not logged in");

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);

    // Update in users list
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const index = users.findIndex((u: any) => u.id === user.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem("users", JSON.stringify(users));
    }
  };

  const addAddress = async (address: Omit<Address, "id">) => {
    if (!user) throw new Error("Not logged in");

    const newAddress: Address = {
      ...address,
      id: Date.now().toString(),
    };

    const updatedUser = {
      ...user,
      addresses: [...user.addresses, newAddress],
    };

    setUser(updatedUser);

    // Update in users list
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const index = users.findIndex((u: any) => u.id === user.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));
    }
  };

  const updateAddress = async (id: string, addressUpdates: Partial<Address>) => {
    if (!user) throw new Error("Not logged in");

    const updatedAddresses = user.addresses.map((addr) =>
      addr.id === id ? { ...addr, ...addressUpdates } : addr
    );

    const updatedUser = {
      ...user,
      addresses: updatedAddresses,
    };

    setUser(updatedUser);

    // Update in users list
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const index = users.findIndex((u: any) => u.id === user.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));
    }
  };

  const deleteAddress = async (id: string) => {
    if (!user) throw new Error("Not logged in");

    const updatedAddresses = user.addresses.filter((addr) => addr.id !== id);

    const updatedUser = {
      ...user,
      addresses: updatedAddresses,
    };

    setUser(updatedUser);

    // Update in users list
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const index = users.findIndex((u: any) => u.id === user.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));
    }
  };

  const setDefaultAddress = async (id: string) => {
    if (!user) throw new Error("Not logged in");

    const updatedAddresses = user.addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));

    const updatedUser = {
      ...user,
      addresses: updatedAddresses,
    };

    setUser(updatedUser);

    // Update in users list
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const index = users.findIndex((u: any) => u.id === user.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        register,
        login,
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
