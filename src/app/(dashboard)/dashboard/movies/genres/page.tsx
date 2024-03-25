import BreadCrumb from "@/components/breadcrumb";
import { AddGenre } from "@/components/genres/AddGenre";
import { Genres } from "@/components/genres/list-genres-tables/client";
import { useSearchParams } from "next/navigation";
import React from "react";

const breadcrumbItems = [
  { title: "Movies", link: "/movies" },
  { title: "Genres", link: "/movies/genres" },
];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Genres />
      </div>
    </>
  );
}
