"use client";

import { Input } from "@/components/ui/input";
import {
  Dispatch,
  SetStateAction,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { SliderThumbItem, useCarousel } from "./carousel";
import { X as RemoveIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropzoneOptions,
  DropzoneState,
  FileRejection,
  useDropzone,
} from "react-dropzone";
import { toast } from "sonner";

type CarouselWithUploadContext = {
  addImageToTheSet: (file: File) => void;
  removeImageFromPreview: (index: number) => void;
  isFileTooBig: boolean;
  dropzoneState: DropzoneState;
  isLOF?: boolean;
};

export const useFileUpload = () => {
  const context = useContext(CarouselUploadContext);
  if (!context) {
    throw new Error("useFileUpload must be used within a ImageUploadProvider");
  }
  return context;
};

const CarouselUploadContext = createContext<CarouselWithUploadContext | null>(
  null,
);

interface ImageUploadProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  value: T[] | null;
  onValueChange: Dispatch<SetStateAction<T[] | null>>;
  dropzoneOptions: DropzoneOptions;
  reSelect?: boolean;
}

export function FileUploadCarouselProvider<T>({
  className,
  value,
  onValueChange,
  dropzoneOptions,
  reSelect,
  children,
}: ImageUploadProps<T>) {
  const { emblaMainApi, mainRef: emblaMainRef, activeIndex } = useCarousel();

  const {
    accept = {
      "image/*": [".jpg", ".jpeg", ".png", ".gif"],
    },
    maxFiles = 1,
    maxSize = 8 * 1024 * 1024,
    multiple = true,
  } = dropzoneOptions;
  const reSelectAll = maxFiles === 1 ? true : reSelect;
  const [isFileTooBig, setIsFileTooBig] = useState(false);
  const [isLOF, setIsLOF] = useState(false);

  const addImageToTheSet = useCallback(
    (file: File) => {
      if (file.size > maxSize) {
        toast.error(`File too big , Max size is ${maxSize / 1024 / 1024}MB`);
        return;
      }
      const fileWithPreview = {
        file,
        preview: URL.createObjectURL(file),
      } as T;
      onValueChange((prev) => {
        if (!reSelectAll && prev && prev.length >= maxFiles) {
          toast.warning(
            `Max files is ${maxFiles} , the component will take the last ones by default to complete the set`,
          );

          return prev;
        }
        return [...(prev || []), fileWithPreview];
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reSelectAll],
  );

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
      onValueChange((prev) => {
        if (!prev) return null;
        const newPreview = [...prev];
        newPreview.splice(index, 1);
        return newPreview;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [emblaMainApi, activeIndex],
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
      } else if (event.key === "Enter") {
        dropzoneState.inputRef.current?.click();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [emblaMainApi, activeIndex, removeImageFromPreview],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const files = acceptedFiles;

      if (!!reSelectAll) {
        onValueChange(null);
      }

      if (!files) {
        toast.error("file error , probably too big");
        return;
      }

      files.forEach(addImageToTheSet);

      if (rejectedFiles.length > 0) {
        for (let i = 0; i < rejectedFiles.length; i++) {
          if (rejectedFiles[i].errors[0]?.code === "file-too-large") {
            toast.error(
              `File is too large. Max size is ${maxSize / 1024 / 1024}MB`,
            );
            break;
          }
          if (rejectedFiles[i].errors[0]?.message) {
            toast.error(rejectedFiles[i].errors[0].message);
            break;
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reSelectAll],
  );

  useEffect(() => {
    if (!value) return;
    if (value.length === maxFiles) {
      setIsLOF(true);
      return;
    }
    setIsLOF(false);
  }, [value, maxFiles]);

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
        isFileTooBig,
        dropzoneState,
        isLOF,
      }}
    >
      <div
        tabIndex={0}
        onKeyDownCapture={handleKeyDown}
        className={cn(
          "grid gap-2 w-full relative focus:outline-none",
          className,
        )}
      >
        {children}
      </div>
    </CarouselUploadContext.Provider>
  );
}

FileUploadCarouselProvider.displayName = "FileUploadCarouselProvider";

export const SliderThumbItemWithRemove = forwardRef<
  HTMLButtonElement,
  {
    index: number;
  } & React.HTMLAttributes<HTMLButtonElement>
>(({ index, children, className, ...props }, ref) => {
  const { removeImageFromPreview } = useFileUpload();
  return (
    <SliderThumbItem index={index} className={className}>
      <button
        ref={ref}
        {...props}
        type="button"
        className={cn(
          "absolute -right-2 -top-1 z-10 opacity-70 h-6 w-6 focus:outline-none",
        )}
        onClick={() => removeImageFromPreview(index)}
      >
        {" "}
        <RemoveIcon className="h-4 w-4 stroke-red-600" />
      </button>
      {children}
    </SliderThumbItem>
  );
});

SliderThumbItemWithRemove.displayName = "SliderThumbItemWithRemove";

export const CustomUploadInput = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { dropzoneState, isFileTooBig, isLOF } = useFileUpload();
  const rootProps = isLOF ? {} : dropzoneState.getRootProps();
  return (
    <div
      ref={ref}
      {...props}
      className={`w-full ${
        isLOF ? "opacity-50 cursor-not-allowed " : "cursor-pointer "
      }`}
    >
      <div
        className={cn(
          `w-full border border-muted-foreground border-dashed rounded-lg duration-300 ease-in-out
      ${
        dropzoneState.isDragAccept
          ? "border-green-500"
          : dropzoneState.isDragReject || isFileTooBig
            ? "border-red-500"
            : "border-gray-300"
      }`,
          className,
        )}
        {...rootProps}
      >
        {children}
      </div>
      <Input
        ref={dropzoneState.inputRef}
        disabled={isLOF}
        {...dropzoneState.getInputProps()}
        className={`${isLOF ? "cursor-not-allowed" : ""}`}
      />
    </div>
  );
});

CustomUploadInput.displayName = "CustomUploadInput";
