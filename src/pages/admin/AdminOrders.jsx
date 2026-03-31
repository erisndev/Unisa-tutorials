import { useEffect, useMemo, useState } from "react";
import { OrderAPI } from "../../api/orders";
import { formatZAR } from "../../lib/university";
import { useToast } from "./AdminToast";

export default function AdminOrders() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const data = await OrderAPI.adminList().catch(() => []);
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((o) => String(o?.status || "pending").toLowerCase() === statusFilter);
  }, [orders, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">View submitted orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="input max-w-[200px]" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
          <button className="btn-outline text-xs" type="button" onClick={load} disabled={loading}>{loading ? "Loading..." : "Refresh"}</button>
        </div>
      </div>

      <div className="rounded-xl border bg-background p-5">
        <div className="text-sm text-muted-foreground">{filtered.length} orders</div>
        <div className="mt-4 space-y-3">
          {!loading && filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground">No orders found.</div>
          ) : (
            filtered.map((o) => {
              const fName = typeof o.faculty === "object" ? o.faculty?.name : o.faculty;
              const cName = typeof o.course === "object" ? o.course?.title || o.course?.name : o.course;
              const pkgName = typeof o.package === "object" ? o.package?.name : o.package;
              const modNames = Array.isArray(o.modules)
                ? o.modules.map((m) => (typeof m === "object" ? m.title || m.name : m)).join(", ")
                : "";

              return (
                <div key={o._id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold">{o.fullName}</div>
                      <div className="text-sm text-muted-foreground">{o.email} · {o.phone}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{formatZAR(o.totalAmount || 0)}</div>
                      <div className={["text-xs font-medium", String(o.status || "pending").toLowerCase() === "paid" ? "text-green-600" : "text-muted-foreground"].join(" ")}>{o.status || "pending"}</div>
                      {o.paymentReference ? <div className="text-xs text-muted-foreground">Ref: {o.paymentReference}</div> : null}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3 text-sm text-muted-foreground">
                    <div><span className="font-medium text-foreground">Faculty:</span> {fName || "—"}</div>
                    <div><span className="font-medium text-foreground">Course:</span> {cName || "—"}</div>
                    <div><span className="font-medium text-foreground">Package:</span> {pkgName || "—"}</div>
                  </div>
                  {modNames ? (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Modules:</span> {modNames}
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
