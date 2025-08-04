"use client";

import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/registry/new-york/extension/multi-select";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const form = z.object({
  value: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    )
    .nonempty("Please select at least one person"),
});

type Form = z.infer<typeof form>;

const users = [
  {
    name: "ThePrimeagen",
  },
  {
    name: "Shadcn",
  },
  {
    name: "Theo",
  },
];

const MultiSelectZod = () => {
  const multiForm = useForm<Form>({
    resolver: zodResolver(form),
    defaultValues: form.parse({
      value: [
        {
          value: users[0].name,
          label: users[0].name,
        },
      ],
    }),
  });

  const onSubmit = (data: Form) => {
    toast.success("Form submitted : " + JSON.stringify(data, null, 2));
  };

  return (
    <Form {...multiForm}>
      <form
        onSubmit={multiForm.handleSubmit(onSubmit)}
        className="space-y-3 grid gap-3 w-full"
      >
        <FormField
          control={multiForm.control}
          name="value"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Invite people</FormLabel>
              <MultiSelector
                onValuesChange={field.onChange}
                values={field.value}
              >
                <MultiSelectorTrigger>
                  <MultiSelectorInput placeholder="Select people to invite" />
                </MultiSelectorTrigger>
                <MultiSelectorContent>
                  <MultiSelectorList>
                    {users.map((user) => (
                      <MultiSelectorItem
                        key={user.name}
                        value={user.name}
                        label={user.name}
                      >
                        <span>{user.name}</span>
                      </MultiSelectorItem>
                    ))}
                  </MultiSelectorList>
                </MultiSelectorContent>
              </MultiSelector>
              <FormDescription>
                Select people to invite to this event
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default MultiSelectZod;
