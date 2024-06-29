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

const formSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  amount: z.string(),
  pay_per_view: z.string(),
  is_draft: z.boolean().optional(),
  movie_id: z.object({
    value: z.string().uuid(),
    label: z.string(),
  }),
});

type AdType = z.infer<typeof formSchema>;

export function CreateEditCampaign({
  open = false,
  editCampaignId,
  onClose: onCloseProp,
}: {
  open: boolean;
  editCampaignId?: string | null | undefined;
  onClose?: () => {};
}) {
  const edit = !!editCampaignId;
  const rotuer = useRouter();
  const mutate = useMutationData();
  const defaultValues = {
    is_draft: true,
  };

  const form = useForm<AdType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const campaign = useFetchData({
    query: supabase
      .from("campaigns")
      .select("*,movies(*)")
      .match({ id: editCampaignId })
      .single(),
    options: {
      enabled: edit,
    },
  });

  console.log(campaign);
  useEffect(() => {
    if (campaign.data)
      form.reset({
        ...campaign.data,
        movie_id: {
          label: campaign.data.movies?.title,
          value: campaign.data.movies?.id,
        },
        start_date: new Date(campaign.data.start_date)
          ?.toISOString()
          .split("T")[0],
        end_date: new Date(campaign.data.end_date)?.toISOString().split("T")[0],
        amount: campaign.data.amount.toString(),
      });
    else form.reset(defaultValues);
  }, [campaign.data]);

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
          .from("campaigns")
          .insert({
            ...data,
            movie_id: data.movie_id.value,
          })
          .select(),
      });

      console.log(rsp);

      if (rsp.data) {
        toast("Campaign has been created.");

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
      if (!campaign.data) return;

      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("campaigns")
          .update({
            ...data,
            movie_id: data.movie_id.value,
          })
          .match({ id: campaign.data.id }),
      });

      console.log(rsp);

      if (!rsp.error) {
        toast("Campaign has been updated.");

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
          <DialogTitle>{edit ? "Edit Campaign" : "Add Campaign"}</DialogTitle>
          <DialogDescription>Add new Ad to the list</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          {edit && campaign.isLoading && <Skeleton className="w-full h-20" />}
          {!campaign.isLoading && (
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
                      <FormLabel>Campaign name</FormLabel>
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
                      <FormLabel>Campaign Description</FormLabel>
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
                  name={"movie_id"}
                  render={({ field }) => {
                    // console.log("asdsd", { field });
                    const {
                      data: resultData,
                      count,
                      isFetching,
                    } = useFetchData({
                      query: supabase.from("movies").select("*").match({
                        watching_option: "paid",
                      }),
                    });
                    const initialOptions = useMemo(() => {
                      if (!resultData) {
                        return [];
                      }

                      return resultData.map((d) => {
                        return {
                          value: d.id,
                          label: d.title,
                        };
                      });
                    }, [resultData]);
                    const loadOptions = (inputValue: string) =>
                      new Promise<{ value: string; label: string }[]>(
                        async (resolve) => {
                          if (!inputValue) resolve([]);

                          const { data, error } = await supabase
                            .from("movies")
                            .select("*")
                            .ilike("title", `%${inputValue}%`)
                            .match({
                              watching_option: "paid",
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
                                label: d.title,
                              };
                            })
                          );
                        }
                      );

                    // console.log({ field });

                    return (
                      <FormItem>
                        <FormLabel>Movie</FormLabel>
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
                  name="pay_per_view"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pay per View Amount</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Campaign Amount</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
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
                /> */}
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
