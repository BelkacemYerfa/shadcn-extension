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

export default function ExamplePage() {
  return (
    <main className="py-20 max-w-1/2 mx-auto ">
      <div className="p-5 bg-muted rounded-md w-full">
        <RTLComponentSupport />
      </div>
    </main>
  );
}

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

const RTLComponentSupport = () => {
  return (
    <BreadCrumb
      orientation="horizontal"
      variant={"ghost"}
      className="gap-1 bg-background rounded-lg p-2"
      dir="rtl"
    >
      {Pages.map((page, index) => {
        return (
          <div key={`${page.title}-path`} className="flex items-center gap-1">
            <BreadCrumbItem index={index} className="h-8 px-2 ">
              <Link scroll={false} href={`#`}>
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
