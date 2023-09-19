import Link from "next/link";
import { type FC } from "react";

import VariantImage from "../base/image/variant-image";

export type GalleryCardProps = {
  id?: string;
  title: string;
  thumb: string;
  slug: string;
  date: string | Date;
  photographer: string | null | undefined;
  aspectRatio?: number;
};

export const GalleryCard: FC<GalleryCardProps> = ({
  id,
  title,
  thumb,
  slug,
  date: dateRaw,
  photographer,
  aspectRatio = 7 / 6,
}) => {
  const date = new Date(dateRaw);

  return (
    <Link
      className="text-white no-underline"
      href={`/multimedia/events/${slug}`}
      id={id}
    >
      <VariantImage
        alt={title}
        aspectRatio={aspectRatio}
        mode="cover"
        src={thumb}
      />

      <div className="mt-2 br:mt-5">
        <div className="text-sm tracking-widest">
          <time dateTime={date.toISOString()}>
            {date.toLocaleDateString("hr-HR")}
          </time>
          <span className="ml-3 mr-5 text-primary">|</span>
          <span>{photographer}</span>
        </div>
        <h4 className="mt-0.5 text-lg font-bold tracking-wide br:mt-2">
          {title}
        </h4>
      </div>
    </Link>
  );
};
