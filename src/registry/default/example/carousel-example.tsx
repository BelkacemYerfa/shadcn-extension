"use client";

import {
  Carousel,
  CarouselMainContainer,
  CarouselThumbsContainer,
  SliderMainItem,
  SliderThumbItem,
} from "@/registry/default/extension/carousel";

const CarouselExample = () => {
  return (
    <Carousel
      orientation="vertical"
      className="max-w-xs w-full h-fit flex items-center gap-2 "
    >
      <div className="relative basis-3/4 ">
        <CarouselMainContainer className="h-60">
          {Array.from({ length: 10 }).map((_, index) => (
            <SliderMainItem
              key={index}
              className="border border-muted flex items-center justify-center h-52 rounded-md"
            >
              <span>Slide {index + 1}</span>
            </SliderMainItem>
          ))}
        </CarouselMainContainer>
      </div>
      <CarouselThumbsContainer className="h-60 basis-1/4">
        {Array.from({ length: 10 }).map((_, index) => (
          <SliderThumbItem key={index} index={index}>
            <span className="border border-muted flex items-center justify-center h-full w-full rounded-md">
              Slide {index + 1}
            </span>
          </SliderThumbItem>
        ))}
      </CarouselThumbsContainer>
    </Carousel>
  );
};

export default CarouselExample;
