import { useUserDetails } from "@/components/layout/Providers/UserDetailsContextProvider";
import { supabase } from "@/lib/supabase/client";
import { UppyFile } from "@uppy/core";
import React from "react";
import { v4 as uuidv4 } from "uuid";

export default function useDeleteSingleFile() {
  const deleteSingleFile = async ({
    fileUrl,
    bucket,
  }: {
    fileUrl: string | null;
    bucket: string;
  }) => {
    if (!fileUrl) return true;
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([fileUrl]);
    if (error) {
      throw "Image delete failed";
    }
    if (data) {
      return true;
    }
  };

  return deleteSingleFile;
}
