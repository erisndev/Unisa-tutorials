import { useEffect, useMemo, useState } from "react";
import { FacultyAPI } from "../../api/faculties";
import { CourseAPI } from "../../api/courses";
import { ModuleAPI } from "../../api/modules";
import { PackageAPI } from "../../api/packages";
import { OrderAPI } from "../../api/orders";
import { formatZAR } from "../../lib/university";

// Simple Bar Chart Component
function BarChart({ data, title, valueKey = "value", labelKey = "label", color = "bg-primary" }) {
  const maxValue = Math.max(...data.map((d) => d[valueKey] || 0), 1);
  
  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="text-sm font-semibold mb-4">{title}</div>
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground truncate max-w-[60%]">{item[labelKey]}</span>
              <span className="font-medium">{item[valueKey]}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${color} rounded-full transition-all duration-500`}
                style={{ width: `${(item[valueKey] / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-4">No data available</div>
        )}
      </div>
    </div>
  );
}

// Horizontal Bar Chart
function HorizontalBarChart({ data, title, valueKey = "value", labelKey = "label", formatValue }) {
  const maxValue = Math.max(...data.map((d) => d[valueKey] || 0), 1);
  const colors = ["bg-primary", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500", "bg-orange-500"];
  
  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="text-sm font-semibold mb-4">{title}</div>
      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-24 text-xs text-muted-foreground truncate">{item[labelKey]}</div>
            <div className="flex-1 h-6 bg-muted rounded-lg overflow-hidden">
              <div
                className={`h-full ${colors[i % colors.length]} rounded-lg transition-all duration-500 flex items-center justify-end pr-2`}
                style={{ width: `${Math.max((item[valueKey] / maxValue) * 100, 10)}%` }}
              >
                <span className="text-[10px] font-medium text-white">
                  {formatValue ? formatValue(item[valueKey]) : item[valueKey]}
                </span>
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-4">No data available</div>
        )}
      </div>
    </div>
  );
}

// Donut/Pie Chart Component
function DonutChart({ data, title, valueKey = "value", labelKey = "label" }) {
  const total = data.reduce((sum, d) => sum + (d[valueKey] || 0), 0);
  const colors = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];
  
  let cumulativePercent = 0;
  const segments = data.map((item, i) => {
    const percent = total > 0 ? (item[valueKey] / total) * 100 : 0;
    const startPercent = cumulativePercent;
    cumulativePercent += percent;
    return { ...item, percent, startPercent, color: colors[i % colors.length] };
  });

  // Create conic gradient
  const gradientStops = segments.map((seg) => 
    `${seg.color} ${seg.startPercent}% ${seg.startPercent + seg.percent}%`
  ).join(", ");

  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="text-sm font-semibold mb-4">{title}</div>
      <div className="flex items-center gap-6">
        <div className="relative">
          <div
            className="w-32 h-32 rounded-full"
            style={{
              background: total > 0 
                ? `conic-gradient(${gradientStops})` 
                : "var(--muted)",
            }}
          />
          <div className="absolute inset-4 bg-background rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold">{total}</div>
              <div className="text-[10px] text-muted-foreground">Total</div>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: seg.color }} />
              <span className="text-muted-foreground flex-1 truncate">{seg[labelKey]}</span>
              <span className="font-medium">{seg[valueKey]}</span>
              <span className="text-muted-foreground">({seg.percent.toFixed(0)}%)</span>
            </div>
          ))}
          {data.length === 0 && (
            <div className="text-sm text-muted-foreground">No data</div>
          )}
        </div>
      </div>
    </div>
  );
}

// Line Chart Component (using SVG)
function LineChart({ data, title, valueKey = "value", labelKey = "label", formatValue }) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border bg-background p-5">
        <div className="text-sm font-semibold mb-4">{title}</div>
        <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
          No data available
        </div>
      </div>
    );
  }

  const values = data.map((d) => d[valueKey] || 0);
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);
  const range = maxValue - minValue || 1;
  
  const width = 100;
  const height = 50;
  const padding = 2;
  
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * (width - padding * 2);
    const y = height - padding - ((d[valueKey] - minValue) / range) * (height - padding * 2);
    return { x, y, ...d };
  });
  
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="text-sm font-semibold mb-4">{title}</div>
      <div className="relative h-48">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#lineGradient)" />
          <path d={pathD} fill="none" stroke="rgb(99, 102, 241)" strokeWidth="0.5" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="1" fill="rgb(99, 102, 241)" />
          ))}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-muted-foreground px-1">
          {data.slice(0, 7).map((d, i) => (
            <span key={i} className="truncate max-w-[40px]">{d[labelKey]}</span>
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>Min: {formatValue ? formatValue(minValue) : minValue}</span>
        <span>Max: {formatValue ? formatValue(maxValue) : maxValue}</span>
      </div>
    </div>
  );
}

// Stats Grid Component
function StatsGrid({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <div key={i} className="rounded-xl border bg-background p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </div>
            {stat.change !== undefined && (
              <span className={`text-xs font-medium ${stat.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                {stat.change >= 0 ? "+" : ""}{stat.change}%
              </span>
            )}
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight">{stat.value}</div>
          {stat.sub && <div className="mt-1 text-xs text-muted-foreground">{stat.sub}</div>}
        </div>
      ))}
    </div>
  );
}

// Area Sparkline
function Sparkline({ data, color = "primary" }) {
  if (data.length < 2) return null;
  
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 100 100" className="w-full h-12" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={`var(--${color})`}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function AdminAnalytics() {
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
        setError(e?.response?.data?.message || e?.message || "Failed to load analytics data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Calculate analytics data
  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o?.totalAmount || 0), 0);
    const paidOrders = orders.filter((o) => String(o?.status || "").toLowerCase() === "paid");
    const pendingOrders = orders.filter((o) => String(o?.status || "pending").toLowerCase() === "pending");
    const paidRevenue = paidOrders.reduce((sum, o) => sum + Number(o?.totalAmount || 0), 0);
    
    // Orders by status
    const ordersByStatus = [
      { label: "Paid", value: paidOrders.length },
      { label: "Pending", value: pendingOrders.length },
      { label: "Other", value: orders.length - paidOrders.length - pendingOrders.length },
    ].filter((s) => s.value > 0);

    // Courses per faculty
    const coursesPerFaculty = faculties.map((f) => ({
      label: f.name || "Unknown",
      value: courses.filter((c) => {
        const fid = typeof c.faculty === "string" ? c.faculty : c.faculty?._id;
        return fid === f._id;
      }).length,
    })).sort((a, b) => b.value - a.value).slice(0, 6);

    // Modules per course (top 6)
    const modulesPerCourse = courses.map((c) => ({
      label: c.title || "Unknown",
      value: modules.filter((m) => {
        const cid = typeof m.course === "string" ? m.course : m.course?._id;
        return cid === c._id;
      }).length,
    })).sort((a, b) => b.value - a.value).slice(0, 6);

    // Revenue by month (simulated from order dates)
    const revenueByMonth = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    orders.forEach((o) => {
      const date = new Date(o.createdAt || Date.now());
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + Number(o.totalAmount || 0);
    });

    const revenueData = Object.entries(revenueByMonth)
      .map(([label, value]) => ({ label, value }))
      .slice(-7);

    // Orders by month
    const ordersByMonth = {};
    orders.forEach((o) => {
      const date = new Date(o.createdAt || Date.now());
      const monthKey = `${monthNames[date.getMonth()]}`;
      ordersByMonth[monthKey] = (ordersByMonth[monthKey] || 0) + 1;
    });

    const ordersData = Object.entries(ordersByMonth)
      .map(([label, value]) => ({ label, value }))
      .slice(-7);

    // Package popularity (by orders)
    const packageOrders = {};
    orders.forEach((o) => {
      if (o.package) {
        const pkgId = typeof o.package === "string" ? o.package : o.package?._id;
        const pkg = packages.find((p) => p._id === pkgId);
        const name = pkg?.name || o.package?.name || "Unknown Package";
        packageOrders[name] = (packageOrders[name] || 0) + 1;
      }
    });

    const packageData = Object.entries(packageOrders)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Active vs Inactive content
    const activeModules = modules.filter((m) => m.isActive !== false).length;
    const inactiveModules = modules.length - activeModules;
    const activeCourses = courses.filter((c) => c.isActive !== false).length;
    const inactiveCourses = courses.length - activeCourses;

    const contentStatus = [
      { label: "Active Courses", value: activeCourses },
      { label: "Inactive Courses", value: inactiveCourses },
      { label: "Active Modules", value: activeModules },
      { label: "Inactive Modules", value: inactiveModules },
    ];

    // Top revenue packages
    const packageRevenue = {};
    orders.forEach((o) => {
      if (o.package) {
        const pkgId = typeof o.package === "string" ? o.package : o.package?._id;
        const pkg = packages.find((p) => p._id === pkgId);
        const name = pkg?.name || o.package?.name || "Unknown";
        packageRevenue[name] = (packageRevenue[name] || 0) + Number(o.totalAmount || 0);
      }
    });

    const topPackageRevenue = Object.entries(packageRevenue)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      totalRevenue,
      paidRevenue,
      paidOrders,
      pendingOrders,
      ordersByStatus,
      coursesPerFaculty,
      modulesPerCourse,
      revenueData,
      ordersData,
      packageData,
      contentStatus,
      topPackageRevenue,
      avgOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      conversionRate: orders.length > 0 ? (paidOrders.length / orders.length) * 100 : 0,
    };
  }, [faculties, courses, modules, packages, orders]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Loading analytics data...</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border bg-background p-5 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-3" />
              <div className="h-8 bg-muted rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Comprehensive insights into your business performance.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Key Metrics */}
      <StatsGrid
        stats={[
          { label: "Total Revenue", value: formatZAR(analytics.totalRevenue), sub: `${formatZAR(analytics.paidRevenue)} confirmed` },
          { label: "Total Orders", value: orders.length, sub: `${analytics.paidOrders.length} paid · ${analytics.pendingOrders.length} pending` },
          { label: "Avg Order Value", value: formatZAR(analytics.avgOrderValue), sub: "Per transaction" },
          { label: "Conversion Rate", value: `${analytics.conversionRate.toFixed(1)}%`, sub: "Paid / Total orders" },
        ]}
      />

      {/* Content Stats */}
      <StatsGrid
        stats={[
          { label: "Faculties", value: faculties.length },
          { label: "Courses", value: courses.length, sub: `${courses.filter((c) => c.isActive !== false).length} active` },
          { label: "Modules", value: modules.length, sub: `${modules.filter((m) => m.isActive !== false).length} active` },
          { label: "Packages", value: packages.length, sub: `${packages.filter((p) => p.isActive !== false).length} active` },
        ]}
      />

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <LineChart
          data={analytics.revenueData}
          title="Revenue Trend"
          valueKey="value"
          labelKey="label"
          formatValue={(v) => formatZAR(v)}
        />
        <DonutChart
          data={analytics.ordersByStatus}
          title="Orders by Status"
          valueKey="value"
          labelKey="label"
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <BarChart
          data={analytics.coursesPerFaculty}
          title="Courses per Faculty"
          valueKey="value"
          labelKey="label"
          color="bg-blue-500"
        />
        <BarChart
          data={analytics.modulesPerCourse}
          title="Modules per Course (Top 6)"
          valueKey="value"
          labelKey="label"
          color="bg-green-500"
        />
      </div>

      {/* Charts Row 3 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <HorizontalBarChart
          data={analytics.topPackageRevenue}
          title="Top Packages by Revenue"
          valueKey="value"
          labelKey="label"
          formatValue={(v) => formatZAR(v)}
        />
        <DonutChart
          data={analytics.packageData}
          title="Package Popularity (Orders)"
          valueKey="value"
          labelKey="label"
        />
      </div>

      {/* Content Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        <BarChart
          data={analytics.contentStatus}
          title="Content Status Overview"
          valueKey="value"
          labelKey="label"
          color="bg-purple-500"
        />
        <LineChart
          data={analytics.ordersData}
          title="Orders by Month"
          valueKey="value"
          labelKey="label"
        />
      </div>

      {/* Recent Activity Summary */}
      <div className="rounded-xl border bg-background p-5">
        <div className="text-sm font-semibold mb-4">Quick Summary</div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">{faculties.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Faculties</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-blue-500">{courses.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Courses</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-green-500">{modules.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Modules</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-purple-500">{packages.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Packages</div>
          </div>
        </div>
      </div>
    </div>
  );
}
