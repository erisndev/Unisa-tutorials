import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FacultyAPI } from "../api/faculties";
import { CourseAPI } from "../api/courses";
import { faculties as fallbackFaculties, countModules } from "../lib/university";
import {
  PageTransition,
  FadeIn,
  FadeInUp,
  StaggerOnMount,
  StaggerItem,
  HoverCard,
} from "../components/motion";

function CourseCard({ faculty, course, moduleCount }) {
  const facultyKey = faculty._id || faculty.id;
  const courseKey = course._id || course.id;
  const courseTitle = course.title || course.name;

  return (
    <HoverCard>
      <div className="card-interactive overflow-hidden h-full flex flex-col">
        <div className="p-6 flex-1 flex flex-col">
          <p className="text-xs font-medium text-primary">{faculty.name}</p>

          <h3 className="mt-2 text-base font-semibold">{courseTitle}</h3>

          <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed">
            {course.shortDescription || course.description || ""}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span className="badge">{moduleCount} module{moduleCount !== 1 ? "s" : ""}</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              className="btn-primary text-xs px-3.5 py-2"
              to={`/courses/${facultyKey}/${courseKey}`}
            >
              View modules
            </Link>
            <Link
              className="btn-outline text-xs px-3.5 py-2"
              to={`/book?faculty=${encodeURIComponent(facultyKey)}&course=${encodeURIComponent(courseKey)}`}
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
  const [apiFaculties, setApiFaculties] = useState(null);
  const [apiCoursesMap, setApiCoursesMap] = useState({});
  const [moduleCountMap, setModuleCountMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [facultyFilter, setFacultyFilter] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const facs = await FacultyAPI.list();
        if (cancelled) return;
        setApiFaculties(facs);

        const courseEntries = await Promise.all(
          facs.map(async (f) => {
            try {
              const courses = await FacultyAPI.listCourses(f._id);
              return [f._id, courses];
            } catch {
              return [f._id, []];
            }
          })
        );
        if (cancelled) return;

        const coursesMap = Object.fromEntries(courseEntries);
        setApiCoursesMap(coursesMap);

        const allCourses = Object.values(coursesMap).flat();
        const modCounts = {};
        await Promise.all(
          allCourses.map(async (c) => {
            try {
              const mods = await CourseAPI.listModules(c._id);
              modCounts[c._id] = Array.isArray(mods) ? mods.length : 0;
            } catch {
              modCounts[c._id] = 0;
            }
          })
        );
        if (cancelled) return;
        setModuleCountMap(modCounts);
      } catch {
        setApiFaculties(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  const allCourses = useMemo(() => {
    if (apiFaculties && apiFaculties.length > 0) {
      const rows = [];
      for (const f of apiFaculties) {
        const courses = apiCoursesMap[f._id] || [];
        for (const c of courses) {
          rows.push({ faculty: f, course: c });
        }
      }
      return rows;
    }

    const rows = [];
    for (const f of fallbackFaculties) {
      for (const c of f.courses) {
        rows.push({ faculty: f, course: c });
      }
    }
    return rows;
  }, [apiFaculties, apiCoursesMap]);

  const facultiesList = useMemo(() => {
    if (apiFaculties && apiFaculties.length > 0) return apiFaculties;
    return fallbackFaculties;
  }, [apiFaculties]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return allCourses.filter(({ faculty, course }) => {
      const fKey = faculty._id || faculty.id;
      if (facultyFilter !== "all" && fKey !== facultyFilter) return false;

      if (!query) return true;

      const courseTitle = course.title || course.name || "";
      const hay = [faculty.name, courseTitle, course.description || ""].join(" ").toLowerCase();
      return hay.includes(query);
    });
  }, [allCourses, facultyFilter, q]);

  const getModuleCount = (course) => {
    const cid = course._id || course.id;
    if (moduleCountMap[cid] !== undefined) return moduleCountMap[cid];
    return course._moduleCount ?? countModules(course);
  };

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

          <FadeInUp delay={0.3}>
            <div className="mt-8 card p-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Search courses
                  </label>
                  <input
                    className="input mt-1.5"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search by course name..."
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Faculty
                  </label>
                  <select
                    className="input mt-1.5"
                    value={facultyFilter}
                    onChange={(e) => setFacultyFilter(e.target.value)}
                  >
                    <option value="all">All faculties</option>
                    {facultiesList.map((f) => (
                      <option key={f._id || f.id} value={f._id || f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                {loading ? (
                  "Loading courses..."
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                    {filtered.length === 1 ? "course" : "courses"}
                  </>
                )}
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <FadeIn>
              <div className="card p-12 text-center">
                <h3 className="text-lg font-semibold">Loading courses...</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fetching data from the server.
                </p>
              </div>
            </FadeIn>
          ) : filtered.length === 0 ? (
            <FadeIn>
              <div className="card p-12 text-center">
                <h3 className="text-lg font-semibold">No courses found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your filters or search term.
                </p>
              </div>
            </FadeIn>
          ) : (
            <StaggerOnMount className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(({ faculty, course }) => (
                <StaggerItem key={`${faculty._id || faculty.id}:${course._id || course.id}`}>
                  <CourseCard
                    faculty={faculty}
                    course={course}
                    moduleCount={getModuleCount(course)}
                  />
                </StaggerItem>
              ))}
            </StaggerOnMount>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
