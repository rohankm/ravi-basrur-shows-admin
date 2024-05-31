import BreadCrumb from "@/components/breadcrumb";

import { ScrollArea } from "@/components/ui/scroll-area";
import UserDashboard from "@/components/users/user-dashboard/UserDashboard";
import React from "react";

export default function Page({ params: { userId } }) {
  const breadcrumbItems = [
    { title: "Users", link: "/dashboard/users" },
    { title: userId, link: "/dashboard/users" },
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <UserDashboard userId={userId} />
    </ScrollArea>
  );
}
