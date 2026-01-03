import { createAuthClient } from "better-auth/react";

// Better Auth URL ko properly set karo
const getAuthBaseURL = () => {
  // Production URL - aapka deployed backend
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  }
  
  // Development URL - localhost
  if (process.env.NODE_ENV === 'development') {
    return "http://localhost:3000/api/auth";
  }
  
  // Default - aapka deployed frontend (jahan Next.js API routes hain)
  return "https://hafizubaid-todo-wep-app.hf.space/api/auth";
};

// Create auth client
export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
});

// Export useSession hook directly
export const useSession = authClient.useSession;
export const signIn = authClient.signIn;
export const signOut = authClient.signOut;
export const signUp = authClient.signUp;

// Default export
export default authClient;
