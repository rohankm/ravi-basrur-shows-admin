import React, { memo, useMemo, useState } from "react";
import { Dashboard } from "@uppy/react";
import Uppy from "@uppy/core";
import ImageEditor from "@uppy/image-editor";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/image-editor/dist/style.min.css";
import Compressor from "@uppy/compressor";
import { ControllerRenderProps } from "react-hook-form";
import useFetchStorage from "@/hooks/supabase/useFetchStorage";
import { Button } from "./button";

export default function UppyComponent({
  field,
  aspectRatio = 1 / 1,
  bucket,
}: {
  field: ControllerRenderProps<any, any>;
  aspectRatio?: number;
  bucket: string;
}) {
  const uppy = useMemo(
    () =>
      new Uppy({
        restrictions: {
          maxNumberOfFiles: 1,
          allowedFileTypes: ["image/*"],
        },
        autoProceed: true,
        allowMultipleUploadBatches: false,
        id: "mediaImage",
      })
        .use(ImageEditor, {
          target: "",
          cropperOptions: {
            aspectRatio: aspectRatio,
            croppedCanvasOptions: {},
          },

          actions: {
            cropSquare: false,
            cropWidescreen: false,
            cropWidescreenVertical: false,
            revert: true,
            rotate: true,
            granularRotate: true,
            flip: true,
            zoomIn: true,
            zoomOut: true,
          },
        })
        .on("file-editor:complete", (updatedFile) => {
          // Access uploaded image data
          //   console.log({ updatedFile });

          field.onChange(updatedFile);
        })
        .on("file-removed", (updatedFile) => {
          // Access uploaded image data

          field.onChange();
        })
        .use(Compressor),
    []
  );

  const img = useFetchStorage({ url: field.value, bucket });

  // console.log("sdfdsf", field.value);

  if (typeof field.value == "string" && field.value !== "" && !img.isError) {
    return (
      <div
        className=" flex justify-center items-center gap-5 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50
      "
      >
        {img.url && (
          <img src={img.url} className=" w-[100px] h-full object-cover" />
        )}
        <Button
          onClick={() => {
            field.onChange(null);
          }}
        >
          Reselect
        </Button>
      </div>
    );
  }

  return (
    <Dashboard
      id="mediaImage"
      uppy={uppy}
      width={"100%"}
      plugins={["ImageEditor"]}
      proudlyDisplayPoweredByUppy={false}
      autoOpenFileEditor={true}
    />
  );
}
