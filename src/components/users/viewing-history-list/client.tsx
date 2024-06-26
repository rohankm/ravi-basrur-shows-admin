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

interface Props {
  user_id?: "string";
  movie_id?: "string";
}
interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}
interface DataTableFilterField<TData> {
  label: string;
  value: keyof TData;
  placeholder?: string;
  options?: Option[];
}

export const ViewingHistoryList: React.FC<Props> = ({ user_id, movie_id }) => {
  const router = useRouter();
  const pathName = usePathname();

  const filterFields: DataTableFilterField<Tables<"viewing_history">>[] = [
    {
      label: user_id ? "movie" : "Phone Number",
      value: user_id ? "movies->title" : "profiles->phone_number",
      placeholder: user_id ? "Filter movie" : "filter number",
    },
    {
      label: "Completed",
      value: "completed",
      options: ["true", "false"].map((status) => ({
        label: status[0]?.toUpperCase() + status.slice(1),
        value: status,
        // icon: getStatusIcon(status),
        withCount: true,
      })),
    },
    {
      label: "Player Events",
      value: "player_event",
      options: [
        "pause",
        "play",
        "completed",
        "error",
        "seek",
        "subtitle",
        "current_time",
        "initial",
        "back",
      ].map((status) => ({
        label: status[0]?.toUpperCase() + status.slice(1),
        value: status,
        // icon: getStatusIcon(status),
        withCount: true,
      })),
    },
    // {
    //   label: "Priority",
    //   value: "priority",
    //   options: tasks.priority.enumValues.map((priority) => ({
    //     label: priority[0]?.toUpperCase() + priority.slice(1),
    //     value: priority,
    //     icon: getPriorityIcon(priority),
    //     withCount: true,
    //   })),
    // },
  ];

  return (
    <>
      <DataTable
        filterFields={filterFields}
        columns={columns}
        tableName="viewing_history"
        initialFixedFilter={
          user_id ? { profile_id: user_id } : { movie_id: movie_id }
        }
        select={
          user_id ? "*,movies!inner(*)" : "*,movies!inner(*),profiles!inner(*)"
        }
        initalColumnVisiblity={
          user_id ? { "profiles->phone_number": false } : {}
        }
      />
    </>
  );
};
