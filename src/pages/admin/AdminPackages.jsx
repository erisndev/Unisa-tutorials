import { useEffect, useState } from "react";
import { PackageAPI } from "../../api/packages";
import { formatZAR } from "../../lib/university";
import { useToast } from "./AdminToast";

export default function AdminPackages() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerModule, setPricePerModule] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await PackageAPI.adminList().catch(() => PackageAPI.list());
      setPackages(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setEditingId(null); setCode(""); setName(""); setDescription(""); setPricePerModule(0); setIsActive(true); };

  const startEdit = (p) => {
    setEditingId(p._id);
    setCode(p.code || "");
    setName(p.name || "");
    setDescription(p.description || "");
    setPricePerModule(p.pricePerModule || 0);
    setIsActive(p.isActive !== false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = { code, name, description, pricePerModule: Number(pricePerModule) || 0, isActive };
      if (editingId) {
        await PackageAPI.update(editingId, body);
        toast.success("Package updated.");
      } else {
        await PackageAPI.create(body);
        toast.success("Package created.");
      }
      resetForm();
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Operation failed");
    }
  };

  const remove = async (id) => {
    try {
      await PackageAPI.remove(id);
      toast.success("Package deleted.");
      if (editingId === id) resetForm();
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Packages</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage pricing packages.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="rounded-xl border bg-background p-5 space-y-3">
          <div className="text-sm font-semibold">{editingId ? "Edit package" : "New package"}</div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Code</label>
            <input className="input mt-1.5" value={code} onChange={(e) => setCode(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</label>
            <input className="input mt-1.5" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</label>
            <input className="input mt-1.5" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Price per module</label>
            <input className="input mt-1.5" type="number" min={0} step={1} value={pricePerModule} onChange={(e) => setPricePerModule(e.target.value)} required />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Active
          </label>
          <div className="flex gap-2">
            <button className="btn-primary" type="submit">{editingId ? "Update" : "Create"}</button>
            {editingId && <button className="btn-outline" type="button" onClick={resetForm}>Cancel</button>}
          </div>
        </form>

        <div className="rounded-xl border bg-background p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">All packages ({packages.length})</div>
            <button className="btn-outline text-xs" type="button" onClick={load} disabled={loading}>{loading ? "Loading..." : "Refresh"}</button>
          </div>
          <div className="mt-4 space-y-2">
            {packages.map((p) => (
              <div key={p._id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div>
                  <div className="font-semibold text-sm">{p.name}</div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="badge">{p.code}</span>
                    <span className="badge-muted">{formatZAR(p.pricePerModule)} / module</span>
                    <span className={p.isActive ? "badge" : "badge-muted"}>{p.isActive ? "Active" : "Inactive"}</span>
                  </div>
                  {p.description ? <div className="text-xs text-muted-foreground mt-1">{p.description}</div> : null}
                </div>
                <div className="flex gap-1.5">
                  <button className="btn-outline text-xs" type="button" onClick={() => startEdit(p)}>Edit</button>
                  <button className="btn-outline text-xs text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20" type="button" onClick={() => remove(p._id)}>Delete</button>
                </div>
              </div>
            ))}
            {!loading && packages.length === 0 && <div className="text-sm text-muted-foreground">No packages yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
