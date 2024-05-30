"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { User } from "@/constants/data";
import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { columns } from "./columns";
import { Tables } from "@/types/database.types";
import { DataTableFilterField } from "@/components/ui/data-table/datatable.types";

interface Props {}

export const ListUsers: React.FC<Props> = ({}) => {
  const router = useRouter();
  const pathName = usePathname();

  const filterFields: DataTableFilterField<Tables<"profiles">>[] = [
    {
      label: "Phone Number",
      value: "phone_number",
      placeholder: "Filter phone number",
    },
  ];

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Users`} description="Manage users" />
        {/* <Button
          className="text-xs md:text-sm"
          onClick={() => {
            router.push("/dashboard/movies/create-movie");
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button> */}
      </div>
      <Separator />

      <DataTable
        filterFields={filterFields}
        columns={columns}
        tableName="profiles"
      />
    </>
  );
};
