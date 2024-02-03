"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useCallback, useEffect, useState } from "react";
import {
  CarouselMainContainer,
  CarouselThumbsContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselProvider,
  FileUploadProps,
  SliderMainItem,
  SliderMiniItem,
} from "./image-upload/image-uploader";
import { cn } from "@/lib/utils";
import { MultiSelect } from "./fancy-multi-select/multi-select";
import { OtpStyledInput } from "./otp-input/otp-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TreeView } from "./tree-view/tree-view";
import { Input } from "../ui/input";
import Image from "next/image";
import { X } from "lucide-react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { FileRejection, useDropzone } from "react-dropzone";
import useEmblaCarousel from "embla-carousel-react";

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
          preview={preview}
          setPreview={setPreview}
          dropzoneOptions={{
            maxFiles: 5,
            maxSize: 1024 * 1024 * 4,
            multiple: true,
          }}
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
        preview={preview}
        setPreview={setPreview}
        dropzoneOptions={{
          maxFiles: 5,
          maxSize: 1024 * 1024 * 4,
          multiple: true,
        }}
        /* renderInput={(props) => (
          <Button type="button" variant="outline" className="w-full" {...props}>
            <span>Upload Image</span>
          </Button>
        )} */
      />
    </div>
  );
};

const UploadImageForm = ({
  setImages,
  preview,
  setPreview,
  dropzoneOptions,
  carouselOptions,
  reSelectAll = false,
  renderInput,
}: FileUploadProps) => {
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(carouselOptions);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });
  const [canScrollPrev, setCanScrollPrev] = useState<boolean>(false);
  const [canScrollNext, setCanScrollNext] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isFileTooBig, setIsFileTooBig] = useState<boolean>(false);

  const {
    accept = {
      "image/jpeg": [".png", ".jpg", ".jpeg"],
    },
    maxFiles = 1,
    maxSize = 8 * 1024 * 1024,
    multiple = true,
  } = dropzoneOptions;

  const addImageToTheSet = useCallback((file: File) => {
    if (file.size > maxSize) {
      toast.error(`File too big , Max size is ${maxSize / 1024 / 1024}MB`);
      return;
    }
    const fileWithPreview = {
      file,
      preview: URL.createObjectURL(file),
    };
    setPreview((prev) => {
      if (!reSelectAll && prev && prev.length >= maxFiles) {
        toast.warning(
          `Max files is ${maxFiles} , the component will take the last ones by default to complete the set`
        );

        return prev;
      }
      return [...(prev || []), fileWithPreview];
    });
    setImages((files) => {
      if (!reSelectAll && files && files.length >= maxFiles) {
        return files;
      }
      return [...(files || []), file];
    });
  }, []);

  const removeImageFromPreview = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaMainRef) return;
      if (index === activeIndex) {
        if (activeIndex === emblaMainApi.selectedScrollSnap()) {
          emblaMainApi.scrollPrev();
        } else {
          emblaMainApi.scrollNext();
        }
      }
      setPreview((prev) => {
        if (!prev) return null;
        const newPreview = [...prev];
        newPreview.splice(index, 1);
        return newPreview;
      });
      setImages((files) => {
        if (!files) return null;
        const newFiles = [...files];
        newFiles.splice(index, 1);
        return newFiles;
      });
    },
    [emblaMainApi, activeIndex]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const files = acceptedFiles;

      if (!!reSelectAll) {
        setPreview(null);
        setImages(null);
      }

      if (!files) {
        toast.error("file error , probably too big");
        return;
      }

      files.forEach((file) => {
        addImageToTheSet(file);
      });

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ errors }) => {
          if (errors[0]?.code === "file-too-large") {
            toast.error(
              `File is too large. Max size is ${maxSize / 1024 / 1024}MB`
            );
            return;
          }
          errors[0]?.message && toast.error(errors[0].message);
        });
      }
    },
    []
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!emblaMainApi) return;
      if (event.key === "ArrowLeft") {
        emblaMainApi.scrollPrev();
      } else if (event.key === "ArrowRight") {
        emblaMainApi.scrollNext();
      } else if (event.key === "Delete" || event.key === "Backspace") {
        removeImageFromPreview(activeIndex);
      }
    },
    [emblaMainApi, activeIndex]
  );

  const ScrollNext = useCallback(() => {
    if (!emblaMainApi) return;
    emblaMainApi.scrollNext();
  }, [emblaMainApi]);

  const ScrollPrev = useCallback(() => {
    if (!emblaMainApi) return;
    emblaMainApi.scrollPrev();
  }, [emblaMainApi]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    const selected = emblaMainApi.selectedScrollSnap();
    setActiveIndex(selected);
    emblaThumbsApi.scrollTo(selected);
    setCanScrollPrev(emblaMainApi.canScrollPrev());
    setCanScrollNext(emblaMainApi.canScrollNext());
  }, [emblaMainApi, emblaThumbsApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
    return () => {
      emblaMainApi.off("select", onSelect);
      emblaMainApi.off("reInit", onSelect);
    };
  }, [emblaMainApi, onSelect]);

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      maxSize,
      accept,
      maxFiles,
      multiple,
      onDropRejected: () => setIsFileTooBig(true),
      onDropAccepted: () => setIsFileTooBig(false),
    });

  return (
    <CarouselProvider>
      <CarouselPrevious className="-left-2 z-[100] top-[35%] -translate-y-1/2 h-6 w-6" />
      <CarouselNext className="-right-2 z-[100] top-[35%] -translate-y-1/2 h-6 w-6" />
      <CarouselMainContainer className="space-y-1 overflow-hidden ">
        {Array.from({ length: 10 }).map((_, i) => (
          <SliderMainItem key={i}>
            <div className="h-40 bg-red-500 w-full"></div>
          </SliderMainItem>
        ))}
      </CarouselMainContainer>
      <CarouselThumbsContainer className="overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <SliderMiniItem key={i} index={i}>
            <div className="h-20 bg-red-500"></div>
          </SliderMiniItem>
        ))}
      </CarouselThumbsContainer>
    </CarouselProvider>
  );
};

export const CommanderUsingUseState = () => {
  const [command, setCommand] = useState<string[]>(["Hello"]);
  return (
    <form className="grid gap-2 max-w-sm w-full">
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
        onUpdateValue={setCommand}
        value={command}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export const Commander = () => {
  const form = useForm({
    defaultValues: {
      command: [],
    },
  });
  const onSubmit = (data: any) => {
    console.log(data);
    toast.success(`Success , Your command is : ${data.command}`);
  };
  return (
    <Form {...form}>
      <form
        className="grid gap-2 max-w-sm w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="command"
          render={({ field }) => (
            <FormControl>
              <FormItem>
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
                  onUpdateValue={field.onChange}
                  {...field}
                />
                <FormMessage />
              </FormItem>
            </FormControl>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
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

export const TreeViewTest = () => {
  const elements = [
    {
      id: "1",
      isSelectable: true,
      name: "Element 1",
      children: [
        {
          id: "2",
          isSelectable: true,
          name: "Element 2",
          children: [
            {
              id: "3",
              isSelectable: true,
              name: "Element 3",
              children: [],
            },
            {
              id: "4",
              isSelectable: true,
              name: "Element 4",
              children: [
                {
                  id: "5",
                  isSelectable: true,
                  name: "Element 5",
                  children: [
                    {
                      id: "6",
                      isSelectable: true,
                      name: "Element 6",
                      children: [
                        {
                          id: "7",
                          isSelectable: false,
                          name: "Element 7",
                          children: [],
                        },
                      ],
                    },
                    {
                      id: "8",
                      isSelectable: true,
                      name: "Element 8",
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    {
      id: "9",
      isSelectable: true,
      name: "Element 9",
      children: [
        {
          id: "10",
          isSelectable: true,
          name: "Element 10",
          children: [
            {
              id: "11",
              isSelectable: true,
              name: "Element 11",
              children: [],
            },
          ],
        },
        {
          id: "12",
          isSelectable: true,
          name: "Element 12",
          children: [
            {
              id: "13",
              isSelectable: true,
              name: "Element 13",
              children: [],
            },
          ],
        },
      ],
    },

    {
      id: "20",
      isSelectable: true,
      name: "Element 20",
      children: [],
    },

    // Add more elements as needed
  ];

  return (
    <div className="flex gap-2 pl-2">
      <TreeView elements={elements} initialSelectedId="3" expandAll />
    </div>
  );
};
