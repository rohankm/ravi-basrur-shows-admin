"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useFetchData from "@/hooks/supabase/useFetchData";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import useMutationData from "@/hooks/supabase/useMutationData";
import { supabase } from "@/lib/supabase/client";
import { Tables } from "@/types/database.types";
import { Label } from "@radix-ui/react-label";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface CellActionProps {
  data: Tables<"movies">;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const mutate = useMutationData();
  const pathName = usePathname();

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            View
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl ">
          <DialogHeader>
            <DialogTitle>View History Logs</DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription> */}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <HistoyChart historyData={data} />
          </div>
          {/* <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </>
  );
};

const HistoyChart = ({ historyData }) => {
  const data = useFetchData({
    query: supabase
      .from("viewing_history_logs")
      .select("*")
      .match({
        viewing_history_id: historyData.id,
      })
      .order("updated_at", { ascending: true })
      .limit(10000),
  });

  const chartData = useMemo(() => {
    if (!data.data) return [];

    const formattedData = data.data.map((log) => ({
      time: log.updated_at,
      currentTime: log.current_time,
      event: log.player_event,
    }));

    return formattedData;
  }, [data, historyData]);

  console.log({ data });

  useEffect(() => {
    let startInterval;
    if (!data.isLoading)
      startInterval = setInterval(async () => {
        data.refetch();
      }, 5000); // Fetch every 2 seconds

    return () => startInterval && clearInterval(startInterval);
  }, [historyData, data]);

  function secondsToHms(seconds) {
    if (seconds < 0) {
      seconds = -seconds; // Handle negative seconds
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const second = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
  }
  return (
    <ResponsiveContainer height={350}>
      <LineChart data={chartData}>
        <YAxis
          // label="Duration" // Label the Y-axis for clarity
          dataKey="currentTime"
          tickFormatter={(value) => {
            return secondsToHms(value); // Format Y-axis ticks to hours and minutes with two decimal places
          }}
        />
        <CartesianGrid stroke="#222" strokeDasharray="5 5" />
        <XAxis
          // label="Time" // Label the Y-axis for clarity
          dataKey="time"
          tickFormatter={(value) => new Date(value).toLocaleTimeString()} // Format Y-axis ticks to two decimal places
        />
        <Tooltip />
        <Line type="monotone" dataKey="currentTime" stroke="#555" />
        <Line
          type="monotone"
          dataKey="event"
          stroke="#ccc"
          // Filter data by event
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
