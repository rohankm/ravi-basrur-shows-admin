"use client";

import { AddGenre } from "@/components/genres/AddGenre";
import type { Metadata } from "next";
import { redirect, useSearchParams } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const newGenre = !!searchParams.get("new_genre");

  return (
    <>
      {children}
      <AddGenre open={newGenre} />
    </>
  );
}
