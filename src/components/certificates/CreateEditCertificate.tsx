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
  name: z.string().min(1),
});

type CertificateType = z.infer<typeof formSchema>;

export function CreateEditCertificate({
  open = false,
  editCertificateId,
}: {
  open: boolean;
  editCertificateId?: string | null | undefined;
}) {
  const edit = !!editCertificateId;
  const rotuer = useRouter();
  const mutate = useMutationData();
  const defaultValues = {
    name: "",
  };

  const form = useForm<CertificateType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const certificate = useFetchData({
    query: supabase
      .from("certificates")
      .select()
      .match({ id: editCertificateId })
      .single(),
    options: {
      enabled: edit,
    },
  });

  console.log(certificate.data);
  useEffect(() => {
    if (certificate.data) form.reset(certificate.data);
    else form.reset(defaultValues);
  }, [certificate.data]);

  const onClose = () => {
    form.reset(defaultValues);
    rotuer.back();
  };

  const onSubmit = async (data: CertificateType) => {
    console.log(data);
    try {
      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("certificates")
          .insert({ name: data.name })
          .select(),
      });

      console.log(rsp);

      if (rsp.data) {
        toast("Certificate has been created.");

        onClose();
      }
    } catch (err) {
      toast.error("Error Adding Certificate");
    }
  };

  const onSubmitEdit = async (data: CertificateType) => {
    console.log(data);
    try {
      if (!certificate.data) return;
      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("certificates")
          .update({ name: data.name })
          .match({ id: certificate.data.id })
          .select(),
      });

      console.log(rsp);

      if (rsp.data) {
        toast("Certificate has been updated.");

        onClose();
      }
    } catch (err) {
      toast.error("Error updating certificate");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>
            {edit ? "Edit Certificate" : "Add Certificate"}
          </DialogTitle>
          <DialogDescription>Add new certificate to the list</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          {edit && certificate.isLoading && (
            <Skeleton className="w-full h-20" />
          )}
          {!certificate.isLoading && (
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
                      <FormLabel>Certificate name</FormLabel>
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
