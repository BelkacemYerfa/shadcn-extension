"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import {
  CarouselMainContainer,
  CarouselThumbsContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselProvider,
  SliderMainItem,
  SliderMiniItem,
} from "./file-upload/carousel";
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
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import {
  CustomUploadInput,
  FileUploadCarouselProvider,
  SliderMainItemWithRemove,
  SliderMiniItemWithRemove,
} from "./file-upload/file-upload";
import Image from "next/image";
import {
  BreadCrumb,
  BreadCrumbEllipsis,
  BreadCrumbItem,
  BreadCrumbSeparator,
} from "./breadcrumb/bread-crumb";

export type FilePreview = {
  file: File;
  preview: string;
};

export const Model = () => {
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
        <ImageUpload />
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
  return (
    <div className="max-w-md w-full">
      <MultiCarousel />
    </div>
  );
};

const MultiCarousel = () => {
  const [preview, setPreview] = useState<FilePreview[] | null>(null);
  return (
    <CarouselProvider>
      <FileUploadCarouselProvider
        value={preview}
        onValueChange={setPreview}
        dropzoneOptions={{
          maxFiles: 5,
          maxSize: 1024 * 1024 * 4,
          multiple: true,
        }}
      >
        {preview && preview.length > 0 ? (
          <>
            {preview.length > 1 && (
              <>
                <CarouselPrevious className="-left-2 z-[100] top-[35%] -translate-y-1/2 h-6 w-6" />
                <CarouselNext className="-right-2 z-[100] top-[35%] -translate-y-1/2 h-6 w-6" />
              </>
            )}
            <CarouselMainContainer className="space-y-1">
              {preview.map((file, i) => (
                <SliderMainItemWithRemove key={i} index={i}>
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={file.preview}
                      objectFit="cover"
                      alt="preview"
                      fill
                      className="rounded-md"
                    />
                  </AspectRatio>
                </SliderMainItemWithRemove>
              ))}
            </CarouselMainContainer>
            <CarouselThumbsContainer>
              {preview.map((file, i) => (
                <SliderMiniItemWithRemove key={i} index={i}>
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={file.preview}
                      objectFit="cover"
                      alt="preview"
                      fill
                      className="rounded-md"
                    />
                  </AspectRatio>
                </SliderMiniItemWithRemove>
              ))}
            </CarouselThumbsContainer>
            <CustomUploadInput className="border-none">
              <Button type="button" variant="outline" className={cn(`w-full`)}>
                Choose another image
              </Button>
            </CustomUploadInput>
          </>
        ) : (
          <CustomUploadInput isLOF={false}>
            <div className="flex items-center justify-center flex-col pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span>
                &nbsp; or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF
              </p>
            </div>
          </CustomUploadInput>
        )}
      </FileUploadCarouselProvider>
    </CarouselProvider>
  );
};

export const CarouselExample = () => {
  return (
    <div className="max-w-md w-full mt-3">
      <CarouselProvider activeKeyboard>
        <CarouselPrevious className="-left-2 z-[100] top-[35%] -translate-y-1/2 h-6 w-6" />
        <CarouselNext className="-right-2 z-[100] top-[35%] -translate-y-1/2 h-6 w-6" />
        <CarouselMainContainer className="overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <SliderMainItem key={i}>
              <div className="w-full h-40 bg-gray-300 rounded-md"></div>
            </SliderMainItem>
          ))}
        </CarouselMainContainer>
        <CarouselThumbsContainer className="overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <SliderMiniItem key={i} index={i}>
              <div className="w-full h-20 bg-gray-300 rounded-md"></div>
            </SliderMiniItem>
          ))}
        </CarouselThumbsContainer>
      </CarouselProvider>
    </div>
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

export const BreadCrumbTest = () => {
  return (
    <BreadCrumb variant={"link"} className="gap-1">
      <BreadCrumbItem
        className="px-2 "
        isActive
        activeVariant={{
          variant: "ghost",
        }}
      >
        Home
      </BreadCrumbItem>
      <BreadCrumbSeparator className="" />
      <BreadCrumbItem className="px-2 ">Settings</BreadCrumbItem>
      <BreadCrumbSeparator />
      <BreadCrumbEllipsis className="px-2" />
      <BreadCrumbSeparator />
      <BreadCrumbItem className="px-2">Account</BreadCrumbItem>
    </BreadCrumb>
  );
};
