const KSET_MEDIA_URL_BASE = "https://www.kset.org/media/";

export type KsetMediaUrlBase = `${typeof KSET_MEDIA_URL_BASE}`;
export type Src = string | null | undefined;
export type MediaUrl<T extends Src> = T extends string
  ? `${KsetMediaUrlBase}${T}`
  : null;
export type CssUrl<T extends Src> = T extends string
  ? `url(${MediaUrl<T>})`
  : null;

export const src = <TSrc extends Src, TRet extends MediaUrl<TSrc>>(
  thumb: TSrc,
): TRet => {
  if (!thumb) {
    return null as TRet;
  }

  if (thumb.startsWith(KSET_MEDIA_URL_BASE)) {
    return thumb as unknown as TRet;
  }

  return `${KSET_MEDIA_URL_BASE}${thumb}` as TRet;
};

export const srcVariant = <
  TSrc extends Src,
  TVariant extends string | null,
  TRet extends MediaUrl<TSrc>,
>(
  baseSrc: TSrc,
  variant: TVariant,
): TRet => {
  if (!baseSrc) {
    return null as TRet;
  }

  baseSrc = src(baseSrc) as unknown as NonNullable<TSrc>;

  if (!variant) {
    return baseSrc as unknown as TRet;
  }

  return baseSrc.replace(/\.([^.]*)$/, `_${variant}.$1`) as TRet;
};

export const urlVariant = <
  TSrc extends Src,
  TVariant extends string | null,
  TRet extends CssUrl<TSrc>,
>(
  thumbSrc: TSrc,
  variant: TVariant,
) => {
  if (!thumbSrc) {
    return null as TRet;
  }

  return `url(${srcVariant(thumbSrc, variant)})` as const;
};

export const urlVariants = <
  TSrc extends Src,
  TVariant extends string | null,
  TRet extends TSrc extends string ? string : null,
>(
  thumbSrc: TSrc,
  variants = ["medium", "fb_thumb", null] as TVariant[],
) => {
  if (!thumbSrc) {
    return null as TRet;
  }

  return variants
    .map((variant) => urlVariant(thumbSrc, variant))
    .join(", ") as TRet;
};
