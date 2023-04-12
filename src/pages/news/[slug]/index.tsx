import { type NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

const PageNewsItem: NextPage = () => {
  const slug = useRouter().query.slug as string;

  return (
    <>
      <NextSeo title={`Vijest - ${slug}`} />
      Vijest
      <pre>{slug}</pre>
    </>
  );
};

export default PageNewsItem;
