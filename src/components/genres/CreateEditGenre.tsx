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
import { ScrollArea } from "../ui/scroll-area";
import { supabase } from "@/lib/supabase/client";
import useMutationData from "@/hooks/supabase/useMutationData";
import { toast } from "sonner";
import useFetchData from "@/hooks/supabase/useFetchData";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

const formSchema = z.object({
  name: z.string().min(3),
});

type GenreType = z.infer<typeof formSchema>;

export function CreateEditGenre({
  open = false,
  editGenreId,
}: {
  open: boolean;
  editGenreId?: string | null | undefined;
}) {
  const edit = !!editGenreId;
  const rotuer = useRouter();
  const mutate = useMutationData();
  const defaultValues = {
    name: "",
  };

  const form = useForm<GenreType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const genre = useFetchData({
    query: supabase.from("genres").select().match({ id: editGenreId }).single(),
    options: {
      enabled: edit,
    },
  });

  console.log(genre.data);
  useEffect(() => {
    if (genre.data) form.reset(genre.data);
    else form.reset(defaultValues);
  }, [genre.data]);

  const onClose = () => {
    form.reset(defaultValues);
    rotuer.back();
  };

  const onSubmit = async (data: GenreType) => {
    console.log(data);
    try {
      const rsp = await mutate.mutateAsync({
        query: supabase.from("genres").insert({ name: data.name }).select(),
      });

      console.log(rsp);

      if (rsp.data) {
        toast("Genre has been created.");

        onClose();
      }
    } catch (err) {
      toast.error("Error Adding Genre");
    }
  };

  const onSubmitEdit = async (data: GenreType) => {
    console.log(data);
    try {
      if (!genre.data) return;
      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("genres")
          .update({ name: data.name })
          .match({ id: genre.data.id })
          .select(),
      });

      console.log(rsp);

      if (rsp.data) {
        toast("Genre has been updated.");

        onClose();
      }
    } catch (err) {
      toast.error("Error updating genre");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>{edit ? "Edit Genre" : "Add Genre"}</DialogTitle>
          <DialogDescription>Add new genre to the list</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          {edit && genre.isLoading && <Skeleton className="w-full h-20" />}
          {!genre.isLoading && (
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
                      <FormLabel>Genre name</FormLabel>
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
