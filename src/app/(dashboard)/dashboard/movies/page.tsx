import BreadCrumb from "@/components/breadcrumb";
import { Cast } from "@/components/movies/cast/list-cast-tables/client";
import { ListMovies } from "@/components/movies/movies/list-movies-tables/client";

import React from "react";

const breadcrumbItems = [{ title: "Movies", link: "/dashboard/movies" }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <ListMovies />
      </div>
    </>
  );
}
