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
import { Textarea } from "@/components/ui/textarea";
import {
  AsyncCreatableSelect,
  AsyncSelect,
} from "@/components/ui/react-select";

const deletedIds = (array1 = [], array2 = []) => {
  const deleted_ids = [];
  array2.forEach((d) => {
    if (array1.find((dd) => d._id === dd._id)) {
    } else {
      deleted_ids.push(d._id);
    }
  });

  return deleted_ids;
};
const formSchema = z.object({
  scheduled_release: z.string(),
  watching_option: z.object({
    value: z.string(),
    label: z.string(),
  }),
  pricing_amount: z.string(),
  discounted_pricing_amount: z.string(),
});

type movieBasicType = z.infer<typeof formSchema>;

export function EditReleaseDetailsAndPricing({
  open = false,
  defaultValues,
  onClose: onCloseProp,
  movie_id,
}: {
  open: boolean;
  defaultValues?: any;
  onClose?: () => void;
  movie_id: string;
}) {
  const rotuer = useRouter();
  const mutate = useMutationData();

  console.log({ defaultValues });

  const form = useForm<movieBasicType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  //   console.log(language.data);
  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues]);

  const onClose = () => {
    form.reset(defaultValues);
    onCloseProp && onCloseProp();
  };

  //   const onSubmit = async (data: movieBasicType) => {
  //     console.log(data);
  //     try {
  //       const rsp = await mutate.mutateAsync({
  //         query: supabase
  //           .from("languages")
  //           .insert({
  //             name: data.name,
  //             code: data.code,
  //             native_name: data.native_name,
  //           })
  //           .select(),
  //       });

  //       console.log(rsp);

  //       if (rsp.data) {
  //         toast("Language has been created.");

  //         onClose();
  //       }
  //     } catch (err) {
  //       toast.error("Error Adding Language");
  //     }
  //   };

  const onSubmitEdit = async (data: movieBasicType) => {
    console.log(data);

    try {
      const movieRsp = await mutate.mutateAsync({
        query: supabase
          .from("movies")
          .update({
            scheduled_release: data.scheduled_release,
            pricing_amount: data.pricing_amount,
            watching_option: data.watching_option.value,
            discounted_pricing_amount: data.discounted_pricing_amount,
          })
          .match({ id: movie_id }),
      });

      toast("Movie has been Update.");
      onClose();
    } catch (err) {
      console.log(err);
      toast.error("Error updating");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>{"Edit Movie Basic Information"}</DialogTitle>
          <DialogDescription>Add new language to the list</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitEdit)}
              className="space-y-2 w-full"
            >
              <FormField
                control={form.control}
                name="scheduled_release"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scheduled Release Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={form.formState.isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`watching_option`}
                render={({ field }) => {
                  // console.log({ field });

                  return (
                    <FormItem>
                      <FormLabel>Watch Option</FormLabel>
                      <FormControl>
                        <div className="z-[999]">
                          <AsyncSelect
                            defaultOptions={[
                              {
                                label: "rental",
                                value: "rental",
                              },
                              {
                                label: "free",
                                value: "free",
                              },
                              {
                                label: "paid",
                                value: "paid",
                              },
                            ]}
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
                name="pricing_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pricing Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={form.formState.isLoading}
                        placeholder="Pricing Amount"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discounted_pricing_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discounted Pricing Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={form.formState.isLoading}
                        placeholder="Discounted Pricing Amount"
                        {...field}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
