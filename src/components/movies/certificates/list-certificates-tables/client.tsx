"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { columns } from "./columns";
import { DataTableFilterField } from "@/components/ui/data-table/datatable.types";
import { Tables } from "@/types/database.types";

interface Props {}

const filterFields: DataTableFilterField<Tables<"certificates">>[] = [
  {
    label: "Name",
    value: "name",
    placeholder: "Filter certificates",
  },
];

export const Certificates: React.FC<Props> = ({}) => {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Certificates`}
          description="Manage movie certificates"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => {
            router.push(pathName + "?new_certificate=true");
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />

      <DataTable
        filterFields={filterFields}
        columns={columns}
        tableName="certificates"
      />
    </>
  );
};
