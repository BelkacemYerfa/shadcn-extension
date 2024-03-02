"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Popover } from "@/components/ui/popover";
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
  value: string[];
  onValueChange: Dispatch<SetStateAction<string[]>>;
  onPrevValueChange: Dispatch<SetStateAction<string[]>>;
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
    VariantProps<typeof buttonVariants> {}

export const BreadCrumb = ({
  className,
  variant,
  size,
  children,
  ...props
}: BreadCrumbProps) => {
  const [value, setValue] = useState<string[]>([]);
  const [prevValue, setPrevValue] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(0);
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const length = value.length - 1;
      if (e.key === "ArrowRight" || e.key === "Backspace") {
        const nextIndex = activeIndex + 1 > length ? 0 : activeIndex + 1;
        setActiveIndex(Number(value[nextIndex]));
      } else if (e.key === "ArrowLeft") {
        const currentIndex = value.indexOf(activeIndex.toFixed()) - 1;
        const prevIndex = currentIndex < 0 ? length : currentIndex;
        setActiveIndex(Number(value[prevIndex]));
      } else if (e.key === "Escape") {
        if (activeIndex !== -1) {
          setValue(prevValue);
          if (
            value.includes(activeIndex.toString()) &&
            !prevValue.includes(activeIndex.toString())
          ) {
            setActiveIndex(target);
          }
          setOpen(false);
        } else setActiveIndex(-1);
      } else if (e.key === "Enter" && activeIndex === target) {
        setOpen(true);
      }
    },
    [activeIndex, value, target, prevValue]
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
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & BreadCrumbItemProps
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
  // TOD0 : a way to remove the element inside the popover after the unmount of this component

  useEffect(() => {
    const targetIndex = index.toString();
    onValueChange((prev) => {
      if (prev.includes(targetIndex)) {
        return prev;
      }
      const arr = [...prev, targetIndex];
      return arr.toSorted((a, b) => Number(a) - Number(b));
    });
    return () => {
      onPrevValueChange(value);
    };
  }, [index, onValueChange]);

  return (
    <Button
      ref={ref}
      {...Variants}
      className={cn(className, isSelected ? "bg-muted" : "")}
      {...props}
      onClick={() => setActiveIndex(index)}
    >
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
  { index: number } & React.HTMLAttributes<HTMLSpanElement>
>(({ className, index, ...props }, ref) => {
  const { activeIndex, onValueChange, setTarget } = useBreadcrumb();
  const isSelected = activeIndex === index;
  useEffect(() => {
    setTarget(index);
    const targetIndex = index.toString();
    onValueChange((prev) => {
      if (prev.includes(targetIndex)) {
        return prev;
      }
      const arr = [...prev, targetIndex];
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
