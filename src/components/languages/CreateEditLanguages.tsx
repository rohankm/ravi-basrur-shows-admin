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
  native_name: z.string().min(1),
  code: z.string().length(2),
});

type LanguagesType = z.infer<typeof formSchema>;

export function CreateEditLanguage({
  open = false,
  editLanguageId,
}: {
  open: boolean;
  editLanguageId?: string | null | undefined;
}) {
  const edit = !!editLanguageId;
  const rotuer = useRouter();
  const mutate = useMutationData();
  const defaultValues = {
    name: "",
    native_name: "",
    code: "",
  };

  const form = useForm<LanguagesType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const language = useFetchData({
    query: supabase
      .from("languages")
      .select()
      .match({ id: editLanguageId })
      .single(),
    options: {
      enabled: edit,
    },
  });

  console.log(language.data);
  useEffect(() => {
    if (language.data) form.reset(language.data);
  }, [language.data]);

  const onClose = () => {
    form.reset(defaultValues);
    rotuer.back();
  };

  const onSubmit = async (data: LanguagesType) => {
    console.log(data);
    try {
      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("languages")
          .insert({
            name: data.name,
            code: data.code,
            native_name: data.native_name,
          })
          .select(),
      });

      console.log(rsp);

      if (rsp.data) {
        toast("Language has been created.");

        onClose();
      }
    } catch (err) {
      toast.error("Error Adding Language");
    }
  };

  const onSubmitEdit = async (data: LanguagesType) => {
    console.log(data);
    try {
      if (!language.data) return;
      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("languages")
          .update({
            name: data.name,
            code: data.code,
            native_name: data.native_name,
          })
          .match({ id: language.data.id })
          .select(),
      });

      console.log(rsp);

      if (rsp.data) {
        toast("Language has been created.");

        onClose();
      }
    } catch (err) {
      toast.error("Error updating language");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>{edit ? "Edit Language" : "Add Language"}</DialogTitle>
          <DialogDescription>Add new language to the list</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          {edit && language.isLoading && <Skeleton className="w-full h-20" />}
          {!language.isLoading && (
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
                      <FormLabel>Language name</FormLabel>
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
                  name="native_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Native Language name</FormLabel>
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
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language Code</FormLabel>
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
