import BreadCrumb from "@/components/breadcrumb";

import { Tags } from "@/components/movies/tags/list-tags-tables/client";

import React from "react";

const breadcrumbItems = [
  { title: "Movies", link: "/dashboard/movies" },
  { title: "Tags", link: "/movies/tags" },
];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Tags />
      </div>
    </>
  );
}
