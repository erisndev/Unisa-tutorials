import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FacultyAPI } from "../api/faculties";
import { CourseAPI } from "../api/courses";
import {
  findCourse,
  findFaculty,
  countModules,
  getYearCount,
} from "../lib/university";
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

  const [faculty, setFaculty] = useState(null);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setNotFound(false);

      try {
        // Try API first
        const [apiFaculty, apiCourse] = await Promise.all([
          FacultyAPI.get(facultyId),
          CourseAPI.get(courseId),
        ]);

        if (cancelled) return;

        setFaculty(apiFaculty);
        setCourse(apiCourse);

        // Load modules for this course
        try {
          const mods = await CourseAPI.listModules(courseId);
          if (!cancelled) setModules(mods);
        } catch {
          if (!cancelled) setModules([]);
        }
      } catch {
        // Fallback to static data
        const staticFaculty = findFaculty(facultyId);
        const staticCourse = findCourse(facultyId, courseId);

        if (cancelled) return;

        if (!staticFaculty || !staticCourse) {
          setNotFound(true);
        } else {
          setFaculty(staticFaculty);
          setCourse(staticCourse);
          setModules([]); // static data has modules embedded in course.years
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [facultyId, courseId]);

  if (loading) {
    return (
      <PageTransition>
        <div className="container section">
          <FadeIn>
            <div className="card p-12 text-center max-w-lg mx-auto">
              <div className="text-4xl mb-4 animate-pulse">📚</div>
              <h1 className="text-2xl font-bold">Loading course...</h1>
            </div>
          </FadeIn>
        </div>
      </PageTransition>
    );
  }

  if (notFound || !faculty || !course) {
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

  // Determine keys — API uses _id, static uses id
  const facultyKey = faculty._id || faculty.id;
  const courseKey = course._id || course.id;
  const courseTitle = course.title || course.name;
  const courseDesc =
    course.overview || course.shortDescription || course.description || "";

  // Check if we have static year/semester structure or flat API modules
  const hasYearStructure = course.years && course.years.length > 0;
  const totalModules = hasYearStructure ? countModules(course) : modules.length;
  const totalYears = hasYearStructure ? getYearCount(course) : 0;

  const bookUrl = `/book?faculty=${encodeURIComponent(facultyKey)}&course=${encodeURIComponent(courseKey)}`;

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
                <span className="badge-primary">
                  {course.level || "Undergraduate"}
                </span>
                <span className="dot" />
                <span className="text-xs text-muted-foreground">
                  {course.duration || ""}
                </span>
                <span className="dot" />
                <span className="text-xs text-muted-foreground">
                  {faculty.name}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {courseTitle}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {courseDesc}
              </p>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <div className="card p-5 w-full lg:w-[340px] shrink-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{totalModules} modules</span>
                  {totalYears > 0 && (
                    <span className="text-muted-foreground">
                      {totalYears} years • {totalYears * 2} semesters
                    </span>
                  )}
                </div>
                <Link className="btn-primary mt-4 w-full" to={bookUrl}>
                  Book tutorial for modules
                </Link>
                <p className="mt-3 text-xs text-muted-foreground text-center">
                  Select modules during booking
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
                  <h2 className="text-xl font-bold tracking-tight">
                    Course overview
                  </h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    {courseDesc}
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
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeInUp>
              )}

              {/* Modules — Year/Semester structure (static fallback) */}
              {hasYearStructure && (
                <FadeIn delay={0.15}>
                  <div className="card p-6 lg:p-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Modules by Year & Semester
                      </h3>
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
                              <div
                                key={sem.semester}
                                className="rounded-xl border bg-background p-4"
                              >
                                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                  Semester {sem.semester}
                                </div>
                                <StaggerContainer
                                  className="space-y-2"
                                  stagger={0.04}
                                >
                                  {sem.modules.map((m) => (
                                    <StaggerItem key={m.id}>
                                      <HoverCard>
                                        <div className="flex items-center gap-3 rounded-lg border-2 border-transparent bg-muted/30 px-3 py-2.5 hover:border-primary/20 transition-colors">
                                          <span className="text-xs font-bold text-primary min-w-[70px]">
                                            {m.code}
                                          </span>
                                          <span className="text-sm font-medium">
                                            {m.name}
                                          </span>
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
              )}

              {/* Modules — Flat list from API */}
              {!hasYearStructure && modules.length > 0 && (
                <FadeIn delay={0.15}>
                  <div className="card p-6 lg:p-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Modules</h3>
                      <span className="badge">{modules.length} total</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Select specific modules when booking a tutorial.
                    </p>

                    <StaggerContainer
                      className="mt-6 grid gap-3 sm:grid-cols-2"
                      stagger={0.04}
                    >
                      {modules.map((m) => (
                        <StaggerItem key={m._id}>
                          <HoverCard>
                            <div className="flex items-center gap-3 rounded-lg border-2 border-transparent bg-muted/30 px-3 py-2.5 hover:border-primary/20 transition-colors">
                              <span className="text-sm font-medium">
                                {m.title}
                              </span>
                              {m.isActive === false && (
                                <span className="badge-muted text-[10px] ml-auto">
                                  Inactive
                                </span>
                              )}
                            </div>
                          </HoverCard>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  </div>
                </FadeIn>
              )}

              {!hasYearStructure && modules.length === 0 && (
                <FadeIn delay={0.15}>
                  <div className="card p-6 lg:p-8 text-center">
                    <div className="text-3xl mb-3">📋</div>
                    <h3 className="text-lg font-semibold">No modules yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Modules for this course haven't been added yet.
                    </p>
                  </div>
                </FadeIn>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <FadeInUp delay={0.3}>
                <div className="card p-6">
                  <h3 className="text-base font-semibold">Course structure</h3>
                  <dl className="mt-4 space-y-3 text-sm">
                    {course.duration && (
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Duration</dt>
                        <dd className="font-medium">{course.duration}</dd>
                      </div>
                    )}
                    {totalYears > 0 && (
                      <>
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Years</dt>
                          <dd className="font-medium">{totalYears}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Semesters</dt>
                          <dd className="font-medium">{totalYears * 2}</dd>
                        </div>
                      </>
                    )}
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
                    {(
                      course.requirements || ["A computer", "Internet access"]
                    ).map((r, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeInUp>

              <FadeInUp delay={0.4}>
                <div className="card p-6 bg-primary/[0.03]">
                  <h3 className="text-base font-semibold">Ready to start?</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Book a tutorial and select the exact modules you need help
                    with.
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
