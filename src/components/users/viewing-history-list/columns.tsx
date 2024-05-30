"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

import { Checkbox } from "@/components/ui/checkbox";
import { Tables } from "@/types/database.types";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";

export const columns: ColumnDef<Tables<"viewing_history">>[] = [
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
  // {
  //   accessorKey: "id",
  //   header: "Id",
  // },
  {
    accessorKey: "movies->title",
    accessorFn: (row) => row.movies.title,
    header: "Movie",
  },
  {
    accessorKey: "profiles->phone_number",
    accessorFn: (row) => row?.profiles?.phone_number,
    header: "User",
  },
  {
    accessorKey: "ip_address",
    header: "IP Address",
  },

  {
    accessorKey: "created_at",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ getValue }) => {
      return new Date(getValue()).toLocaleString();
    },
  },

  {
    accessorKey: "updated_at",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ getValue }) => {
      return new Date(getValue()).toLocaleString();
    },
  },

  {
    accessorKey: "player_event",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Player Event" />
    ),
  },

  {
    accessorKey: "device_type",
    header: "Device Type",
  },

  {
    accessorKey: "completed",
    header: "Completed",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
