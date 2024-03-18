"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { VariantProps } from "class-variance-authority";
import { ChevronRight } from "lucide-react";
import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type BreadCrumbContextProps = {
  activeIndex: number;
  setActiveIndex: (activeIndex: number) => void;
  value: number[];
  onValueChange: Dispatch<SetStateAction<number[]>>;
  onPrevValueChange: Dispatch<SetStateAction<number[]>>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setTarget: (target: number) => void;
} & VariantProps<typeof buttonVariants>;

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
    VariantProps<typeof buttonVariants> {
  orientation?: "horizontal" | "vertical";
}

// TODO: add support for orientation

export const BreadCrumb = ({
  className,
  orientation = "horizontal",
  variant,
  size,
  children,
  ...props
}: BreadCrumbProps) => {
  const [value, setValue] = useState<number[]>([]);
  const [prevValue, setPrevValue] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const length = value.length - 1;

      const moveNext = () => {
        const nextIndex = activeIndex + 1 > length ? 0 : activeIndex + 1;
        setActiveIndex(value[nextIndex]);
      };

      const movePrev = () => {
        const currentIndex = value.indexOf(activeIndex) - 1;
        const prevIndex = currentIndex < 0 ? length : currentIndex;
        setActiveIndex(value[prevIndex]);
      };

      switch (e.key) {
        case "ArrowDown":
          if (orientation === "vertical") {
            moveNext();
          }
          break;
        case "ArrowUp":
          if (orientation === "vertical") {
            movePrev();
          }
          break;
        case "ArrowRight":
          if (orientation === "horizontal") {
            moveNext();
          }
          break;
        case "ArrowLeft":
          if (orientation === "horizontal") {
            movePrev();
          }
          break;
      }

      if (e.key === "Escape") {
        if (activeIndex !== -1) {
          if (prevValue.length > 0) setValue(prevValue);
          setOpen(false);
          if (
            value.includes(activeIndex) &&
            !prevValue.includes(activeIndex) &&
            prevValue.length > 0
          ) {
            setActiveIndex(target);
            return;
          }
          setActiveIndex(-1);
        }
      } else if (e.key === "Enter" && activeIndex === target) {
        if (prevValue.length > 0) setValue(prevValue);
        setOpen(!open);
      }
    },
    [activeIndex, value, prevValue]
  );

  return (
    <BreadCrumbContext.Provider
      value={{
        variant,
        size,
        activeIndex,
        value,
        onValueChange: setValue,
        onPrevValueChange: setPrevValue,
        setActiveIndex,
        open,
        onOpenChange: setOpen,
        setTarget,
      }}
    >
      <div
        {...props}
        onKeyDown={handleKeyDown}
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
      index: number;
    } & (
      | {
          isActive: true;
          activeVariant?: VariantProps<typeof buttonVariants>;
        }
      | {
          isActive?: false;
          activeVariant?: undefined;
        }
    );

export const BreadCrumbItem = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & BreadCrumbItemProps
>(({ className, isActive, activeVariant, index, children, ...props }, ref) => {
  const {
    variant,
    size,
    activeIndex,
    value,
    onValueChange,
    setActiveIndex,
    onPrevValueChange,
  } = useBreadcrumb();
  const variants = {
    variant,
    size,
  };
  const activeVariants = activeVariant ?? variants;
  const Variants = isActive ? activeVariants : variants;
  const isSelected = isActive ?? activeIndex === index;

  useEffect(() => {
    onValueChange((prev) => {
      if (prev.includes(index)) {
        return prev;
      }
      const arr = [...prev, index];
      return arr.toSorted((a, b) => Number(a) - Number(b));
    });
    return () => {
      onPrevValueChange(value);
    };
  }, [index, onValueChange]);

  return (
    <div
      ref={ref}
      className={cn(
        buttonVariants(Variants),
        className,
        isSelected ? "bg-muted focus-visible:ring-0 ring-0" : ""
      )}
      {...props}
      onClick={() => setActiveIndex(index)}
    >
      {children}
    </div>
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
      <span className="sr-only">next page</span>
    </span>
  );
});

BreadCrumbSeparator.displayName = "BreadCrumbSeparator";

export const BreadCrumbEllipsis = forwardRef<
  HTMLSpanElement,
  { index: number } & React.HTMLAttributes<HTMLSpanElement>
>(({ className, index, ...props }, ref) => {
  const { activeIndex, onValueChange, setTarget } = useBreadcrumb();
  const isSelected = activeIndex === index;
  useEffect(() => {
    setTarget(index);
    onValueChange((prev) => {
      if (prev.includes(index)) {
        return prev;
      }
      const arr = [...prev, index];
      return arr.toSorted((a, b) => Number(a) - Number(b));
    });
  }, [index, onValueChange]);
  return (
    <span
      ref={ref}
      aria-hidden
      className={cn("", className, isSelected ? "bg-muted" : "")}
      {...props}
    >
      <DotsHorizontalIcon className="h-4 w-4 " />
      <span className="sr-only">More pages</span>
    </span>
  );
});

BreadCrumbEllipsis.displayName = "BreadCrumbEllipsis";

export const BreadCrumbPopover = forwardRef<
  PopoverPrimitive.PopoverProps,
  React.HTMLAttributes<HTMLDivElement>
>(({ children }, ref) => {
  const { open, onOpenChange } = useBreadcrumb();
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      {children}
    </Popover>
  );
});

BreadCrumbPopover.displayName = "BreadCrumbPopover";

export const BreadCrumbTrigger = PopoverTrigger;

BreadCrumbTrigger.displayName = "BreadCrumbTrigger";

export const BreadCrumbContent = forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ children, ...props }, ref) => {
  return (
    <PopoverContent {...props} ref={ref}>
      {children}
    </PopoverContent>
  );
});

BreadCrumbContent.displayName = "BreadCrumbContent";