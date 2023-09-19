/* eslint-disable jsx-a11y/alt-text */
import { type FC } from "react";

import { type Assign } from "~/types/object";

import AspectRatio, { type AspectRatioProps } from "../aspect-ratio";
import { Carousel, type CarouselProps } from ".";

export type ImageCarouselImage = {
  alt: string;
  src: string;
  aspect?: AspectRatioProps;
};

export type ImageCarouselPropsStrict = {
  images: ImageCarouselImage[];
};

export type ImageCarouselProps = Assign<
  CarouselProps,
  ImageCarouselPropsStrict
>;

export const ImageCarousel: FC<ImageCarouselProps> = ({ images, ...props }) => {
  return (
    <Carousel
      className="max-br:[--slide-size-override:100%]"
      displayed={3}
      {...props}
    >
      {images.map(({ aspect, ...props }) => {
        return (
          <Carousel.Item key={props.src}>
            <AspectRatio ratio={1.2} {...aspect}>
              <img
                className="h-full w-full object-cover"
                decoding="async"
                loading="lazy"
                {...props}
              />
            </AspectRatio>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
};
