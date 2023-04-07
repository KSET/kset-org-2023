import { Mulish } from "next/font/google";
import { type FC, type PropsWithChildren } from "react";

import { BaseHeader } from "~/components/base/header";
import { cn } from "~/utils/class";

const font = Mulish({
  subsets: ["latin-ext"],
  fallback: ["sans-serif"],
});

export const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-7xl flex-col gap-14 p-12",
        font.className,
      )}
    >
      <BaseHeader />
      <main className={font.className}>{children}</main>
    </div>
  );
};
