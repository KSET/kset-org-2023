import Link, { type LinkProps } from "next/link";
import { type PropsWithChildren, type ReactNode } from "react";
import {
  RxArrowLeft as IconArrowLeft,
  RxArrowRight as IconArrowRight,
} from "react-icons/rx";

import { type Assign } from "~/types/object";
import { cn } from "~/utils/class";

export type LinkWithIconPropsStrict = {
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const LinkWithIcon = <TRouteType extends unknown>({
  children,
  iconBefore,
  iconAfter,
  ...rest
}: PropsWithChildren<
  Assign<LinkProps<TRouteType>, LinkWithIconPropsStrict>
>) => {
  return (
    <Link
      {...rest}
      className={cn(
        "inline-block no-underline hover:underline",
        rest.className,
      )}
    >
      <span className="flex items-center gap-[.5ch] max-br:ml-auto">
        {iconBefore}
        <span className="mb-px">{children}</span>
        {iconAfter}
      </span>
    </Link>
  );
};
export type LinkWithArrowPropsStrict = {
  arrowPosition?: "before" | "after";
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const LinkWithArrow = <TRouteType extends unknown>({
  children,
  arrowPosition = "after",
  ...rest
}: PropsWithChildren<
  Assign<LinkProps<TRouteType>, LinkWithArrowPropsStrict>
>) => {
  return (
    <LinkWithIcon
      {...rest}
      iconAfter={arrowPosition === "after" ? <IconArrowRight /> : null}
      iconBefore={arrowPosition === "before" ? <IconArrowLeft /> : null}
    >
      {children}
    </LinkWithIcon>
  );
};
