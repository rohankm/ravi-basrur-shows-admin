"use client";
import React from "react";
import ThemeProvider from "../ThemeToggle/theme-provider";
import { User } from "@supabase/supabase-js";
import UserDetailsContextProvider from "./UserDetailsContextProvider";

export default function Providers({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <UserDetailsContextProvider user={user}>
          {children}
        </UserDetailsContextProvider>
      </ThemeProvider>
    </>
  );
}
