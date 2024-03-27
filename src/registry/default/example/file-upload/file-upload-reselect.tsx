"use client";

import {
  FileUploader,
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
} from "@/registry/default/extension/file-upload";
import { DropzoneOptions } from "react-dropzone";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CardForm = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  files: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      })
    )
    .max(5, {
      message: "Maximum 5 files are allowed",
    })
    .nullable(),
});

type CardFormType = z.infer<typeof CardForm>;

const FileUploadDropzone = () => {
  const form = useForm<CardFormType>({
    resolver: zodResolver(CardForm),
    defaultValues: {
      name: "",
      description: "",
      files: null,
    },
  });

  const dropzone = {
    multiple: true,
    maxFiles: 5,
    maxSize: 4 * 1024 * 1024,
  } satisfies DropzoneOptions;

  const onSubmit = (data: CardFormType) => {
    console.log(data);
    toast.success(`Files are ${data.files}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem>
              <FileUploader
                value={field.value}
                onValueChange={field.onChange}
                dropzoneOptions={dropzone}
                reSelect={true}
              >
                <FileInput>
                  <div className="flex items-center justify-center h-32 w-full border bg-background rounded-md">
                    <p className="text-gray-400">Drop files here</p>
                  </div>
                </FileInput>
                <FileUploaderContent>
                  {field.value?.map((file, i) => (
                    <FileUploaderItem
                      key={i}
                      index={i}
                      aria-roledescription={`file ${i + 1} containing ${
                        file.name
                      }`}
                    >
                      <span>{file.name}</span>
                    </FileUploaderItem>
                  ))}
                </FileUploaderContent>
              </FileUploader>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default FileUploadDropzone;
