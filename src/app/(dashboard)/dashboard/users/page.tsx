import BreadCrumb from "@/components/breadcrumb";
import { Cast } from "@/components/movies/cast/list-cast-tables/client";
import { ListUsers } from "@/components/users/list-users/client";

import React from "react";

const breadcrumbItems = [{ title: "Users", link: "/dashboard/movies" }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <ListUsers />
      </div>
    </>
  );
}
