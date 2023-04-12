import { type FC, type PropsWithChildren } from "react";

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html>
      <body>ligma balls {children}</body>
    </html>
  );
};

export default RootLayout;
