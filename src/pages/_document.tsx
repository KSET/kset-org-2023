import { Head, Html, Main, NextScript } from "next/document";
import { type FC, Suspense } from "react";

const Document: FC = () => {
  return (
    <Suspense fallback={<h1>Loading!</h1>}>
      <Html lang="hr" className="bg-off-black text-white">
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
