"use client";

import {
  BreadCrumb,
  BreadCrumbItem,
  BreadCrumbSeparator,
  BreadCrumbPopover,
  BreadCrumbTrigger,
  BreadCrumbContent,
  BreadCrumbEllipsis,
} from "@/registry/default/extension/breadcrumb";
import Link from "next/link";
const BreadCrumbTest = () => {
  return (
    <BreadCrumb
      orientation="horizontal"
      variant={"ghost"}
      className="gap-1 bg-background rounded-lg px-4"
    >
      <BreadCrumbItem className="px-2 h-7" index={0}>
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

export default BreadCrumbTest;
