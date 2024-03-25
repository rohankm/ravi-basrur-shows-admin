import { useUserDetails } from "@/components/layout/Providers/UserDetailsContextProvider";
import { supabase } from "@/lib/supabase/client";
import { UppyFile } from "@uppy/core";
import React from "react";
import { v4 as uuidv4 } from "uuid";

const baseBath = "file:///storage/emulated/0/Documents/Easy_Script";
export default function uploadToStorage() {
  const { user } = useUserDetails();

  const upload = async ({
    image,
    parentPath,
  }: {
    image: UppyFile<Record<string, unknown>>;
    parentPath: string;
  }) => {
    const id = uuidv4();
    const path =
      user?.id + "/projects/" + parentPath + "/" + id + `.${image.extension}`;
    const { data, error } = await supabase.storage
      .from("project")
      .upload(path, image.data, { contentType: image.meta.type });
    if (error) {
      throw "Image upload failed";
    }
    if (data) {
      return baseBath + "/projects" + data.path.split("projects")[1];
    }
  };

  return upload;
}
