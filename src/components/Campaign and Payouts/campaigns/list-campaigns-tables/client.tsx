"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { columns } from "./columns";
import useFetchData from "@/hooks/supabase/useFetchData";
import { supabase } from "@/lib/supabase/client";
import { useMemo } from "react";
import useInfiniteFetchData from "@/hooks/supabase/useInfiniteFetchData";
import { keepPreviousData } from "@tanstack/react-query";
import { DataTableFilterField } from "@/components/ui/data-table/datatable.types";
import { Tables } from "@/types/database.types";

interface ProductsClientProps {}

const filterFields: DataTableFilterField<Tables<"campaigns">>[] = [
  {
    label: "Name",
    value: "name",
    placeholder: "Filter tags",
  },
];

export const Campaigns: React.FC<ProductsClientProps> = ({}) => {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Campaigns`} description="Manage campaigns" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => {
            router.push(pathName + "?new_campaign=true");
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />

      <DataTable
        filterFields={filterFields}
        columns={columns}
        tableName="campaigns"
      />
    </>
  );
};
