"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./input";
import { Button } from "./button";
import { ScrollArea, ScrollBar } from "./scroll-area";
import { useEffect, useMemo, useReducer, useState } from "react";
import { DataTablePagination } from "./DataTablePagination";
import useFetchData from "@/hooks/supabase/useFetchData";

import { PostgrestQueryBuilder } from "@supabase/postgrest-js";
import {
  GenericSchema,
  GenericTable,
} from "@supabase/supabase-js/dist/module/lib/types";
import { keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { supabase } from "@/lib/supabase/client";
import { Skeleton } from "./skeleton";
import { Database } from "@/types/database.types";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { ChevronDown } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns?: ColumnDef<TData, TValue>[];
  data?: TData[];
  searchKey?: string;

  tableName?: keyof Database["public"]["Tables"];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  tableName,
}: DataTableProps<TData, TValue>) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const memoQuery = useMemo(
    () =>
      supabase
        .from(tableName!)
        .select("*", { count: "exact" })
        .ilike(searchKey!, `%${debouncedSearch}%`)
        .range(
          pagination.pageIndex * pagination.pageSize,
          pagination.pageIndex * pagination.pageSize + pagination.pageSize - 1
        ),
    [pagination, debouncedSearch, searchKey, tableName]
  );
  const {
    data: resultData,
    count,
    isFetching,
  } = useFetchData({
    query: memoQuery,
    options: {
      enabled: !!tableName,
      // placeholderData: keepPreviousData,
    },
  });

  console.log({ tableName, resultData });

  // console.log(pagination, data?.pages?.[pagination.pageIndex]);
  const table = useReactTable({
    data: [...(data ? data : resultData ?? [])],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
      sorting,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    rowCount: count ?? -1,
    manualPagination: true,
    // manualPagination: true,
    // pageCount: -1,
    // initialState: { pageIndex: 0 },
  });

  console.log({ columnFilters });
  /* this can be used to get the selectedrows 
  console.log("value", table.getFilteredSelectedRowModel()); */

  const handleFilterChange = (value, columnId) => {
    const column = table.getColumn(columnId);
    if (column) {
      column.setFilterValue(value);
    }
  };

  return (
    <>
      <div className="flex items-center ">
        <Input
          placeholder={`Search ${searchKey}...`}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full md:max-w-sm"
        />
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : (
                  <Input
                    placeholder={`Filter ${
                      table.getColumn(header.id).columnDef.header
                    }...`}
                    value={
                      (table
                        .getColumn(header.id)
                        ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                      handleFilterChange(event.target.value, header.id)
                    }
                    className="max-w-sm"
                  />
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="rounded-md border h-[calc(80vh-220px)]">
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isFetching ? (
              Array(10)
                .fill(0)
                .map((d, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={columns.length} className="">
                      <Skeleton className="w-full h-[36px] " />
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <DataTablePagination table={table} />
    </>
  );
}
