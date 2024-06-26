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
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase/client";
import useMutationData from "@/hooks/supabase/useMutationData";
import { toast } from "sonner";
import useFetchData from "@/hooks/supabase/useFetchData";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  name: z.string().min(3),
  priority: z.string(),
});

type CastRoleType = z.infer<typeof formSchema>;

export function CreateEditCastRole({
  open = false,
  editCastRoleId,
}: {
  open: boolean;
  editCastRoleId?: string | null | undefined;
}) {
  const edit = !!editCastRoleId;
  const rotuer = useRouter();
  const mutate = useMutationData();
  const defaultValues = {
    name: "",
  };

  const form = useForm<CastRoleType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const castRole = useFetchData({
    query: supabase
      .from("cast_roles")
      .select()
      .match({ id: editCastRoleId })
      .single(),
    options: {
      enabled: edit,
    },
  });

  console.log(castRole.data);
  useEffect(() => {
    if (castRole.data) form.reset(castRole.data);
    else form.reset(defaultValues);
  }, [castRole.data]);

  const onClose = () => {
    form.reset(defaultValues);
    rotuer.back();
  };

  const onSubmit = async (data: CastRoleType) => {
    console.log(data);
    try {
      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("cast_roles")
          .insert({ name: data.name, priority: data.priority })
          .select(),
      });

      console.log(rsp);

      if (rsp.data) {
        toast("Cast Role has been created.");

        onClose();
      }
    } catch (err) {
      toast.error("Error Adding Cast Role");
    }
  };

  const onSubmitEdit = async (data: CastRoleType) => {
    console.log(data);
    try {
      if (!castRole.data) return;
      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("cast_roles")
          .update({ name: data.name, priority: data.priority })
          .match({ id: castRole.data.id })
          .select(),
      });

      console.log(rsp);

      if (rsp.data) {
        toast("Cast Role has been updated.");

        onClose();
      }
    } catch (err) {
      toast.error("Error updating Cast Role");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>{edit ? "Edit Cast Role" : "Add Cast Role"}</DialogTitle>
          <DialogDescription>Add new Cast Role to the list</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          {edit && castRole.isLoading && <Skeleton className="w-full h-20" />}
          {!castRole.isLoading && (
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
                      <FormLabel>Cast role name</FormLabel>
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
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
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
