"use client";

import {
  BreadCrumb,
  BreadCrumbItem,
  BreadCrumbSeparator,
} from "@/registry/default/extension/breadcrumb";
import Link from "next/link";

const BreadCrumbTest = () => {
  return (
    <BreadCrumb
      orientation="horizontal"
      variant={"ghost"}
      className="gap-1 bg-background rounded-lg"
    >
      <BreadCrumbItem className="px-2 h-7" index={0}>
        <Link href="/">Home</Link>
      </BreadCrumbItem>
      <BreadCrumbSeparator className="" />
      <BreadCrumbItem index={1} className="px-2">
        Settings
      </BreadCrumbItem>
      <BreadCrumbSeparator />
      <BreadCrumbItem index={5} className="px-2">
        Account
      </BreadCrumbItem>
    </BreadCrumb>
  );
};

export default BreadCrumbTest;
