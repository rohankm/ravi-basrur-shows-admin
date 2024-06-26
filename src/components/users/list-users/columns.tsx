"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

import { Checkbox } from "@/components/ui/checkbox";
import { Tables } from "@/types/database.types";

export const columns: ColumnDef<Tables<"profiles">>[] = [
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
    accessorKey: "first_name",
    header: "First Name",
    enableSorting: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
    enableSorting: true,
  },
  {
    accessorKey: "phone_number",
    header: "Phone Number",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    enableHiding: false,
  },
];
