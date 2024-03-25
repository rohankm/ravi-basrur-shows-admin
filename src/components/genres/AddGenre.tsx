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

const formSchema = z.object({
  name: z.string().min(3),
});

type GenreType = z.infer<typeof formSchema>;

export function AddGenre({ open = false }: { open: boolean }) {
  const rotuer = useRouter();
  const mutate = useMutationData();
  const defaultValues = {
    name: "",
  };

  const form = useForm<GenreType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onClose = () => {
    form.reset();
    rotuer.back();
  };

  const onSubmit = async (data: GenreType) => {
    console.log(data);

    const rsp = await mutate.mutateAsync({
      query: supabase.from("genres").insert({ name: data.name }).select(),
    });

    console.log(rsp);

    if (rsp.data) {
      toast("Genre has been created.");

      onClose();
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Add Genre</DialogTitle>
          <DialogDescription>Add new genre to the list</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
