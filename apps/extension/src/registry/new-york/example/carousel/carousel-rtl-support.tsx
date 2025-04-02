"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Carousel,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  SliderMainItem,
  CarouselThumbsContainer,
  SliderThumbItem,
  CarouselIndicator,
} from "@/registry/default/extension/carousel";
import { useState } from "react";

const CarouselOrientation = () => {
  const [direction, setDirection] = useState<DirectionType>("ltr");
  return (
    <>
      <Carousel dir={direction}>
        <CarouselNext />
        <CarouselPrevious />
        <CarouselMainContainer className="h-60">
          {Array.from({ length: 5 }).map((_, index) => (
            <SliderMainItem key={index} className="bg-transparent">
              <div className="outline outline-1 outline-border size-full flex items-center justify-center rounded-xl bg-background">
                Slide {index + 1}
              </div>
            </SliderMainItem>
          ))}
        </CarouselMainContainer>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <CarouselThumbsContainer className="gap-x-1 ">
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselIndicator key={index} index={index} />
            ))}
          </CarouselThumbsContainer>
        </div>
      </Carousel>
      <SelectDirection direction={direction} setDirection={setDirection} />
    </>
  );
};

export default CarouselOrientation;

type DirectionType = "rtl" | "ltr";

const OPTIONS = ["rtl", "ltr"];

const SelectDirection = ({
  direction,
  setDirection,
}: {
  direction: DirectionType;
  setDirection: (direction: DirectionType) => void;
}) => {
  return (
    <div className="absolute right-2 top-2">
      <Select
        defaultValue="ghost"
        value={direction}
        onValueChange={setDirection}
      >
        <SelectTrigger
          className="px-2 h-8 bg-background text-sm w-32"
          aria-label="select direction"
        >
          <SelectValue>
            <span className="text-muted-foreground text-xs">Variant : </span>
            <span>{direction}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end">
          {OPTIONS.map((opt, index) => (
            <SelectItem key={`${opt}-${index}`} value={opt} className="text-sm">
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
