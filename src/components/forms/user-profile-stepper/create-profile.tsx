"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import {
  AsyncCreatableSelect,
  AsyncSelect,
} from "@/components/ui/react-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangleIcon, Trash, Trash2Icon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

import * as z from "zod";

export const CompleteMovieSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  release_year: z.string(),
  scheduled_release: z.string(),
  is_released: z.boolean(),

  movie_languages: z.array(
    z.object({
      value: z.string().uuid(),
      label: z.string(),
    })
  ),

  movie_certificates: z.array(
    z.object({
      value: z.string().uuid(),
      label: z.string(),
    })
  ),

  movie_genres: z.array(
    z.object({
      value: z.string().uuid(),
      label: z.string(),
    })
  ),
  movie_tags: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
      __isNew__: z.boolean().optional(),
    })
  ),

  movie_cast: z.array(
    z.object({
      role_id: z.object({
        value: z.string().uuid(),
        label: z.string(),
      }),
      cast_ids: z.array(
        z.object({
          value: z.string().uuid(),
          label: z.string(),
        })
      ),
    })
  ),

  movie_posters: z.array(
    z.object({
      url: z.string(),
      type: z.string(),
    })
  ),

  movie_videos: z.array(
    z.object({
      url: z.string(),
      type: z.string(),
    })
  ),
});

type CompleteMovie = z.infer<typeof CompleteMovieSchema>;

interface ProfileFormType {
  categories: any;
}

export const CreateProfileOne: React.FC<ProfileFormType> = ({ categories }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const title = "Create Movie";
  const description =
    "To create movie, we first need some basic information about you.";

  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({});
  const delta = currentStep - previousStep;

  const defaultValues = {
    movie_cast: [
      {
        cast_id: "",
        role_id: "",
      },
    ],
  };

  const form = useForm<CompleteMovie>({
    resolver: zodResolver(CompleteMovieSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    control,
    formState: { errors },
  } = form;

  const movie_cast = useFieldArray({
    control,
    name: "movie_cast",
  });

  const movie_posters = useFieldArray({
    control,
    name: "movie_posters",
  });
  const movie_videos = useFieldArray({
    control,
    name: "movie_videos",
  });

  const onSubmit = async (data: CompleteMovie) => {
    try {
      setLoading(true);

      router.refresh();
      router.push(`/dashboard/products`);
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      //   await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const processForm: SubmitHandler<CompleteMovie> = (data) => {
    console.log("data ==>", data);
    setData(data);
    // api call and reset
    // form.reset();
  };

  type FieldName = keyof CompleteMovie;

  const steps = [
    {
      id: "Step 1",
      name: "Basic Information",
      fields: [
        "title",
        "description",
        "release_year",
        "scheduled_release",
        // "is_released",
        "movie_languages",
        "movie_certificates",
        "movie_genres",
        "movie_tags",
      ],
    },
    {
      id: "Step 2",
      name: "Add Cast",
      // fields are mapping and flattening for the error to be trigger  for the dynamic fields
      fields: movie_cast.fields
        ?.map((_, index) => [
          `movie_cast.${index}.cast_ids`,
          `movie_cast.${index}.role_id`,
          // Add other field names as needed
        ])
        .flat(),
    },
    {
      id: "Step 3",
      name: "Media",
      // fields: [
      //   movie_posters.fields
      //     ?.map((_, index) => [
      //       `movie_posters.${index}.url`,
      //       `movie_posters.${index}.type`,
      //       // Add other field names as needed
      //     ])
      //     .flat(),
      //   movie_videos.fields
      //     ?.map((_, index) => [
      //       `movie_videos.${index}.url`,
      //       `movie_videos.${index}.type`,
      //       // Add other field names as needed
      //     ])
      //     .flat(),
      // ],
    },
  ];

  const next = async () => {
    const fields = steps[currentStep].fields;

    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: true,
    });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await form.handleSubmit(processForm)();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <div>
        <ul className="flex gap-4">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              {currentStep > index ? (
                <div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-sky-600 transition-colors ">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-sky-600">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex h-full w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-gray-500 transition-colors">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(processForm)}
          className="space-y-8 w-full"
        >
          <div className={cn("md:grid max-w-xl gap-5")}>
            {currentStep === 0 && (
              <>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
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
                          disabled={loading}
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
                  name="release_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Release Date</FormLabel>
                      <FormControl>
                        <Input disabled={loading} type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="scheduled_release"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scheduled Release Date</FormLabel>
                      <FormControl>
                        <Input type="date" disabled={loading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="movie_languages"
                  render={({ field }) => {
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
                            isMulti
                            cacheOptions
                            defaultOptions
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
                            defaultOptions
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
                            defaultOptions
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
                            defaultOptions
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </>
            )}
            {currentStep === 1 && (
              <>
                {movie_cast.fields?.map((field, index) => (
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue="item-1"
                    key={field.id}
                  >
                    <AccordionItem value="item-1">
                      <AccordionTrigger
                        className={cn(
                          "[&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden relative !no-underline",
                          errors?.movie_cast?.[index] && "text-red-700"
                        )}
                      >
                        {`Work Experience ${index + 1}`}

                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute right-8"
                          onClick={() => movie_cast.remove(index)}
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
                            "md:grid md:grid-cols-3 gap-8 border p-4 rounded-md relative mb-4"
                          )}
                        >
                          <FormField
                            control={form.control}
                            name={`movie_cast.${index}.role_id`}
                            render={({ field }) => {
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
                                    <AsyncSelect
                                      loadOptions={loadOptions}
                                      cacheOptions
                                      defaultOptions
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
                            name={`movie_cast.${index}.cast_ids`}
                            render={({ field }) => {
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
                                      defaultOptions
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
                ))}

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
              </>
            )}
            {currentStep === 2 && (
              <div>
                <h1>Completed</h1>
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(data)}
                </pre>
              </div>
            )}
          </div>

          {/* <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button> */}
        </form>
      </Form>
      {/* Navigation */}
      <div className="mt-8 pt-5">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={currentStep === 0}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            disabled={currentStep === steps.length - 1}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};
