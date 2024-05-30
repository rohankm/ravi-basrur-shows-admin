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
  user_id: "string";
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

export const ViewingHistoryList: React.FC<Props> = ({ user_id }) => {
  const router = useRouter();
  const pathName = usePathname();

  const filterFields: DataTableFilterField<Tables<"viewing_history">>[] = [
    {
      label: "movie",
      value: "movies->title",
      placeholder: "Filter movie",
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
        initialFixedFilter={{ profile_id: user_id }}
        select="*,movies!inner(*)"
        initalColumnVisiblity={{}}
      />
    </>
  );
};
