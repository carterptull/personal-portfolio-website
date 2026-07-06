import Link from "next/link";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="bevel-up mb-4 bg-chrome px-3 py-2">
      <nav aria-label="Site" className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="font-pixel font-bold text-scarlet">Carter Tull</span>
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-pixel text-sm underline underline-offset-2 hover:text-scarlet"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
