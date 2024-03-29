"use client";

import {
  BreadCrumb,
  BreadCrumbItem,
  BreadCrumbSeparator,
} from "@/registry/default/extension/breadcrumb";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Pages = [
  {
    title: "Home",
    path: "home",
  },
  {
    title: "Settings",
    path: "settings",
  },
  {
    title: "Account",
    path: "account",
  },
];

const BreadCrumbTest = () => {
  const searchParams = useSearchParams();
  const path = searchParams.get("path");
  return (
    <BreadCrumb
      orientation="horizontal"
      variant={"ghost"}
      className="gap-1 bg-background rounded-lg p-2"
    >
      {Pages.map((page, index) => {
        const isActive = path === page.path;
        return (
          <div key={`${page.title}-path`} className="flex items-center gap-1">
            <BreadCrumbItem
              isActive={isActive}
              index={index}
              className="h-8 px-2 "
              activeVariant={{
                variant: "default",
              }}
            >
              <Link scroll={false} href={`?path=${page.path}`}>
                {page.title}
              </Link>
            </BreadCrumbItem>
            {index !== Pages.length - 1 && <BreadCrumbSeparator />}
          </div>
        );
      })}
    </BreadCrumb>
  );
};

export default BreadCrumbTest;
