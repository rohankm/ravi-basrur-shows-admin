"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

import { Checkbox } from "@/components/ui/checkbox";
import { Tables } from "@/types/database.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useFetchStorage from "@/hooks/supabase/useFetchStorage";

export const columns: ColumnDef<Tables<"cast_information">>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "profile_picture",
    header: "Avatar",
    cell: ({ row, getValue }) => {
      const img = useFetchStorage({
        url: getValue() as string,
        bucket: "cast_images",
      });

      return (
        <Avatar>
          <AvatarImage src={img.url} />
          <AvatarFallback>
            {
              (row.getValue("first_name")?.[0] +
                row.getValue("last_name")?.[0]) as string
            }
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "biography",
    header: "Biography",
  },
  {
    accessorKey: "birth_date",
    header: "Birth Day",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
