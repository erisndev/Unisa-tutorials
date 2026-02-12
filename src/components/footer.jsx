import { Link } from "react-router-dom";
import { FadeIn, StaggerContainer, StaggerItem } from "./motion";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "Courses", to: "/courses" },
      { label: "Book a Tutorial", to: "/book" },
      { label: "About Us", to: "/about" },
      { label: "Our Team", to: "/team" },
    ],
  },
  {
    title: "Contact",
    items: [
      "support@erisn.example",
      "+27 11 123 4567",
      "Mon–Fri, 09:00–17:00",
    ],
  },
  {
    title: "Social",
    externals: [
      { label: "LinkedIn", href: "#" },
      { label: "YouTube", href: "#" },
      { label: "X (Twitter)", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-card/50">
      <div className="container section-sm">
        <StaggerContainer className="grid gap-10 md:grid-cols-5">
          {/* Brand */}
          <StaggerItem className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md shadow-primary/20">
                E
              </span>
              <div className="leading-tight">
                <div className="text-sm font-bold tracking-tight">Erisn</div>
                <div className="text-[11px] text-muted-foreground">UNISA Tutorials</div>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Affordable university tutorial sessions — book per module, learn at
              your pace, and pass with confidence.
            </p>
          </StaggerItem>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <StaggerItem key={col.title} className="space-y-3">
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {col.links?.map((l) => (
                  <li key={l.to}>
                    <Link
                      className="hover:text-foreground transition-colors"
                      to={l.to}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                {col.items?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
                {col.externals?.map((ext) => (
                  <li key={ext.label}>
                    <a
                      className="hover:text-foreground transition-colors"
                      href={ext.href}
                      rel="noreferrer"
                    >
                      {ext.label}
                    </a>
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      <div className="border-t">
        <FadeIn className="container flex flex-col gap-2 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Erisn UNISA Tutorials. All rights reserved.</p>
          <p>Built with React + Tailwind + Framer Motion</p>
        </FadeIn>
      </div>
    </footer>
  );
}
