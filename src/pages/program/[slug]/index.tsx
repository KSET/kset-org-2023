import { type NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

const PageProgramItem: NextPage = () => {
  const slug = useRouter().query.slug as string;

  return (
    <>
      <NextSeo title={`Program - ${slug}`} />
      Program
      <pre>{slug}</pre>
    </>
  );
};

export default PageProgramItem;
