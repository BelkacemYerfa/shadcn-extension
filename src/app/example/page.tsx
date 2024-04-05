"use client";
import {
  Carousel,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
  SliderMainItem,
  SliderThumbItem,
} from "@/registry/default/extension/carousel";

export default function ExamplePage() {
  return (
    <main className="py-20 max-w-sm w-full mx-auto ">
      <div className=" p-5 bg-muted rounded-md w-full">
        <RTLComponentSupport />
      </div>
    </main>
  );
}

const RTLComponentSupport = () => {
  return (
    <div className="space-y-2">
      <Carousel orientation="horizontal" dir="rtl">
        <CarouselMainContainer>
          {Array.from({ length: 10 }).map((_, index) => (
            <SliderMainItem
              key={index}
              className="border border-muted flex items-center justify-center h-52 rounded-md"
            >
              Slide {index + 1}
            </SliderMainItem>
          ))}
        </CarouselMainContainer>
        <CarouselThumbsContainer>
          {Array.from({ length: 10 }).map((_, index) => (
            <SliderThumbItem
              key={index}
              index={index}
              className="rounded-md bg-transparent"
            >
              <span className="border border-muted flex items-center justify-center h-full w-full rounded-md cursor-pointer bg-background">
                Slide {index + 1}
              </span>
            </SliderThumbItem>
          ))}
        </CarouselThumbsContainer>
      </Carousel>

      <Carousel
        orientation="vertical"
        className="flex items-center gap-2"
        carouselOptions={{
          direction: "rtl",
        }}
      >
        <div className="relative basis-3/4 ">
          <CarouselMainContainer className="h-60">
            {Array.from({ length: 10 }).map((_, index) => (
              <SliderMainItem
                key={index}
                className="border border-muted flex items-center justify-center h-52 rounded-md"
              >
                Slide {index + 1}
              </SliderMainItem>
            ))}
          </CarouselMainContainer>
        </div>
        <CarouselThumbsContainer className="h-60 basis-1/4">
          {Array.from({ length: 10 }).map((_, index) => (
            <SliderThumbItem
              key={index}
              index={index}
              className="rounded-md bg-transparent"
            >
              <span className="border border-muted flex items-center justify-center h-full w-full rounded-md cursor-pointer bg-background">
                Slide {index + 1}
              </span>
            </SliderThumbItem>
          ))}
        </CarouselThumbsContainer>
      </Carousel>
    </div>
  );
};
