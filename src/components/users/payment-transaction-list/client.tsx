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

interface Props {
  user_id: string;
}

export const PaymentTransactionsList: React.FC<Props> = ({ user_id }) => {
  const router = useRouter();
  const pathName = usePathname();

  const {
    data: payment_transactions,
    error,
    refetch,
  } = useFetchData({
    query: supabase.from("payment_transactions").select("*").match({
      user_id: user_id,
    }),
  });

  return (
    <>
      <DataTable columns={columns} data={payment_transactions} />
    </>
  );
};
