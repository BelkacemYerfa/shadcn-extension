"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { VariantProps } from "class-variance-authority";
import { ChevronRight } from "lucide-react";
import { createContext, forwardRef, useContext } from "react";

type BreadCrumbContextProps = {} & VariantProps<typeof buttonVariants>;

const BreadCrumbContext = createContext<BreadCrumbContextProps | null>(null);

const useBreadcrumb = () => {
  const context = useContext(BreadCrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within a BreadCrumb");
  }
  return context;
};

interface BreadCrumbProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonVariants> {}

// ? feature: breadcrumb : https://tailwindui.com/components/application-ui/navigation/breadcrumbs

export const BreadCrumb = ({
  className,
  variant,
  children,
  ...props
}: BreadCrumbProps) => {
  // TODO: the core feature needs to use the query string to determine the path
  //supports pagination ( at most it show  3 items at a time)

  return (
    <BreadCrumbContext.Provider value={{ variant }}>
      <div
        {...props}
        className={cn(
          "flex items-center justify-center flex-wrap gap-2",
          className
        )}
      >
        {children}
      </div>
    </BreadCrumbContext.Provider>
  );
};

BreadCrumb.displayName = "BreadCrumb";

// Check if activeVariant is provided without isActive

type BreadCrumbItemProps =
  | {
      isActive: true;
      activeVariant?: VariantProps<typeof buttonVariants>;
    }
  | {
      isActive?: false;
      activeVariant?: undefined;
    };

export const BreadCrumbItem = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & BreadCrumbItemProps
>(({ className, isActive, activeVariant, children }, ref) => {
  const { variant, size } = useBreadcrumb();
  return (
    <Button
      ref={ref}
      className={cn(
        buttonVariants(
          isActive
            ? activeVariant
              ? { ...activeVariant }
              : { variant, size }
            : {
                variant,
                size,
              }
        ),
        className
      )}
    >
      {children}
    </Button>
  );
});

BreadCrumbItem.displayName = "BreadCrumbItem";

export const BreadCrumbSeparator = forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children }, ref) => {
  return (
    <span ref={ref}>
      {children ? (
        children
      ) : (
        <ChevronRight className={cn("h-4 w-4", className)} />
      )}
    </span>
  );
});

BreadCrumbSeparator.displayName = "BreadCrumbSeparator";

export const BreadCrumbEllipsis = forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  return (
    <span ref={ref} aria-hidden className={cn("", className)} {...props}>
      <DotsHorizontalIcon className="h-4 w-4 " />
      <span className="sr-only">More pages</span>
    </span>
  );
});

BreadCrumbEllipsis.displayName = "BreadCrumbEllipsis";
