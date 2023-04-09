import { type FC, type PropsWithChildren } from "react";

import { BaseHeader } from "~/components/base/header";

export const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-14 p-12">
      <BaseHeader />
      <main>{children}</main>
    </div>
  );
};
