import { createAuthClient } from "better-auth/react";

// Better Auth URL ko properly set karo
const getAuthBaseURL = () => {
  // 1. Environment variable se URL (sabse priority)
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    console.log('Using env URL:', process.env.NEXT_PUBLIC_BETTER_AUTH_URL);
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  }

  // 2. Production check
  if (process.env.NODE_ENV === 'production') {
    // IMPORTANT: Logs se confirm hua ke backend PORT 8001 PE HAI, 7860 nahi!
    const productionURL = "https://hafizubaid-todo-wep-app.hf.space:8001";
    console.log('Production Auth URL:', productionURL);
    return productionURL;
  }

  // 3. Development
  console.log('Development Auth URL: http://localhost:8001');
  return "http://localhost:8001";
};

// Create auth client with cookie options
const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
});

// PURANE CODE KE LIYE COMPATIBILITY
// "auth" naam ka export bhi rakh lo taaki purane code kaam kare
export const auth = authClient;

// Export useSession hook directly
export const useSession = authClient.useSession;
export const signIn = authClient.signIn;
export const signOut = authClient.signOut;
export const signUp = authClient.signUp;

// Export the authClient as well (agar koi naya code use kare)
export { authClient };

// Default export
export default authClient;

// Debug info
console.log('Auth initialized with baseURL:', getAuthBaseURL());