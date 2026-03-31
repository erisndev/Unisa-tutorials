import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FacultyAPI } from "../../api/faculties";
import { CourseAPI } from "../../api/courses";
import { ModuleAPI } from "../../api/modules";
import { PackageAPI } from "../../api/packages";
import { OrderAPI } from "../../api/orders";
import { formatZAR } from "../../lib/university";

function StatCard({ label, value, sub, to }) {
  const inner = (
    <div className="rounded-xl border bg-background p-5 transition-shadow hover:shadow-md">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
      <div className="mt-3 text-3xl font-extrabold tracking-tight">{value}</div>
      {sub ? <div className="mt-1 text-xs text-muted-foreground">{sub}</div> : null}
    </div>
  );
  if (to) return <Link to={to}>{inner}</Link>;
  return inner;
}

export default function AdminOverview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [packages, setPackages] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [f, c, m, p, o] = await Promise.all([
          FacultyAPI.adminList().catch(() => FacultyAPI.list()),
          CourseAPI.adminList().catch(() => CourseAPI.list()),
          ModuleAPI.adminList().catch(() => ModuleAPI.list()),
          PackageAPI.adminList().catch(() => PackageAPI.list()),
          OrderAPI.adminList().catch(() => []),
        ]);
        if (cancelled) return;
        setFaculties(Array.isArray(f) ? f : []);
        setCourses(Array.isArray(c) ? c : []);
        setModules(Array.isArray(m) ? m : []);
        setPackages(Array.isArray(p) ? p : []);
        setOrders(Array.isArray(o) ? o : []);
      } catch (e) {
        if (cancelled) return;
        setError(e?.response?.data?.message || e?.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const revenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + Number(o?.totalAmount || 0), 0);
  }, [orders]);

  const paidCount = useMemo(() => {
    return orders.filter((o) => String(o?.status || "").toLowerCase() === "paid").length;
  }, [orders]);

  const pendingCount = useMemo(() => {
    return orders.filter((o) => String(o?.status || "pending").toLowerCase() === "pending").length;
  }, [orders]);

  const l = loading ? "…" : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back. Here's what's happening.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Faculties" value={l ?? faculties.length} to="/admin/faculties" />
        <StatCard label="Courses" value={l ?? courses.length} to="/admin/courses" />
        <StatCard label="Modules" value={l ?? modules.length} to="/admin/modules" />
        <StatCard label="Packages" value={l ?? packages.length} to="/admin/packages" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Orders" value={l ?? orders.length} to="/admin/orders" sub={`${paidCount} paid · ${pendingCount} pending`} />
        <StatCard label="Revenue" value={l ?? formatZAR(revenue)} sub="Sum of all order amounts" />
        <StatCard label="Avg Order" value={l ?? (orders.length ? formatZAR(revenue / orders.length) : "R 0")} sub="Average order value" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-background p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Recent orders</div>
            <Link to="/admin/orders" className="text-xs text-primary font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {(orders || []).slice(0, 6).map((o) => (
              <div key={o._id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="text-sm font-semibold">{o.fullName}</div>
                  <div className="text-xs text-muted-foreground">{o.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-primary">{formatZAR(o.totalAmount || 0)}</div>
                  <div className={[
                    "text-[10px] font-medium",
                    String(o.status || "pending").toLowerCase() === "paid" ? "text-green-600" : "text-muted-foreground",
                  ].join(" ")}>
                    {o.status || "pending"}
                  </div>
                </div>
              </div>
            ))}
            {!loading && orders.length === 0 && (
              <div className="text-sm text-muted-foreground">No orders yet.</div>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-background p-5">
          <div className="text-sm font-semibold">Quick actions</div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Link to="/admin/faculties" className="rounded-lg border p-4 text-center hover:bg-muted transition-colors">
              <div className="text-sm font-medium">Add Faculty</div>
            </Link>
            <Link to="/admin/courses" className="rounded-lg border p-4 text-center hover:bg-muted transition-colors">
              <div className="text-sm font-medium">Add Course</div>
            </Link>
            <Link to="/admin/modules" className="rounded-lg border p-4 text-center hover:bg-muted transition-colors">
              <div className="text-sm font-medium">Add Module</div>
            </Link>
            <Link to="/admin/packages" className="rounded-lg border p-4 text-center hover:bg-muted transition-colors">
              <div className="text-sm font-medium">Add Package</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
