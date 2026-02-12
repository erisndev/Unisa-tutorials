import { Link } from "react-router-dom";
import {
  PageTransition,
  FadeIn,
  FadeInUp,
  StaggerContainer,
  StaggerOnMount,
  StaggerItem,
  HoverCard,
} from "../components/motion";

const values = [
  {
    icon: "🎯",
    title: "Clarity over complexity",
    desc: "We break down difficult concepts into simple, digestible steps.",
  },
  {
    icon: "📐",
    title: "Structure & consistency",
    desc: "Every tutorial follows a clear plan aligned to your module outcomes.",
  },
  {
    icon: "🛠️",
    title: "Practical learning",
    desc: "Focus on exam preparation, past papers, and real understanding.",
  },
  {
    icon: "🤝",
    title: "Supportive community",
    desc: "Group sessions let you learn alongside peers facing the same challenges.",
  },
];

const milestones = [
  { value: "2024", label: "Founded" },
  { value: "500+", label: "Students helped" },
  { value: "3", label: "Faculties covered" },
  { value: "98%", label: "Satisfaction rate" },
];

export default function AboutPage() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="page-hero">
        <div className="container section-sm">
          <FadeInUp>
            <span className="badge-primary mb-4">About us</span>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl max-w-3xl">
              Helping UNISA students{" "}
              <span className="gradient-text">pass with confidence</span>
            </h1>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Erisn is a tutorial booking platform built specifically for UNISA
              students. We connect you with experienced tutors for the exact
              modules you need — no more, no less.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b">
        <div className="container section-sm">
          <StaggerOnMount className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {milestones.map((m) => (
              <StaggerItem key={m.label}>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">{m.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{m.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerOnMount>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            <FadeIn className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Our mission</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  To make quality academic support accessible and affordable for
                  every UNISA student. We believe that with the right guidance,
                  anyone can succeed in their studies.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="card p-6">
                  <div className="text-2xl mb-3">🔭</div>
                  <h3 className="text-base font-semibold">Vision</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    A future where every distance-learning student has access to
                    affordable, high-quality tutorial support.
                  </p>
                </div>
                <div className="card p-6">
                  <div className="text-2xl mb-3">💡</div>
                  <h3 className="text-base font-semibold">Approach</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Module-specific tutorials with flexible packages so you only
                    pay for what you need.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="card p-6 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold">Why choose Erisn?</h3>
                  <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    {[
                      "Per-module pricing — no bundles",
                      "Aligned to UNISA faculties & courses",
                      "Private or group session options",
                      "Experienced, vetted tutors",
                      "Simple 3-step booking process",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Link className="btn-primary" to="/courses">
                    Browse Courses
                  </Link>
                  <Link className="btn-outline" to="/book">
                    Book a Tutorial
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t bg-card/50">
        <div className="container section">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                What we stand for
              </h2>
              <p className="mt-3 text-muted-foreground">
                Our values shape every tutorial session and every interaction.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <HoverCard>
                  <div className="card-interactive p-6 text-center h-full">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-2xl">
                      {v.icon}
                    </div>
                    <h3 className="mt-4 text-sm font-semibold">{v.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </PageTransition>
  );
}
