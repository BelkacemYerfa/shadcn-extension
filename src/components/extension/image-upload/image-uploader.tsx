"use client";

import Image from "next/image";
import {
  Dispatch,
  JSXElementConstructor,
  SetStateAction,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  useDropzone,
  type FileRejection,
  DropzoneOptions,
} from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRightIcon, X as RemoveIcon } from "lucide-react";
import { FilePreview } from "../model";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { createContext } from "react";

export interface FileUploadProps
  extends React.HTMLAttributes<HTMLInputElement> {
  images?: File[] | null;
  setImages: Dispatch<SetStateAction<File[] | null>>;
  preview: FilePreview[] | null;
  setPreview: Dispatch<SetStateAction<FilePreview[] | null>>;
  dropzoneOptions: DropzoneOptions;
  carouselOptions?: EmblaOptionsType;
  reSelectAll?: boolean;
  renderInput?: <T extends JSXElementConstructor<any>>(
    props: React.ComponentProps<T>
  ) => React.ReactNode;
}

type CarouselContextProps = {
  carouselOptions?: EmblaOptionsType;
};

type CarouselContextType = {
  mainRef: ReturnType<typeof useEmblaCarousel>[0];
  thumbsRef: ReturnType<typeof useEmblaCarousel>[0];
  scrollNext: () => void;
  scrollPrev: () => void;
  canScrollNext: boolean;
  canScrollPrev: boolean;
  activeIndex: number;
  onThumbClick: (index: number) => void;
} & CarouselContextProps;

type CarouselWithUploadType = {
  images?: File[] | null;
  setImages: Dispatch<SetStateAction<File[] | null>>;
  preview: FilePreview[] | null;
  setPreview: Dispatch<SetStateAction<FilePreview[] | null>>;
  dropzoneOptions: DropzoneOptions;
  reSelectAll?: boolean;
  renderInput?: <T extends JSXElementConstructor<any>>(
    props: React.ComponentProps<T>
  ) => React.ReactNode;
} & CarouselContextType;

const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a CarouselProvider");
  }
  return context;
};

const CarouselContext = createContext<CarouselContextType | null>(null);

export const CarouselProvider = forwardRef<
  HTMLDivElement,
  CarouselContextProps & React.HTMLAttributes<HTMLDivElement>
>(({ carouselOptions, children, className, ...props }, ref) => {
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(carouselOptions);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });
  const [canScrollPrev, setCanScrollPrev] = useState<boolean>(false);
  const [canScrollNext, setCanScrollNext] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  /*  const {
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
    ); */

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!emblaMainApi) return;
      if (event.key === "ArrowLeft") {
        emblaMainApi.scrollPrev();
      } else if (event.key === "ArrowRight") {
        emblaMainApi.scrollNext();
      } /* else if (event.key === "Delete" || event.key === "Backspace") {
          removeImageFromPreview(activeIndex);
        } */
    },
    [emblaMainApi]
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

  return (
    <CarouselContext.Provider
      value={{
        mainRef: emblaMainRef,
        thumbsRef: emblaThumbsRef,
        scrollNext: ScrollNext,
        scrollPrev: ScrollPrev,
        canScrollNext,
        canScrollPrev,
        activeIndex,
        onThumbClick,
      }}
    >
      <div
        ref={ref}
        tabIndex={0}
        onKeyDownCapture={handleKeyDown}
        className={cn(
          "grid gap-2 w-full relative focus:outline-none",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
});

CarouselProvider.displayName = "CarouselProvider";

export const CarouselMainContainer = forwardRef<
  HTMLDivElement,
  {} & React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { mainRef } = useCarousel();
  return (
    <div ref={mainRef} {...props} className={cn("overflow-hidden", className)}>
      <div ref={ref} className="flex items-center w-full ">
        {children}
      </div>
    </div>
  );
});

CarouselMainContainer.displayName = "CarouselMainContainer";

export const CarouselThumbsContainer = forwardRef<
  HTMLDivElement,
  {} & React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { thumbsRef } = useCarousel();
  return (
    <div
      ref={thumbsRef}
      {...props}
      className={cn("overflow-hidden", className)}
    >
      <div ref={ref} className="flex items-center w-full ">
        {children}
      </div>
    </div>
  );
});

CarouselThumbsContainer.displayName = "CarouselThumbsContainer";

export const SliderMainItem = forwardRef<
  HTMLDivElement,
  {} & React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className={cn("px-1 flex min-w-0 shrink-0 grow-0 basis-full", className)}
    >
      {children}
    </div>
  );
});

SliderMainItem.displayName = "SliderMainItem";

export const SliderMiniItem = forwardRef<
  HTMLDivElement,
  {
    index: number;
  } & React.HTMLAttributes<HTMLDivElement>
>(({ className, index, children, ...props }, ref) => {
  const { activeIndex, onThumbClick } = useCarousel();
  const isSlideActive = activeIndex === index;
  return (
    <div
      {...props}
      ref={ref}
      onClick={() => onThumbClick(index)}
      className={cn("basis-1/3 px-1 min-w-0 shrink-0 grow-0", className)}
    >
      <div
        className={`relative aspect-square h-20 w-full   opacity-40 rounded-md transition-opacity ${
          isSlideActive ? "!opacity-100" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
});

SliderMiniItem.displayName = "SliderMiniItem";

export const CarouselPrevious = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { canScrollPrev, scrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn("absolute h-8 w-8 rounded-full hidden sm:flex ", className)}
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      {...props}
    >
      <ChevronLeftIcon className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

export const CarouselNext = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { canScrollNext, scrollNext } = useCarousel();
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn("absolute h-8 w-8 rounded-full hidden sm:flex ", className)}
      onClick={scrollNext}
      disabled={!canScrollNext}
      {...props}
    >
      <ChevronRightIcon className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";
