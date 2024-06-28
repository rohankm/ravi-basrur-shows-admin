"use client";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "../../ui/scroll-area";
import { supabase } from "@/lib/supabase/client";
import useMutationData from "@/hooks/supabase/useMutationData";
import { toast } from "sonner";
import useFetchData from "@/hooks/supabase/useFetchData";
import { useEffect } from "react";
import { Skeleton } from "../../ui/skeleton";
import UppyComponent from "@/components/ui/UppyComponent";
import useUpsertToStorage from "@/hooks/supabase/upsertToStorage";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  ad_image: z.union([
    z.string(), // For URLs
    z.any(), // For File objects
  ]),
  is_draft: z.boolean().optional(),
});

type AdType = z.infer<typeof formSchema>;

export function CreateEditAds({
  open = false,
  editAdId,
}: {
  open: boolean;
  editAdId?: string | null | undefined;
}) {
  const edit = !!editAdId;
  const rotuer = useRouter();
  const mutate = useMutationData();
  const defaultValues = {
    is_draft: true,
  };

  const form = useForm<AdType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const Ad = useFetchData({
    query: supabase.from("ads").select().match({ id: editAdId }).single(),
    options: {
      enabled: edit,
    },
  });

  console.log(Ad.data);
  useEffect(() => {
    if (Ad.data)
      form.reset({
        name: Ad.data.name,
        description: Ad.data.description,

        ad_image: Ad.data.ad_content.data,
        is_draft: Ad.data.is_draft,
      });
    else form.reset(defaultValues);
  }, [Ad.data]);

  const onClose = () => {
    form.reset(defaultValues);
    rotuer.back();
  };
  const upsertFile = useUpsertToStorage();
  const onSubmit = async (data: AdType) => {
    console.log(data.is_draft);

    try {
      const uploadId = await upsertFile({
        image: data.ad_image,
        bucket: "ads",
      });
      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("ads")
          .insert({
            name: data.name,
            description: data.description,
            ad_content: {
              data: uploadId,
              type: "image",
            },
            is_draft: data.is_draft,
          })
          .select(),
      });

      console.log(rsp);

      if (rsp.data) {
        toast("Ad has been created.");

        onClose();
      }
    } catch (err) {
      console.log(err);
      toast.error("Error Adding Ad");
    }
  };

  const onSubmitEdit = async (data: AdType) => {
    console.log(data);
    try {
      if (!Ad.data) return;

      const uploadId = await upsertFile({
        image: data.ad_image,
        originalImage: Ad.data.ad_content.data,
        bucket: "ads",
      });
      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("ads")
          .update({
            name: data.name,
            description: data.description,
            ad_content: {
              data: uploadId,
              type: "image",
            },
            is_draft: data.is_draft,
          })
          .match({ id: Ad.data.id })
          .select(),
      });

      console.log(rsp);

      if (rsp.data) {
        toast("Ad has been updated.");

        onClose();
      }
    } catch (err) {
      console.log("err Ad", err);
      toast.error("Error updating Ad");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>{edit ? "Edit Ad" : "Add Ad"}</DialogTitle>
          <DialogDescription>Add new Ad to the list</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          {edit && Ad.isLoading && <Skeleton className="w-full h-20" />}
          {!Ad.isLoading && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(edit ? onSubmitEdit : onSubmit)}
                className="space-y-2 w-full"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Type here..."
                          disabled={form.formState.isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad Description</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Type here..."
                          disabled={form.formState.isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ad_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad Image</FormLabel>
                      <FormControl>
                        <UppyComponent field={field} bucket={"ads"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_draft"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormLabel>Draft</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(value) => {
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={form.formState.isSubmitting}
                  className="ml-auto w-full mt-5"
                  type="submit"
                >
                  Save
                </Button>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
