import Link from "next/link";
import { siteConfig } from "@/config/site";

const links = [
  { href: "/about", label: "사이트 소개" },
  { href: "/author", label: "운영자 소개" },
  { href: "/contact", label: "문의하기" },
  { href: "/privacy", label: "개인정보 처리방침" },
  { href: "/terms", label: "이용약관" },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-4xl px-4 py-8 text-sm text-zinc-500">
        <nav className="flex flex-wrap gap-x-4 gap-y-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-zinc-800">
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="mt-4">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
