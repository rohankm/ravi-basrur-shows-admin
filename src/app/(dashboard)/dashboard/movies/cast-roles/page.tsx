import BreadCrumb from "@/components/breadcrumb";
import { ListCastRoles } from "@/components/movies/cast_roles/list-cast-roles-tables/client";

import React from "react";

const breadcrumbItems = [
  { title: "Movies", link: "/movies" },
  { title: "Cast Roles", link: "/movies/cast-roles" },
];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <ListCastRoles />
      </div>
    </>
  );
}
