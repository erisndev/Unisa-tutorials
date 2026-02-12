import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  faculties,
  findCourse,
  findFaculty,
  formatZAR,
  packages,
  getAllModules,
  getYearCount,
} from "../lib/university";
import { PageTransition, FadeIn, FadeInUp } from "../components/motion";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function StepIndicator({ current }) {
  const steps = ["Details", "Review", "Payment"];
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => {
        const num = i + 1;
        const active = num === current;
        const done = num < current;
        return (
          <div key={label} className="flex items-center gap-2">
            {i > 0 && (
              <div className={["h-px w-6 sm:w-10 transition-colors", done ? "bg-primary" : "bg-border"].join(" ")} />
            )}
            <div className="flex items-center gap-1.5">
              <span
                className={[
                  "grid h-7 w-7 place-items-center rounded-full text-xs font-bold transition-all",
                  active ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : done ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground",
                ].join(" ")}
              >
                {done ? "✓" : num}
              </span>
              <span className={["hidden text-xs font-medium sm:inline", active ? "text-foreground" : "text-muted-foreground"].join(" ")}>
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const stepVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

function StepWrapper({ children, stepKey }) {
  return (
    <motion.div
      key={stepKey}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function BookTutorialPage() {
  const query = useQuery();
  const navigate = useNavigate();

  const preFaculty = query.get("faculty") || "";
  const preCourse = query.get("course") || "";

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    studentNumber: "",
    email: "",
    phone: "",
    facultyId: preFaculty,
    courseId: preCourse,
    packageId: "1v1",
    moduleIds: [],
  });

  const faculty = useMemo(() => (form.facultyId ? findFaculty(form.facultyId) : null), [form.facultyId]);
  const course = useMemo(() => (form.facultyId && form.courseId ? findCourse(form.facultyId, form.courseId) : null), [form.facultyId, form.courseId]);
  const selectedPackage = useMemo(() => packages.find((p) => p.id === form.packageId) || packages[0], [form.packageId]);

  const allModulesFlat = useMemo(() => getAllModules(course), [course]);
  const moduleMap = useMemo(() => new Map(allModulesFlat.map((m) => [m.id, m])), [allModulesFlat]);

  const selectedModules = useMemo(() => form.moduleIds.map((id) => moduleMap.get(id)).filter(Boolean), [form.moduleIds, moduleMap]);
  const finalPrice = useMemo(() => form.moduleIds.length * (selectedPackage?.pricePerModule || 0), [form.moduleIds.length, selectedPackage]);

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }
  function onChange(e) {
    setField(e.target.name, e.target.value);
  }
  function onFacultyChange(e) {
    setForm((prev) => ({ ...prev, facultyId: e.target.value, courseId: "", moduleIds: [] }));
  }
  function onCourseChange(e) {
    setForm((prev) => ({ ...prev, courseId: e.target.value, moduleIds: [] }));
  }
  function toggleModule(moduleId) {
    setForm((prev) => ({
      ...prev,
      moduleIds: prev.moduleIds.includes(moduleId)
        ? prev.moduleIds.filter((id) => id !== moduleId)
        : [...prev.moduleIds, moduleId],
    }));
  }

  function valid() {
    return form.fullName.trim() && form.email.trim() && form.phone.trim() && form.facultyId && form.courseId && form.packageId && form.moduleIds.length > 0;
  }

  function goNext() {
    if (step === 1 && valid()) { setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else if (step === 2) { setStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); }
  }
  function goBack() {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function confirmAndPay() {
    navigate("/book?success=1");
    setStep(1);
    setForm({ fullName: "", studentNumber: "", email: "", phone: "", facultyId: preFaculty, courseId: preCourse, packageId: "1v1", moduleIds: [] });
  }

  const success = query.get("success") === "1";

  return (
    <PageTransition>
      <section className="page-hero">
        <div className="container section-sm">
          <FadeInUp><span className="badge-primary mb-4">Book Tutorial</span></FadeInUp>
          <FadeInUp delay={0.1}>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Book a Tutorial</h1>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground leading-relaxed">
              Choose your faculty, course, year & semester, then select the modules you need. Pick a package and pay per module.
            </p>
          </FadeInUp>
          <FadeInUp delay={0.25}>
            <div className="mt-6"><StepIndicator current={step} /></div>
          </FadeInUp>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {success ? (
            <FadeIn>
              <div className="card p-8 lg:p-12 max-w-2xl mx-auto text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-500/10 text-3xl mb-6">✅</motion.div>
                <h2 className="text-2xl font-bold tracking-tight">Booking confirmed!</h2>
                <p className="mt-3 text-muted-foreground">Your booking has been captured. Payment integration can be connected to a real gateway later.</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link className="btn-primary" to="/courses">Browse courses</Link>
                  <Link className="btn-outline" to="/book">Book another tutorial</Link>
                </div>
              </div>
            </FadeIn>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="card p-6 lg:p-8">
                  <AnimatePresence mode="wait">
                    {/* ── STEP 1 ── */}
                    {step === 1 && (
                      <StepWrapper stepKey="step1">
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); goNext(); }}>
                          {/* Personal details */}
                          <div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Your details</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <label className="text-sm font-medium">Full name</label>
                                <input className="input mt-1.5" name="fullName" value={form.fullName} onChange={onChange} placeholder="Your full name" required />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Student number <span className="text-muted-foreground">(optional)</span></label>
                                <input className="input mt-1.5" name="studentNumber" value={form.studentNumber} onChange={onChange} placeholder="e.g., 12345678" />
                              </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 mt-4">
                              <div>
                                <label className="text-sm font-medium">Email</label>
                                <input className="input mt-1.5" type="email" name="email" value={form.email} onChange={onChange} placeholder="you@example.com" required />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Phone</label>
                                <input className="input mt-1.5" name="phone" value={form.phone} onChange={onChange} placeholder="+27 81 234 5678" required />
                              </div>
                            </div>
                          </div>

                          {/* Faculty & Course */}
                          <div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Faculty & Course</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <label className="text-sm font-medium">Faculty</label>
                                <select className="input mt-1.5" value={form.facultyId} onChange={onFacultyChange} required>
                                  <option value="" disabled>Select a faculty</option>
                                  {faculties.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
                                </select>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Course</label>
                                <select className="input mt-1.5" value={form.courseId} onChange={onCourseChange} disabled={!faculty} required>
                                  <option value="" disabled>{faculty ? "Select a course" : "Select faculty first"}</option>
                                  {(faculty?.courses || []).map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Modules by Year & Semester */}
                          <div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                              Select module(s) by Year & Semester
                            </h3>

                            {course ? (
                              <div className="space-y-6">
                                {course.years.map((yr) => (
                                  <div key={yr.year}>
                                    <div className="flex items-center gap-2 mb-3">
                                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                                        Y{yr.year}
                                      </span>
                                      <span className="text-sm font-semibold">Year {yr.year}</span>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                      {yr.semesters.map((sem) => (
                                        <div key={sem.semester} className="rounded-xl border bg-background p-4">
                                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                            Semester {sem.semester}
                                          </div>
                                          <div className="space-y-2">
                                            {sem.modules.map((m) => {
                                              const checked = form.moduleIds.includes(m.id);
                                              return (
                                                <motion.label
                                                  key={m.id}
                                                  whileTap={{ scale: 0.98 }}
                                                  className={[
                                                    "flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-colors",
                                                    checked ? "border-primary bg-primary/[0.03]" : "border-transparent hover:border-muted-foreground/20",
                                                  ].join(" ")}
                                                >
                                                  <input
                                                    type="checkbox"
                                                    className="mt-0.5 h-4 w-4 rounded accent-primary"
                                                    checked={checked}
                                                    onChange={() => toggleModule(m.id)}
                                                  />
                                                  <div>
                                                    <div className="text-xs font-medium text-primary">{m.code}</div>
                                                    <div className="text-sm font-semibold">{m.name}</div>
                                                  </div>
                                                </motion.label>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="rounded-xl border-2 border-dashed p-8 text-center text-sm text-muted-foreground">
                                Select a faculty and course above to see modules by year & semester.
                              </div>
                            )}
                          </div>

                          {/* Package */}
                          <div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Choose a package</h3>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {packages.map((p) => {
                                const sel = form.packageId === p.id;
                                return (
                                  <motion.label key={p.id} whileTap={{ scale: 0.98 }} className={["flex cursor-pointer items-start gap-3 rounded-xl border-2 bg-background p-4 transition-colors", sel ? "border-primary bg-primary/[0.03]" : "border-transparent hover:border-muted-foreground/20"].join(" ")}>
                                    <input type="radio" name="packageId" className="mt-0.5 accent-primary" checked={sel} onChange={() => setField("packageId", p.id)} />
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="text-sm font-semibold">{p.name}</div>
                                        <div className="text-sm font-bold text-primary">{formatZAR(p.pricePerModule)}</div>
                                      </div>
                                      <div className="mt-0.5 text-xs text-muted-foreground">{p.description}</div>
                                    </div>
                                  </motion.label>
                                );
                              })}
                            </div>
                          </div>

                          {/* Summary bar */}
                          <div className="flex flex-col gap-3 rounded-xl bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm">
                              <span className="font-semibold">{form.moduleIds.length}</span> module(s) × <span className="font-semibold">{formatZAR(selectedPackage.pricePerModule)}</span> = <span className="text-lg font-bold text-primary">{formatZAR(finalPrice)}</span>
                            </div>
                            <button className="btn-primary" type="submit" disabled={!valid()}>Next →</button>
                          </div>
                        </form>
                      </StepWrapper>
                    )}

                    {/* ─�� STEP 2 ── */}
                    {step === 2 && (
                      <StepWrapper stepKey="step2">
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-xl font-bold tracking-tight">Review your booking</h2>
                            <p className="mt-2 text-sm text-muted-foreground">Confirm everything looks correct before payment.</p>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border bg-background p-5">
                              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Student</div>
                              <div className="mt-2 text-sm font-semibold">{form.fullName}</div>
                              <div className="mt-1 text-sm text-muted-foreground">{form.email}</div>
                              <div className="text-sm text-muted-foreground">{form.phone}</div>
                              {form.studentNumber && <div className="text-sm text-muted-foreground">#{form.studentNumber}</div>}
                            </div>
                            <div className="rounded-xl border bg-background p-5">
                              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Package</div>
                              <div className="mt-2 text-sm font-semibold">{selectedPackage.name}</div>
                              <div className="mt-1 text-sm text-muted-foreground">{formatZAR(selectedPackage.pricePerModule)} per module</div>
                            </div>
                          </div>

                          <div className="rounded-xl border bg-background p-5">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Faculty & Course</div>
                            <div className="mt-2 text-sm font-semibold">{faculty?.name} → {course?.name}</div>

                            <div className="mt-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Selected modules</div>
                            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                              {selectedModules.map((m) => (
                                <div key={m.id} className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2">
                                  <span className="text-xs font-bold text-primary">{m.code}</span>
                                  <span className="text-sm">{m.name}</span>
                                  <span className="ml-auto text-[10px] text-muted-foreground">Y{m.year} S{m.semester}</span>
                                </div>
                              ))}
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t pt-4">
                              <div className="text-sm text-muted-foreground">{form.moduleIds.length} module(s) × {formatZAR(selectedPackage.pricePerModule)}</div>
                              <div className="text-xl font-bold">{formatZAR(finalPrice)}</div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                            <button className="btn-outline" onClick={goBack} type="button">← Back</button>
                            <button className="btn-primary" onClick={goNext} type="button">Proceed to payment →</button>
                          </div>
                        </div>
                      </StepWrapper>
                    )}

                    {/* ── STEP 3 ── */}
                    {step === 3 && (
                      <StepWrapper stepKey="step3">
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-xl font-bold tracking-tight">Payment</h2>
                            <p className="mt-2 text-sm text-muted-foreground">Complete your payment to confirm the booking.</p>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border bg-background p-6">
                              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount due</div>
                              <div className="mt-2 text-4xl font-bold gradient-text">{formatZAR(finalPrice)}</div>
                              <div className="mt-2 text-sm text-muted-foreground">{form.moduleIds.length} module(s) • {selectedPackage.name}</div>
                            </div>
                            <div className="rounded-xl border bg-background p-6">
                              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Payment method</div>
                              <p className="mt-2 text-sm text-muted-foreground">Connect PayFast / Stripe / PayPal here.</p>
                              <div className="mt-4 grid grid-cols-3 gap-2">
                                {["💳 Card", "🏦 EFT", "📱 Wallet"].map((m) => (
                                  <div key={m} className="rounded-lg border-2 bg-muted/30 p-3 text-center text-xs font-medium">{m}</div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="rounded-xl border bg-background p-5">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Summary</div>
                            <div className="space-y-1.5 text-sm text-muted-foreground">
                              <div><span className="font-medium text-foreground">Student:</span> {form.fullName}</div>
                              <div><span className="font-medium text-foreground">Contact:</span> {form.email} • {form.phone}</div>
                              <div><span className="font-medium text-foreground">Faculty:</span> {faculty?.name}</div>
                              <div><span className="font-medium text-foreground">Course:</span> {course?.name}</div>
                              <div><span className="font-medium text-foreground">Modules:</span> {selectedModules.map((m) => `${m.code} (Y${m.year} S${m.semester})`).join(", ")}</div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                            <button className="btn-outline" onClick={goBack} type="button">← Back</button>
                            <button className="btn-primary text-base px-8" onClick={confirmAndPay} type="button">Pay {formatZAR(finalPrice)}</button>
                          </div>
                        </div>
                      </StepWrapper>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                <FadeInUp delay={0.3}>
                  <div className="card p-6">
                    <h3 className="text-sm font-semibold">Pricing breakdown</h3>
                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Package</span>
                        <span className="font-semibold">{formatZAR(selectedPackage.pricePerModule)} / module</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Modules</span>
                        <span className="font-semibold">{form.moduleIds.length}</span>
                      </div>
                      <div className="border-t pt-3 flex items-center justify-between">
                        <span className="font-medium">Total</span>
                        <span className="text-lg font-bold text-primary">{formatZAR(finalPrice)}</span>
                      </div>
                    </div>
                  </div>
                </FadeInUp>

                {course && (
                  <FadeInUp delay={0.35}>
                    <div className="card p-6">
                      <h3 className="text-sm font-semibold">Course structure</h3>
                      <div className="mt-3 text-sm text-muted-foreground space-y-1">
                        <div>{getYearCount(course)} years • {getYearCount(course) * 2} semesters</div>
                        <div>{getAllModules(course).length} total modules</div>
                        <div>{form.moduleIds.length} selected</div>
                      </div>
                    </div>
                  </FadeInUp>
                )}

                <FadeInUp delay={0.4}>
                  <div className="card p-6">
                    <h3 className="text-sm font-semibold">Need help?</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Browse courses first to understand modules by year & semester.</p>
                    <Link className="btn-secondary mt-4 w-full" to="/courses">Browse courses</Link>
                  </div>
                </FadeInUp>
              </aside>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
