import { supabase } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { upsertWithQuery } from "./helpers";

interface D extends Record<string, any> {
  id: string;
}

export default function useRealtime() {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!supabase) return;

    const c = supabase
      .channel("all_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
        },
        async (payload) => {
          const newData = payload.new as D;

          console.log("useRealtime", payload);
          if (payload.errors) {
            console.log({ payload });
            throw payload.errors;
          }
          upsertWithQuery({
            queryClient,
            newData,
            queryKey: [payload.schema, "table", payload.table],
            addFirst: false,
          });
        }
      )
      .subscribe();

    return () => {
      if (c) c.unsubscribe();
    };
  }, [supabase, queryClient]);
}
