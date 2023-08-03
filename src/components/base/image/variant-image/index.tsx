import { type FC } from "react";

import { cn } from "~/utils/class";
import { src as imgSrc, urlVariants } from "~/utils/kset-image";

import AppImage, { type AppImageProps } from "../app-image";

const VariantImage: FC<
  AppImageProps & {
    aspectRatio?: number;
  }
> = ({ src, alt, aspect, aspectRatio, ...props }) => {
  const ratio = aspectRatio ?? aspect?.ratio ?? 3 / 2;

  if (!src) {
    return <div />;
  }

  src = imgSrc(src);

  return (
    <AppImage
      {...props}
      alt={alt}
      className={cn(props.className, "backdrop-blur-lg backdrop-saturate-150")}
      src={src}
      aspect={{
        ratio,
        style: {
          backgroundImage: urlVariants(src),
          ...aspect?.style,
        },
        ...aspect,
      }}
    />
  );
};

export default VariantImage;
