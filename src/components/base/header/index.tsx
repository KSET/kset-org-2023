import * as Drawer from "@accessible/drawer";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FC, type PropsWithChildren, useCallback, useRef } from "react";
import {
  RiCloseLine as IconClose,
  RiMenuLine as IconBurger,
} from "react-icons/ri";

import KsetLogo from "~/assets/common/kset-logo.png";
import { cn } from "~/utils/class";

import $style from "./index.module.scss";

const NavDrawerItem: FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef(null);
  const closeButton = Drawer.useA11yCloseButton(ref);

  return (
    <div ref={ref} className="contents" {...closeButton}>
      {children}
    </div>
  );
};

export const BaseHeader: FC = () => {
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
      <nav className="ml-auto px-4">
        <div className="flex h-full br:hidden">
          <Drawer.Drawer>
            <Drawer.Trigger>
              <button className="aspect-square h-full w-full flex-1 opacity-80 transition-opacity hover:opacity-100">
                <IconBurger className="h-full w-full" />
              </button>
            </Drawer.Trigger>

            <Drawer.Target closeOnEscape placement="right" preventScroll={true}>
              <div className="z-50 h-[100vh] w-full overflow-y-auto overflow-x-hidden bg-off-black transition-all duration-300">
                <div className="container pt-6">
                  <div className="flex p-6 pt-0">
                    <Drawer.CloseButton>
                      <button className="ml-auto h-6 scale-125 opacity-80 transition-opacity hover:opacity-100">
                        <IconClose className="h-full w-full" />
                      </button>
                    </Drawer.CloseButton>
                  </div>

                  <ul className="flex flex-col gap-7">
                    {headerItems.map((item) => (
                      <li
                        key={item.text}
                        className={cn(
                          "relative flex pb-1 font-bold uppercase opacity-80 hover:opacity-100",
                          ifActive(item, $style.navLinkActive),
                        )}
                      >
                        <NavDrawerItem>
                          <Link href={item.href}>{item.text}</Link>
                        </NavDrawerItem>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Drawer.Target>
          </Drawer.Drawer>
        </div>
        <ul className="hidden gap-7 br:flex">
          {headerItems.map((item) => (
            <li
              key={item.text}
              className={cn(
                "relative flex pb-1 font-bold uppercase opacity-80 hover:opacity-100",
                ifActive(item, $style.navLinkActive),
              )}
            >
              <Link href={item.href}>{item.text}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
