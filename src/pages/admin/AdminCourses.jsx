import { useEffect, useMemo, useState } from "react";
import { FacultyAPI } from "../../api/faculties";
import { CourseAPI } from "../../api/courses";
import { useToast } from "./AdminToast";

export default function AdminCourses() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: "" });

  const load = async () => {
    setLoading(true);
    try {
      const [f, c] = await Promise.all([
        FacultyAPI.adminList().catch(() => FacultyAPI.list()),
        CourseAPI.adminList().catch(() => CourseAPI.list()),
      ]);
      setFaculties(Array.isArray(f) ? f : []);
      setCourses(Array.isArray(c) ? c : []);
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const coursesForFaculty = useMemo(() => {
    if (!selectedFacultyId) return courses;
    return courses.filter((c) => {
      const fid = typeof c.faculty === "string" ? c.faculty : c.faculty?._id;
      return fid === selectedFacultyId;
    });
  }, [courses, selectedFacultyId]);

  const resetForm = () => { setEditingId(null); setTitle(""); setDescription(""); setIsActive(true); };

  const startEdit = (c) => {
    setEditingId(c._id);
    setTitle(c.title || "");
    setDescription(c.description || "");
    setIsActive(c.isActive !== false);
    const fid = typeof c.faculty === "string" ? c.faculty : c.faculty?._id;
    if (fid) setSelectedFacultyId(fid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFacultyId) { toast.error("Select a faculty first."); return; }
    try {
      if (editingId) {
        await CourseAPI.update(editingId, { faculty: selectedFacultyId, title, description, isActive });
        toast.success("Course updated.");
      } else {
        await CourseAPI.create({ faculty: selectedFacultyId, title, description, isActive });
        toast.success("Course created.");
      }
      resetForm();
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Operation failed");
    }
  };

  const openDeleteModal = (c) => {
    setDeleteModal({ open: true, id: c._id, title: c.title });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, id: null, title: "" });
  };

  const confirmDelete = async () => {
    const id = deleteModal.id;
    closeDeleteModal();
    try {
      await CourseAPI.remove(id);
      toast.success("Course deleted.");
      if (editingId === id) resetForm();
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create, edit and delete courses.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="rounded-xl border bg-background p-5 space-y-3">
          <div className="text-sm font-semibold">{editingId ? "Edit course" : "New course"}</div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Faculty</label>
            <select className="input mt-1.5" value={selectedFacultyId} onChange={(e) => setSelectedFacultyId(e.target.value)} required>
              <option value="">Select faculty</option>
              {faculties.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</label>
            <input className="input mt-1.5" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={!selectedFacultyId} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</label>
            <input className="input mt-1.5" value={description} onChange={(e) => setDescription(e.target.value)} disabled={!selectedFacultyId} />
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
            <div className="text-sm font-semibold">Courses ({coursesForFaculty.length})</div>
            <button className="btn-outline text-xs" type="button" onClick={load} disabled={loading}>{loading ? "Loading..." : "Refresh"}</button>
          </div>
          <div className="mt-4 space-y-2">
            {coursesForFaculty.map((c) => (
              <div key={c._id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div>
                  <div className="font-semibold text-sm">{c.title}</div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className={c.isActive ? "badge" : "badge-muted"}>{c.isActive ? "Active" : "Inactive"}</span>
                  </div>
                  {c.description ? <div className="text-xs text-muted-foreground mt-1">{c.description}</div> : null}
                </div>
                <div className="flex gap-1.5">
                  <button className="btn-outline text-xs" type="button" onClick={() => startEdit(c)}>Edit</button>
                  <button className="btn-outline text-xs text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20" type="button" onClick={() => openDeleteModal(c)}>Delete</button>
                </div>
              </div>
            ))}
            {!loading && coursesForFaculty.length === 0 && <div className="text-sm text-muted-foreground">No courses yet.</div>}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={closeDeleteModal}></div>
          <div className="relative z-50 w-full max-w-md rounded-xl border bg-background p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Delete Course</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete <span className="font-medium text-foreground">"{deleteModal.title}"</span>? This action cannot be undone.
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
