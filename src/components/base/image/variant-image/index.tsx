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
      className="bg-cover bg-center bg-no-repeat object-cover"
      ratio={aspectRatio}
      style={{
        backgroundImage: urlVariants(src),
      }}
    >
      <img
        alt={alt}
        className="h-full w-full object-contain backdrop-blur-lg backdrop-saturate-150"
        decoding="async"
        loading="lazy"
        src={src}
      />
    </AspectRatio>
  );
};

export default VariantImage;
