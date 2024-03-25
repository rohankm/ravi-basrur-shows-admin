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

interface ProductsClientProps {}

export const Genres: React.FC<ProductsClientProps> = ({}) => {
  const router = useRouter();
  const pathName = usePathname();
  const genres = useInfiniteFetchData({
    query: supabase.from("genres").select("*"),
    loadAmount: 5,
  });

  const data = useMemo(() => [genres.finalData ?? []], [genres.finalData]);
  console.log(genres.hasPreviousPage);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Genres`} description="Manage movie genres" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => {
            router.push(pathName + "?new_genre=true");
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={columns}
        data={genres.finalData ?? []}
        query={genres}
      />
    </>
  );
};
