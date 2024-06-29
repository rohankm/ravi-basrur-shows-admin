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
import { useEffect, useMemo } from "react";
import { Skeleton } from "../../ui/skeleton";
import UppyComponent from "@/components/ui/UppyComponent";
import useUpsertToStorage from "@/hooks/supabase/upsertToStorage";
import { Checkbox } from "@/components/ui/checkbox";
import { AsyncSelect } from "@/components/ui/react-select";
import { Tables } from "@/types/database.types";

const formSchema = z.object({
  duration: z.string(),
  ad_start_time: z.string(),
  ad_id: z.object({
    value: z.string().uuid(),
    label: z.string(),
  }),
});

type AdType = z.infer<typeof formSchema>;

export function CreateEditCampaignAd({
  open = false,
  campaignId,
  editCampaignAd,
  onClose: onCloseProp,
}: {
  open: boolean;
  editCampaignAd?: Tables<"campaign_ads">;
  onClose?: () => {};
}) {
  const edit = !!editCampaignAd;
  const rotuer = useRouter();
  const mutate = useMutationData();
  const defaultValues = {
    duration: "10",
  };

  const form = useForm<AdType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editCampaignAd)
      form.reset({
        ...editCampaignAd,
        duration: editCampaignAd.duration.toString(),
        ad_id: {
          label: editCampaignAd.ads.name,
          value: editCampaignAd.ads.id,
        },
      });
    else form.reset(defaultValues);
  }, [editCampaignAd, open]);

  const onClose = () => {
    form.reset(defaultValues);
    if (onCloseProp) {
      onCloseProp();
      return;
    }
    rotuer.back();
  };
  const upsertFile = useUpsertToStorage();
  const onSubmit = async (data: AdType) => {
    console.log(data);

    try {
      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("campaign_ads")
          .insert({
            ...data,
            ad_id: data.ad_id.value,
            campaign_id: campaignId,
          })
          .select(),
      });

      console.log(rsp);

      if (!rsp.error) {
        toast("Campaign Ad has been created.");

        onClose();
      }
    } catch (err) {
      console.log(err);
      toast.error("Error Adding Campaign");
    }
  };

  const onSubmitEdit = async (data: AdType) => {
    console.log(data);
    try {
      if (!editCampaignAd) return;

      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("campaign_ads")
          .update({
            ...data,
            ad_id: data.ad_id.value,
            campaign_id: campaignId,
          })
          .match({ id: editCampaignAd.id }),
      });

      console.log(rsp);

      if (!rsp.error) {
        toast("Campaign Ad has been updated.");

        onClose();
      }
    } catch (err) {
      console.log("err campaign", err);
      toast.error("Error updating Campaign");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>
            {edit ? "Edit Campaign Ad" : "Add Campaign Ad"}
          </DialogTitle>
          <DialogDescription>Add new Ad to the list</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(edit ? onSubmitEdit : onSubmit)}
              className="space-y-2 w-full"
            >
              <FormField
                control={form.control}
                name={"ad_id"}
                render={({ field }) => {
                  // console.log("asdsd", { field });
                  const {
                    data: resultData,
                    count,
                    isFetching,
                  } = useFetchData({
                    query: supabase.from("ads").select("*").match({
                      is_draft: false,
                    }),
                  });
                  const initialOptions = useMemo(() => {
                    if (!resultData) {
                      return [];
                    }

                    return resultData.map((d) => {
                      return {
                        value: d.id,
                        label: d.name,
                      };
                    });
                  }, [resultData]);
                  const loadOptions = (inputValue: string) =>
                    new Promise<{ value: string; label: string }[]>(
                      async (resolve) => {
                        if (!inputValue) resolve([]);

                        const { data, error } = await supabase
                          .from("ads")
                          .select("*")
                          .ilike("name", `%${inputValue}%`)
                          .match({
                            is_draft: false,
                          });

                        // console.log(data, error);
                        if (!data) {
                          resolve([]);
                          return;
                        }

                        if (data.length == 0) resolve([]);
                        resolve(
                          data.map((d) => {
                            return {
                              value: d.id,
                              label: d.name,
                            };
                          })
                        );
                      }
                    );

                  // console.log({ field });

                  return (
                    <FormItem>
                      <FormLabel>Ad</FormLabel>
                      <FormControl>
                        <div className="z-[999]">
                          <AsyncSelect
                            loadOptions={loadOptions}
                            cacheOptions
                            defaultOptions={initialOptions}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="ad_start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Start Time in seconds</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
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
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Duration</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
