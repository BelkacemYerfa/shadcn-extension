"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
import { SmartDatetimeInput } from "@/registry/default/extension/smart-datetime-input";

export default function ExamplePage() {
  return (
    <main className="py-28 max-w-md w-full mx-auto">
      <SmartDatetimeInputZod />
    </main>
  );
}

const formSchema = z.object({
  name: z.string().min(3, { message: "Name is required" }),
  datetime: z.date(),
});

type Form = z.infer<typeof formSchema>;

const SmartDatetimeInputZod = () => {
  const form = useForm<Form>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      datetime: undefined,
    },
    shouldUseNativeValidation: true,
  });

  const onSubmit = (data: Form) => {
    if (!data.datetime) return;
    toast.success("Form submitted : " + JSON.stringify(data, null, 2));
  };

  return (
    <Form {...form}>
      <form
        className="grid gap-y-5 bg-background p-4 rounded-md shadow-md"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <>
          <div className="flex gap-2 pb-2">
            <CalendarIcon className="w-6 h-6" />
            <p className="text-md font-semibold text-right">
              What&apos;s the best time for you?
            </p>
          </div>
          <FormField
            control={form.control}
            name="datetime"
            render={({ field }) => {
              return (
                <FormControl>
                  <>
                    <FormLabel
                      htmlFor={field.name}
                      className="text-xs text-center sr-only"
                    >
                      Enter your next available appointment date
                    </FormLabel>
                    <FormItem>
                      <SmartDatetimeInput
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="e.g. Tomorrow morning 9am"
                      />
                    </FormItem>
                    <FormMessage />
                  </>
                </FormControl>
              );
            }}
          />
        </>
        <div className="w-full flex justify-start gap-x-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormControl>
                  <>
                    <FormLabel
                      htmlFor={field.name}
                      className="text-xs mb-0 pb-0 sr-only"
                    >
                      Name
                    </FormLabel>
                    <div className="w-full flex flex-col items-start gap-1">
                      <FormItem>
                        <Input {...field} type="text" placeholder="Your name" />
                      </FormItem>
                      <FormMessage />
                    </div>
                  </>
                </FormControl>
              );
            }}
          />
          <Button type="submit" className="w-fit ml-auto" size="sm">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};
