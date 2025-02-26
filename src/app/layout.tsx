import { SessionProvider } from "@/components/auth/SessionProvider";
import { NavBar } from "@/components/NavBar";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js Todo App",
  description: "A professional Todo application built with Next.js",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 dark:bg-gray-900`}>
        <SessionProvider>
          <NavBar user={session?.user} />
          <Toaster position="top-right" />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
