"use client";
import { CreateEditAds } from "@/components/Campaign and Payouts/ads/CreateEditAds";
import { Ads } from "@/components/Campaign and Payouts/ads/list-ads-tables/client";
import BreadCrumb from "@/components/breadcrumb";

import { Tags } from "@/components/movies/tags/list-tags-tables/client";
import { useSearchParams } from "next/navigation";

import React from "react";

const breadcrumbItems = [{ title: "Ads", link: "/movies/tags" }];
export default function page({}) {
  const searchParams = useSearchParams();
  const newad = !!searchParams.get("new_ad");
  const editad = searchParams.get("edit_ad");
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Ads />
        <CreateEditAds open={newad || !!editad} editAdId={editad} />
      </div>
    </>
  );
}
