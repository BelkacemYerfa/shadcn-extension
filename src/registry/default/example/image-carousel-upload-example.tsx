"use client";
import { useState } from "react";
import {
  FileUploadCarouselProvider,
  CustomUploadInput,
  SliderThumbItemWithRemove,
} from "@/registry/default/extension/image-carousel-upload";
import {
  Carousel,
  SliderMainItem,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
} from "@/registry/default/extension/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FileSvgDraw = () => {
  return (
    <>
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

type FilePreview = {
  preview: string;
  file: File;
};

const MultiCarouselUploader = () => {
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
              <FileSvgDraw />
            </div>
          </CustomUploadInput>
        )}
      </FileUploadCarouselProvider>
    </Carousel>
  );
};

export default MultiCarouselUploader;
