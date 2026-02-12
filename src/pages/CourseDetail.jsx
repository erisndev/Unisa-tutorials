import { Link, useParams } from "react-router-dom";
import { findCourse, findFaculty, countModules, getYearCount } from "../lib/university";
import {
  PageTransition,
  FadeIn,
  FadeInUp,
  StaggerContainer,
  StaggerItem,
  HoverCard,
} from "../components/motion";

export default function CourseDetailPage() {
  const { facultyId, courseId } = useParams();
  const faculty = findFaculty(facultyId);
  const course = findCourse(facultyId, courseId);

  if (!faculty || !course) {
    return (
      <PageTransition>
        <div className="container section">
          <FadeIn>
            <div className="card p-12 text-center max-w-lg mx-auto">
              <div className="text-4xl mb-4">😕</div>
              <h1 className="text-2xl font-bold">Course not found</h1>
              <p className="mt-3 text-muted-foreground">
                The course you requested does not exist.
              </p>
              <Link className="btn-primary mt-6" to="/courses">
                Back to courses
              </Link>
            </div>
          </FadeIn>
        </div>
      </PageTransition>
    );
  }

  const bookUrl = `/book?faculty=${encodeURIComponent(faculty.id)}&course=${encodeURIComponent(course.id)}`;
  const totalModules = countModules(course);
  const totalYears = getYearCount(course);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="page-hero">
        <div className="container section-sm">
          <FadeInUp>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              to="/courses"
            >
              ← Back to Courses
            </Link>
          </FadeInUp>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <FadeInUp delay={0.1} className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge-primary">{course.level}</span>
                <span className="dot" />
                <span className="text-xs text-muted-foreground">{course.duration}</span>
                <span className="dot" />
                <span className="text-xs text-muted-foreground">{faculty.name}</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {course.name}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {course.overview || course.shortDescription}
              </p>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <div className="card p-5 w-full lg:w-[340px] shrink-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{totalModules} modules</span>
                  <span className="text-muted-foreground">
                    {totalYears} years • {totalYears * 2} semesters
                  </span>
                </div>
                <Link className="btn-primary mt-4 w-full" to={bookUrl}>
                  Book tutorial for modules
                </Link>
                <p className="mt-3 text-xs text-muted-foreground text-center">
                  Select year, semester & modules during booking
                </p>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <FadeInUp delay={0.25}>
                <div className="card p-6 lg:p-8">
                  <h2 className="text-xl font-bold tracking-tight">Course overview</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    {course.overview || course.shortDescription}
                  </p>
                </div>
              </FadeInUp>

              {/* Outcomes */}
              {course.outcomes?.length > 0 && (
                <FadeInUp delay={0.3}>
                  <div className="card p-6 lg:p-8">
                    <h3 className="text-lg font-semibold">Learning outcomes</h3>
                    <ul className="mt-4 space-y-3">
                      {course.outcomes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeInUp>
              )}

              {/* Modules by Year & Semester */}
              <FadeIn delay={0.15}>
                <div className="card p-6 lg:p-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Modules by Year & Semester</h3>
                    <span className="badge">{totalModules} total</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Select specific modules when booking a tutorial.
                  </p>

                  <div className="mt-6 space-y-8">
                    {course.years.map((yr) => (
                      <div key={yr.year}>
                        <h4 className="text-base font-bold flex items-center gap-2">
                          <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                            Y{yr.year}
                          </span>
                          Year {yr.year}
                        </h4>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          {yr.semesters.map((sem) => (
                            <div key={sem.semester} className="rounded-xl border bg-background p-4">
                              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                Semester {sem.semester}
                              </div>
                              <StaggerContainer className="space-y-2" stagger={0.04}>
                                {sem.modules.map((m) => (
                                  <StaggerItem key={m.id}>
                                    <HoverCard>
                                      <div className="flex items-center gap-3 rounded-lg border-2 border-transparent bg-muted/30 px-3 py-2.5 hover:border-primary/20 transition-colors">
                                        <span className="text-xs font-bold text-primary min-w-[70px]">
                                          {m.code}
                                        </span>
                                        <span className="text-sm font-medium">{m.name}</span>
                                      </div>
                                    </HoverCard>
                                  </StaggerItem>
                                ))}
                              </StaggerContainer>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <FadeInUp delay={0.3}>
                <div className="card p-6">
                  <h3 className="text-base font-semibold">Course structure</h3>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Duration</dt>
                      <dd className="font-medium">{course.duration}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Years</dt>
                      <dd className="font-medium">{totalYears}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Semesters</dt>
                      <dd className="font-medium">{totalYears * 2}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Total modules</dt>
                      <dd className="font-medium">{totalModules}</dd>
                    </div>
                  </dl>
                </div>
              </FadeInUp>

              <FadeInUp delay={0.35}>
                <div className="card p-6">
                  <h3 className="text-base font-semibold">Requirements</h3>
                  <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                    {(course.requirements || ["A computer", "Internet access"]).map(
                      (r, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                          {r}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </FadeInUp>

              <FadeInUp delay={0.4}>
                <div className="card p-6 bg-primary/[0.03]">
                  <h3 className="text-base font-semibold">Ready to start?</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Book a tutorial and select the exact modules you need help with.
                  </p>
                  <Link className="btn-primary mt-4 w-full" to={bookUrl}>
                    Book tutorial
                  </Link>
                </div>
              </FadeInUp>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
