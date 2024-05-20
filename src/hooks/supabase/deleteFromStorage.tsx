import { useUserDetails } from "@/components/layout/Providers/UserDetailsContextProvider";
import { supabase } from "@/lib/supabase/client";

export default function useDeleteFromStorage() {
  const { user } = useUserDetails();

  const getAllFiles = async (bucket = "project", baseUrl: string) => {
    const { data, error } = await supabase.storage.from(bucket).list(baseUrl);

    if (error) return [];
    let filesToDelete = data
      .filter((file) => file.id)
      .map((file) => `${baseUrl}/${file.name}`);

    let folders = data.filter((file) => file.id == null);
    // console.log("get", baseUrl, { data, error }, { folders }, { filesToDelete });
    await Promise.all(
      folders.map(async (folder) => {
        let tmp = await getAllFiles(bucket, `${baseUrl}/${folder.name}`);

        filesToDelete = [...filesToDelete, ...tmp];
      })
    );

    return filesToDelete;
  };

  const getDirectory = (url: string, userId: string) => {
    let tmp = url?.split("projects")[1];

    return userId + "/projects" + tmp;
  };

  const deleteFile = async ({
    url,
    userImage,
  }: {
    url: string | null | undefined;
    userImage?: boolean;
  }) => {
    if (!url || !user?.id) return;
    let deleteFile: string[];
    //is directory check
    if (url?.split(".").length == 1) {
      deleteFile = await getAllFiles("project", getDirectory(url, user?.id));
    } else {
      deleteFile = [getDirectory(url, user?.id)];
    }

    const { data, error } = await supabase.storage
      .from("project")
      .remove(deleteFile);
  };

  return deleteFile;
}
