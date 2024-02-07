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

export const BreadCrumb = ({
  className,
  variant,
  size,
  children,
  ...props
}: BreadCrumbProps) => {
  return (
    <BreadCrumbContext.Provider value={{ variant, size }}>
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
  React.ButtonHTMLAttributes<HTMLButtonElement> & BreadCrumbItemProps
>(({ className, isActive, activeVariant, children, ...props }, ref) => {
  const { variant, size } = useBreadcrumb();
  const variants = {
    variant,
    size,
  };
  const activeVariants = activeVariant ?? variants;
  const Variants = isActive ? activeVariants : variants;
  return (
    <Button ref={ref} {...Variants} className={cn(className)} {...props}>
      {children}
    </Button>
  );
});

BreadCrumbItem.displayName = "BreadCrumbItem";

export const BreadCrumbSeparator = forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => {
  return (
    <span ref={ref} {...props}>
      {children ? (
        children
      ) : (
        <ChevronRight className={cn("h-4 w-4", className)} />
      )}
      <span className="sr-only">the next page</span>
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
