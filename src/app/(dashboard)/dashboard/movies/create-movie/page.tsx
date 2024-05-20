import BreadCrumb from "@/components/breadcrumb";
import { CreateMovie } from "@/components/movies/movies/CreateMovie";

import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [
  { title: "Movies", link: "/dashboard/movies" },
  { title: "Create Movie", link: "" },
];
export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <CreateMovie />
      </div>
    </ScrollArea>
  );
}
