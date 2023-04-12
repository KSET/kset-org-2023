import { Head, Html, Main, NextScript } from "next/document";
import { type FC, Suspense } from "react";

import { cn } from "~/utils/class";
import { fontDisplay, fontMono, fontUi } from "~/utils/font";

const Document: FC = () => {
  return (
    <Suspense fallback={<h1>Loading!</h1>}>
      <Html
        lang="hr"
        className={cn(
          "bg-off-black text-white",
          fontUi.className,
          fontUi.variable,
          fontDisplay.variable,
          fontMono.variable,
        )}
      >
        <Head />
        <body className="flex min-h-screen flex-col justify-stretch">
          <Main />
          <NextScript />
        </body>
      </Html>
    </Suspense>
  );
};

export default Document;
