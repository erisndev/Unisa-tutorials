import { useEffect, useMemo, useState } from "react";
import { FacultyAPI } from "../../api/faculties";
import { CourseAPI } from "../../api/courses";
import { ModuleAPI } from "../../api/modules";
import { useToast } from "./AdminToast";

export default function AdminModules() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);

  const [selectedFacultyId, setSelectedFacultyId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: "" });

  const load = async () => {
    setLoading(true);
    try {
      const [f, c, m] = await Promise.all([
        FacultyAPI.adminList().catch(() => FacultyAPI.list()),
        CourseAPI.adminList().catch(() => CourseAPI.list()),
        ModuleAPI.adminList().catch(() => ModuleAPI.list()),
      ]);
      setFaculties(Array.isArray(f) ? f : []);
      setCourses(Array.isArray(c) ? c : []);
      setModules(Array.isArray(m) ? m : []);
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const coursesForFaculty = useMemo(() => {
    if (!selectedFacultyId) return [];
    return courses.filter((c) => {
      const fid = typeof c.faculty === "string" ? c.faculty : c.faculty?._id;
      return fid === selectedFacultyId;
    });
  }, [courses, selectedFacultyId]);

  const modulesForCourse = useMemo(() => {
    if (!selectedCourseId) return [];
    return modules.filter((m) => {
      const cid = typeof m.course === "string" ? m.course : m.course?._id;
      return cid === selectedCourseId;
    });
  }, [modules, selectedCourseId]);

  useEffect(() => {
    if (!selectedCourseId) return;
    const c = courses.find((x) => x._id === selectedCourseId);
    if (!c) return;
    const fid = typeof c.faculty === "string" ? c.faculty : c.faculty?._id;
    if (fid !== selectedFacultyId) setSelectedCourseId("");
  }, [selectedCourseId, selectedFacultyId, courses]);

  const resetForm = () => { setEditingId(null); setTitle(""); setDescription(""); setIsActive(true); };

  const startEdit = (m) => {
    setEditingId(m._id);
    setTitle(m.title || "");
    setDescription(m.description || "");
    setIsActive(m.isActive !== false);
    const cid = typeof m.course === "string" ? m.course : m.course?._id;
    if (cid) setSelectedCourseId(cid);
    const c = courses.find((x) => x._id === cid);
    if (c) {
      const fid = typeof c.faculty === "string" ? c.faculty : c.faculty?._id;
      if (fid) setSelectedFacultyId(fid);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) { toast.error("Select a course first."); return; }
    try {
      if (editingId) {
        await ModuleAPI.update(editingId, { course: selectedCourseId, title, description, isActive });
        toast.success("Module updated.");
      } else {
        await ModuleAPI.create({ course: selectedCourseId, title, description, isActive });
        toast.success("Module created.");
      }
      resetForm();
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Operation failed");
    }
  };

  const openDeleteModal = (m) => {
    setDeleteModal({ open: true, id: m._id, title: m.title });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, id: null, title: "" });
  };

  const confirmDelete = async () => {
    const id = deleteModal.id;
    closeDeleteModal();
    try {
      await ModuleAPI.remove(id);
      toast.success("Module deleted.");
      if (editingId === id) resetForm();
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Modules</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create, edit and delete modules.</p>
      </div>

      <div className="rounded-xl border bg-background p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Faculty</label>
            <select className="input mt-1.5" value={selectedFacultyId} onChange={(e) => { setSelectedFacultyId(e.target.value); setSelectedCourseId(""); }}>
              <option value="">Select faculty</option>
              {faculties.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Course</label>
            <select className="input mt-1.5" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} disabled={!selectedFacultyId}>
              <option value="">Select course</option>
              {coursesForFaculty.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="rounded-xl border bg-background p-5 space-y-3">
          <div className="text-sm font-semibold">{editingId ? "Edit module" : "New module"}</div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</label>
            <input className="input mt-1.5" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={!selectedCourseId} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</label>
            <input className="input mt-1.5" value={description} onChange={(e) => setDescription(e.target.value)} disabled={!selectedCourseId} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} disabled={!selectedCourseId} /> Active
          </label>
          <div className="flex gap-2">
            <button className="btn-primary" type="submit" disabled={!selectedCourseId}>{editingId ? "Update" : "Create"}</button>
            {editingId && <button className="btn-outline" type="button" onClick={resetForm}>Cancel</button>}
          </div>
        </form>

        <div className="rounded-xl border bg-background p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Modules ({modulesForCourse.length})</div>
            <button className="btn-outline text-xs" type="button" onClick={load} disabled={loading}>{loading ? "Loading..." : "Refresh"}</button>
          </div>
          <div className="mt-4 space-y-2">
            {selectedCourseId ? (
              modulesForCourse.length > 0 ? modulesForCourse.map((m) => (
                <div key={m._id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <div>
                    <div className="font-semibold text-sm">{m.title}</div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className={m.isActive ? "badge" : "badge-muted"}>{m.isActive ? "Active" : "Inactive"}</span>
                    </div>
                    {m.description ? <div className="text-xs text-muted-foreground mt-1">{m.description}</div> : null}
                  </div>
                  <div className="flex gap-1.5">
                    <button className="btn-outline text-xs" type="button" onClick={() => startEdit(m)}>Edit</button>
                    <button className="btn-outline text-xs text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20" type="button" onClick={() => openDeleteModal(m)}>Delete</button>
                  </div>
                </div>
              )) : <div className="text-sm text-muted-foreground">No modules yet.</div>
            ) : <div className="text-sm text-muted-foreground">Select a course to view its modules.</div>}
          </div>
        </div>
      </div>
    {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={closeDeleteModal}></div>
          <div className="relative z-50 w-full max-w-md rounded-xl border bg-background p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Delete Module</h3>
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
