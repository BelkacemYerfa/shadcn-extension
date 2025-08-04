"use client";

import {
  FileUploader,
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
} from "@/registry/default/extension/file-upload";
import Image from "next/image";
import { useState } from "react";
import { DropzoneOptions } from "react-dropzone";

const FileUploadDropzone = () => {
  const [files, setFiles] = useState<File[] | null>([]);

  const dropzone = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    multiple: true,
    maxFiles: 3,
  } satisfies DropzoneOptions;

  return (
    <FileUploader
      value={files}
      onValueChange={setFiles}
      dropzoneOptions={dropzone}
    >
      <FileInput>
        <div className="flex items-center justify-center h-32 w-full border bg-background rounded-md">
          <p className="text-gray-400">Drop files here</p>
        </div>
      </FileInput>
      <FileUploaderContent className="flex items-center flex-row gap-2">
        {files?.map((file, i) => (
          <FileUploaderItem
            key={i}
            index={i}
            className="size-20 p-0 rounded-md overflow-hidden"
            aria-roledescription={`file ${i + 1} containing ${file.name}`}
          >
            <Image
              src={URL.createObjectURL(file)}
              alt={file.name}
              height={80}
              width={80}
              className="size-20 p-0 object-cover"
            />
          </FileUploaderItem>
        ))}
      </FileUploaderContent>
    </FileUploader>
  );
};

export default FileUploadDropzone;
