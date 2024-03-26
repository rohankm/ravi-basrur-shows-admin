import BreadCrumb from "@/components/breadcrumb";

import { Genres } from "@/components/movies/genres/list-genres-tables/client";

import React from "react";

const breadcrumbItems = [
  { title: "Movies", link: "/dashboard/movies" },
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
