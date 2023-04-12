import { type FC, type PropsWithChildren } from "react";

import { BaseFooter } from "~/components/base/footer";
import { BaseHeader } from "~/components/base/header";
import { cn } from "~/utils/class";

export const MainLayout: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  return (
    <>
      <div className={cn("container flex flex-1 flex-col pb-20", className)}>
        <BaseHeader />
        <main>{children}</main>
      </div>
      <BaseFooter />
    </>
  );
};
