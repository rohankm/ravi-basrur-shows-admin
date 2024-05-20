"use client";

import { CreateEditCertificate } from "@/components/movies/certificates/CreateEditCertificate";
import { CreateEditGenre } from "@/components/movies/genres/CreateEditGenre";
import { CreateEditLanguage } from "@/components/movies/languages/CreateEditLanguages";
import { CreateEditCastRole } from "@/components/movies/cast_roles/CreateEditCastRole";
import type { Metadata } from "next";
import { redirect, useSearchParams } from "next/navigation";
import { CreateEditCast } from "@/components/movies/cast/CreateEditCast";
import { CreateEditTag } from "@/components/movies/tags/CreateEditTag";

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

  const newCast = !!searchParams.get("new_cast");
  const editCast = searchParams.get("edit_cast");

  const newCastRole = !!searchParams.get("new_cast_role");
  const editCastRole = searchParams.get("edit_cast_role");

  const newTag = !!searchParams.get("new_tag");
  const editTag = searchParams.get("edit_tag");

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
      <CreateEditCast open={newCast || !!editCast} editCastId={editCast} />
      <CreateEditCastRole
        open={newCastRole || !!editCastRole}
        editCastRoleId={editCastRole}
      />
      <CreateEditTag open={newTag || !!editTag} editTagId={editTag} />
    </>
  );
}
