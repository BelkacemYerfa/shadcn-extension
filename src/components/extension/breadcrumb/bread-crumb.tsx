"use client";

import { useRouter } from "next/navigation";
import { JSXElementConstructor } from "react";

type ReactElement = JSXElementConstructor<any>;

type itemTypes = {
  path: string;
  name: string;
  component: <T extends ReactElement>(
    props?: React.ComponentProps<T>
  ) => React.ReactNode;
};

interface BreadCrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: itemTypes[];
  separator?: <T extends ReactElement>(
    props?: React.ComponentProps<T>
  ) => React.ReactNode;
  className?: string;
}

// ? feature: breadcrumb : https://tailwindui.com/components/application-ui/navigation/breadcrumbs

export const BreadCrumb = ({
  items = [
    {
      path: "/",
      name: "Home",
      component: (props) => <div {...props}>Home</div>, //gonna be used for dynamic routing later
    },
    {
      path: "/about",
      name: "About",
      component: (props) => <div {...props}>About</div>,
    },
  ],
  separator,
}: BreadCrumbProps) => {
  // TODO: the core feature needs to use the query string to determine the path
  const router = useRouter();
  //supports pagination ( at most it show  3 items at a time)
  const maxItems = 3;
  const buildPath = (targetPathName: string) => {
    const currentPath: string[] = [];
    items.forEach((item) => {
      currentPath.push(item.path);
      if (item.name === targetPathName) {
        return currentPath;
      }
    });
  };
  return (
    <div className="flex items-center justify-center flex-wrap gap-2">
      {items.map((item, index) => (
        <>
          <div key={item?.name + index} className="flex items-center gap-2">
            <item.component />
            {separator ? (
              separator()
            ) : (
              <span>{index !== items.length - 1 && ">"}</span>
              //popover triggers when the user hovers over the breadcrumb separator
            )}
          </div>
          {index !== items.length - 1 && (
            <div className="flex items-center gap-2">
              <span>...</span>
              {separator ? (
                separator()
              ) : (
                <span>{index !== items.length - 1 && ">"}</span>
              )}
            </div>
          )}
        </>
      ))}
    </div>
  );
};
