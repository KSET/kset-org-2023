"use client";

import * as Drawer from "@accessible/drawer";
import { type Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FC, type PropsWithChildren, useCallback, useRef } from "react";
import {
  RiCloseLine as IconClose,
  RiMenuLine as IconBurger,
} from "react-icons/ri";

import { cn } from "~/utils/class";

import $style from "./index.module.scss";

export type NavItem<T extends string = string> = {
  text: string;
  href: T extends never ? Route : T;
  active?: (currentPath: string) => boolean;
};

export const NavDrawerItem: FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef(null);
  const closeButton = Drawer.useA11yCloseButton(ref);

  return (
    <div ref={ref} className="contents" {...closeButton}>
      {children}
    </div>
  );
};

export const NavDrawer: FC<{ items: NavItem[] }> = ({ items }) => {
  const pagePathName = usePathname()!;

  const isActive = useCallback(
    <T extends string>(item: NavItem<T>) => {
      if (item.active) {
        return item.active(pagePathName);
      }

      return pagePathName.startsWith(item.href);
    },
    [pagePathName],
  );

  const ifActive = useCallback(
    <T extends string>(item: NavItem<T>, className: string | undefined) => {
      return isActive(item) ? className : "";
    },
    [isActive],
  );

  return (
    <nav className="ml-auto px-4">
      <div className="flex h-full br:hidden">
        <Drawer.Drawer>
          <Drawer.Trigger>
            <button
              className="aspect-square h-full w-full flex-1 opacity-80 transition-opacity hover:opacity-100"
              type="button"
            >
              <IconBurger className="h-full w-full" />
            </button>
          </Drawer.Trigger>

          <Drawer.Target closeOnEscape preventScroll placement="right">
            <div className="z-50 flex h-[100vh] w-full overflow-y-auto overflow-x-hidden bg-off-black transition-all duration-300">
              <div className="container self-stretch py-6">
                <div className="flex p-6 pt-0">
                  <Drawer.CloseButton>
                    <button
                      className="ml-auto h-6 scale-125 opacity-80 transition-opacity hover:opacity-100"
                      type="button"
                    >
                      <IconClose className="h-full w-full" />
                    </button>
                  </Drawer.CloseButton>
                </div>

                <ul className="flex flex-col gap-7">
                  {items.map((item) => (
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
        {items.map((item) => (
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
  );
};
