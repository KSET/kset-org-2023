"use client";

import "~/styles/globals.css";

import { Mulish } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { cn } from "~/utils/class";

type RootLayoutProps = {
  children: React.ReactNode;
};

const font = Mulish({
  subsets: ["latin-ext"],
  fallback: ["sans-serif"],
});

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="hr" className={cn("bg-[#1E1E22] text-white", font.className)}>
      <head />
      <body className="min-h-screen">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
