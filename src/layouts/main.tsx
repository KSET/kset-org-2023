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
      <BaseHeader className="container" />

      <div className={cn("flex flex-1 flex-col", className)}>
        <main>{children}</main>
      </div>

      <BaseFooter />
    </>
  );
};
