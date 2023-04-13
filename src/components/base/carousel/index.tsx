import useEmblaCarousel, { type EmblaOptionsType } from "embla-carousel-react";
import {
  type FC,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  RiArrowLeftSLine as IconChevronLeft,
  RiArrowRightSLine as IconChevronRight,
} from "react-icons/ri";

import { type Dict } from "~/types/object";

const CarouselItem: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      className="min-w-0 flex-shrink-0 flex-grow-0"
      style={{
        flexBasis: "var(--slide-size, 100%)",
      }}
    >
      {children}
    </div>
  );
};

export const Carousel: FC<
  PropsWithChildren<
    EmblaOptionsType & {
      displayed?: number;
    }
  >
> & {
  Item: typeof CarouselItem;
} = ({ children, displayed, ...emblaOptions }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    ...emblaOptions,
  });
  const slideSize = useMemo(() => 100 / (displayed ?? 1), [displayed]);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) {
      return;
    }
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="grid grid-cols-[2em_minmax(0,1fr)_2em]">
      <div className="self-center justify-self-center">
        <button
          disabled={!prevBtnEnabled}
          className="block transform transition-transform hover:-translate-x-0.5 disabled:grayscale"
          onClick={scrollPrev}
          role="button"
          aria-label="Previous image"
        >
          <IconChevronLeft className="text-primary" size="1.5rem" />
        </button>
      </div>
      <div ref={emblaRef} className="overflow-clip">
        <div
          className="flex"
          style={
            {
              "--slide-size": `${slideSize}%`,
            } as Dict
          }
        >
          {children}
        </div>
      </div>
      <div className="self-center justify-self-center">
        <button
          disabled={!nextBtnEnabled}
          className="block transform transition-transform hover:translate-x-0.5 disabled:grayscale"
          onClick={scrollNext}
          role="button"
          aria-label="Next image"
        >
          <IconChevronRight className="text-primary" size="1.5rem" />
        </button>
      </div>
    </div>
  );
};

Carousel.Item = CarouselItem;
