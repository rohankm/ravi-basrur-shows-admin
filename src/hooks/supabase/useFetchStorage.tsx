import { useUserDetails } from "@/components/layout/Providers/UserDetailsContextProvider";
import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

export default function useFetchStorage({
  url,
  userImage = false,
}: {
  url: string | null | undefined;
  userImage?: boolean;
}) {
  const { user } = useUserDetails();

  // console.log(url, typeof url == "string");
  const file = userImage
    ? user?.id + "/" + url?.split("/").pop()
    : user?.id +
      "/projects" +
      (typeof url == "string" ? url?.split("projects")?.[1] : "");

  //   console.log(file);
  const queryKey = ["storage", file];

  const { data, ...rest } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!url) {
        throw "Url not specified";
      }
      const { data, error } = await supabase.storage
        .from("project")
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

  //   useEffect(() => {
  //     const getFile = async () => {
  //       console.log(file);
  //       const { data, error } = await supabase.storage
  //         .from("project")
  //         .createSignedUrl(file, 60 * 5);

  //       console.log(data, error);
  //       if (data) {
  //         setImg(data.signedUrl);
  //       }
  //       if (error) {
  //         setError(true);
  //       }
  //     };
  //     if (url && user) getFile();
  //   }, [url, user]);

  return { url: data?.signedUrl, ...rest };
}
