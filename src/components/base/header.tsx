import Image from "next/image";
import Link from "next/link";

import KsetLogo from "./kset.png";

export const BaseHeader: React.FC = () => {
  const headerItems = [
    {
      text: "Program",
      href: "/arhiva/dogadaji",
    },
    {
      text: "Vijesti",
      href: "/arhiva/vijesti",
    },
    {
      text: "O klubu",
      href: "/club",
    },
    {
      text: "Sekcije",
      href: "/club/divisions",
    },
    {
      text: "Kontakt",
      href: "/kontakt",
    },
    {
      text: "Multimedija",
      href: "/club/multimedia",
    },
  ];

  return (
    <header className="relative flex h-8">
      <Link href="/">
        <Image
          src={KsetLogo}
          alt="KSET Logo"
          priority
          sizes="100vw"
          className="h-full w-auto object-contain object-left"
        />
      </Link>
      <nav className="ml-auto">
        <ul className="flex gap-7">
          {headerItems.map((item) => (
            <li
              className="relative flex font-bold uppercase opacity-80 hover:opacity-100"
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
