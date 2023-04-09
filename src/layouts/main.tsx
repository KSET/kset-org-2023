import { type FC, type PropsWithChildren } from "react";

import { BaseHeader } from "~/components/base/header";
import { cn } from "~/utils/class";
import { fontDisplay } from "~/utils/font";

export const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-7xl flex-col gap-14 p-12",
        fontDisplay.className,
      )}
    >
      <BaseHeader />
      <main>{children}</main>
    </div>
  );
};
