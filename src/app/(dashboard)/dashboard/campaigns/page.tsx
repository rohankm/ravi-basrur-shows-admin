"use client";

import { Ads } from "@/components/Campaign and Payouts/ads/list-ads-tables/client";
import { CreateEditCampaign } from "@/components/Campaign and Payouts/campaigns/CreateEditCampaign";
import { Campaigns } from "@/components/Campaign and Payouts/campaigns/list-campaigns-tables/client";
import BreadCrumb from "@/components/breadcrumb";

import { useSearchParams } from "next/navigation";

import React from "react";

const breadcrumbItems = [{ title: "Campaigns", link: "/movies/tags" }];
export default function page({}) {
  const searchParams = useSearchParams();
  const newCampaign = !!searchParams.get("new_campaign");
  const editCampaign = searchParams.get("edit_campaign");
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Campaigns />
        <CreateEditCampaign
          open={newCampaign || !!editCampaign}
          editCampaignId={editCampaign}
        />
      </div>
    </>
  );
}
