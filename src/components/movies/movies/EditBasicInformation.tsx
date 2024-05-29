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
import { useEffect, useMemo } from "react";
import { Skeleton } from "../../ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  AsyncCreatableSelect,
  AsyncSelect,
} from "@/components/ui/react-select";

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
  title: z.string().min(3),
  description: z.string().min(10),
  release_date: z.string(),
  movie_languages: z
    .array(
      z.object({
        value: z.string().uuid(),
        label: z.string(),
        _id: z.string().uuid().optional(),
      })
    )
    .min(1),
  duration: z.string(),

  movie_certificates: z
    .array(
      z.object({
        value: z.string().uuid(),
        label: z.string(),
        _id: z.string().uuid().optional(),
      })
    )
    .min(1),

  movie_genres: z
    .array(
      z.object({
        value: z.string().uuid(),
        label: z.string(),
        _id: z.string().uuid().optional(),
      })
    )
    .min(1),
  movie_tags: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        __isNew__: z.boolean().optional(),
        _id: z.string().uuid().optional(),
      })
    )
    .min(1),
});

type movieBasicType = z.infer<typeof formSchema>;

export function EditBasicInformation({
  open = false,
  defaultValues,
  onClose: onCloseProp,
  movie_id,
  select,
}: {
  open: boolean;
  defaultValues?: any;
  onClose?: () => void;
  movie_id: string;
}) {
  const rotuer = useRouter();
  const mutate = useMutationData();

  console.log({ defaultValues });

  const form = useForm<movieBasicType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  //   console.log(language.data);
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

  const onSubmitEdit = async (data: movieBasicType) => {
    console.log(data);

    console.log(parseInt(data.duration));
    try {
      const movieRsp = await mutate.mutateAsync({
        query: supabase
          .from("movies")
          .update({
            title: data.title,
            description: data.description,
            duration: data.duration,
            release_date: data.release_date,
          })
          .match({ id: movie_id }),
      });

      console.log({ movieRsp });

      const deleted_movie_languages = deletedIds(
        data.movie_languages,
        defaultValues.movie_languages
      );

      await Promise.all(
        deleted_movie_languages.map(async (language) => {
          const movieLanguages = await mutate.mutateAsync({
            query: supabase
              .from("movie_languages")
              .delete()
              .match({ id: language })
              .select(),
          });
        })
      );

      await Promise.all(
        data.movie_languages.map(async (language) => {
          if (language._id) return;
          const movieLanguages = await mutate.mutateAsync({
            query: supabase
              .from("movie_languages")
              .insert({
                movie_id: movie_id,
                language_id: language.value,
              })
              .select(),
          });
        })
      );

      const deleted_movie_genres = deletedIds(
        data.movie_genres,
        defaultValues.movie_genres
      );

      await Promise.all(
        deleted_movie_genres.map(async (id) => {
          const movie_genres = await mutate.mutateAsync({
            query: supabase
              .from("movie_genres")
              .delete()
              .match({ id: id })
              .select(),
          });
        })
      );

      await Promise.all(
        data.movie_genres.map(async (movie_genre) => {
          if (movie_genre._id) return;
          const movie_genres = await mutate.mutateAsync({
            query: supabase
              .from("movie_genres")
              .insert({
                movie_id: movie_id,
                genre_id: movie_genre.value,
              })
              .select(),
          });
        })
      );

      const deleted_movie_tags = deletedIds(
        data.movie_tags,
        defaultValues.movie_tags
      );

      await Promise.all(
        deleted_movie_tags.map(async (id) => {
          const movie_tags = await mutate.mutateAsync({
            query: supabase
              .from("movie_tags")
              .delete()
              .match({ id: id })
              .select(),
          });
        })
      );

      await Promise.all(
        data.movie_tags.map(async (tags) => {
          if (tags._id) return;
          let id = tags.value;
          if (tags.__isNew__) {
            const newtag = await mutate.mutateAsync({
              query: supabase
                .from("tags")
                .insert({
                  name: tags.label,
                })
                .select()
                .single(),
            });
            id = newtag.data.id;
          }

          const movieTags = await mutate.mutateAsync({
            query: supabase
              .from("movie_tags")
              .insert({
                movie_id: movie_id,
                tag_id: id,
              })
              .select(),
          });
        })
      );

      const deleted_movie_certificates = deletedIds(
        data.movie_certificates,
        defaultValues.movie_certificates
      );

      await Promise.all(
        deleted_movie_certificates.map(async (id) => {
          const movie_certificates = await mutate.mutateAsync({
            query: supabase
              .from("movie_certificates")
              .delete()
              .match({ id: id })
              .select(),
          });
        })
      );

      await Promise.all(
        data.movie_certificates.map(async (movie_certificate) => {
          if (movie_certificate._id) return;
          const movie_genres = await mutate.mutateAsync({
            query: supabase
              .from("movie_certificates")
              .insert({
                movie_id: movie_id,
                certificate_id: movie_certificate.value,
              })
              .select(),
          });
        })
      );

      console.log(movieRsp);

      toast("Movie has been Update.");
      onClose();
    } catch (err) {
      console.log(err);
      toast.error("Error updating");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>{"Edit Movie Basic Information"}</DialogTitle>
          <DialogDescription>Add new language to the list</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitEdit)}
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
                        disabled={form.formState.isLoading}
                        placeholder="Movie Title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Movie Description</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={form.formState.isLoading}
                        placeholder="Movie Description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Movie Duration in Seconds</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={form.formState.isLoading}
                        placeholder="Movie Duration"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="release_date"
                render={({ field }) => {
                  console.log({ field });
                  return (
                    <FormItem>
                      <FormLabel>Release Date</FormLabel>
                      <FormControl>
                        <Input
                          disabled={form.formState.isLoading}
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="movie_languages"
                render={({ field }) => {
                  const {
                    data: resultData,
                    count,
                    isFetching,
                  } = useFetchData({
                    query: supabase.from("languages").select("*"),
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
                          .from("languages")
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
                      <FormLabel>Languages</FormLabel>
                      <FormControl>
                        <AsyncSelect
                          loadOptions={loadOptions}
                          defaultOptions={initialOptions}
                          isMulti
                          cacheOptions
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="movie_certificates"
                render={({ field }) => {
                  const {
                    data: resultData,
                    count,
                    isFetching,
                  } = useFetchData({
                    query: supabase.from("certificates").select("*"),
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
                          .from("certificates")
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
                      <FormLabel>Movie Certificate</FormLabel>
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
              <FormField
                control={form.control}
                name="movie_genres"
                render={({ field }) => {
                  const {
                    data: resultData,
                    count,
                    isFetching,
                  } = useFetchData({
                    query: supabase.from("genres").select("*"),
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
                          .from("genres")
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
                      <FormLabel>Movie Genres</FormLabel>
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
              <FormField
                control={form.control}
                name="movie_tags"
                render={({ field }) => {
                  // console.log({ field });
                  const {
                    data: resultData,
                    count,
                    isFetching,
                  } = useFetchData({
                    query: supabase.from("tags").select("*"),
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
                          .from("tags")
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
                      <FormLabel>Movie Tags</FormLabel>
                      <FormControl>
                        <AsyncCreatableSelect
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
