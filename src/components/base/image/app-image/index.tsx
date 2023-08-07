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

const Img: FC<AppImageProps> = ({ src, mode = "contain", ...props }) => {
  return (
    <img
      {...props}
      alt={props.alt}
      decoding="async"
      loading="lazy"
      src={src ?? undefined}
      className={cn(
        props.className,
        "h-full w-full",
        mode === "contain" ? "object-contain" : "object-cover",
      )}
    />
  );
};

const AppImage: FC<AppImageProps> = ({ aspect, ...props }) => {
  if (!aspect) {
    return (
      <div className="relative w-full">
        <Img {...props} />
      </div>
    );
  }

  return (
    <AspectRatio
      {...aspect}
      className={cn(
        aspect.className,
        "bg-cover bg-center bg-no-repeat object-cover",
      )}
    >
      <Img {...props} />
    </AspectRatio>
  );
};

export default AppImage;
