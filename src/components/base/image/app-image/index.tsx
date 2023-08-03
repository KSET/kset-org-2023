import { type DetailedHTMLProps, type FC, type ImgHTMLAttributes } from "react";

import { cn } from "~/utils/class";
import { type Src } from "~/utils/kset-image";

import AspectRatio, { type AspectRatioProps } from "../../aspect-ratio";

export type ImgProps = DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

type LocalAppImageProps = {
  src: Src;
  alt: string;
  mode?: "contain" | "cover";
  aspect?: AspectRatioProps;
};

export type AppImageProps = Omit<ImgProps, keyof LocalAppImageProps> &
  LocalAppImageProps;

const AppImage: FC<AppImageProps> = ({
  src,
  alt,
  aspect,
  mode = "contain",
  ...props
}) => {
  return (
    <AspectRatio
      {...aspect}
      className={cn(
        aspect?.className,
        "bg-cover bg-center bg-no-repeat object-cover",
      )}
    >
      <img
        {...props}
        alt={alt}
        decoding="async"
        loading="lazy"
        src={src ?? undefined}
        className={cn(
          props.className,
          "h-full w-full",
          mode === "contain" ? "object-contain" : "object-cover",
        )}
      />
    </AspectRatio>
  );
};

export default AppImage;
