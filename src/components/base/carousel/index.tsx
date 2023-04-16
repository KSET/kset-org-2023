import useEmblaCarousel, { type EmblaOptionsType } from "embla-carousel-react";
import {
  type FC,
  type HTMLProps,
  type MouseEventHandler,
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
import { cn } from "~/utils/class";

const CarouselItem: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-w-0 flex-shrink-0 flex-grow-0 basis-[var(--slide-size-override,var(--slide-size,100%))]">
      {children}
    </div>
  );
};

const CarouselArrow: FC<{
  enabled: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  direction: "left" | "right";
}> = ({ enabled, onClick, direction }) => {
  const Icon = direction === "left" ? IconChevronLeft : IconChevronRight;
  const label = direction === "left" ? "Previous" : "Next";

  return (
    <div className="self-center justify-self-center">
      <button
        aria-label={label}
        disabled={!enabled}
        role="button"
        className={cn(
          "block transform transition-transform disabled:grayscale",
          direction === "left"
            ? "hover:-translate-x-0.5"
            : "hover:translate-x-0.5",
        )}
        onClick={onClick}
      >
        <Icon className="h-10 w-10 text-primary" />
      </button>
    </div>
  );
};

export const Carousel: FC<
  PropsWithChildren<
    HTMLProps<HTMLDivElement> & {
      displayed?: number;
      options?: EmblaOptionsType;
    }
  >
> & {
  Item: typeof CarouselItem;
} = ({ children, displayed, options: emblaOptions, ...divProps }) => {
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
    <div
      {...divProps}
      className={cn(
        "grid grid-cols-[2em_minmax(0,1fr)_2em]",
        divProps.className,
      )}
    >
      <CarouselArrow
        direction="left"
        enabled={prevBtnEnabled}
        onClick={scrollPrev}
      />
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
      <CarouselArrow
        direction="right"
        enabled={nextBtnEnabled}
        onClick={scrollNext}
      />
    </div>
  );
};

Carousel.Item = CarouselItem;
