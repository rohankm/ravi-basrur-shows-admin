"use client";
import BreadCrumb from "@/components/breadcrumb";
import { Cast } from "@/components/movies/cast/list-cast-tables/client";
import { CreatePushNotifications } from "@/components/push-notifications/CreatePushNotifications";
import { PushNotificationsList } from "@/components/push-notifications/push-notifications-list/client";
import { ListUsers } from "@/components/users/list-users/client";
import { useSearchParams } from "next/navigation";

import React from "react";

const breadcrumbItems = [
  { title: "Push Notifications", link: "/dashboard/movies" },
];
export default function page() {
  const searchParams = useSearchParams();
  const newPushNotifcation = !!searchParams.get("new_push_notification");

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <PushNotificationsList />
        <CreatePushNotifications open={newPushNotifcation} />
      </div>
    </>
  );
}
