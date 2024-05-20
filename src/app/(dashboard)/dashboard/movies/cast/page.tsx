import BreadCrumb from "@/components/breadcrumb";
import { Cast } from "@/components/movies/cast/list-cast-tables/client";

import React from "react";

const breadcrumbItems = [
  { title: "Movies", link: "/dashboard/movies" },
  { title: "Cast", link: "/movies/cast" },
];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Cast />
      </div>
    </>
  );
}
