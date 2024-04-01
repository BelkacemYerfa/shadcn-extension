"use client";

import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/registry/default/extension/multi-select";
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

export default function ExamplePage() {
  return (
    <main className="py-20 max-w-1/2 mx-auto ">
      <div className="p-5 bg-muted rounded-md w-full">
        <RTLComponentSupport />
      </div>
    </main>
  );
}

const form = z.object({
  value: z.array(z.string()).nonempty("Please select at least one person"),
});

type Form = z.infer<typeof form>;

const users = [
  {
    name: "ThePrimeagen",
    picture:
      "https://pbs.twimg.com/profile_images/1759330620160049152/2i_wkOoK_400x400.jpg",
  },
  {
    name: "Shadcn",
    picture:
      "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
  },
  {
    name: "Theo",
    picture:
      "https://pbs.twimg.com/profile_images/1605762947686375425/lsoGWWty_400x400.jpg",
  },
];
const RTLComponentSupport = () => {
  const multiForm = useForm<Form>({
    resolver: zodResolver(form),
    defaultValues: form.parse({ value: [users[0].name] }),
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
                      <MultiSelectorItem key={user.name} value={user.name}>
                        <div className="flex items-center gap-x-2">
                          <Image
                            src={user.picture}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full"
                          />
                          <span>{user.name}</span>
                        </div>
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
