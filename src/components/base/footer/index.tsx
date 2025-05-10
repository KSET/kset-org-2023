import Image from "next/image";
import Link from "next/link";
import { type FC, type HTMLProps } from "react";
import { RiArrowRightSLine as IconChevronRight } from "react-icons/ri";
import { FaInstagram, FaFacebookF, FaYoutube, FaTiktok } from "react-icons/fa";

import KsetLogo from "~/assets/common/kset-logo.png";
import { cn } from "~/utils/class";

export const BaseFooter: FC<HTMLProps<HTMLElement>> = (props) => {
  return (
    <footer
      {...props}
      className={cn(
        "pb-safe mt-auto bg-secondary",
        props.className,
      )}
    >
      <div className="w-full flex flex-col px-8 py-8 gap-y-8 md:flex-row md:flex-wrap md:gap-x-8 md:pb-20 md:pt-8 lg:justify-between">

        <div className="flex flex-col items-start md:flex-auto">
          <Link href="/">
            <Image
              priority
              alt="KSET Logo"
              className="h-8 w-auto object-contain object-left"
              sizes="100vw"
              src={KsetLogo}
            />
          </Link>
          <span className="text-xs tracking-widest opacity-80 mt-2">
            © SS FER
          </span>
        </div>

        <div className="flex flex-col items-start text-left md:ml-auto">
          <h4 className="text-xs uppercase tracking-widest text-white/60 mb-2">Prati nas</h4>
          <div className="flex flex-row items-center gap-4 text-white text-xl">
            <a href="https://www.instagram.com/klubkset" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/KSETZg" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://www.youtube.com/user/KsetVideo" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
            <a href="https://www.tiktok.com/@klubkset" target="_blank" rel="noopener noreferrer">
              <FaTiktok />
            </a>
          </div>
        </div>

        <div className="flex flex-col w-full md:w-auto border-b">
          <h4 className="text-xs uppercase tracking-widest text-white/60">Pretplati se na newsletter</h4>
          <form className="mt-1 flex  overflow-hidden bg-[#2c2b2c] sm:w-[300px]">
            <input
              type="email"
              name="email"
              placeholder="Unesi svoju e-adresu"
              className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-white/50 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="flex items-center justify-center bg-[#ff9900] px-3"
            >
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </form>
        </div>

        <div className="flex flex-col w-full md:w-auto">
          <ul className="space-y-4 leading-none">
            <li>Pravila i uvijeti korištenja</li>
            <li>Impressum</li>
            <li>Zaštita privatnosti</li>
            <li>
              <Link href="/contact">Kontakt</Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col order-last md:order-none md:ml-10">
          <ul className={cn("space-y-4 leading-none")}>
            <li className="flex uppercase">
              <IconChevronRight className="mr-3 text-primary" />
              <a href="">SS FER</a>
            </li>
            <li className="flex uppercase">
              <IconChevronRight className="mr-3 text-primary" />
              <a href="">FER</a>
            </li>
            <li className="flex uppercase">
              <IconChevronRight className="mr-3 text-primary" />
              <a href="">A1</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};