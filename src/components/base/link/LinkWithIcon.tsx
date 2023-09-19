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

export const LinkWithIcon = ({
  children,
  iconBefore,
  iconAfter,
  ...rest
}: PropsWithChildren<
  Assign<
    LinkProps,
    LinkWithIconPropsStrict & {
      className?: string;
    }
  >
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
export const LinkWithArrow = ({
  children,
  arrowPosition = "after",
  ...rest
}: PropsWithChildren<
  Assign<
    LinkProps,
    LinkWithArrowPropsStrict & {
      className?: string;
    }
  >
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
