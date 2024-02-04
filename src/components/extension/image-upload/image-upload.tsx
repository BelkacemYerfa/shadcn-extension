import { Input } from "@/components/ui/input";
import {
  Dispatch,
  JSXElementConstructor,
  SetStateAction,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
} from "react";
import { CarouselProvider, SliderMiniItem, useCarousel } from "./carousel";
import { X as RemoveIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmblaOptionsType } from "embla-carousel";
import {
  DropzoneOptions,
  DropzoneState,
  FileRejection,
  useDropzone,
} from "react-dropzone";
import { toast } from "sonner";
import { FilePreview } from "../model";

type CarouselWithUploadContext = {
  addImageToTheSet: (file: File) => void;
  removeImageFromPreview: (index: number) => void;
  onDrop: (acceptedFiles: File[], rejectedFiles: FileRejection[]) => void;
  isFileTooBig: boolean;
  dropzoneState: DropzoneState;
};

export const useFileUpload = () => {
  const context = useContext(CarouselUploadContext);
  if (!context) {
    throw new Error("useFileUpload must be used within a ImageUploadProvider");
  }
  return context;
};

const CarouselUploadContext = createContext<CarouselWithUploadContext | null>(
  null
);

type ImageUploadProps = {
  value?: string[];
  onChange?: (value: string[]) => void;
  images: File[] | null;
  setImages: Dispatch<SetStateAction<File[] | null>>;
  preview: FilePreview[] | null;
  setPreview: Dispatch<SetStateAction<FilePreview[] | null>>;
  carouselOptions?: EmblaOptionsType;
  dropzoneOptions: DropzoneOptions;
  reSelectAll?: boolean;
};

export const FileUploadCarouselProvider = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ImageUploadProps
>(
  (
    {
      className,
      carouselOptions,
      images,
      setImages,
      preview,
      setPreview,
      dropzoneOptions,
      reSelectAll,
      children,
      ...props
    },
    ref
  ) => {
    const { emblaMainApi, mainRef: emblaMainRef, activeIndex } = useCarousel();
    const {
      accept = {
        "image/jpeg": [".png", ".jpg", ".jpeg"],
      },
      maxFiles = 1,
      maxSize = 8 * 1024 * 1024,
      multiple = true,
    } = dropzoneOptions;
    const [isFileTooBig, setIsFileTooBig] = useState(false);

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
      [emblaMainApi]
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

    const dropzoneState = useDropzone({
      onDrop,
      maxSize,
      accept,
      maxFiles,
      multiple,
      onDropRejected: () => setIsFileTooBig(true),
      onDropAccepted: () => setIsFileTooBig(false),
    });

    return (
      <CarouselUploadContext.Provider
        value={{
          addImageToTheSet,
          removeImageFromPreview,
          onDrop,
          isFileTooBig,
          dropzoneState,
        }}
      >
        <div
          tabIndex={0}
          onKeyDownCapture={handleKeyDown}
          ref={ref}
          {...props}
          className={cn(
            "grid gap-2 w-full relative focus:outline-none",
            className
          )}
        >
          {children}
        </div>
      </CarouselUploadContext.Provider>
    );
  }
);

FileUploadCarouselProvider.displayName = "FileUploadCarouselProvider";

export const SliderMiniItemWithRemove = forwardRef<
  HTMLButtonElement,
  {
    index: number;
  } & React.HTMLAttributes<HTMLButtonElement>
>(({ index, children, className, ...props }, ref) => {
  const { removeImageFromPreview } = useFileUpload();
  return (
    <SliderMiniItem index={index}>
      <button
        ref={ref}
        {...props}
        type="button"
        className={cn(
          "absolute -right-2 -top-1 z-[100] opacity-70 h-6 w-6 focus:outline-none group",
          className
        )}
        onClick={() => removeImageFromPreview(index)}
      >
        {" "}
        <RemoveIcon className="h-4 w-4 group-hover:stroke-red-600" />
      </button>
      {children}
    </SliderMiniItem>
  );
});

SliderMiniItemWithRemove.displayName = "SliderMiniItemWithRemove";

export const CustomUploadInput = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children }, ref) => {
  const { dropzoneState, isFileTooBig } = useFileUpload();
  return (
    <div ref={ref} className={"w-full"}>
      <div
        className={cn(
          `w-full border border-muted-foreground border-dashed rounded-lg cursor-pointer duration-300 ease-in-out
      ${
        dropzoneState.isDragAccept
          ? "border-green-500"
          : dropzoneState.isDragReject || isFileTooBig
          ? "border-red-500"
          : "border-gray-300 "
      }`,
          className
        )}
        {...dropzoneState.getRootProps()}
      >
        {children}
      </div>
      <Input {...dropzoneState.getInputProps()} />
    </div>
  );
});

CustomUploadInput.displayName = "CustomUploadInput";
