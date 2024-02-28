"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Dispatch,
  SetStateAction,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useDropzone,
  DropzoneState,
  FileRejection,
  DropzoneOptions,
} from "react-dropzone";
import { toast } from "sonner";
import useResizeObserver from "use-resize-observer";
import { Trash2 as RemoveIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type FileUploaderContextType = {
  dropzoneState: DropzoneState;
  isLOF: boolean;
  isFileTooBig: boolean;
  removeFileFromSet: (index: number) => void;
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
};

const FileUploaderContext = createContext<FileUploaderContextType | null>(null);

export const useFileUpload = () => {
  const context = useContext(FileUploaderContext);
  if (!context) {
    throw new Error("useFileUpload must be used within a FileUploaderProvider");
  }
  return context;
};

type FileUploaderProps = {
  reSelect?: boolean;
  value: File[] | null;
  onValueChange: Dispatch<SetStateAction<File[] | null>>;
  dropzoneOptions: DropzoneOptions;
};

export const FileUploader = forwardRef<
  HTMLDivElement,
  FileUploaderProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      className,
      dropzoneOptions,
      reSelect,
      value,
      onValueChange,
      children,
      ...props
    },
    ref
  ) => {
    const [isFileTooBig, setIsFileTooBig] = useState(false);
    const [isLOF, setIsLOF] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(-1);
    const {
      accept = {
        "image/*": [".jpg", ".jpeg", ".png", ".gif"],
      },
      maxFiles = 1,
      maxSize = 4 * 1024 * 1024,
      multiple = true,
    } = dropzoneOptions;

    const reSelectAll = maxFiles === 1 ? true : reSelect;

    const addFileToSet = useCallback(
      (file: File) => {
        if (file.size > maxSize) {
          toast.error(`File too big , Max size is ${maxSize / 1024 / 1024}MB`);
        }

        onValueChange((prev) => {
          if (!reSelectAll && prev && prev.length >= maxFiles) {
            return prev;
          }
          return [...(prev || []), file];
        });
      },
      [reSelectAll]
    );

    const removeFileFromSet = useCallback((index: number) => {
      onValueChange((prev) => {
        if (!prev) return prev;
        const newPreview = [...prev];
        newPreview.splice(index, 1);
        return newPreview;
      });
    }, []);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!value) return;

        if (e.key === "ArrowDown") {
          const nextIndex = activeIndex + 1;
          setActiveIndex(nextIndex > value.length - 1 ? 0 : nextIndex);
        } else if (e.key === "ArrowUp") {
          const nextIndex = activeIndex - 1;
          setActiveIndex(nextIndex < 0 ? value.length - 1 : nextIndex);
        } else if (e.key === "Enter" || e.key === "Space") {
          if (activeIndex === -1) {
            dropzoneState.inputRef.current?.click();
          }
        } else if (e.key === "Delete" || e.key === "Backspace") {
          if (activeIndex !== -1) {
            removeFileFromSet(activeIndex);
            const newIndex = activeIndex - 1;
            setActiveIndex(newIndex < 0 ? value.length - 1 : newIndex);
          }
        } else if (e.key === "Escape") {
          setActiveIndex(-1);
        }
      },
      [value, activeIndex]
    );

    const onDrop = useCallback(
      (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        const files = acceptedFiles;

        if (!!reSelectAll) {
          onValueChange([]);
        }

        if (!files) {
          toast.error("file error , probably too big");
          return;
        }

        files.forEach(addFileToSet);

        if (rejectedFiles.length > 0) {
          for (let i = 0; i < rejectedFiles.length; i++) {
            if (rejectedFiles[i].errors[0]?.code === "file-too-large") {
              toast.error(
                `File is too large. Max size is ${maxSize / 1024 / 1024}MB`
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
      [reSelectAll]
    );

    useEffect(() => {
      if (!value) return;
      if (value.length === maxFiles) {
        setIsLOF(true);
        return;
      }
      setIsLOF(false);
    }, [value, maxFiles]);

    const opts = dropzoneOptions
      ? dropzoneOptions
      : { accept, maxFiles, maxSize, multiple };

    const dropzoneState = useDropzone({
      ...opts,
      onDrop,
      onDropRejected: () => setIsFileTooBig(true),
      onDropAccepted: () => setIsFileTooBig(false),
    });
    const { height, width } = useResizeObserver({
      ref: containerRef,
    });

    return (
      <FileUploaderContext.Provider
        value={{
          dropzoneState,
          isLOF,
          isFileTooBig,
          removeFileFromSet,
          activeIndex,
          setActiveIndex,
        }}
      >
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDownCapture={handleKeyDown}
          className={cn(
            "grid gap-2 w-full relative focus:outline-none",
            className
          )}
          style={{ height, width }}
          {...props}
        >
          {children}
        </div>
      </FileUploaderContext.Provider>
    );
  }
);

FileUploader.displayName = "FileUploader";

export const FileUploaderContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { height, width } = useResizeObserver({
    ref: containerRef,
  });
  return (
    <div
      className={cn("relative w-full")}
      ref={containerRef}
      aria-description="content file holder"
    >
      <ScrollArea
        style={{
          width,
          height,
        }}
        className="px-1"
      >
        <div
          {...props}
          ref={ref}
          className={cn("flex flex-col gap-1", className)}
        >
          {children}
        </div>
      </ScrollArea>
    </div>
  );
});

FileUploaderContent.displayName = "FileUploaderContent";

export const FileUploaderItem = forwardRef<
  HTMLDivElement,
  { index: number } & React.HTMLAttributes<HTMLDivElement>
>(({ className, index, children, ...props }, ref) => {
  const { removeFileFromSet, activeIndex } = useFileUpload();
  const isSelected = index === activeIndex;
  return (
    <div
      ref={ref}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "h-6 p-1 justify-between cursor-pointer relative",
        className,
        isSelected ? "bg-muted" : ""
      )}
      {...props}
    >
      <div className="font-medium leading-none tracking-tight flex items-center gap-1.5 h-full w-full">
        {children}
      </div>
      <button
        type="button"
        className="absolute top-1 right-1"
        onClick={() => removeFileFromSet(index)}
      >
        <span className="sr-only">remove item {index}</span>
        <RemoveIcon className="w-4 h-4 hover:stroke-destructive duration-200 ease-in-out" />
      </button>
    </div>
  );
});

FileUploaderItem.displayName = "FileUploaderItem";

export const FileInput = forwardRef<
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
          `w-full rounded-lg duration-300 ease-in-out
         ${
           dropzoneState.isDragAccept
             ? "border-green-500"
             : dropzoneState.isDragReject || isFileTooBig
             ? "border-red-500"
             : "border-gray-300"
         }`,
          className
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

FileInput.displayName = "FileInput";
