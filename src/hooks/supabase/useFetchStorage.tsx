import { useUserDetails } from "@/components/layout/Providers/UserDetailsContextProvider";
import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

export default function useFetchStorage({
  url,
  userImage = false,
  bucket,
}: {
  url: string | null | undefined;
  userImage?: boolean;
  bucket: string;
}) {
  const { user } = useUserDetails();

  // console.log(url, typeof url == "string");
  const file = url;

  //   console.log(file);
  const queryKey = ["storage", file];

  const { data, ...rest } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!url) {
        throw "Url not specified";
      }
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(file, 60 * 5, {
          transform: {
            width: 500,
            height: 600,
            resize: "contain",
          },
        });
      if (error) {
        throw error;
      }
      return data;
    },
    refetchInterval: 1000 * 60 * 5,
    enabled: !!url,
  });

  return { url: data?.signedUrl, ...rest };
}
