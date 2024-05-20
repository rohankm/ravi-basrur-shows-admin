import BreadCrumb from "@/components/breadcrumb";
import { Languages } from "@/components/movies/languages/list-languages-tables/client";

import React from "react";

const breadcrumbItems = [
  { title: "Movies", link: "/dashboard/movies" },
  { title: "Languages", link: "/movies/languages" },
];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Languages />
      </div>
    </>
  );
}
