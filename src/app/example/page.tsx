"use client";

import {
  FileUploader,
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
} from "@/registry/default/extension/file-upload";
import { Paperclip } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { DropzoneOptions } from "react-dropzone";

export default function ExamplePage() {
  return (
    <main className="py-20 max-w-xl w-full mx-auto ">
      <div className="p-5 bg-muted rounded-md w-full">
        <RTLComponentSupport />
      </div>
    </main>
  );
}

const RTLComponentSupport = () => {
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
      className="relative bg-background rounded-lg p-2"
    >
      <FileInput className="outline-dashed outline-1 outline-white">
        <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
          Drop me
        </div>
      </FileInput>
      <FileUploaderContent>
        {files &&
          files.length > 0 &&
          files.map((file, i) => (
            <FileUploaderItem key={i} index={i} className="min-w-40">
              <Paperclip className="h-4 w-4 stroke-current" />
              <span>{file.name}</span>
            </FileUploaderItem>
          ))}
      </FileUploaderContent>
    </FileUploader>
  );
};
