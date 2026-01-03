"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";

// Define the shape of the user object. Adjust as per your application's needs.
interface User {
  id: string;
  name: string;
  // Add other user properties here
}

// Define the shape of the authentication context
export interface AuthContextType {
  // Exported for useAuth.ts
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<void>; // Replace 'any' with specific login credentials type
  logout: () => Promise<void>;
}

// Create the AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
); // Export AuthContext

// Define props for the BetterAuthProvider component
interface BetterAuthProviderProps {
  children: ReactNode;
}

// BetterAuthProvider component
export const BetterAuthProvider: React.FC<BetterAuthProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to check for an existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        // Simulate an API call to validate a token or session from localStorage/cookies
        // In a real application, this would be an actual API request to your backend
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

        const storedUser = localStorage.getItem("better-auth-user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err: any) {
        // Handle errors during session check
        setError(err.message || "Failed to check session");
        console.error("Session check failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []); // Run only once on mount

  // Function to handle user login
  const login = async (credentials: any) => {
    try {
      setIsLoading(true);
      setError(null);
      // Simulate an API call for login
      // Replace with actual authentication logic (e.g., POST request to /api/login)
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

      // Assuming successful login returns user data
      const loggedInUser: User = {
        id: "user-123",
        name: credentials.username || "Authenticated User",
      };
      setUser(loggedInUser);
      localStorage.setItem("better-auth-user", JSON.stringify(loggedInUser)); // Store user data
    } catch (err: any) {
      setError(err.message || "Login failed");
      setUser(null); // Clear user on login failure
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle user logout
  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Simulate an API call for logout or clear session on the backend
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

      setUser(null); // Clear user state
      localStorage.removeItem("better-auth-user"); // Remove stored user data
    } catch (err: any) {
      setError(err.message || "Logout failed");
      console.error("Logout failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // The value provided to the context consumers
  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
