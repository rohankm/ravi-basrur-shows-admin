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

const formSchema = z.object({
  name: z.string().min(3),
});

type TagType = z.infer<typeof formSchema>;

export function CreateEditTag({
  open = false,
  editTagId,
}: {
  open: boolean;
  editTagId?: string | null | undefined;
}) {
  const edit = !!editTagId;
  const rotuer = useRouter();
  const mutate = useMutationData();
  const defaultValues = {
    name: "",
  };

  const form = useForm<TagType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const tag = useFetchData({
    query: supabase.from("tags").select().match({ id: editTagId }).single(),
    options: {
      enabled: edit,
    },
  });

  console.log(tag.data);
  useEffect(() => {
    if (tag.data) form.reset(tag.data);
    else form.reset(defaultValues);
  }, [tag.data]);

  const onClose = () => {
    form.reset(defaultValues);
    rotuer.back();
  };

  const onSubmit = async (data: TagType) => {
    console.log(data);
    try {
      const rsp = await mutate.mutateAsync({
        query: supabase.from("tags").insert({ name: data.name }).select(),
      });

      console.log(rsp);

      if (rsp.data) {
        toast("Tag has been created.");

        onClose();
      }
    } catch (err) {
      toast.error("Error Adding Tag");
    }
  };

  const onSubmitEdit = async (data: TagType) => {
    console.log(data);
    try {
      if (!tag.data) return;
      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("tags")
          .update({ name: data.name })
          .match({ id: tag.data.id })
          .select(),
      });

      console.log(rsp);

      if (rsp.data) {
        toast("Tag has been updated.");

        onClose();
      }
    } catch (err) {
      console.log("err tag", err);
      toast.error("Error updating tag");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>{edit ? "Edit Tag" : "Add Tag"}</DialogTitle>
          <DialogDescription>Add new tag to the list</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          {edit && tag.isLoading && <Skeleton className="w-full h-20" />}
          {!tag.isLoading && (
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
                      <FormLabel>Tag name</FormLabel>
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
