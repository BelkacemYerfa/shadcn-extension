"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { UploadImageForm } from "./image-uploader";
import { cn } from "@/lib/utils";
import { MultiSelect } from "../fancy-multi-select/multi-select";
import { OtpStyledInput } from "../otp-input/otp-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export type FilePreview = {
  file: File;
  preview: string;
};

export const Model = () => {
  const [image, setImage] = useState<File[] | null>(null);
  const [preview, setPreview] = useState<FilePreview[] | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className={cn(
          "",
          buttonVariants({
            variant: "outline",
          })
        )}
      >
        Open Dialog
      </DialogTrigger>
      <DialogContent className="max-w-md p-3 w-full">
        <UploadImageForm
          setImages={setImage}
          images={image}
          preview={preview}
          setPreview={setPreview}
          maxFiles={2}
          maxSize={1024 * 1024 * 8}
          multiple={true}
        />
        <div className="flex items-center justify-end gap-2">
          <Button variant={"outline"} onClick={() => setIsOpen(!open)}>
            <span>Cancel</span>
          </Button>
          <Button>
            <span>Submit</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ImageUpload = () => {
  const [image, setImage] = useState<File[] | null>(null);
  const [preview, setPreview] = useState<FilePreview[] | null>(null);
  return (
    <div className="max-w-md w-full">
      <UploadImageForm
        setImages={setImage}
        images={image}
        preview={preview}
        setPreview={setPreview}
        maxFiles={5}
        maxSize={1024 * 1024 * 8}
        multiple={true}
      />
    </div>
  );
};

export const Commander = () => {
  return (
    <MultiSelect
      options={[
        "Hello",
        "World",
        "Next.js",
        "Tailwind CSS",
        "TypeScript",
        "React",
        "Vite",
        "Remix",
        "Astro",
        "Svelte",
      ]}
    />
  );
};

export const OtpTest = () => {
  const form = useForm({
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    toast.success(`Success , Your Otp code is : ${data.otp}`);
  };
  return (
    <div className="max-w-xs flex items-center justify-center outline outline-1 outline-muted rounded-md p-4">
      <div className="w-full space-y-2">
        <div className="space-y-1">
          <h2 className="font-semibold">OTP verification</h2>
          <p className="text-xs">
            Enter the 5-digit code sent to your email address or phone number
          </p>
        </div>
        <Form {...form}>
          <form className="grid gap-2" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormControl>
                  <>
                    <FormItem>
                      <OtpStyledInput
                        numInputs={5}
                        inputType="number"
                        {...field}
                      />
                    </FormItem>
                    <FormMessage />
                  </>
                </FormControl>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
