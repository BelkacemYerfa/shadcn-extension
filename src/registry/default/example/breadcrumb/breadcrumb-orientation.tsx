import {
  BreadCrumb,
  BreadCrumbItem,
  BreadCrumbSeparator,
} from "@/registry/default/extension/breadcrumb";
import { Slash } from "lucide-react";
import Link from "next/link";

const BreadcrumbOrientation = () => {
  return (
    <BreadCrumb
      orientation="vertical"
      variant={"ghost"}
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
  );
};

export default BreadcrumbOrientation;
