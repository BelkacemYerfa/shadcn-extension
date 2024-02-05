"use client";

import {
  Dispatch,
  JSXElementConstructor,
  SetStateAction,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { createContext } from "react";

type CarouselContextProps = {
  carouselOptions?: EmblaOptionsType;
  activeKeyboard?: boolean;
};

type CarouselContextType = {
  emblaMainApi: ReturnType<typeof useEmblaCarousel>[1];
  mainRef: ReturnType<typeof useEmblaCarousel>[0];
  thumbsRef: ReturnType<typeof useEmblaCarousel>[0];
  scrollNext: () => void;
  scrollPrev: () => void;
  canScrollNext: boolean;
  canScrollPrev: boolean;
  activeIndex: number;
  onThumbClick: (index: number) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
} & CarouselContextProps;

export const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a CarouselProvider");
  }
  return context;
};

const CarouselContext = createContext<CarouselContextType | null>(null);

export const CarouselProvider = forwardRef<
  HTMLDivElement,
  CarouselContextProps & React.HTMLAttributes<HTMLDivElement>
>(({ carouselOptions, activeKeyboard, children, className, ...props }, ref) => {
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(carouselOptions);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });
  const [canScrollPrev, setCanScrollPrev] = useState<boolean>(false);
  const [canScrollNext, setCanScrollNext] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!emblaMainApi) return;
      if (event.key === "ArrowLeft") {
        emblaMainApi.scrollPrev();
      } else if (event.key === "ArrowRight") {
        emblaMainApi.scrollNext();
      }
    },
    [emblaMainApi]
  );

  const ScrollNext = useCallback(() => {
    if (!emblaMainApi) return;
    emblaMainApi.scrollNext();
  }, [emblaMainApi]);

  const ScrollPrev = useCallback(() => {
    if (!emblaMainApi) return;
    emblaMainApi.scrollPrev();
  }, [emblaMainApi]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    const selected = emblaMainApi.selectedScrollSnap();
    setActiveIndex(selected);
    emblaThumbsApi.scrollTo(selected);
    setCanScrollPrev(emblaMainApi.canScrollPrev());
    setCanScrollNext(emblaMainApi.canScrollNext());
  }, [emblaMainApi, emblaThumbsApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
    return () => {
      emblaMainApi.off("select", onSelect);
      emblaMainApi.off("reInit", onSelect);
    };
  }, [emblaMainApi, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        emblaMainApi,
        mainRef: emblaMainRef,
        thumbsRef: emblaThumbsRef,
        scrollNext: ScrollNext,
        scrollPrev: ScrollPrev,
        canScrollNext,
        canScrollPrev,
        activeIndex,
        onThumbClick,
        handleKeyDown,
      }}
    >
      <div
        tabIndex={0}
        ref={ref}
        onKeyDownCapture={activeKeyboard ? handleKeyDown : undefined}
        className={cn(
          "grid gap-2 w-full relative focus:outline-none",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
});

CarouselProvider.displayName = "CarouselProvider";

export const CarouselMainContainer = forwardRef<
  HTMLDivElement,
  {} & React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { mainRef } = useCarousel();
  return (
    <div ref={mainRef} {...props} className={cn("overflow-hidden", className)}>
      <div ref={ref} className="flex items-center w-full">
        {children}
      </div>
    </div>
  );
});

CarouselMainContainer.displayName = "CarouselMainContainer";

export const CarouselThumbsContainer = forwardRef<
  HTMLDivElement,
  {} & React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { thumbsRef } = useCarousel();
  return (
    <div ref={thumbsRef} {...props} className={cn("overflow-hidden")}>
      <div ref={ref} className={cn("flex items-center w-full", className)}>
        {children}
      </div>
    </div>
  );
});

CarouselThumbsContainer.displayName = "CarouselThumbsContainer";

export const SliderMainItem = forwardRef<
  HTMLDivElement,
  {} & React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className={cn("px-1 flex min-w-0 shrink-0 grow-0 basis-full", className)}
    >
      {children}
    </div>
  );
});

SliderMainItem.displayName = "SliderMainItem";

export const SliderMiniItem = forwardRef<
  HTMLDivElement,
  {
    index: number;
  } & React.HTMLAttributes<HTMLDivElement>
>(({ className, index, children, ...props }, ref) => {
  const { activeIndex, onThumbClick } = useCarousel();
  const isSlideActive = activeIndex === index;
  return (
    <div
      {...props}
      ref={ref}
      onClick={() => onThumbClick(index)}
      className={cn("basis-1/3 px-1 min-w-0 shrink-0 grow-0", className)}
    >
      <div
        className={`relative aspect-square h-20 w-full   opacity-40 rounded-md transition-opacity ${
          isSlideActive ? "!opacity-100" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
});

SliderMiniItem.displayName = "SliderMiniItem";

export const CarouselPrevious = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { canScrollPrev, scrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn("absolute h-8 w-8 rounded-full hidden sm:flex ", className)}
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      {...props}
    >
      <ChevronLeftIcon className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

export const CarouselNext = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { canScrollNext, scrollNext } = useCarousel();
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn("absolute h-8 w-8 rounded-full hidden sm:flex ", className)}
      onClick={scrollNext}
      disabled={!canScrollNext}
      {...props}
    >
      <ChevronRightIcon className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";
