"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Calendar } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DatetimePicker } from "../../extension/datetime-picker";

const formSchema = z.object({
  datetime: z.date().optional(),
});

type Form = z.infer<typeof formSchema>;

const DateTimePickerZod = () => {
  const [_, setFormData] = useState<Form | null>(null);
  const form = useForm<Form>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      datetime: new Date(),
    },
    shouldUseNativeValidation: true,
  });

  const onSubmit = (data: Form) => {
    if (!data.datetime) return;
    setFormData((prev) => ({ ...prev, ...data }));
    toast.success("Form submitted : " + JSON.stringify(data, null, 2));
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        className="grid gap-y-5 bg-background p-4 rounded-md shadow-md"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <>
          <div className="flex gap-2 pb-2">
            <Calendar className="w-6 h-6" />
            <p className="text-md font-semibold text-right">
              Let&apos;s get this on the books.
            </p>
          </div>
          <FormField
            control={form.control}
            name="datetime"
            render={({ field }) => {
              return (
                <FormControl>
                  <>
                    <FormItem>
                      <FormLabel
                        htmlFor={field.name}
                        className="text-xs text-center sr-only"
                      >
                        Let&apos;s put it in the books
                      </FormLabel>
                      <DatetimePicker
                        {...field}
                        format={[
                          ["months", "days", "years"],
                          ["hours", "minutes", "am/pm"],
                        ]}
                      />
                    </FormItem>
                    <FormMessage />
                  </>
                </FormControl>
              );
            }}
          />
        </>
        <div className="w-full flex justify-start items-center gap-x-4">
          <Button
            type="submit"
            variant="ghost"
            className="w-fit ml-auto"
            size="sm"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DateTimePickerZod;
