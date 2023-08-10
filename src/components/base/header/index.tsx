import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";

import KsetLogo from "~/assets/common/kset-logo.png";

import { NavDrawer, type NavItem } from "./components";

export const BaseHeader: FC = () => {
  const headerItems = [
    {
      text: "Program",
      href: "/program",
    },
    {
      text: "Vijesti",
      href: "/news",
    },
    {
      text: "O klubu",
      href: "/about",
    },
    {
      text: "Sekcije",
      href: "/divisions",
    },
    {
      text: "Kontakt",
      href: "/contact",
    },
    {
      text: "Multimedija",
      href: "/multimedia",
    },
  ] satisfies NavItem[];

  return (
    <header className="relative mb-6 mt-6 flex h-6 transition-[height,margin] br:mb-14 br:mt-12 br:h-8">
      <Link href="/">
        <Image
          priority
          alt="KSET Logo"
          className="h-full w-auto object-contain object-left"
          sizes="100vw"
          src={KsetLogo}
        />
      </Link>
      <NavDrawer items={headerItems} />
    </header>
  );
};
