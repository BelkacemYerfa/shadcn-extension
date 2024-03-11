"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import {
  CarouselMainContainer,
  CarouselThumbsContainer,
  CarouselNext,
  CarouselPrevious,
  Carousel,
  SliderMainItem,
  SliderThumbItem,
} from "./carousel/carousel";
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
import { Tree, Folder, File, CollapseButton } from "./tree-view/tree-view-api";
import { TreeView } from "./tree-view/tree-view";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import {
  CustomUploadInput,
  FileUploadCarouselProvider,
  SliderThumbItemWithRemove,
} from "./carousel/carousel-image-upload";
import Image from "next/image";
import {
  BreadCrumb,
  BreadCrumbContent,
  BreadCrumbEllipsis,
  BreadCrumbItem,
  BreadCrumbPopover,
  BreadCrumbSeparator,
  BreadCrumbTrigger,
} from "./breadcrumb/bread-crumb";
import Link from "next/link";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "./file-uploader/file-uploader";
import { Paperclip } from "lucide-react";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "./fancy-multi-select/multi-select-api";

export type FilePreview = {
  file: File;
  preview: string;
};

const options = [
  {
    value: "Next",
    label: "Next",
  },
  {
    value: "React",
    label: "React",
  },
  {
    value: "Tailwind",
    label: "Tailwind",
  },
  {
    value: "Remix",
    label: "Remix",
  },
  {
    value: "Astro",
    label: "Astro",
  },
  {
    value: "Svelte",
    label: "Svelte",
  },
  {
    value: "Solid",
    label: "Solid",
  },
  {
    value: "Vue",
    label: "Vue",
  },
  {
    value: "Nuxt",
    label: "Nuxt",
    disabled: true,
  },
  {
    value: "Angular",
    label: "Angular",
  },
  {
    value: "Ember",
    label: "Ember",
    disabled: true,
  },
  {
    value: "Preact",
    label: "Preact",
    disabled: true,
  },
  {
    value: "Sapper",
    label: "Sapper",
  },
  {
    value: "Marko",
    label: "Marko",
  },
  {
    value: "Riot",
    label: "Riot",
  },
];

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
    <Carousel>
      <FileUploadCarouselProvider<FilePreview>
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
                <SliderMainItem key={i}>
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={file.preview}
                      objectFit="cover"
                      alt="preview"
                      fill
                      className="rounded-md"
                    />
                  </AspectRatio>
                </SliderMainItem>
              ))}
            </CarouselMainContainer>
            <CarouselThumbsContainer>
              {preview.map((file, i) => (
                <SliderThumbItemWithRemove key={i} index={i}>
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={file.preview}
                      objectFit="cover"
                      alt="preview"
                      fill
                      className="rounded-md"
                    />
                  </AspectRatio>
                </SliderThumbItemWithRemove>
              ))}
            </CarouselThumbsContainer>
            <CustomUploadInput className="border-none">
              <Button
                type="button"
                variant="outline"
                className={cn(`w-full`)}
                //disabled={preview.length >= 2}
              >
                Choose another image
              </Button>
            </CustomUploadInput>
          </>
        ) : (
          <CustomUploadInput>
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
    </Carousel>
  );
};

export const CarouselExample = () => {
  return (
    <Carousel
      orientation="vertical"
      className="max-w-xs w-full h-fit flex items-center gap-2 "
    >
      <div className="relative basis-3/4 ">
        <CarouselMainContainer className="h-60">
          {Array.from({ length: 10 }).map((_, index) => (
            <SliderMainItem
              key={index}
              className="border border-muted flex items-center justify-center h-52 rounded-md"
            >
              <span>Slide {index + 1}</span>
            </SliderMainItem>
          ))}
        </CarouselMainContainer>
      </div>
      <CarouselThumbsContainer className="h-60 basis-1/4">
        {Array.from({ length: 10 }).map((_, index) => (
          <SliderThumbItem key={index} index={index}>
            <span className="border border-muted flex items-center justify-center h-full w-full rounded-md">
              Slide {index + 1}
            </span>
          </SliderThumbItem>
        ))}
      </CarouselThumbsContainer>
    </Carousel>
  );
};

export const CommanderUsingUseState = () => {
  const [command, setCommand] = useState<string[]>(["Hello"]);
  return (
    <form
      className="grid gap-2 max-w-sm w-full"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <MultiSelect
        options={options}
        onValueChange={setCommand}
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
            <FormControl className="w-full">
              <FormItem className="w-full">
                <MultiSelect
                  options={options}
                  onValueChange={field.onChange}
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
    <div className="max-w-xs h-fit flex items-center justify-center outline outline-1 outline-muted rounded-md p-4">
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

export const BreadCrumbTest = () => {
  return (
    <BreadCrumb orientation="vertical" variant={"ghost"} className="gap-1">
      <BreadCrumbItem className="px-2 h-8" index={0}>
        <Link href="/">Home</Link>
      </BreadCrumbItem>
      <BreadCrumbSeparator className="" />
      <BreadCrumbItem index={1} className="px-2">
        Settings
      </BreadCrumbItem>
      <BreadCrumbSeparator />
      <BreadCrumbPopover>
        <BreadCrumbTrigger className="hover:bg-muted flex items-center justify-center size-8 rounded-md focus:outline-none">
          <BreadCrumbEllipsis
            index={2}
            className="px-2 flex items-center justify-center size-8 rounded-md"
          />
          <span className="sr-only">open rest links</span>
        </BreadCrumbTrigger>
        <BreadCrumbContent className="flex items-center flex-col p-1 max-w-40">
          <BreadCrumbItem index={3} className="px-2 size-8 w-full">
            Account
          </BreadCrumbItem>
          <BreadCrumbItem index={4} className="px-2 size-8 w-full">
            Settings
          </BreadCrumbItem>
        </BreadCrumbContent>
      </BreadCrumbPopover>
      <BreadCrumbSeparator />
      <BreadCrumbItem index={5} className="px-2">
        Account
      </BreadCrumbItem>
    </BreadCrumb>
  );
};

const FileSvgDraw = () => {
  return (
    <>
      {" "}
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
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
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        SVG, PNG, JPG or GIF
      </p>
    </>
  );
};

export const FileUploaderTest = () => {
  const [files, setFiles] = useState<File[] | null>(null);
  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };
  return (
    <FileUploader
      value={files}
      onValueChange={setFiles}
      dropzoneOptions={dropZoneConfig}
      className="relative max-w-xs space-y-1"
    >
      <FileInput className="border border-dashed border-gray-500">
        <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
          <FileSvgDraw />
        </div>
      </FileInput>
      <FileUploaderContent className="h-48 ">
        {files &&
          files.length > 0 &&
          files.map((file, i) => (
            <FileUploaderItem key={i} index={i}>
              <Paperclip className="h-4 w-4 stroke-current" />
              <span>{file.name}</span>
            </FileUploaderItem>
          ))}
      </FileUploaderContent>
    </FileUploader>
  );
};

export const TreeFileTest = () => {
  const elements = [
    {
      id: "1",
      isSelectable: true,
      name: "src",
      children: [
        {
          id: "2",
          isSelectable: true,
          name: "app.tsx",
        },
        {
          id: "3",
          isSelectable: true,
          name: "components",
          children: [
            {
              id: "4",
              isSelectable: true,
              name: "input.tsx",
            },
            {
              id: "5",
              isSelectable: true,
              name: "button.tsx",
            },
            {
              id: "20",
              isSelectable: true,
              name: "pages",
              children: [
                {
                  id: "21",
                  isSelectable: true,
                  name: "interface.ts",
                },
              ],
            },
          ],
        },
        {
          id: "6",
          isSelectable: true,
          name: "ui",
          children: [
            {
              id: "7",
              isSelectable: true,
              name: "carousel.tsx",
            },
          ],
        },
      ],
    },
  ];
  return (
    <Tree
      className="rounded-md outline h-60 w-96 outline-1 outline-muted overflow-hidden py-1"
      initialExpendedItems={["components"]}
      initialSelectedId="carousel.tsx"
      elements={elements}
    >
      <Folder element="src">
        <File element="app.tsx">
          <p> app.tsx </p>
        </File>
        <Folder element="components">
          <File element="input.tsx">
            <p> input.tsx </p>
          </File>
          <File element="button.tsx">
            <p> button.tsx </p>
          </File>
          <Folder element="pages">
            <File element="interface.ts">
              <p>interface.ts</p>
            </File>
          </Folder>
        </Folder>
        <Folder element="ui">
          <File element="carousel.tsx">
            <p>carousel.tsx</p>
          </File>
        </Folder>
      </Folder>
      <CollapseButton elements={elements} />
    </Tree>
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
              id: "4",
              isSelectable: false,
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
                          isSelectable: true,
                          name: "Element 7",
                        },
                        {
                          id: "21",
                          isSelectable: false,
                          name: "Element 21",
                        },
                      ],
                    },
                    {
                      id: "8",
                      isSelectable: true,
                      name: "Element 8",
                    },
                  ],
                },
              ],
            },
            {
              id: "3",
              isSelectable: true,
              name: "Element 3",
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
      <TreeView
        elements={elements}
        initialSelectedId="Element 7"
        initialExpendedItems={["Element 9"]}
        indicator={true}
      />
    </div>
  );
};

() => {
  const [value, setValue] = useState<string[]>([]);
  const [loop, setLoop] = useState<boolean>(false);
  return (
    <MultiSelector
      value={value}
      onValueChange={setValue}
      className="max-w-xs"
      loop={loop}
    >
      <MultiSelectorTrigger>
        <MultiSelectorInput placeholder="Select your framework" />
      </MultiSelectorTrigger>
      <MultiSelectorContent>
        <MultiSelectorList>
          {options.map((option, i) => (
            <MultiSelectorItem key={i} value={option.value}>
              {option.label}
            </MultiSelectorItem>
          ))}
        </MultiSelectorList>
      </MultiSelectorContent>
    </MultiSelector>
  );
};