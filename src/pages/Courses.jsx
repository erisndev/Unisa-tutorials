import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

function CourseCard({ faculty, course }) {
  return (
    <HoverCard>
      <div className="card-interactive overflow-hidden h-full flex flex-col">
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between gap-3">
            <span className="badge-primary">{course.level}</span>
            <span className="text-xs text-muted-foreground">{course.duration}</span>
          </div>

          <h3 className="mt-4 text-base font-semibold">{course.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{faculty.name}</p>
          <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed">
            {course.shortDescription}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span className="badge">{countModules(course)} modules</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              className="btn-primary text-xs px-3.5 py-2"
              to={`/courses/${faculty.id}/${course.id}`}
            >
              View modules
            </Link>
            <Link
              className="btn-outline text-xs px-3.5 py-2"
              to={`/book?faculty=${encodeURIComponent(faculty.id)}&course=${encodeURIComponent(course.id)}`}
            >
              Book tutorial
            </Link>
          </div>
        </div>
      </div>
    </HoverCard>
  );
}

export default function CoursesPage() {
  const [facultyId, setFacultyId] = useState("all");
  const [level, setLevel] = useState("all");
  const [q, setQ] = useState("");

  const allCourses = useMemo(() => {
    const rows = [];
    for (const f of faculties) {
      for (const c of f.courses) {
        rows.push({ faculty: f, course: c });
      }
    }
    return rows;
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return allCourses.filter(({ faculty, course }) => {
      if (facultyId !== "all" && faculty.id !== facultyId) return false;
      if (level !== "all" && String(course.level).toLowerCase() !== level) return false;
      if (!query) return true;
      const moduleTexts = [];
      for (const yr of course.years || []) {
        for (const sem of yr.semesters) {
          for (const m of sem.modules) {
            moduleTexts.push(`${m.code} ${m.name}`);
          }
        }
      }
      const hay = [
        faculty.name,
        course.name,
        course.shortDescription,
        course.duration,
        course.level,
        ...moduleTexts,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }, [allCourses, facultyId, level, q]);

  const levels = useMemo(() => {
    const set = new Set();
    for (const { course } of allCourses) set.add(String(course.level).toLowerCase());
    return ["all", ...Array.from(set)];
  }, [allCourses]);

  return (
    <PageTransition>
      <section className="page-hero">
        <div className="container section-sm">
          <FadeInUp>
            <span className="badge-primary mb-4">Courses</span>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              University Courses
            </h1>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground leading-relaxed">
              Browse faculties and courses. Tutorials are booked per module — you
              choose exactly what you need.
            </p>
          </FadeInUp>

          {/* Filters */}
          <FadeInUp delay={0.3}>
            <div className="mt-8 card p-5">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Search
                  </label>
                  <input
                    className="input mt-1.5"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search courses, modules, codes (e.g., CS101) ..."
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Faculty
                  </label>
                  <select
                    className="input mt-1.5"
                    value={facultyId}
                    onChange={(e) => setFacultyId(e.target.value)}
                  >
                    <option value="all">All faculties</option>
                    {faculties.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Level
                  </label>
                  <select
                    className="input mt-1.5"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    {levels.map((lv) => (
                      <option key={lv} value={lv}>
                        {lv === "all" ? "All levels" : lv[0].toUpperCase() + lv.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "course" : "courses"}
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {filtered.length === 0 ? (
            <FadeIn>
              <div className="card p-12 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold">No courses found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your filters or search term.
                </p>
              </div>
            </FadeIn>
          ) : (
            <StaggerOnMount className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(({ faculty, course }) => (
                <StaggerItem key={`${faculty.id}:${course.id}`}>
                  <CourseCard faculty={faculty} course={course} />
                </StaggerItem>
              ))}
            </StaggerOnMount>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
