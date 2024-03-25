import { supabase } from "@/lib/supabase/client";

import {
  PostgrestError,
  PostgrestResponse,
  PostgrestTransformBuilder,
} from "@supabase/postgrest-js";

import {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { getKeys, upsertWithQuery } from "./helpers";
import { GenericSchema } from "@supabase/supabase-js/dist/module/lib/types";

interface D extends Record<string, any> {
  id: string;
}

type UseInfiniteQueryResultWithFinalData<Result> = UseInfiniteQueryResult<
  {
    pages: { error: PostgrestError; data: Result[] }[];
    pageParams: number[];
  },
  PostgrestError
> &
  Pick<PostgrestResponse<Result>, "count"> & {
    finalData?: Result[]; // Add the finalData property
  };

function useInfiniteFetchData<
  Schema extends GenericSchema,
  Table extends Record<string, unknown>,
  Result extends Record<string, unknown>,
  RelationName = unknown,
  Relationships = unknown
>({
  query,
  options = {
    refetchOnWindowFocus: "always",
  },
  realtime = false,
  addFirst = false,
  loadAmount = 50,
}: {
  query: PostgrestTransformBuilder<
    Schema,
    Table,
    Result[],
    RelationName,
    Relationships
  >;
  options?: Omit<
    UseInfiniteQueryOptions,
    | "queryKey"
    | "queryFn"
    | "getNextPageParam"
    | "getPreviousPageParam"
    | "initialPageParam"
  >;
  realtime?: boolean;
  addFirst?: boolean;
  loadAmount?: number;
}): UseInfiniteQueryResultWithFinalData<Result> {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => getKeys(query), [query]);

  const results = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: async ({ pageParam = 0 }: { pageParam: number }) => {
      const response = await query.range(
        pageParam * loadAmount,
        pageParam * loadAmount + loadAmount - 1
      );

      if (response.error) {
        throw response.error;
      }

      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.data?.length < loadAmount || !lastPage || !lastPage?.data) {
        return undefined;
      }

      return allPages.length;
    },
    getPreviousPageParam: (firstPage, allPages) => {},
    ...options,
  });

  useEffect(() => {
    if (!supabase) return;
    if (!realtime) return;

    const table = queryKey[2];
    const filter = queryKey[3]
      .filter((d: string) => d.match(/(eq|neq|lt|lte|gt|gte|in)/g))
      .join("&");

    // console.log("Calledd");

    const c = supabase
      .channel(queryKey[3])
      .on(
        "postgres_changes",
        {
          event: "*",
          table,
          schema: "public",
          filter: filter ? filter : undefined,
        },
        async (payload) => {
          console.log(payload);
          const newData = payload.new as D;

          upsertWithQuery({
            queryClient,
            newData,
            queryKey,
            addFirst,
          });
        }
      )
      .subscribe();

    return () => {
      if (c) c.unsubscribe();
    };
  }, [supabase, queryClient, realtime, queryKey, addFirst]);

  const finalData = useMemo(() => {
    if (!results.data) return [];
    const tmp = results.data?.pages?.reduce((acc, page) => {
      return acc.concat(page?.data);
    }, []);

    // if (tmp?.length == 1) return tmp[0];
    return tmp;
  }, [results]);

  // console.log(finalData, results.data);

  return {
    finalData,
    count: finalData?.count ?? null,
    ...results,
  };
}

export default useInfiniteFetchData;
