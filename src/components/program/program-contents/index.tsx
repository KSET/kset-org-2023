import { type FC, type HTMLAttributes } from "react";

import { cn } from "~/utils/class";

import $style from "./index.module.scss";

export const ProgramContents: FC<
  HTMLAttributes<HTMLDivElement> & { html?: string | null }
> = ({ html, ...attrs }) => {
  if (!html) {
    return null;
  }

  return (
    <div
      {...attrs}
      className={cn(attrs.className, $style.container)}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
};
