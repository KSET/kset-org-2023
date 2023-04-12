import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";

import KsetLogo from "~/assets/common/kset-logo.png";
import { cn } from "~/utils/class";

import $style from "./index.module.scss";

export const BaseFooter: FC = () => {
  return (
    <footer className="mt-auto bg-secondary">
      <div className="container flex gap-8 pb-20 pt-9">
        <div>
          <Link href="/">
            <Image
              src={KsetLogo}
              alt="KSET Logo"
              priority
              sizes="100vw"
              className="h-8 w-auto object-contain object-left"
            />
          </Link>
          <span className="text-xs tracking-widest opacity-80">
            &copy; SS FER
          </span>
        </div>
        <div className="ml-auto flex gap-14 [&>div>ul>li>a:hover]:underline">
          <div className="text-left">
            <ul className="space-y-4 leading-none">
              <li>
                <Link href="/contact">Kontakt</Link>
              </li>
              <li>Impressum</li>
              <li>Zaštita privatnosti</li>
            </ul>
          </div>
          <div>
            <ul className={cn("space-y-4 leading-none", $style.footerList)}>
              <li>
                <a href="https://www.facebook.com/KSETZg">Facebook</a>
              </li>
              <li>
                <a href="https://www.instagram.com/klubkset">Instagram</a>
              </li>
              <li>
                <a href="https://www.youtube.com/user/KsetVideo">YouTube</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
