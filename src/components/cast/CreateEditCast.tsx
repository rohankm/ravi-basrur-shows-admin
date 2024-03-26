"use client";
import { CalendarIcon, Copy } from "lucide-react";

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
import { ScrollArea } from "../ui/scroll-area";
import { supabase } from "@/lib/supabase/client";
import useMutationData from "@/hooks/supabase/useMutationData";
import { toast } from "sonner";
import useFetchData from "@/hooks/supabase/useFetchData";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { Textarea } from "../ui/textarea";
import UppyComponent from "../ui/UppyComponent";
import useUploadToStorage from "@/hooks/supabase/uploadToStorage";
import Uppy from "@uppy/core";
import useUpsertToStorage from "@/hooks/supabase/upsertToStorage";
const formSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  biography: z.string().nullable(),
  birth_date: z.date({
    required_error: "A date of birth is required.",
  }),
  profile_picture: z.union([
    z.string(), // For URLs
    z.any(), // For File objects
  ]),
});

type CastType = z.infer<typeof formSchema>;

export function CreateEditCast({
  open = false,
  editCastId,
}: {
  open: boolean;
  editCastId?: string | null | undefined;
}) {
  const edit = !!editCastId;
  const rotuer = useRouter();
  const mutate = useMutationData();
  const defaultValues = {
    first_name: "",
    last_name: "",
    biography: "",
    birth_date: new Date(),
    profile_picture: "",
  };

  const form = useForm<CastType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const cast = useFetchData({
    query: supabase
      .from("cast_information")
      .select()
      .match({ id: editCastId })
      .single(),
    options: {
      enabled: edit,
    },
  });

  useEffect(() => {
    console.log("CALLED", cast.data);
    if (cast.data)
      //@ts-ignore
      form.reset({ ...cast.data, birth_date: new Date(cast.data.birth_date) });
    else form.reset(defaultValues);
  }, [cast.data]);

  const onClose = async () => {
    form.reset(defaultValues);
    rotuer.back();
  };

  const upsertFile = useUpsertToStorage();

  const onSubmit = async (data: CastType) => {
    console.log(data);
    try {
      const uploadId = await upsertFile({
        image: data.profile_picture,
        bucket: "cast_images",
      });

      console.log(uploadId);
      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("cast_information")
          .insert({
            first_name: data.first_name,
            last_name: data.last_name,
            biography: data.biography,
            birth_date: format(data.birth_date, "yyyy-MM-dd"),
            profile_picture: uploadId,
          })
          .select(),
      });

      console.log(rsp);

      if (rsp.data) {
        toast("Cast has been created.");

        onClose();
      }
    } catch (err) {
      console.log(err);
      toast.error("Error Adding Cast");
    }
  };

  const onSubmitEdit = async (data: CastType) => {
    console.log(data);
    try {
      if (!cast.data) return;

      const uploadId = await upsertFile({
        image: data.profile_picture,
        originalImage: cast.data.profile_picture,
        bucket: "cast_images",
      });

      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("cast_information")
          .update({
            first_name: data.first_name,
            last_name: data.last_name,
            biography: data.biography,
            birth_date: format(data.birth_date, "yyyy-MM-dd"),
            profile_picture: uploadId,
          })
          .match({ id: cast.data.id })
          .select(),
      });

      console.log(rsp);

      if (rsp.data) {
        toast("Cast has been updated.");

        onClose();
      }
    } catch (err) {
      console.log(err);
      toast.error("Error updating cast");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-lg" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>{edit ? "Edit Cast" : "Add Cast"}</DialogTitle>
          <DialogDescription>Add new cast to the list</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          {edit && cast.isLoading && (
            <ScrollArea className=" h-[70vh] w-full mb-5 ">
              <Skeleton className="w-full h-20" />
            </ScrollArea>
          )}
          {!cast.isLoading && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(edit ? onSubmitEdit : onSubmit)}
                className="space-y-2 w-full"
              >
                <div className="flex gap-2 flex-col px-1 max-h-[70vh] overflow-y-auto mb-5">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
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
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
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
                    name="biography"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biography</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Type Here"
                            className="resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birth_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col ">
                        <FormLabel className="mt-2">Date of birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  " pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="profile_picture"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Pic</FormLabel>
                        <FormControl>
                          <UppyComponent field={field} bucket={"cast_images"} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  disabled={form.formState.isSubmitting}
                  className="ml-auto w-full "
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
