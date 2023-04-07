import { Head, Html, Main, NextScript } from "next/document";
import { type FC } from "react";

const Document: FC = () => {
  return (
    <Html lang="hr" className="bg-[#1E1E22] text-white">
      <Head />
      <body className="flex min-h-screen flex-col justify-stretch">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
