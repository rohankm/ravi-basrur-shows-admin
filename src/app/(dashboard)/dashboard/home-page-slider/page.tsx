import BreadCrumb from "@/components/breadcrumb";
import { CreateHomePageSlider } from "@/components/home-page-slider/CreateHomePageSlider";
import { HomePageSliderList } from "@/components/home-page-slider/home-page-slider-list/client";

import React from "react";

const breadcrumbItems = [
  { title: "Home Page Slider", link: "/home-page-slider" },
];
export default function page({ searchParams }) {
  console.log(searchParams);
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <HomePageSliderList />
        {searchParams?.new_home_page_slider && (
          <CreateHomePageSlider open={!!searchParams?.new_home_page_slider} />
        )}
      </div>
    </>
  );
}
