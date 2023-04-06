import { BaseHeader } from "./(components)/(header)/header";

type HomeLayoutProps = {
  children: React.ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-14 p-12">
      <BaseHeader />
      <main>{children}</main>
    </div>
  );
};

export default HomeLayout;
