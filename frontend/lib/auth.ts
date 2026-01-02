import { createAuthClient } from "better-auth/react";

// Client-side auth
export const auth = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:8001",
  fetchOptions: {
    // Add any additional fetch options if needed
  }
});

// Export the auth client
export default auth;