import DisplayCampaign from "@/components/Campaign and Payouts/campaigns/DisplayCampaign";
import BreadCrumb from "@/components/breadcrumb";

import DisplayMovie from "@/components/movies/movies/DisplayMovie";

import React from "react";

export default function page({ params: { campaignid } }) {
  const breadcrumbItems = [
    { title: "Campaigns", link: "/dashboard/campaigns" },
    { title: campaignid, link: "/dashboard/campaigns" },
  ];

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <DisplayCampaign id={campaignid} />
      </div>
    </>
  );
}
