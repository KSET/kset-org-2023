import Image from "next/image";
import Link from "next/link";
import { type FC, type HTMLProps } from "react";
import { RiArrowRightSLine as IconChevronRight } from "react-icons/ri";

import KsetLogo from "~/assets/common/kset-logo.png";
import { cn } from "~/utils/class";

export const BaseFooter: FC<HTMLProps<HTMLElement>> = (props) => {
  return (
    <footer
      {...props}
      className={cn(
        "pb-safe mt-auto overflow-hidden bg-secondary",
        props.className,
      )}
    >
      <div className="container flex flex-wrap-reverse gap-8 pb-20 pt-8 max-br:pb-8">
        <div className="flex-auto">
          <Link href="/">
            <Image
              priority
              alt="KSET Logo"
              className="h-8 w-auto object-contain object-left"
              sizes="100vw"
              src={KsetLogo}
            />
          </Link>
          <span className="text-xs tracking-widest opacity-80">
            &copy; SS FER
          </span>
        </div>
        <div className="ml-auto flex flex-initial gap-14 [&>div>ul>li>a:hover]:underline">
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
            <ul className={cn("space-y-4 leading-none")}>
              <li className="flex uppercase">
                <IconChevronRight className="mr-1 text-primary" />
                <a href="https://www.facebook.com/KSETZg">Facebook</a>
              </li>
              <li className="flex uppercase">
                <IconChevronRight className="mr-1 text-primary" />
                <a href="https://www.instagram.com/klubkset">Instagram</a>
              </li>
              <li className="flex uppercase">
                <IconChevronRight className="mr-1 text-primary" />
                <a href="https://www.youtube.com/user/KsetVideo">YouTube</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
