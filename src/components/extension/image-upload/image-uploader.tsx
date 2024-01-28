"use client";

import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDropzone, type FileRejection, type Accept } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { EmblaOptionsType } from "embla-carousel";
import { X as RemoveIcon } from "lucide-react";

interface FileUploadProps extends React.HTMLAttributes<HTMLInputElement> {
  accept?: Accept;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  images: File[] | null;
  setImages: Dispatch<SetStateAction<File[] | null>>;
  preview: string[] | null;
  setPreview: Dispatch<SetStateAction<string[] | null>>;
  options?: EmblaOptionsType;
}

export const UploadImageForm = ({
  images,
  setImages,
  preview,
  setPreview,
  accept = {
    "image/*": [".jpeg", ".png"],
  },
  multiple = false,
  maxSize = 1024 * 1024 * 8,
  maxFiles = 1,
  options,
}: FileUploadProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const ref = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isFileTooBig, setIsFileTooBig] = useState<boolean>(false);

  const handleBannerImageChange = (file: File) => {
    const fileWithPreview = URL.createObjectURL(file);
    setPreview((prev) => [
      ...(prev && maxFiles > 1 ? prev : []),
      fileWithPreview,
    ]);
    setImages((files) => [...(files && maxFiles > 1 ? files : []), file]);
  };

  const removeImageFromPreview = (index: number) => {
    if (!api) return;
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
    console.log(index, activeIndex);

    //make condition to change the activate index
    if (index === activeIndex) {
      if (index === 0) {
        api.scrollTo(0);
      } else {
        api.scrollTo(index - 1);
      }
    }
  };

  const checkFileSize = (file: File) => {
    if (file.size > maxSize) {
      setIsFileTooBig(true);
      toast.error("File too big , Max size is 8MB");
      return;
    }
    setIsFileTooBig(false);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const files = acceptedFiles;
      if (!files) {
        toast.error("file error , probably too big");
        return;
      }
      files.forEach((file) => {
        checkFileSize(file);
        handleBannerImageChange(file);
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
      if (!api || !ref.current) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        api.scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        api.scrollNext();
      }
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    },
    [api]
  );

  const scrollTo = useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
    },
    [api]
  );

  const onSelect = useCallback((api: any) => {
    if (!api) return;
    setActiveIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;

    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
  }, [api, onSelect]);

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      maxSize,
      multiple,
      accept,
      maxFiles,
      onDropRejected: () => setIsFileTooBig(true),
      onDropAccepted: () => setIsFileTooBig(false),
    });

  return preview && preview.length > 0 ? (
    <div className="grid space-y-2 w-full">
      <Carousel
        opts={{
          align: "start",
          ...options,
        }}
        tabIndex={0}
        setApi={setApi}
        className="w-full carousel space-y-1  focus:outline-none"
        orientation="horizontal"
        onKeyDownCapture={handleKeyDown}
      >
        <p className="text-xs">
          {preview.length} File{"(s)"} out of {maxFiles}
        </p>
        <CarouselNext className="-right-2 top-[40%] z-[100] h-6 w-6  " />
        <CarouselPrevious className="-left-2 top-[40%] z-[100] h-6 w-6" />
        <CarouselContent className="flex items-center w-full">
          {preview.map((imageSrc, i) => (
            <CarouselItem key={i} className={`basis-full `}>
              <AspectRatio ratio={4 / 3} className="w-full">
                <Image
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className=" rounded-lg object-cover"
                  quality={100}
                  src={imageSrc}
                  alt={`uploaded image ${activeIndex}`}
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>

        {maxFiles > 1 ? (
          <Carousel setApi={setApi}>
            <CarouselContent className="flex items-center w-full mt-1">
              {preview.map((imageSrc, i) => (
                <CarouselItem
                  key={i}
                  className={`basis-1/3 `}
                  onClick={() => scrollTo(i)}
                >
                  <div className="relative aspect-square h-20 w-full">
                    <button
                      aria-label={`remove-slide-${i}`}
                      type="button"
                      className="absolute -right-2 -top-1 z-[100] opacity-70 h-6 w-6 group"
                      onClick={() => removeImageFromPreview(i)}
                    >
                      {" "}
                      <RemoveIcon className="h-4 w-4 group-hover:stroke-red-600" />
                    </button>
                    <Image
                      src={imageSrc}
                      alt="uploaded image"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className=" rounded-lg object-cover"
                      quality={100}
                    />
                    {i === activeIndex && (
                      <div
                        ref={ref}
                        className="h-20 w-full bg-gray-300 opacity-50 backdrop-blur rounded-md"
                      />
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : null}
      </Carousel>
      <Button type="button" variant="outline" {...getRootProps()}>
        Choose another image
      </Button>
    </div>
  ) : (
    <div
      className={`w-full border border-muted-foreground border-dashed rounded-lg cursor-pointer duration-300 ease-in-out
      ${
        isDragAccept
          ? "border-green-500"
          : isDragReject || isFileTooBig
          ? "border-red-500"
          : "border-gray-300 "
      }`}
      {...getRootProps()}
    >
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
      <Input {...getInputProps()} />
    </div>
  );
};
