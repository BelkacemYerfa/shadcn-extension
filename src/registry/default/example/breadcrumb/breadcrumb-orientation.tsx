import {
  BreadCrumb,
  BreadCrumbItem,
  BreadCrumbSeparator,
} from "@/registry/default/extension/breadcrumb";
import Link from "next/link";

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

const BreadcrumbOrientation = () => {
  return (
    <BreadCrumb
      orientation="vertical"
      variant={"ghost"}
      className="gap-1 bg-background rounded-lg p-2"
    >
      {Pages.map((page, index) => {
        return (
          <div
            key={`${page.title}-path`}
            className="flex flex-col items-center gap-1"
          >
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

export default BreadcrumbOrientation;
