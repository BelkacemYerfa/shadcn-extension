"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { UploadImageForm } from "./image-uploader";
import { cn } from "@/lib/utils";
import { MultiSelect } from "../fancy-multi-select/multi-select";
import { CommandDialog } from "@/components/ui/command";
import { Popover } from "@/components/ui/popover";

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
