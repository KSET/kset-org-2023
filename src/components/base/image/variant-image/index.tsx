import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { type FC } from "react";

import { src as imgSrc, urlVariants } from "~/utils/kset-image";

const VariantImage: FC<{
  src: string | undefined | null;
  alt: string;
  aspectRatio?: number;
}> = ({ src, alt, aspectRatio = 3 / 2 }) => {
  if (!src) {
    return <div />;
  }

  src = imgSrc(src);

  return (
    <AspectRatio
      ratio={aspectRatio}
      className="bg-cover bg-center bg-no-repeat object-cover"
      style={{
        backgroundImage: urlVariants(src),
      }}
    >
      <img
        className="h-full w-full object-contain backdrop-blur-lg backdrop-saturate-150"
        alt={alt}
        src={src}
        decoding="async"
        loading="lazy"
      />
    </AspectRatio>
  );
};

export default VariantImage;
