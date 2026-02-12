import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { faculties, countModules } from "../lib/university";
import {
  PageTransition,
  FadeIn,
  FadeInUp,
  StaggerContainer,
  StaggerOnMount,
  StaggerItem,
  HoverCard,
} from "../components/motion";

const allCourses = faculties.flatMap((f) =>
  f.courses.map((c) => ({ faculty: f, course: c }))
);

const stats = [
  { value: `${faculties.length}`, label: "Faculties" },
  { value: `${allCourses.length}+`, label: "Courses" },
  { value: "4", label: "Package options" },
  { value: "R150", label: "From / module" },
];

const features = [
  {
    icon: "📚",
    title: "Per-module booking",
    desc: "Only pay for the modules you need help with — no bundles, no waste.",
  },
  {
    icon: "👥",
    title: "Flexible packages",
    desc: "Choose 1v1 private sessions or group tutorials up to 50 students.",
  },
  {
    icon: "🎓",
    title: "University-aligned",
    desc: "Content mapped to UNISA faculties, courses, and module codes.",
  },
  {
    icon: "💰",
    title: "Transparent pricing",
    desc: "See the price per module upfront — no hidden fees or surprises.",
  },
];

const testimonials = [
  {
    name: "Lerato M.",
    role: "BSc Computer Science",
    quote:
      "I booked tutorials for CS201 and CS301 — the 1v5 group was affordable and the tutor explained everything clearly.",
  },
  {
    name: "Thabo S.",
    role: "BCom Accounting",
    quote:
      "The per-module pricing saved me money. I only needed help with Taxation and Auditing, not the whole course.",
  },
  {
    name: "Naledi D.",
    role: "BA Psychology",
    quote:
      "Booking was so easy. I picked my modules, chose a package, and was set up in minutes.",
  },
];

export default function HomePage() {
  const featured = allCourses.slice(0, 3);

  return (
    <PageTransition>
      {/* ── HERO ── */}
      <section className="page-hero">
        <div className="container py-16 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <FadeInUp>
                <div className="badge-primary mb-6">
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  UNISA Tutorial Booking Platform
                </div>
              </FadeInUp>

              <FadeInUp delay={0.1}>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl !leading-[1.1]">
                  Book university tutorials{" "}
                  <span className="gradient-text">per module</span>
                </h1>
              </FadeInUp>

              <FadeInUp delay={0.2}>
                <p className="mt-6 max-w-lg text-lg text-muted-foreground leading-relaxed">
                  Select your faculty, course, and the exact modules you need.
                  Choose a package that fits your budget — from private 1v1 to
                  group sessions.
                </p>
              </FadeInUp>

              <FadeInUp delay={0.3}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link className="btn-primary text-base px-7 py-3" to="/courses">
                    Browse Courses
                  </Link>
                  <Link className="btn-outline text-base px-7 py-3" to="/book">
                    Book a Tutorial
                  </Link>
                </div>
              </FadeInUp>

              <StaggerOnMount className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4" stagger={0.06}>
                {stats.map((s) => (
                  <StaggerItem key={s.label}>
                    <div className="rounded-xl border bg-card/80 p-4 text-center backdrop-blur">
                      <div className="text-xl font-bold">{s.value}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerOnMount>
            </div>

            {/* Right visual */}
            <FadeInUp delay={0.2} y={32}>
              <div className="relative">
                <div className="card p-6 lg:p-8">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">How it works</div>
                    <span className="badge-primary">3 steps</span>
                  </div>

                  <div className="mt-6 space-y-4">
                    {[
                      { step: "1", title: "Choose your modules", desc: "Pick faculty → course → modules" },
                      { step: "2", title: "Select a package", desc: "1v1, 1v5, 1v10, or 1v50" },
                      { step: "3", title: "Review & pay", desc: "Confirm details and pay per module" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-start gap-4 rounded-xl border bg-background p-4"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                          {item.step}
                        </span>
                        <div>
                          <div className="text-sm font-semibold">{item.title}</div>
                          <div className="text-xs text-muted-foreground">{item.desc}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-xl bg-primary/5 border border-primary/10 p-4">
                    <div className="text-sm font-semibold">Ready to start?</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Book a tutorial in under 2 minutes.
                    </div>
                    <Link className="btn-primary mt-4 w-full" to="/book">
                      Book Now
                    </Link>
                  </div>
                </div>

                {/* Decorative blurs */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/8 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-indigo-500/8 blur-3xl" />
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* ── FEATURED COURSES ── */}
      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Popular courses
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Explore faculties and find the modules you need.
                </p>
              </div>
              <Link className="btn-secondary" to="/courses">
                View all courses
              </Link>
            </div>
          </FadeIn>

          <StaggerContainer className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map(({ faculty, course }) => (
              <StaggerItem key={`${faculty.id}:${course.id}`}>
                <HoverCard>
                  <Link
                    to={`/courses/${faculty.id}/${course.id}`}
                    className="card-interactive block p-6"
                  >
                    <div className="flex items-center justify-between">
                      <span className="badge-primary">{course.level}</span>
                      <span className="text-xs text-muted-foreground">{course.duration}</span>
                    </div>
                    <h3 className="mt-4 text-base font-semibold">{course.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{faculty.name}</p>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {course.shortDescription}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="badge">{countModules(course)} modules</span>
                    </div>
                    <div className="mt-5 text-sm font-semibold text-primary">
                      View modules →
                    </div>
                  </Link>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="border-y bg-card/50">
        <div className="container section">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Why students choose Erisn
              </h2>
              <p className="mt-3 text-muted-foreground">
                Flexible, affordable, and designed around how university students
                actually study.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <HoverCard>
                  <div className="card-interactive p-6 text-center h-full">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-2xl">
                      {f.icon}
                    </div>
                    <h3 className="mt-4 text-sm font-semibold">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                What students say
              </h2>
              <p className="mt-3 text-muted-foreground">
                Real feedback from UNISA students who booked tutorials.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <HoverCard>
                  <div className="card-interactive p-6 h-full flex flex-col">
                    <div className="text-3xl text-primary/20 font-serif">"</div>
                    <p className="flex-1 text-sm text-muted-foreground leading-relaxed -mt-2">
                      {t.quote}
                    </p>
                    <div className="mt-5 flex items-center gap-3 border-t pt-4">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t">
        <div className="container section-sm">
          <FadeIn>
            <div className="card overflow-hidden">
              <div className="grid lg:grid-cols-2">
                <div className="p-8 lg:p-12">
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Ready to book your tutorial?
                  </h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    Pick your modules, choose a package, and get the help you need
                    to pass your exams.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link className="btn-primary" to="/book">
                      Book a Tutorial
                    </Link>
                    <Link className="btn-outline" to="/courses">
                      Browse Courses
                    </Link>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary/5 via-accent/40 to-indigo-500/5 p-8 lg:p-12 flex items-center">
                  <div>
                    <div className="text-sm font-semibold">What you get</div>
                    <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                      {[
                        "Tutorials aligned to your exact modules",
                        "Private or group session options",
                        "Transparent per-module pricing",
                        "Experienced tutors for each faculty",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
}
