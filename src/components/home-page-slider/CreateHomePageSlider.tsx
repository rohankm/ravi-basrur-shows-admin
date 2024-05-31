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

import { supabase } from "@/lib/supabase/client";
import useMutationData from "@/hooks/supabase/useMutationData";
import { toast } from "sonner";
import useFetchData from "@/hooks/supabase/useFetchData";
import { useEffect, useMemo } from "react";

import { AsyncSelect } from "../ui/react-select";

const formSchema = z.object({
  movie: z.object({
    label: z.string(),
    value: z.string().uuid(),
  }),
});

type CreateHomePageSliderType = z.infer<typeof formSchema>;

export function CreateHomePageSlider({ open = false }: { open: boolean }) {
  const rotuer = useRouter();
  const mutate = useMutationData();
  const defaultValues = {};

  const form = useForm<CreateHomePageSliderType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onClose = () => {
    form.reset(defaultValues);
    rotuer.back();
  };

  const onSubmit = async (data: CreateHomePageSliderType) => {
    console.log(data);
    try {
      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("home_slider")
          .insert({ movies_id: data.movie.value })
          .select("*,movies(*)"),
      });

      console.log(rsp);

      if (rsp.data) {
        toast("Added Successfully.");

        onClose();
      }
    } catch (err) {
      toast.error("Error Adding");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>{"Add Movie"}</DialogTitle>
          <DialogDescription>Add new tag to the list</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 w-full"
            >
              <FormField
                control={form.control}
                name="movie"
                render={({ field }) => {
                  const {
                    data: resultData,
                    count,
                    isFetching,
                  } = useFetchData({
                    query: supabase.from("movies").select("*"),
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
                          .ilike("title", `%${inputValue}%`);

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
                        <AsyncSelect
                          loadOptions={loadOptions}
                          defaultOptions={initialOptions}
                          cacheOptions
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
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
