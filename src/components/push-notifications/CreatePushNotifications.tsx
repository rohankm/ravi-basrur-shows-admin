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
  title: z.string(),
  body: z.string(),
});

type CreatePushNotificationsType = z.infer<typeof formSchema>;

export function CreatePushNotifications({ open = false }: { open: boolean }) {
  const rotuer = useRouter();
  const mutate = useMutationData();
  const defaultValues = {};

  const form = useForm<CreatePushNotificationsType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onClose = () => {
    form.reset(defaultValues);
    rotuer.back();
  };

  const onSubmit = async (data: CreatePushNotificationsType) => {
    console.log(data);
    try {
      const rsp = await mutate.mutateAsync({
        query: supabase.from("push_notifications").insert(data).select("*"),
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
          <DialogTitle>{"Add Notification"}</DialogTitle>
          {/* <DialogDescription>Add new tag to the list</DialogDescription> */}
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 w-full"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
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
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body</FormLabel>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
