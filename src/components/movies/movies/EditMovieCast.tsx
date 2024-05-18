"use client";
import { AlertTriangleIcon, Copy, Trash2Icon } from "lucide-react";

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
import { useFieldArray, useForm } from "react-hook-form";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

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
  movie_cast: z
    .array(
      z.object({
        role_id: z.object({
          value: z.string().uuid(),
          label: z.string(),
        }),
        cast_ids: z
          .array(
            z.object({
              value: z.string().uuid(),
              label: z.string(),
              _id: z.string().uuid().optional(),
            })
          )
          .min(1),
        _id: z.string().uuid().optional(),
      })
    )
    .min(1),
});

type movieBasicType = z.infer<typeof formSchema>;

export function EditMovieCast({
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

  console.log("sdfd", { defaultValues });

  const form = useForm<movieBasicType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const {
    formState: { errors },
  } = form;

  console.log(errors);
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
  const movie_cast = useFieldArray({
    control: form.control,

    name: "movie_cast",
  });

  const onSubmitEdit = async (data: movieBasicType) => {
    console.log(data);
    const deleted_ids = deletedIds(data.movie_cast, defaultValues.movie_cast);

    console.log({ deleted_ids });

    deleted_ids.map(async (d) => {
      const find = defaultValues.movie_cast.find((dd) => dd._id == d);

      console.log({ find });
      await Promise.all(
        find.cast_ids.map(async (dd) => {
          const movie_genres = await mutate.mutateAsync({
            query: supabase
              .from("movie_cast")
              .delete()
              .match({ id: dd._id })
              .select(),
          });
        })
      );
    });

    try {
      await Promise.all(
        data.movie_cast.map(async (movie_cast, index) => {
          if (movie_cast._id) {
            const deleted_ids = deletedIds(
              movie_cast.cast_ids,
              defaultValues.movie_cast[index].cast_ids
            );
            console.log({ deleted_ids });
            await Promise.all(
              deleted_ids.map(async (id) => {
                const movie_genres = await mutate.mutateAsync({
                  query: supabase
                    .from("movie_cast")
                    .delete()
                    .match({ id: id })
                    .select(),
                });
              })
            );
          }

          console.log({ movie_cast });
          const find = defaultValues.movie_cast.find(
            (dd) => movie_cast._id == dd._id
          );

          // console.log({ find }, find.role_id, movie_cast.role_id);

          await Promise.all(
            movie_cast.cast_ids.map(async (cast_id) => {
              if (find?.role_id?.value !== movie_cast.role_id.value) {
                try {
                  const movieGenre = await mutate.mutateAsync({
                    query: supabase
                      .from("movie_cast")
                      .update({
                        role_id: movie_cast.role_id.value,
                        cast_id: cast_id.value,
                      })
                      .match({ id: cast_id._id })
                      .select(),
                  });
                } catch (err) {}
              }

              if (cast_id._id) return;
              const movieGenre = await mutate.mutateAsync({
                query: supabase.from("movie_cast").insert({
                  movie_id: movie_id,
                  role_id: movie_cast.role_id.value,
                  cast_id: cast_id.value,
                }),
              });
            })
          );
        })
      );

      toast("Movie has been Update.");
      onClose();
    } catch (err) {
      console.log(err);
      toast.error("Error updating");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-3xl max-h-[90vh] overflow-y-auto "
        onClose={onClose}
      >
        <DialogHeader>
          <DialogTitle>{"Edit Movie Cast"}</DialogTitle>
          <DialogDescription>Add new language to the list</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 h-full ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitEdit)}
              className="space-y-2 w-full  h-full"
            >
              {movie_cast.fields?.map((field, index) => {
                return (
                  <Accordion type="single" defaultValue="item-1" key={field.id}>
                    <AccordionItem value="item-1">
                      <AccordionTrigger
                        className={cn(
                          "[&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden relative !no-underline",
                          errors?.movie_cast?.[index] && "text-red-700"
                        )}
                      >
                        {`Cast ${index + 1}`}

                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute right-8"
                          disabled={movie_cast.fields.length == 1}
                          onClick={() => {
                            if (movie_cast.fields.length == 1) return;
                            movie_cast.remove(index);
                          }}
                        >
                          <Trash2Icon className="h-4 w-4 " />
                        </Button>
                        {errors?.movie_cast?.[index] && (
                          <span className="absolute alert right-8">
                            <AlertTriangleIcon className="h-4 w-4   text-red-700" />
                          </span>
                        )}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div
                          className={cn(
                            "md:grid z-[999] md:grid-cols-2 gap-8 border p-4 rounded-md relative mb-4"
                          )}
                        >
                          <FormField
                            control={form.control}
                            name={`movie_cast.${index}.role_id`}
                            render={({ field }) => {
                              // console.log("asdsd", { field });
                              const {
                                data: resultData,
                                count,
                                isFetching,
                              } = useFetchData({
                                query: supabase.from("cast_roles").select("*"),
                              });
                              const initialOptions = useMemo(() => {
                                if (!resultData) {
                                  return [];
                                }

                                return resultData.map((d) => {
                                  return {
                                    value: d.id,
                                    label: d.name,
                                  };
                                });
                              }, [resultData]);
                              const loadOptions = (inputValue: string) =>
                                new Promise<{ value: string; label: string }[]>(
                                  async (resolve) => {
                                    if (!inputValue) resolve([]);

                                    const { data, error } = await supabase
                                      .from("cast_roles")
                                      .select("*")
                                      .ilike("name", `%${inputValue}%`);

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
                                          label: d.name,
                                        };
                                      })
                                    );
                                  }
                                );

                              // console.log({ field });

                              return (
                                <FormItem>
                                  <FormLabel>Role</FormLabel>
                                  <FormControl>
                                    <div className="z-[999]">
                                      <AsyncSelect
                                        loadOptions={loadOptions}
                                        cacheOptions
                                        defaultOptions={initialOptions}
                                        // isDisabled={true}
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
                            name={`movie_cast.${index}.cast_ids`}
                            render={({ field }) => {
                              const {
                                data: resultData,
                                count,
                                isFetching,
                              } = useFetchData({
                                query: supabase
                                  .from("cast_information")
                                  .select("*"),
                              });
                              const initialOptions = useMemo(() => {
                                if (!resultData) {
                                  return [];
                                }

                                return resultData.map((d) => {
                                  return {
                                    value: d.id,
                                    label: d.first_name + " " + d.last_name,
                                  };
                                });
                              }, [resultData]);

                              const loadOptions = (inputValue: string) =>
                                new Promise<{ value: string; label: string }[]>(
                                  async (resolve) => {
                                    if (!inputValue) resolve([]);

                                    const { data, error } = await supabase
                                      .from("cast_information")
                                      .select("*")
                                      .ilike("first_name", `%${inputValue}%`);

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
                                          label:
                                            d.first_name + " " + d.last_name,
                                        };
                                      })
                                    );
                                  }
                                );

                              // console.log({ field });

                              return (
                                <FormItem>
                                  <FormLabel>Cast</FormLabel>
                                  <FormControl>
                                    <AsyncSelect
                                      loadOptions={loadOptions}
                                      isMulti
                                      cacheOptions
                                      defaultOptions={initialOptions}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              );
                            }}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              })}

              <div className="flex justify-center mt-4">
                <Button
                  type="button"
                  className="flex justify-center"
                  size={"lg"}
                  onClick={() =>
                    movie_cast.append({
                      cast_ids: [],
                      role_id: {
                        label: "",
                        value: "",
                      },
                    })
                  }
                >
                  Add More
                </Button>
              </div>

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
