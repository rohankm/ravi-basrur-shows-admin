import { PostgrestBuilder } from "@supabase/postgrest-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getKeys, upsertWithQuery } from "./helpers";
interface OLDDATA {
  error: any;
  data: null | { [key: string]: any };
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function useMutationData() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      query,
      addFirst = false,
      deleteId,
    }: {
      query: PostgrestBuilder<any>;
      addFirst?: boolean;
      deleteId?: string;
    }) => {
      const mutationData = await query;

      if (mutationData.error) {
        throw mutationData.error;
      }

      console.log({ mutationData });

      if (deleteId) {
        return {
          data: { id: deleteId, is_deleted: true },
          query,
          addFirst,
        };
      }
      // console.log(mutationData);
      return { data: mutationData.data, query, addFirst };
    },
    onSuccess: ({ data, query, addFirst }) => {
      if (!data) return;
      const queryKey = getKeys(query);
      // console.log("data: ", { queryKey, data });
      if (Array.isArray(data)) {
        data.map((data) => {
          upsertWithQuery({
            queryClient,
            queryKey,
            newData: data,
            addFirst,
          });
        });
      } else
        upsertWithQuery({
          queryClient,
          queryKey,
          newData: data,
          addFirst,
        });
    },
  });

  return mutation;
}
