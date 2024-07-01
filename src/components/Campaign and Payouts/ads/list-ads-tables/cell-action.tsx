"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useDeleteSingleFile from "@/hooks/supabase/useDeleteSingleFile";

import useMutationData from "@/hooks/supabase/useMutationData";
import { supabase } from "@/lib/supabase/client";
import { Tables } from "@/types/database.types";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CellActionProps {
  data: Tables<"ads">;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const mutate = useMutationData();
  const pathName = usePathname();
  const deleteFile = useDeleteSingleFile();
  const onConfirm = async () => {
    setLoading(true);
    try {
      const deleteF = await deleteFile({
        fileUrl: data.ad_content.data,
        bucket: "ads",
      });
      // const rsp = await mutate.mutateAsync({
      //   query: supabase
      //     .from("ads")
      //     .delete()
      //     .match({
      //       id: data.id,
      //     })
      //     .select("*"),
      //   deleteId: data.id,
      // });

      toast("Ad deleted successfully.");
      setOpen(false);
    } catch (err) {
      console.log("Ad deleted err", err);
      toast.error("Something Went Wrong.");
    }
    setLoading(false);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title={`Are you sure you want to delete Ad ${data.name}?`}
        description="This Cannot Be Undone"
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(pathName + "?edit_ad=" + data.id)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
