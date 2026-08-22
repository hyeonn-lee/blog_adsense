import Link from "next/link";
import { Container } from "@/components/Container";
import { siteConfig } from "@/config/site";
import { getActiveCategories } from "@/lib/posts";

export function Footer() {
  const categories = getActiveCategories();

  return (
    <footer className="mt-20 border-t border-border bg-primary text-primary-foreground">
      <Container className="py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="font-serif text-2xl font-black">{siteConfig.name}</div>
            <p className="mt-3 max-w-xs text-base leading-relaxed text-primary-foreground/70">
              {siteConfig.slogan}
            </p>
          </div>

          {categories.length > 0 && (
            <FooterCol
              title="카테고리"
              links={categories.map((c) => ({ label: c.name, href: `/category/${c.id}` }))}
            />
          )}

          <FooterCol
            title="안내"
            links={[
              { label: "사이트 소개", href: "/about" },
              { label: "운영자 소개", href: "/author" },
              { label: "문의하기", href: "/contact" },
              { label: "개인정보처리방침", href: "/privacy" },
              { label: "이용약관", href: "/terms" },
            ]}
          />

          <div>
            <div className="mb-3 text-sm font-bold tracking-widest text-primary-foreground/60 uppercase">문의</div>
            <p className="text-base text-primary-foreground/80">{siteConfig.contactEmail}</p>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/15 pt-6 text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} {siteConfig.name} ({siteConfig.domain}). 본 사이트의 정보는
          참고용이며, 정확한 진단과 치료는 전문의와 상담하시기 바랍니다.
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="mb-3 text-sm font-bold tracking-widest text-primary-foreground/60 uppercase">{title}</div>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-base text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
