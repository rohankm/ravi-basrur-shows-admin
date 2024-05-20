import { useUserDetails } from "@/components/layout/Providers/UserDetailsContextProvider";
import { supabase } from "@/lib/supabase/client";
import { UppyFile } from "@uppy/core";
import React from "react";
import { v4 as uuidv4 } from "uuid";

export default function useUploadToStorage() {
  const upload = async ({
    image,
    parentPath = "",
    bucket,
  }: {
    image: UppyFile<Record<string, unknown>>;
    parentPath?: string;
    bucket: string;
  }) => {
    const id = uuidv4();
    const path = parentPath + "/" + id + `.${image.extension}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, image.data, { contentType: image.meta.type });
    if (error) {
      throw "Image upload failed";
    }
    if (data) {
      return data.path;
    }
  };

  return upload;
}
