"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { User } from "@/constants/data";
import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { columns } from "./columns";
import useFetchData from "@/hooks/supabase/useFetchData";
import { supabase } from "@/lib/supabase/client";
import { useMemo } from "react";
import useInfiniteFetchData from "@/hooks/supabase/useInfiniteFetchData";
import { keepPreviousData } from "@tanstack/react-query";

interface Props {}

export const ListCastRoles: React.FC<Props> = ({}) => {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Cast Roles`} description="Manage movie cast roles" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => {
            router.push(pathName + "?new_cast_role=true");
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />

      <DataTable searchKey="name" columns={columns} tableName="cast_roles" />
    </>
  );
};
