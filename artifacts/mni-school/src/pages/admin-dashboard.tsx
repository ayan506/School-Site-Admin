import { useState, useEffect } from "react";
import { useListBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost, useListGalleryPhotos, useCreateGalleryPhoto, useUpdateGalleryPhoto, useDeleteGalleryPhoto, useListStaff, useCreateStaff, useUpdateStaff, useDeleteStaff, getListBlogPostsQueryKey, getListGalleryPhotosQueryKey, getListStaffQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Plus, Pencil, Trash2, X, BookOpen, Image, Users, AlertCircle } from "lucide-react";

type Tab = "blog" | "gallery" | "staff";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("blog");
  const [session, setSession] = useState<{ isAdmin: boolean; username: string } | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.isAdmin) {
          setSession(data);
        } else {
          window.location.href = "/admin";
        }
      })
      .catch(() => { window.location.href = "/admin"; })
      .finally(() => setSessionLoading(false));
  }, []);

  if (sessionLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!session?.isAdmin) {
    return null;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/admin";
  };

  const tabs = [
    { id: "blog" as Tab, label: "Blog Posts", labelHindi: "ब्लॉग", icon: BookOpen },
    { id: "gallery" as Tab, label: "Photo Gallery", labelHindi: "गैलरी", icon: Image },
    { id: "staff" as Tab, label: "Staff", labelHindi: "स्टाफ", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="bg-secondary text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-lg">Admin Dashboard</h1>
          <p className="text-white/60 text-xs">MNI School — {session.username}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id ? "bg-primary text-white shadow-sm" : "bg-card border text-foreground hover:bg-accent/40"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className="text-xs opacity-70">/ {tab.labelHindi}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "blog" && <BlogManager />}
            {activeTab === "gallery" && <GalleryManager />}
            {activeTab === "staff" && <StaffManager />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==================== BLOG MANAGER ====================

type BlogPost = {
  id: number;
  title: string;
  titleHindi: string;
  content: string;
  contentHindi: string;
  author: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

type BlogFormData = {
  title: string;
  titleHindi: string;
  content: string;
  contentHindi: string;
  author: string;
  imageUrl: string;
};

function BlogManager() {
  const qc = useQueryClient();
  const { data: posts, isLoading } = useListBlogPosts();
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();
  const deleteMutation = useDeleteBlogPost();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<BlogFormData>({ title: "", titleHindi: "", content: "", contentHindi: "", author: "", imageUrl: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const openAdd = () => { setEditing(null); setForm({ title: "", titleHindi: "", content: "", contentHindi: "", author: "", imageUrl: "" }); setShowForm(true); };
  const openEdit = (post: BlogPost) => { setEditing(post); setForm({ title: post.title, titleHindi: post.titleHindi, content: post.content, contentHindi: post.contentHindi, author: post.author, imageUrl: post.imageUrl ?? "" }); setShowForm(true); };

  const invalidate = () => qc.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, imageUrl: form.imageUrl || null };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data }, { onSuccess: () => { setShowForm(false); invalidate(); } });
    } else {
      createMutation.mutate({ data }, { onSuccess: () => { setShowForm(false); invalidate(); } });
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id }, { onSuccess: () => { setDeleteConfirm(null); invalidate(); } });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-secondary">Blog Posts / ब्लॉग पोस्ट</h2>
          <p className="text-muted-foreground text-sm">{posts?.length ?? 0} posts</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Post
        </button>
      </div>

      {isLoading && <div className="text-muted-foreground py-10 text-center">Loading...</div>}

      <div className="space-y-3">
        {posts?.map(post => (
          <div key={post.id} className="bg-card border rounded-xl p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{post.title}</p>
              <p className="text-sm text-muted-foreground truncate">{post.titleHindi}</p>
              <p className="text-xs text-muted-foreground mt-1">By {post.author} · {new Date(post.createdAt).toLocaleDateString("en-IN")}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openEdit(post)} className="p-2 text-muted-foreground hover:text-primary hover:bg-accent/40 rounded-lg transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => setDeleteConfirm(post.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <Modal onClose={() => setShowForm(false)} title={editing ? "Edit Blog Post" : "Add Blog Post"}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Title (English)" required>
                <input className={inputClass} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
              </Field>
              <Field label="Title (Hindi / हिंदी शीर्षक)" required>
                <input className={inputClass} value={form.titleHindi} onChange={e => setForm(p => ({ ...p, titleHindi: e.target.value }))} required />
              </Field>
              <Field label="Content (Hindi / हिंदी सामग्री)" required>
                <textarea className={inputClass + " resize-none"} rows={4} value={form.contentHindi} onChange={e => setForm(p => ({ ...p, contentHindi: e.target.value }))} required />
              </Field>
              <Field label="Content (English)" required>
                <textarea className={inputClass + " resize-none"} rows={4} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required />
              </Field>
              <Field label="Author" required>
                <input className={inputClass} value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} required />
              </Field>
              <Field label="Image URL (optional)">
                <input className={inputClass} value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://..." />
              </Field>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
                  {editing ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 border rounded-lg text-sm hover:bg-accent/40 transition-colors">Cancel</button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <DeleteConfirm open={deleteConfirm !== null} onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
}

// ==================== GALLERY MANAGER ====================

type GalleryPhoto = {
  id: number;
  title: string;
  titleHindi: string;
  imageUrl: string;
  category: string;
  createdAt: string;
};

type GalleryFormData = { title: string; titleHindi: string; imageUrl: string; category: string };

function GalleryManager() {
  const qc = useQueryClient();
  const { data: photos, isLoading } = useListGalleryPhotos();
  const createMutation = useCreateGalleryPhoto();
  const updateMutation = useUpdateGalleryPhoto();
  const deleteMutation = useDeleteGalleryPhoto();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GalleryPhoto | null>(null);
  const [form, setForm] = useState<GalleryFormData>({ title: "", titleHindi: "", imageUrl: "", category: "Events" });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const openAdd = () => { setEditing(null); setForm({ title: "", titleHindi: "", imageUrl: "", category: "Events" }); setShowForm(true); };
  const openEdit = (photo: GalleryPhoto) => { setEditing(photo); setForm({ title: photo.title, titleHindi: photo.titleHindi, imageUrl: photo.imageUrl, category: photo.category }); setShowForm(true); };

  const invalidate = () => qc.invalidateQueries({ queryKey: getListGalleryPhotosQueryKey() });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: form }, { onSuccess: () => { setShowForm(false); invalidate(); } });
    } else {
      createMutation.mutate({ data: form }, { onSuccess: () => { setShowForm(false); invalidate(); } });
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id }, { onSuccess: () => { setDeleteConfirm(null); invalidate(); } });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-secondary">Photo Gallery / फोटो गैलरी</h2>
          <p className="text-muted-foreground text-sm">{photos?.length ?? 0} photos</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Photo
        </button>
      </div>

      {isLoading && <div className="text-muted-foreground py-10 text-center">Loading...</div>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos?.map(photo => (
          <div key={photo.id} className="bg-card border rounded-xl overflow-hidden group">
            <div className="aspect-square relative">
              <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200"; }} />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => openEdit(photo)} className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteConfirm(photo.id)} className="p-2 bg-red-500/70 rounded-full text-white hover:bg-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-2">
              <p className="text-xs font-medium truncate">{photo.titleHindi}</p>
              <p className="text-xs text-muted-foreground truncate">{photo.category}</p>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <Modal onClose={() => setShowForm(false)} title={editing ? "Edit Photo" : "Add Photo"}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Title (English)" required>
                <input className={inputClass} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
              </Field>
              <Field label="Title (Hindi / हिंदी शीर्षक)" required>
                <input className={inputClass} value={form.titleHindi} onChange={e => setForm(p => ({ ...p, titleHindi: e.target.value }))} required />
              </Field>
              <Field label="Image URL" required>
                <input className={inputClass} value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} required placeholder="https://..." />
              </Field>
              <Field label="Category" required>
                <select className={inputClass} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  <option>Academic</option>
                  <option>Sports</option>
                  <option>Cultural</option>
                  <option>Events</option>
                </select>
              </Field>
              {form.imageUrl && <img src={form.imageUrl} alt="preview" className="w-full h-32 object-cover rounded-lg border" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
                  {editing ? "Update" : "Add Photo"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 border rounded-lg text-sm hover:bg-accent/40 transition-colors">Cancel</button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <DeleteConfirm open={deleteConfirm !== null} onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
}

// ==================== STAFF MANAGER ====================

type StaffMember = {
  id: number;
  name: string;
  nameHindi: string;
  role: string;
  roleHindi: string;
  photoUrl?: string | null;
  order: number;
  createdAt: string;
};

type StaffFormData = { name: string; nameHindi: string; role: string; roleHindi: string; photoUrl: string; order: number };

function StaffManager() {
  const qc = useQueryClient();
  const { data: staff, isLoading } = useListStaff();
  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();
  const deleteMutation = useDeleteStaff();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [form, setForm] = useState<StaffFormData>({ name: "", nameHindi: "", role: "", roleHindi: "", photoUrl: "", order: 10 });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const openAdd = () => { setEditing(null); setForm({ name: "", nameHindi: "", role: "", roleHindi: "", photoUrl: "", order: (staff?.length ?? 0) + 1 }); setShowForm(true); };
  const openEdit = (m: StaffMember) => { setEditing(m); setForm({ name: m.name, nameHindi: m.nameHindi, role: m.role, roleHindi: m.roleHindi, photoUrl: m.photoUrl ?? "", order: m.order }); setShowForm(true); };

  const invalidate = () => qc.invalidateQueries({ queryKey: getListStaffQueryKey() });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, photoUrl: form.photoUrl || null };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data }, { onSuccess: () => { setShowForm(false); invalidate(); } });
    } else {
      createMutation.mutate({ data }, { onSuccess: () => { setShowForm(false); invalidate(); } });
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id }, { onSuccess: () => { setDeleteConfirm(null); invalidate(); } });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-secondary">Staff Management / स्टाफ प्रबंधन</h2>
          <p className="text-muted-foreground text-sm">{staff?.length ?? 0} members</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {isLoading && <div className="text-muted-foreground py-10 text-center">Loading...</div>}

      <div className="space-y-3">
        {staff?.map(member => (
          <div key={member.id} className="bg-card border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 border">
              {member.photoUrl ? (
                <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <Users className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.nameHindi}</p>
              <span className="inline-block bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs mt-1">{member.role} / {member.roleHindi}</span>
            </div>
            <div className="text-xs text-muted-foreground bg-muted rounded px-2 py-1">#{member.order}</div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(member)} className="p-2 text-muted-foreground hover:text-primary hover:bg-accent/40 rounded-lg transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => setDeleteConfirm(member.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <Modal onClose={() => setShowForm(false)} title={editing ? "Edit Staff Member" : "Add Staff Member"}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Name (English)" required>
                <input className={inputClass} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </Field>
              <Field label="Name (Hindi / हिंदी नाम)" required>
                <input className={inputClass} value={form.nameHindi} onChange={e => setForm(p => ({ ...p, nameHindi: e.target.value }))} required />
              </Field>
              <Field label="Role (English)" required>
                <input className={inputClass} value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} required placeholder="e.g. Principal" />
              </Field>
              <Field label="Role (Hindi / हिंदी भूमिका)" required>
                <input className={inputClass} value={form.roleHindi} onChange={e => setForm(p => ({ ...p, roleHindi: e.target.value }))} required placeholder="e.g. प्राचार्य" />
              </Field>
              <Field label="Photo URL (optional)">
                <input className={inputClass} value={form.photoUrl} onChange={e => setForm(p => ({ ...p, photoUrl: e.target.value }))} placeholder="https://..." />
              </Field>
              <Field label="Display Order">
                <input type="number" className={inputClass} value={form.order} onChange={e => setForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} min={1} />
              </Field>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
                  {editing ? "Update" : "Add Member"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 border rounded-lg text-sm hover:bg-accent/40 transition-colors">Cancel</button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <DeleteConfirm open={deleteConfirm !== null} onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
}

// ==================== SHARED UI ====================

const inputClass = "w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-card border rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-serif text-lg font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function DeleteConfirm({ open, onConfirm, onCancel }: { open: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <Modal onClose={onCancel} title="Confirm Delete">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-foreground font-medium mb-1">Are you sure?</p>
            <p className="text-muted-foreground text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={onConfirm} className="flex-1 bg-destructive text-destructive-foreground py-2.5 rounded-lg text-sm font-semibold hover:bg-destructive/90 transition-colors">
                Delete
              </button>
              <button onClick={onCancel} className="flex-1 border py-2.5 rounded-lg text-sm hover:bg-accent/40 transition-colors">Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </AnimatePresence>
  );
}
