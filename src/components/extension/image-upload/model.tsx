"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { UploadImageForm } from "./image-uploader";
import { cn } from "@/lib/utils";

export const Model = () => {
  const [image, setImage] = useState<File[] | null>(null);
  const [preview, setPreview] = useState<string[] | null>(null);
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
          maxFiles={5}
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
