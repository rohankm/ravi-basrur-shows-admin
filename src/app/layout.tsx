import Providers from "@/components/layout/Providers/providers";
import { Toaster } from "@/components/ui/sonner";
import "@uploadthing/react/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import NextTopLoader from "@/components/layout/NextTopLoader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ravi Basrur Shows Admin",
  description: "Ravi Basrur Shows Admin",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseServer = createClient();
  const { data, error } = await supabaseServer.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`}>
        <Providers user={data.user}>
          <Toaster />
          <NextTopLoader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
