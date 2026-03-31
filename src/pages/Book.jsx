import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FacultyAPI } from "../api/faculties";
import { CourseAPI } from "../api/courses";
import { PackageAPI } from "../api/packages";
import { OrderAPI } from "../api/orders";
import { PaymentAPI } from "../api/payments";
import {
  faculties as fallbackFaculties,
  packages as fallbackPackages,
  findFaculty,
  findCourse,
  getAllModules,
  getYearCount,
  formatZAR,
} from "../lib/university";
import { PageTransition, FadeIn, FadeInUp } from "../components/motion";

function loadPaystackScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("No window"));

    // Already loaded
    if (window.PaystackPop) return resolve(true);

    const existing = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => reject(new Error("Failed to load Paystack")));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Paystack"));
    document.body.appendChild(script);
  });
}

function getPaystackKey() {
  // Vite convention: VITE_PAYSTACK_PUBLIC_KEY
  // Fallback to localStorage to avoid dev-server env caching issues
  return (
    import.meta?.env?.VITE_PAYSTACK_PUBLIC_KEY ||
    (typeof window !== "undefined"
      ? window.localStorage.getItem("paystack_public_key")
      : "") ||
    ""
  );
}

function normalizePaystackAmountZarToKobo(amountZar) {
  // Paystack expects amount in kobo (ZAR cents)
  const n = Number(amountZar);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

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
              <div
                className={[
                  "h-px w-6 sm:w-10 transition-colors",
                  done ? "bg-primary" : "bg-border",
                ].join(" ")}
              />
            )}
            <div className="flex items-center gap-1.5">
              <span
                className={[
                  "grid h-7 w-7 place-items-center rounded-full text-xs font-bold transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : done
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground",
                ].join(" ")}
              >
                {done ? "✓" : num}
              </span>
              <span
                className={[
                  "hidden text-xs font-medium sm:inline",
                  active ? "text-foreground" : "text-muted-foreground",
                ].join(" ")}
              >
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

const LS_BOOKING_KEY = "booking_draft_v1";
const LS_PAYMENT_KEY = "payment_draft_v1";

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export default function BookTutorialPage() {
  const query = useQuery();
  const navigate = useNavigate();

  const preFaculty = query.get("faculty") || "";
  const preCourse = query.get("course") || "";

  /* ── API data state ── */
  const [apiFaculties, setApiFaculties] = useState(null);
  const [apiCourses, setApiCourses] = useState([]); // courses for selected faculty
  const [apiModules, setApiModules] = useState([]); // modules for selected course
  const [apiPackages, setApiPackages] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  /* ── Form state ── */
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderResult, setOrderResult] = useState(null);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [toast, setToast] = useState(null);
  const [paymentInit, setPaymentInit] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    facultyId: preFaculty,
    courseId: preCourse,
    packageId: "",
    moduleIds: [],
  });

  // Restore draft from localStorage (if any)
  useEffect(() => {
    const raw = window.localStorage.getItem(LS_BOOKING_KEY);
    const draft = safeJsonParse(raw);
    if (!draft) return;

    if (draft.form) {
      setForm((prev) => ({
        ...prev,
        ...draft.form,
        // keep query preselects if present
        facultyId: draft.form.facultyId || prev.facultyId,
        courseId: draft.form.courseId || prev.courseId,
      }));
    }
    if (draft.createdBooking) setCreatedBooking(draft.createdBooking);
    if (draft.orderResult) setOrderResult(draft.orderResult);

    // Restore step reliably (step can be 1/2/3)
    if (Number.isFinite(draft.step) && draft.step >= 1 && draft.step <= 3) {
      setStep(draft.step);
    } else if (draft.createdBooking) {
      // If booking exists, user should be on payment step
      setStep(3);
    }

    // Restore payment init (if any)
    const payRaw = window.localStorage.getItem(LS_PAYMENT_KEY);
    const payDraft = safeJsonParse(payRaw);
    if (payDraft) setPaymentInit(payDraft);
  }, [preFaculty, preCourse]);

  // Persist draft to localStorage
  useEffect(() => {
    // If payment succeeded, we clear storage elsewhere.
    const payload = {
      step,
      form,
      createdBooking,
      orderResult,
      updatedAt: Date.now(),
    };
    window.localStorage.setItem(LS_BOOKING_KEY, JSON.stringify(payload));
  }, [step, form, createdBooking, orderResult]);

  useEffect(() => {
    if (!paymentInit) return;
    window.localStorage.setItem(LS_PAYMENT_KEY, JSON.stringify(paymentInit));
  }, [paymentInit]);

  const usingApi = apiFaculties !== null;

  // Faculties list
  const facultiesList = useMemo(() => {
    if (usingApi) return apiFaculties;
    return fallbackFaculties;
  }, [usingApi, apiFaculties]);

  // Packages list
  const packagesList = useMemo(() => {
    if (apiPackages !== null) return apiPackages;
    return fallbackPackages;
  }, [apiPackages]);

  /* ── Load initial data (faculties + packages) ── */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [facs, pkgs] = await Promise.all([
          FacultyAPI.list(),
          PackageAPI.list(),
        ]);
        if (cancelled) return;

        // Mark API as reachable (even if empty)
        setApiFaculties(Array.isArray(facs) ? facs : []);
        setApiPackages(Array.isArray(pkgs) ? pkgs : []);

        // Set default package if not set
        if (!form.packageId) {
          const first = (Array.isArray(pkgs) && pkgs[0]) || null;
          if (first) {
            setForm((prev) => ({ ...prev, packageId: first._id || first.id }));
          }
        }
      } catch {
        // API unreachable → use fallback
        if (cancelled) return;
        setApiFaculties(null);
        setApiPackages(null);

        if (!form.packageId && fallbackPackages.length > 0) {
          setForm((prev) => ({ ...prev, packageId: fallbackPackages[0].id }));
        }
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Load courses when faculty changes ── */
  useEffect(() => {
    if (!form.facultyId) {
      setApiCourses([]);
      return;
    }

    if (!usingApi) return;

    let cancelled = false;
    (async () => {
      try {
        const courses = await FacultyAPI.listCourses(form.facultyId);
        if (!cancelled) setApiCourses(Array.isArray(courses) ? courses : []);
      } catch {
        if (!cancelled) setApiCourses([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [form.facultyId, usingApi]);

  /* ── Load modules when course changes ── */
  useEffect(() => {
    if (!form.courseId) {
      setApiModules([]);
      return;
    }

    if (!usingApi) return;

    let cancelled = false;
    (async () => {
      try {
        const mods = await CourseAPI.listModules(form.courseId);
        if (!cancelled) setApiModules(Array.isArray(mods) ? mods : []);
      } catch {
        if (!cancelled) setApiModules([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [form.courseId, usingApi]);

  /* ── Derived data ── */

  // Static fallback faculty/course
  const staticFaculty = useMemo(() => {
    if (usingApi) return null;
    return findFaculty(form.facultyId);
  }, [usingApi, form.facultyId]);

  const staticCourse = useMemo(() => {
    if (usingApi) return null;
    return findCourse(form.facultyId, form.courseId);
  }, [usingApi, form.facultyId, form.courseId]);

  // Courses for selected faculty
  const coursesList = useMemo(() => {
    if (usingApi) return apiCourses;
    return staticFaculty?.courses || [];
  }, [usingApi, apiCourses, staticFaculty]);

  // Modules for selected course
  const modulesList = useMemo(() => {
    if (usingApi) return apiModules;
    return getAllModules(staticCourse);
  }, [usingApi, apiModules, staticCourse]);

  // Module map for quick lookup
  const moduleMap = useMemo(() => {
    const map = new Map();
    for (const m of modulesList) {
      map.set(m._id || m.id, m);
    }
    return map;
  }, [modulesList]);

  // Selected package
  const selectedPackage = useMemo(() => {
    return (
      packagesList.find((p) => (p._id || p.id) === form.packageId) ||
      packagesList[0]
    );
  }, [packagesList, form.packageId]);

  // Selected modules
  const selectedModules = useMemo(() => {
    return form.moduleIds.map((id) => moduleMap.get(id)).filter(Boolean);
  }, [form.moduleIds, moduleMap]);

  // Price calculation
  const finalPrice = useMemo(() => {
    return form.moduleIds.length * (selectedPackage?.pricePerModule || 0);
  }, [form.moduleIds.length, selectedPackage]);

  // Faculty/course display names
  const facultyName = useMemo(() => {
    if (usingApi) {
      const f = apiFaculties?.find((x) => x._id === form.facultyId);
      return f?.name || "";
    }
    return staticFaculty?.name || "";
  }, [usingApi, apiFaculties, form.facultyId, staticFaculty]);

  const courseName = useMemo(() => {
    if (usingApi) {
      const c = apiCourses.find((x) => x._id === form.courseId);
      return c?.title || c?.name || "";
    }
    return staticCourse?.name || "";
  }, [usingApi, apiCourses, form.courseId, staticCourse]);

  /* ── Handlers ── */
  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }
  function onChange(e) {
    setField(e.target.name, e.target.value);
  }
  function onFacultyChange(e) {
    setForm((prev) => ({
      ...prev,
      facultyId: e.target.value,
      courseId: "",
      moduleIds: [],
    }));
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
    return (
      form.fullName.trim() &&
      form.email.trim() &&
      form.phone.trim() &&
      form.facultyId &&
      form.courseId &&
      form.packageId &&
      form.moduleIds.length > 0
    );
  }

  function goNext() {
    if (step === 1 && valid()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step === 2) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const confirmBookingAndProceed = useCallback(async () => {
    setSubmitting(true);
    setSubmitError("");

    try {
      const pkgId =
        form.packageId ||
        selectedPackage?._id ||
        selectedPackage?.id ||
        packagesList?.[0]?._id ||
        packagesList?.[0]?.id ||
        "";

      if (!pkgId) {
        throw new Error("Please select a package before confirming booking.");
      }

      const orderBody = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        faculty: form.facultyId,
        course: form.courseId,
        modules: form.moduleIds,
        // send both styles to satisfy backend validation
        package: pkgId,
        packageId: pkgId,
      };

      const created = await OrderAPI.create(orderBody);
      setCreatedBooking(created);
      setOrderResult(created);
      window.localStorage.setItem(
        LS_BOOKING_KEY,
        JSON.stringify({
          step: 3,
          form,
          createdBooking: created,
          orderResult: created,
          updatedAt: Date.now(),
        }),
      );

      setToast({
        type: "success",
        message: "Booking created. Proceed to payment.",
      });

      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create booking. Please try again.";
      setSubmitError(msg);
      setToast({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  }, [form]);
  function goBack() {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const confirmAndPay = useCallback(async () => {
    setSubmitting(true);
    setSubmitError("");

    try {
      // Booking must already be created in Step 2
      const created = createdBooking;
      if (!created) {
        throw new Error(
          "No booking found. Please go back and confirm your booking first.",
        );
      }

      const orderId = created?.orderId || created?._id || created?.id;
      if (!orderId) {
        throw new Error("Missing orderId from booking response.");
      }

      // 1) Initialize payment on backend (server calculates amount)
      const init = await PaymentAPI.initialize({ orderId, email: form.email });

      setPaymentInit(init);

      // 2) Redirect to Paystack checkout URL
      if (!init?.paymentUrl) {
        throw new Error("Payment initialization failed (missing paymentUrl).");
      }

      window.location.href = init.paymentUrl;
    } catch (err) {
      const msg = err?.message || "Failed to start payment. Please try again.";
      setSubmitError(msg);
      setToast({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  }, [createdBooking, form.email]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const success = query.get("success") === "1";
  const payRefFromQuery = query.get("reference") || query.get("ref") || "";

  // After Paystack redirect, verify payment using reference
  useEffect(() => {
    if (!payRefFromQuery) return;

    let cancelled = false;
    (async () => {
      try {
        setSubmitting(true);
        setSubmitError("");

        const verify = await PaymentAPI.verify(payRefFromQuery);
        if (cancelled) return;

        if (verify?.success) {
          setOrderResult(verify?.order || orderResult);
          setToast({ type: "success", message: "Payment verified successfully." });

          // Clear drafts
          window.localStorage.removeItem(LS_BOOKING_KEY);
          window.localStorage.removeItem(LS_PAYMENT_KEY);
          window.localStorage.removeItem(LS_PAYMENT_KEY);

          navigate("/book?success=1", { replace: true });
        } else {
          throw new Error(verify?.message || "Payment verification failed.");
        }
      } catch (e) {
        if (cancelled) return;
        const msg = e?.message || "Payment verification failed.";
        setSubmitError(msg);
        setToast({ type: "error", message: msg });
      } finally {
        if (!cancelled) setSubmitting(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payRefFromQuery]);

  // If user reloads on payment step, keep them on payment step
  // (success param should only be present after successful payment)
  useEffect(() => {
    if (success) return;
    if (createdBooking && step !== 3) setStep(3);
  }, [createdBooking, step, success]);

  return (
    <PageTransition>
      <section className="page-hero">
        <div className="container section-sm">
          <FadeInUp>
            <span className="badge-primary mb-4">Book Tutorial</span>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Book a Tutorial
            </h1>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground leading-relaxed">
              Choose your faculty and course, then select the modules you need.
              Pick a package and pay per module.
            </p>
          </FadeInUp>
          <FadeInUp delay={0.25}>
            <div className="mt-6">
              <StepIndicator current={step} />
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-20 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2"
          >
            <div
              className={[
                "rounded-xl border bg-white px-4 py-3 text-sm shadow-lg",
                toast.type === "success"
                  ? "border-green-600 bg-green-50 text-green-800"
                  : "border-red-600 bg-red-50 text-red-800",
              ].join(" ")}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="font-medium">{toast.message}</div>
                <button
                  type="button"
                  className="text-xs opacity-70 hover:opacity-100"
                  onClick={() => setToast(null)}
                  aria-label="Close notification"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="section">
        <div className="container">
          {success ? (
            <FadeIn>
              <div className="card p-8 lg:p-12 max-w-2xl mx-auto text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-500/10 text-3xl mb-6"
                >
                  ✅
                </motion.div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Booking confirmed!
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Your order has been submitted successfully.
                  {orderResult?.paymentReference && (
                    <>
                      {" "}
                      Payment reference:{" "}
                      <span className="font-semibold text-foreground">
                        {orderResult.paymentReference}
                      </span>
                    </>
                  )}
                </p>
                {orderResult?.totalAmount && (
                  <p className="mt-2 text-lg font-bold text-primary">
                    Total: {formatZAR(orderResult.totalAmount)}
                  </p>
                )}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link className="btn-primary" to="/courses">
                    Browse courses
                  </Link>
                  <Link className="btn-outline" to="/book">
                    Book another tutorial
                  </Link>
                </div>
              </div>
            </FadeIn>
          ) : dataLoading ? (
            <FadeIn>
              <div className="card p-12 text-center max-w-lg mx-auto">
                <div className="text-4xl mb-4 animate-pulse">📚</div>
                <h3 className="text-lg font-semibold">Loading...</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fetching faculties and packages.
                </p>
              </div>
            </FadeIn>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="card p-6 lg:p-8">
                  {submitError && (
                    <div className="mb-6 card p-4 border border-red-500/30 bg-red-500/5 text-sm text-red-600">
                      {submitError}
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {/* ── STEP 1 ── */}
                    {step === 1 && (
                      <StepWrapper stepKey="step1">
                        <form
                          className="space-y-6"
                          onSubmit={(e) => {
                            e.preventDefault();
                            goNext();
                          }}
                        >
                          {/* Personal details */}
                          <div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                              Your details
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <label className="text-sm font-medium">
                                  Full name
                                </label>
                                <input
                                  className="input mt-1.5"
                                  name="fullName"
                                  value={form.fullName}
                                  onChange={onChange}
                                  placeholder="Your full name"
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Email
                                </label>
                                <input
                                  className="input mt-1.5"
                                  type="email"
                                  name="email"
                                  value={form.email}
                                  onChange={onChange}
                                  placeholder="you@example.com"
                                  required
                                />
                              </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 mt-4">
                              <div>
                                <label className="text-sm font-medium">
                                  Phone
                                </label>
                                <input
                                  className="input mt-1.5"
                                  name="phone"
                                  value={form.phone}
                                  onChange={onChange}
                                  placeholder="0712345678"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          {/* Faculty & Course */}
                          <div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                              Faculty & Course
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <label className="text-sm font-medium">
                                  Faculty
                                </label>
                                <select
                                  className="input mt-1.5"
                                  value={form.facultyId}
                                  onChange={onFacultyChange}
                                  required
                                >
                                  <option value="" disabled>
                                    Select a faculty
                                  </option>
                                  {facultiesList.map((f) => (
                                    <option
                                      key={f._id || f.id}
                                      value={f._id || f.id}
                                    >
                                      {f.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Course
                                </label>
                                <select
                                  className="input mt-1.5"
                                  value={form.courseId}
                                  onChange={onCourseChange}
                                  disabled={!form.facultyId}
                                  required
                                >
                                  <option value="" disabled>
                                    {form.facultyId
                                      ? "Select a course"
                                      : "Select faculty first"}
                                  </option>
                                  {coursesList.map((c) => (
                                    <option
                                      key={c._id || c.id}
                                      value={c._id || c.id}
                                    >
                                      {c.title || c.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Modules */}
                          <div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                              Select module(s)
                            </h3>

                            {modulesList.length > 0 ? (
                              <div className="grid gap-3 sm:grid-cols-2">
                                {modulesList.map((m) => {
                                  const mKey = m._id || m.id;
                                  const checked = form.moduleIds.includes(mKey);
                                  const mTitle = m.title || m.name;
                                  const mCode = m.code || "";
                                  return (
                                    <motion.label
                                      key={mKey}
                                      whileTap={{ scale: 0.98 }}
                                      className={[
                                        "flex cursor-pointer items-start gap-3 rounded-xl border-2 bg-background p-4 transition-colors",
                                        checked
                                          ? "border-primary bg-primary/[0.03]"
                                          : "border-transparent hover:border-muted-foreground/20",
                                      ].join(" ")}
                                    >
                                      <input
                                        type="checkbox"
                                        className="mt-0.5 h-4 w-4 rounded accent-primary"
                                        checked={checked}
                                        onChange={() => toggleModule(mKey)}
                                      />
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                          <div>
                                            {mCode && (
                                              <div className="text-xs font-medium text-primary">
                                                {mCode}
                                              </div>
                                            )}
                                            <div className="text-sm font-semibold">
                                              {mTitle}
                                            </div>
                                          </div>
                                          {m.year && m.semester && (
                                            <div className="text-[10px] text-muted-foreground">
                                              Y{m.year} • S{m.semester}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </motion.label>
                                  );
                                })}
                              </div>
                            ) : form.courseId ? (
                              <div className="rounded-xl border-2 border-dashed p-8 text-center text-sm text-muted-foreground">
                                No modules available for this course yet.
                              </div>
                            ) : (
                              <div className="rounded-xl border-2 border-dashed p-8 text-center text-sm text-muted-foreground">
                                Select a faculty and course above to see
                                modules.
                              </div>
                            )}
                          </div>

                          {/* Package */}
                          <div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                              Choose a package
                            </h3>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {packagesList.map((p) => {
                                const pKey = p._id || p.id;
                                const sel = form.packageId === pKey;
                                return (
                                  <motion.label
                                    key={pKey}
                                    whileTap={{ scale: 0.98 }}
                                    className={[
                                      "flex cursor-pointer items-start gap-3 rounded-xl border-2 bg-background p-4 transition-colors",
                                      sel
                                        ? "border-primary bg-primary/[0.03]"
                                        : "border-transparent hover:border-muted-foreground/20",
                                    ].join(" ")}
                                  >
                                    <input
                                      type="radio"
                                      name="packageId"
                                      className="mt-0.5 accent-primary"
                                      checked={sel}
                                      onChange={() =>
                                        setField("packageId", pKey)
                                      }
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="text-sm font-semibold">
                                          {p.name}
                                        </div>
                                        <div className="text-sm font-bold text-primary">
                                          {formatZAR(p.pricePerModule)}
                                        </div>
                                      </div>
                                      <div className="mt-0.5 text-xs text-muted-foreground">
                                        {p.description}
                                      </div>
                                    </div>
                                  </motion.label>
                                );
                              })}
                            </div>
                          </div>

                          {/* Summary bar */}
                          <div className="flex flex-col gap-3 rounded-xl bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm">
                              <span className="font-semibold">
                                {form.moduleIds.length}
                              </span>{" "}
                              module(s) ×{" "}
                              <span className="font-semibold">
                                {formatZAR(
                                  selectedPackage?.pricePerModule || 0,
                                )}
                              </span>{" "}
                              ={" "}
                              <span className="text-lg font-bold text-primary">
                                {formatZAR(finalPrice)}
                              </span>
                            </div>
                            <button
                              className="btn-primary"
                              type="submit"
                              disabled={!valid()}
                            >
                              Next →
                            </button>
                          </div>
                        </form>
                      </StepWrapper>
                    )}

                    {/* ── STEP 2 ── */}
                    {step === 2 && (
                      <StepWrapper stepKey="step2">
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-xl font-bold tracking-tight">
                              Review your booking
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                              Confirm everything looks correct before payment.
                            </p>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border bg-background p-5">
                              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Student
                              </div>
                              <div className="mt-2 text-sm font-semibold">
                                {form.fullName}
                              </div>
                              <div className="mt-1 text-sm text-muted-foreground">
                                {form.email}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {form.phone}
                              </div>
                            </div>
                            <div className="rounded-xl border bg-background p-5">
                              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Package
                              </div>
                              <div className="mt-2 text-sm font-semibold">
                                {selectedPackage?.name}
                              </div>
                              <div className="mt-1 text-sm text-muted-foreground">
                                {formatZAR(
                                  selectedPackage?.pricePerModule || 0,
                                )}{" "}
                                per module
                              </div>
                            </div>
                          </div>

                          <div className="rounded-xl border bg-background p-5">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Faculty & Course
                            </div>
                            <div className="mt-2 text-sm font-semibold">
                              {facultyName} → {courseName}
                            </div>

                            <div className="mt-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Selected modules
                            </div>
                            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                              {selectedModules.map((m) => {
                                const mKey = m._id || m.id;
                                const mTitle = m.title || m.name;
                                const mCode = m.code || "";
                                return (
                                  <div
                                    key={mKey}
                                    className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2"
                                  >
                                    {mCode && (
                                      <span className="text-xs font-bold text-primary">
                                        {mCode}
                                      </span>
                                    )}
                                    <span className="text-sm">{mTitle}</span>
                                    {m.year && (
                                      <span className="ml-auto text-[10px] text-muted-foreground">
                                        Y{m.year}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t pt-4">
                              <div className="text-sm text-muted-foreground">
                                {form.moduleIds.length} module(s) ×{" "}
                                {formatZAR(
                                  selectedPackage?.pricePerModule || 0,
                                )}
                              </div>
                              <div className="text-xl font-bold">
                                {formatZAR(finalPrice)}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                            <button
                              className="btn-outline"
                              onClick={goBack}
                              type="button"
                            >
                              ← Back
                            </button>
                            <button
                              className="btn-primary"
                              onClick={confirmBookingAndProceed}
                              type="button"
                              disabled={submitting}
                            >
                              {submitting
                                ? "Confirming..."
                                : "Confirm booking and proceed to payment →"}
                            </button>
                          </div>
                        </div>
                      </StepWrapper>
                    )}

                    {/* ── STEP 3 ── */}
                    {step === 3 && (
                      <StepWrapper stepKey="step3">
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-xl font-bold tracking-tight">
                              Payment
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                              Complete your payment to confirm the booking.
                            </p>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border bg-background p-6">
                              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Amount due
                              </div>
                              <div className="mt-2 text-4xl font-bold gradient-text">
                                {formatZAR(finalPrice)}
                              </div>
                              <div className="mt-2 text-sm text-muted-foreground">
                                {form.moduleIds.length} module(s) •{" "}
                                {selectedPackage?.name}
                              </div>
                            </div>
                            <div className="rounded-xl border bg-background p-6">
                              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Payment method
                              </div>
                              <p className="mt-2 text-sm text-muted-foreground">
                                You will be redirected to Paystack to complete payment.
                              </p>
                              <div className="mt-4 grid grid-cols-3 gap-2">
                                {["💳 Card", "🏦 EFT", "📱 Wallet"].map((m) => (
                                  <div
                                    key={m}
                                    className="rounded-lg border-2 bg-muted/30 p-3 text-center text-xs font-medium"
                                  >
                                    {m}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="rounded-xl border bg-background p-5">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                              Summary
                            </div>
                            <div className="space-y-1.5 text-sm text-muted-foreground">
                              <div>
                                <span className="font-medium text-foreground">
                                  Student:
                                </span>{" "}
                                {form.fullName}
                              </div>
                              <div>
                                <span className="font-medium text-foreground">
                                  Contact:
                                </span>{" "}
                                {form.email} • {form.phone}
                              </div>
                              <div>
                                <span className="font-medium text-foreground">
                                  Faculty:
                                </span>{" "}
                                {facultyName}
                              </div>
                              <div>
                                <span className="font-medium text-foreground">
                                  Course:
                                </span>{" "}
                                {courseName}
                              </div>
                              <div>
                                <span className="font-medium text-foreground">
                                  Modules:
                                </span>{" "}
                                {selectedModules
                                  .map((m) => {
                                    const mCode = m.code || "";
                                    const mTitle = m.title || m.name;
                                    return mCode ? `${mCode}` : mTitle;
                                  })
                                  .join(", ")}
                              </div>
                            </div>
                          </div>

                          {submitError && (
                            <div className="card p-4 border border-red-500/30 bg-red-500/5 text-sm text-red-600">
                              {submitError}
                            </div>
                          )}

                          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                            <button
                              className="btn-outline"
                              onClick={goBack}
                              type="button"
                              disabled={submitting}
                            >
                              ← Back
                            </button>
                            <button
                              className="btn-primary text-base px-8"
                              onClick={confirmAndPay}
                              type="button"
                              disabled={submitting}
                            >
                              {submitting
                                ? "Processing..."
                                : `Pay ${formatZAR(finalPrice)}`}
                            </button>
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
                        <span className="font-semibold">
                          {formatZAR(selectedPackage?.pricePerModule || 0)} /
                          module
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Modules</span>
                        <span className="font-semibold">
                          {form.moduleIds.length}
                        </span>
                      </div>
                      <div className="border-t pt-3 flex items-center justify-between">
                        <span className="font-medium">Total</span>
                        <span className="text-lg font-bold text-primary">
                          {formatZAR(finalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </FadeInUp>

                {form.courseId && (
                  <FadeInUp delay={0.35}>
                    <div className="card p-6">
                      <h3 className="text-sm font-semibold">Selection</h3>
                      <div className="mt-3 text-sm text-muted-foreground space-y-1">
                        <div>{modulesList.length} available modules</div>
                        <div>{form.moduleIds.length} selected</div>
                      </div>
                    </div>
                  </FadeInUp>
                )}

                <FadeInUp delay={0.4}>
                  <div className="card p-6">
                    <h3 className="text-sm font-semibold">Need help?</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      Browse courses first to understand available modules.
                    </p>
                    <Link className="btn-secondary mt-4 w-full" to="/courses">
                      Browse courses
                    </Link>
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
