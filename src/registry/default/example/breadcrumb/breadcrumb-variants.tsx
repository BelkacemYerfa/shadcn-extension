"use client";

import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import {
  BreadCrumb,
  BreadCrumbItem,
  BreadCrumbSeparator,
} from "@/registry/default/extension/breadcrumb";
import { SelectTrigger, SelectValue } from "@radix-ui/react-select";
import Link from "next/link";
import { useState } from "react";

const OPTIONS = ["ghost", "outline", "link", "default", "destructive"];

const BreadCrumbVariantPicker = ({
  variant,
  setVariant,
}: {
  variant: string;
  setVariant: (variant: string) => void;
}) => {
  return (
    <div className="absolute right-2 top-2">
      <Select defaultValue="ghost" value={variant} onValueChange={setVariant}>
        <SelectTrigger className="">
          <SelectValue placeholder="Select a variant " />
        </SelectTrigger>
        <SelectContent align="end">
          {OPTIONS.map((opt, index) => (
            <SelectItem key={`${opt}-${index}`} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const BreadCrumbTest = () => {
  const [variant, setVariant] = useState("ghost");
  return (
    <>
      <BreadCrumb
        orientation="horizontal"
        variant={variant as any}
        className="gap-1 bg-background rounded-lg p-2"
      >
        <BreadCrumbItem className="px-2 h-7" index={0}>
          <Link href="/">Home</Link>
        </BreadCrumbItem>
        <BreadCrumbSeparator />
        <BreadCrumbItem className="px-2 h-7" index={1}>
          Settings
        </BreadCrumbItem>
        <BreadCrumbSeparator />
        <BreadCrumbItem className="px-2 h-7" index={2}>
          Account
        </BreadCrumbItem>
      </BreadCrumb>
      <BreadCrumbVariantPicker variant={variant} setVariant={setVariant} />
    </>
  );
};

export default BreadCrumbTest;
