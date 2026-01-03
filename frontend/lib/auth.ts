import { createAuthClient } from "better-auth/react";

// Client-side auth - simple banao
export const auth = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://hafizubaid-todo-wep-app.hf.space/api/auth",
});

// Sirf auth export karo
export default auth;

// useSession directly auth se use karo
// Example: auth.useSession
