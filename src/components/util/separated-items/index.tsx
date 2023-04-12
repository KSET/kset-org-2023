import { type FC, type HTMLProps, type PropsWithChildren } from "react";

import { cn } from "~/utils/class";

import $style from "./index.module.scss";

export const SeparatedItems: FC<
  PropsWithChildren<HTMLProps<HTMLDivElement>> & {
    spacing?: `${number}px` | `${number}em` | `${number}rem`;
  }
> = ({ children, className, ...props }) => {
  return (
    <div {...props} className={cn("divide-x", $style.container, className)}>
      {children}
    </div>
  );
};
