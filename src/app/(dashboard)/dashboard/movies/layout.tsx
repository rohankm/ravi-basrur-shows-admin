"use client";

import { CreateEdit } from "@/components/genres/CreateEditGenre";
import type { Metadata } from "next";
import { redirect, useSearchParams } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const newGenre = !!searchParams.get("new_genre");
  const editGenre = searchParams.get("edit_genre");

  return (
    <>
      {children}
      <CreateEdit open={newGenre || !!editGenre} editGenreId={editGenre} />
    </>
  );
}
