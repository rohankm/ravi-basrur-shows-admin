import BreadCrumb from "@/components/breadcrumb";
import { Certificates } from "@/components/certificates/list-certificates-tables/client";

import React from "react";

const breadcrumbItems = [
  { title: "Movies", link: "/movies" },
  { title: "Certificates", link: "/movies/certificates" },
];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Certificates />
      </div>
    </>
  );
}
