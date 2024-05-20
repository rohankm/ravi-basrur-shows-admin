import BreadCrumb from "@/components/breadcrumb";
import { Cast } from "@/components/movies/cast/list-cast-tables/client";
import DisplayMovie from "@/components/movies/movies/DisplayMovie";
import { ListMovies } from "@/components/movies/movies/list-movies-tables/client";
import { useSearchParams } from "next/navigation";

import React from "react";

export default function page({ params: { movieid } }) {
  const breadcrumbItems = [
    { title: "Movies", link: "/dashboard/movies" },
    { title: movieid, link: "/dashboard/movies" },
  ];
  console.log({ movieid });

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <DisplayMovie id={movieid} />
      </div>
    </>
  );
}
