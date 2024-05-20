import { supabase } from "@/lib/supabase/client";
import {
  PostgrestError,
  PostgrestMaybeSingleResponse,
  PostgrestResponse,
  PostgrestSingleResponse,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
} from "@supabase/supabase-js";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { getKeys, upsertWithQuery } from "./helpers";

interface OLDDATA {
  error: any;
  data: null | { [key: string]: any };
}

interface D extends Record<string, any> {
  id: string;
}

type UseQueryAnyReturn<Result> = Omit<
  UseQueryResult<PostgrestResponse<Result>["data"], PostgrestError>,
  "refetch"
> &
  Pick<UseQueryResult<PostgrestResponse<Result>, PostgrestError>, "refetch"> &
  Pick<PostgrestResponse<Result>, "count">;

type UseQuerySingleReturn<Result> = Omit<
  UseQueryResult<PostgrestSingleResponse<Result>["data"], PostgrestError>,
  "refetch"
> &
  Pick<
    UseQueryResult<PostgrestSingleResponse<Result>, PostgrestError>,
    "refetch"
  > &
  Pick<PostgrestSingleResponse<Result>, "count">;

type UseQueryMaybeSingleReturn<Result> = Omit<
  UseQueryResult<PostgrestMaybeSingleResponse<Result>["data"], PostgrestError>,
  "refetch"
> &
  Pick<
    UseQueryResult<PostgrestMaybeSingleResponse<Result>, PostgrestError>,
    "refetch"
  > &
  Pick<PostgrestMaybeSingleResponse<Result>, "count">;

function useFetchData<Result>({
  query,
  options,
  realtime,
  addFirst,
}: {
  query: PromiseLike<PostgrestSingleResponse<Result>>;
  options?: Omit<
    UseQueryOptions<PostgrestSingleResponse<Result>, PostgrestError>,
    "queryKey" | "queryFn"
  >;
  realtime?: boolean;
  addFirst?: boolean;
}): UseQuerySingleReturn<Result>;

function useFetchData<Result>({
  query,
  options,
  realtime,
  addFirst,
}: {
  query: PromiseLike<PostgrestMaybeSingleResponse<Result>>;
  options?: Omit<
    UseQueryOptions<PostgrestSingleResponse<Result>, PostgrestError>,
    "queryKey" | "queryFn"
  >;
  realtime?: boolean;
  addFirst?: boolean;
}): UseQueryMaybeSingleReturn<Result>;

function useFetchData<Result>({
  query,
  options = {
    refetchOnWindowFocus: "always",
  },
  realtime = false,
  addFirst = false,
}: {
  query: PromiseLike<PostgrestResponse<Result>>;
  options?: Omit<
    UseQueryOptions<PostgrestResponse<Result>, PostgrestError>,
    "queryKey" | "queryFn"
  >;
  realtime?: boolean;
  addFirst?: boolean;
}): UseQueryAnyReturn<Result> {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => getKeys(query), [query]);

  const { data, ...rest } = useQuery<PostgrestResponse<Result>, PostgrestError>(
    {
      queryKey: queryKey,
      queryFn: async () => {
        const response = await query;
        if (response.error) {
          throw response.error;
        }
        return response;
      },
      ...options,
    }
  );

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

  return { data: data?.data, count: data?.count ?? null, ...rest };
}

export default useFetchData;
