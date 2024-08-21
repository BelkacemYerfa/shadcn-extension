"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { TagsInput } from "@/registry/default/extension/tags-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const form = z.object({
  value: z.array(z.string()).nonempty("Please at least one item"),
});

type Form = z.infer<typeof form>;

const TagsInputZod = () => {
  const tagsForm = useForm<Form>({
    resolver: zodResolver(form),
    defaultValues: {
      value: [],
    },
  });

  const onSubmit = (data: Form) => {
    toast.success(JSON.stringify(data));
  };
  return (
    <Form {...tagsForm}>
      <form
        onSubmit={tagsForm.handleSubmit(onSubmit)}
        className="grid gap-2 w-full"
      >
        <FormField
          control={tagsForm.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <TagsInput
                className="w-full"
                value={field.value}
                onValueChange={field.onChange}
                placeholder="enter your used tech"
              />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-fit h-8">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default TagsInputZod;
