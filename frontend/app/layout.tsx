import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { BetterAuthProvider } from "@/components/BetterAuth/BetterAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskMaster - Professional Task Management",
  description: "A full-stack todo application with authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BetterAuthProvider>
          {children}
          <Toaster position="top-right" />
        </BetterAuthProvider>
      </body>
    </html>
  );
}
