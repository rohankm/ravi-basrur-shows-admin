"use client";

import { CreateEditCertificate } from "@/components/certificates/CreateEditCertificate";
import { CreateEditGenre } from "@/components/genres/CreateEditGenre";
import { CreateEditLanguage } from "@/components/languages/CreateEditLanguages";
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

  const newLanguage = !!searchParams.get("new_language");
  const editLanguage = searchParams.get("edit_language");

  const newCertificate = !!searchParams.get("new_certificate");
  const editCertificate = searchParams.get("edit_certificate");

  return (
    <>
      {children}
      <CreateEditGenre open={newGenre || !!editGenre} editGenreId={editGenre} />
      <CreateEditLanguage
        open={newLanguage || !!editLanguage}
        editLanguageId={editLanguage}
      />
      <CreateEditCertificate
        open={newCertificate || !!editCertificate}
        editCertificateId={editCertificate}
      />
    </>
  );
}
