import { useUserDetails } from "@/components/layout/Providers/UserDetailsContextProvider";
import { supabase } from "@/lib/supabase/client";
import { UppyFile } from "@uppy/core";
import React from "react";
import { v4 as uuidv4 } from "uuid";

export default function useUpsertToStorage() {
  const upsert = async ({
    image,
    originalImage,
    bucket,
  }: {
    image: UppyFile<Record<string, unknown>> | string;
    originalImage?: string | null;
    bucket: string;
  }) => {
    if (typeof image == "string") {
      return image;
    }
    const id = uuidv4();
    const path = originalImage
      ? originalImage
      : "/" + id + `.${image.extension}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, image.data, { contentType: image.meta.type, upsert: true });
    console.log("image upload", path, data);
    if (error) {
      console.log({ error });
      throw "Image upload failed";
    }
    if (data) {
      return data.path;
    }
  };

  return upsert;
}
