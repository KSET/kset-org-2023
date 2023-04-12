import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";

import KsetLogo from "~/assets/common/kset-logo.png";
import { cn } from "~/utils/class";

import $style from "./index.module.scss";

export const BaseHeader: React.FC = () => {
  type NavItem = {
    text: string;
    href: string;
    active?: (currentPath: string) => boolean;
  };

  const headerItems: NavItem[] = [
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
  ];
  const { pathname: pagePathName } = useRouter();

  const isActive = useCallback(
    (item: NavItem) => {
      if (item.active) {
        return item.active(pagePathName);
      }

      return pagePathName.startsWith(item.href);
    },
    [pagePathName],
  );

  const ifActive = useCallback(
    (item: NavItem, className: string | undefined) => {
      return isActive(item) ? className : "";
    },
    [isActive],
  );

  return (
    <header className="relative mb-14 mt-12 flex h-8">
      <Link href="/">
        <Image
          src={KsetLogo}
          alt="KSET Logo"
          priority
          sizes="100vw"
          className="h-full w-auto object-contain object-left"
        />
      </Link>
      <nav className="ml-auto px-4">
        <ul className="hidden gap-7 lg:flex">
          {headerItems.map((item) => (
            <li
              className={cn(
                "relative flex pb-1 font-bold uppercase opacity-80 hover:opacity-100",
                ifActive(item, $style.navLinkActive),
              )}
              key={item.text}
            >
              <Link href={item.href}>{item.text}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
