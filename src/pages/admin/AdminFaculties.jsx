import { useEffect, useState } from "react";
import { FacultyAPI } from "../../api/faculties";
import { useToast } from "./AdminToast";

export default function AdminFaculties() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [faculties, setFaculties] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });

  const load = async () => {
    setLoading(true);
    try {
      const data = await FacultyAPI.adminList().catch(() => FacultyAPI.list());
      setFaculties(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to load faculties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setEditingId(null); setName(""); setDescription(""); };

  const startEdit = (f) => {
    setEditingId(f._id);
    setName(f.name || "");
    setDescription(f.description || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await FacultyAPI.update(editingId, { name, description });
        toast.success("Faculty updated.");
      } else {
        await FacultyAPI.create({ name, description });
        toast.success("Faculty created.");
      }
      resetForm();
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Operation failed");
    }
  };

  const openDeleteModal = (f) => {
    setDeleteModal({ open: true, id: f._id, name: f.name });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, id: null, name: "" });
  };

  const confirmDelete = async () => {
    const id = deleteModal.id;
    closeDeleteModal();
    try {
      await FacultyAPI.remove(id);
      toast.success("Faculty deleted.");
      if (editingId === id) resetForm();
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Faculties</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create, edit and delete faculties.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="rounded-xl border bg-background p-5 space-y-3">
          <div className="text-sm font-semibold">{editingId ? "Edit faculty" : "New faculty"}</div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</label>
            <input className="input mt-1.5" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</label>
            <input className="input mt-1.5" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button className="btn-primary" type="submit">{editingId ? "Update" : "Create"}</button>
            {editingId && <button className="btn-outline" type="button" onClick={resetForm}>Cancel</button>}
          </div>
        </form>

        <div className="rounded-xl border bg-background p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">All faculties ({faculties.length})</div>
            <button className="btn-outline text-xs" type="button" onClick={load} disabled={loading}>{loading ? "Loading..." : "Refresh"}</button>
          </div>
          <div className="mt-4 space-y-2">
            {faculties.map((f) => (
              <div key={f._id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div>
                  <div className="font-semibold text-sm">{f.name}</div>
                  {f.description ? <div className="text-xs text-muted-foreground mt-0.5">{f.description}</div> : null}
                </div>
                <div className="flex gap-1.5">
                  <button className="btn-outline text-xs" type="button" onClick={() => startEdit(f)}>Edit</button>
                  <button className="btn-outline text-xs text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20" type="button" onClick={() => openDeleteModal(f)}>Delete</button>
                </div>
              </div>
            ))}
            {!loading && faculties.length === 0 && <div className="text-sm text-muted-foreground">No faculties yet.</div>}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={closeDeleteModal}></div>
          <div className="relative z-50 w-full max-w-md rounded-xl border bg-background p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Delete Faculty</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete <span className="font-medium text-foreground">"{deleteModal.name}"</span>? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button className="btn-outline" type="button" onClick={closeDeleteModal}>Cancel</button>
              <button className="btn-primary bg-red-600 hover:bg-red-700" type="button" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
