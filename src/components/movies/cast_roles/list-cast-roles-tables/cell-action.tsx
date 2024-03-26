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

import useMutationData from "@/hooks/supabase/useMutationData";
import { supabase } from "@/lib/supabase/client";
import { Tables } from "@/types/database.types";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CellActionProps {
  data: Tables<"cast_roles">;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const mutate = useMutationData();
  const pathName = usePathname();

  const onConfirm = async () => {
    setLoading(true);
    try {
      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("cast_roles")
          .delete()
          .match({
            id: data.id,
          })
          .select("*"),
        deleteId: data.id,
      });

      toast("Cast Role deleted successfully.");
      setOpen(false);
    } catch (err) {
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
        title={`Are you sure you want to delete Cast Role ${data.name}?`}
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
            onClick={() => router.push(pathName + "?edit_cast_role=" + data.id)}
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
