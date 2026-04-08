import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Plus, Pencil, Trash2, X, BookOpen, Image, Users, Settings, AlertCircle, ArrowLeft, FolderOpen, UserCircle2, Check } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";

type Tab = "blog" | "gallery" | "staff" | "settings";

interface Session { isAdmin: boolean; username: string; }

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("blog");
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.isAdmin) setSession(data);
        else window.location.href = "/admin";
      })
      .catch(() => { window.location.href = "/admin"; })
      .finally(() => setSessionLoading(false));
  }, []);

  if (sessionLoading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }
  if (!session?.isAdmin) return null;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/admin";
  };

  const tabs = [
    { id: "blog" as Tab, label: "Blog", icon: BookOpen },
    { id: "gallery" as Tab, label: "Gallery Albums", icon: Image },
    { id: "staff" as Tab, label: "Staff", icon: Users },
    { id: "settings" as Tab, label: "Site Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary text-white px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div>
          <h1 className="font-serif font-bold text-lg">Admin Dashboard</h1>
          <p className="text-white/60 text-xs">MNI Higher Secondary School — {session.username}</p>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="text-white/60 hover:text-white text-xs transition-colors">← View Site</a>
          <button onClick={handleLogout} className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
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
            </button>
          ))}
        </div>

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
            {activeTab === "settings" && <SettingsManager />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==================== BLOG MANAGER ====================

type BlogPost = { id: number; title: string; titleHindi: string; content: string; contentHindi: string; author: string; imageUrl?: string | null; createdAt: string; };
type BlogForm = { title: string; titleHindi: string; content: string; contentHindi: string; author: string; imageUrl: string; };

function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<BlogForm>({ title: "", titleHindi: "", content: "", contentHindi: "", author: "", imageUrl: "" });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = useCallback(() => {
    fetch("/api/blog").then(r => r.json()).then(setPosts).catch(() => {}).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm({ title: "", titleHindi: "", content: "", contentHindi: "", author: "", imageUrl: "" }); setShowForm(true); };
  const openEdit = (p: BlogPost) => { setEditing(p); setForm({ title: p.title, titleHindi: p.titleHindi, content: p.content, contentHindi: p.contentHindi, author: p.author, imageUrl: p.imageUrl ?? "" }); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const body = { ...form, imageUrl: form.imageUrl || null };
    const url = editing ? `/api/blog/${editing.id}` : "/api/blog";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(body) });
    setSaving(false); setShowForm(false); load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/blog/${deleteId}`, { method: "DELETE", credentials: "include" });
    setDeleteId(null); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="font-serif text-2xl font-bold text-secondary">Blog Posts</h2><p className="text-muted-foreground text-sm">{posts.length} posts</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90"><Plus className="w-4 h-4" /> Add Post</button>
      </div>
      {loading && <Spinner />}
      <div className="space-y-3">
        {posts.map(post => (
          <div key={post.id} className="bg-card border rounded-xl p-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {post.imageUrl && <img src={post.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">{post.title}</p>
                <p className="text-sm text-muted-foreground truncate">{post.titleHindi}</p>
                <p className="text-xs text-muted-foreground mt-1">By {post.author} · {new Date(post.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <IconBtn icon={Pencil} onClick={() => openEdit(post)} />
              <IconBtn icon={Trash2} onClick={() => setDeleteId(post.id)} variant="danger" />
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {showForm && (
          <Modal onClose={() => setShowForm(false)} title={editing ? "Edit Blog Post" : "Add Blog Post"}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Title (Hindi)" required><input className={iC} value={form.titleHindi} onChange={e => setForm(p => ({ ...p, titleHindi: e.target.value }))} required /></Field>
              <Field label="Title (English)" required><input className={iC} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required /></Field>
              <Field label="Content (Hindi)" required><textarea className={iC + " resize-none"} rows={4} value={form.contentHindi} onChange={e => setForm(p => ({ ...p, contentHindi: e.target.value }))} required /></Field>
              <Field label="Content (English)" required><textarea className={iC + " resize-none"} rows={4} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required /></Field>
              <Field label="Author" required><input className={iC} value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} required /></Field>
              <Field label="Cover Image (optional)">
                <ImageUpload value={form.imageUrl || null} onChange={url => setForm(p => ({ ...p, imageUrl: url }))} label="Upload cover image" />
              </Field>
              <FormActions onCancel={() => setShowForm(false)} saving={saving} editMode={!!editing} />
            </form>
          </Modal>
        )}
      </AnimatePresence>
      <DeleteConfirm open={deleteId !== null} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}

// ==================== GALLERY MANAGER ====================

type Album = { id: number; name: string; nameHindi: string; description?: string | null; coverImageUrl?: string | null; eventDate?: string | null; };
type Photo = { id: number; title: string; titleHindi: string; imageUrl: string; category: string; albumId?: number | null; };
type AlbumForm = { name: string; nameHindi: string; description: string; coverImageUrl: string; eventDate: string; };
type PhotoForm = { title: string; titleHindi: string; imageUrl: string; category: string; albumId: number | null; };

function GalleryManager() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAlbum, setOpenAlbum] = useState<Album | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<Photo[]>([]);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [albumForm, setAlbumForm] = useState<AlbumForm>({ name: "", nameHindi: "", description: "", coverImageUrl: "", eventDate: "" });
  const [photoForm, setPhotoForm] = useState<PhotoForm>({ title: "", titleHindi: "", imageUrl: "", category: "Events", albumId: null });
  const [saving, setSaving] = useState(false);
  const [deleteAlbumId, setDeleteAlbumId] = useState<number | null>(null);
  const [deletePhotoId, setDeletePhotoId] = useState<number | null>(null);

  const loadAlbums = useCallback(() => {
    fetch("/api/gallery/albums").then(r => r.json()).then(setAlbums).catch(() => {}).finally(() => setLoading(false));
  }, []);
  useEffect(() => { loadAlbums(); }, [loadAlbums]);

  const loadAlbumPhotos = useCallback((albumId: number) => {
    fetch(`/api/gallery/albums/${albumId}/photos`).then(r => r.json()).then(setAlbumPhotos).catch(() => setAlbumPhotos([]));
  }, []);

  const openAlbumDetail = (album: Album) => {
    setOpenAlbum(album);
    loadAlbumPhotos(album.id);
  };

  const openAddAlbum = () => { setEditingAlbum(null); setAlbumForm({ name: "", nameHindi: "", description: "", coverImageUrl: "", eventDate: "" }); setShowAlbumForm(true); };
  const openEditAlbum = (a: Album) => { setEditingAlbum(a); setAlbumForm({ name: a.name, nameHindi: a.nameHindi, description: a.description ?? "", coverImageUrl: a.coverImageUrl ?? "", eventDate: a.eventDate ?? "" }); setShowAlbumForm(true); };
  const openAddPhoto = () => { setEditingPhoto(null); setPhotoForm({ title: "", titleHindi: "", imageUrl: "", category: "Events", albumId: openAlbum?.id ?? null }); setShowPhotoForm(true); };
  const openEditPhoto = (p: Photo) => { setEditingPhoto(p); setPhotoForm({ title: p.title, titleHindi: p.titleHindi, imageUrl: p.imageUrl, category: p.category, albumId: p.albumId ?? null }); setShowPhotoForm(true); };

  const submitAlbum = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const body = { name: albumForm.name, nameHindi: albumForm.nameHindi, description: albumForm.description || null, coverImageUrl: albumForm.coverImageUrl || null, eventDate: albumForm.eventDate || null };
    const url = editingAlbum ? `/api/gallery/albums/${editingAlbum.id}` : "/api/gallery/albums";
    await fetch(url, { method: editingAlbum ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(body) });
    setSaving(false); setShowAlbumForm(false); loadAlbums();
    if (openAlbum && editingAlbum?.id === openAlbum.id) {
      const updated = await fetch(`/api/gallery/albums`).then(r => r.json());
      const a = updated.find((x: Album) => x.id === openAlbum.id);
      if (a) setOpenAlbum(a);
    }
  };

  const submitPhoto = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const url = editingPhoto ? `/api/gallery/${editingPhoto.id}` : "/api/gallery";
    await fetch(url, { method: editingPhoto ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(photoForm) });
    setSaving(false); setShowPhotoForm(false);
    if (openAlbum) loadAlbumPhotos(openAlbum.id);
  };

  const deleteAlbum = async () => {
    if (!deleteAlbumId) return;
    await fetch(`/api/gallery/albums/${deleteAlbumId}`, { method: "DELETE", credentials: "include" });
    setDeleteAlbumId(null);
    if (openAlbum?.id === deleteAlbumId) { setOpenAlbum(null); setAlbumPhotos([]); }
    loadAlbums();
  };

  const deletePhoto = async () => {
    if (!deletePhotoId) return;
    await fetch(`/api/gallery/${deletePhotoId}`, { method: "DELETE", credentials: "include" });
    setDeletePhotoId(null);
    if (openAlbum) loadAlbumPhotos(openAlbum.id);
  };

  return (
    <div>
      {!openAlbum ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <div><h2 className="font-serif text-2xl font-bold text-secondary">Gallery Albums</h2><p className="text-muted-foreground text-sm">{albums.length} albums</p></div>
            <button onClick={openAddAlbum} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90"><Plus className="w-4 h-4" /> New Album</button>
          </div>
          {loading && <Spinner />}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {albums.map(album => (
              <div key={album.id} className="bg-card border rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                <div className="relative cursor-pointer" style={{ aspectRatio: "16/9" }} onClick={() => openAlbumDetail(album)}>
                  <img
                    src={album.coverImageUrl || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400"}
                    alt={album.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-3 text-white text-xs flex items-center gap-1"><FolderOpen className="w-3 h-3" /> Click to manage photos</div>
                </div>
                <div className="p-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-serif font-bold text-foreground truncate text-sm">{album.nameHindi}</p>
                    <p className="text-xs text-muted-foreground truncate">{album.name}</p>
                    {album.eventDate && <p className="text-xs text-muted-foreground mt-0.5">{album.eventDate}</p>}
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <IconBtn icon={Pencil} onClick={() => openEditAlbum(album)} small />
                    <IconBtn icon={Trash2} onClick={() => setDeleteAlbumId(album.id)} variant="danger" small />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => { setOpenAlbum(null); setAlbumPhotos([]); }} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border rounded-lg px-3 py-1.5 bg-card transition-colors">
                <ArrowLeft className="w-4 h-4" /> Albums
              </button>
              <div>
                <h2 className="font-serif text-xl font-bold text-secondary">{openAlbum.nameHindi}</h2>
                <p className="text-sm text-muted-foreground">{openAlbum.name} — {albumPhotos.length} photos</p>
              </div>
            </div>
            <button onClick={openAddPhoto} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90"><Plus className="w-4 h-4" /> Add Photo</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {albumPhotos.map(photo => (
              <div key={photo.id} className="bg-card border rounded-xl overflow-hidden group">
                <div className="aspect-square relative">
                  <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200"; }} />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <IconBtn icon={Pencil} onClick={() => openEditPhoto(photo)} glass />
                    <IconBtn icon={Trash2} onClick={() => setDeletePhotoId(photo.id)} variant="danger" glass />
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium truncate">{photo.titleHindi}</p>
                </div>
              </div>
            ))}
            {albumPhotos.length === 0 && (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                <Image className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No photos yet. Click "Add Photo" to add.</p>
              </div>
            )}
          </div>
        </>
      )}

      <AnimatePresence>
        {showAlbumForm && (
          <Modal onClose={() => setShowAlbumForm(false)} title={editingAlbum ? "Edit Album" : "New Album"}>
            <form onSubmit={submitAlbum} className="space-y-4">
              <Field label="Event Name (Hindi)" required><input className={iC} value={albumForm.nameHindi} onChange={e => setAlbumForm(p => ({ ...p, nameHindi: e.target.value }))} required placeholder="e.g. वार्षिक खेल दिवस" /></Field>
              <Field label="Event Name (English)" required><input className={iC} value={albumForm.name} onChange={e => setAlbumForm(p => ({ ...p, name: e.target.value }))} required placeholder="e.g. Annual Sports Day" /></Field>
              <Field label="Event Date (optional)"><input className={iC} value={albumForm.eventDate} onChange={e => setAlbumForm(p => ({ ...p, eventDate: e.target.value }))} placeholder="e.g. March 15, 2024" /></Field>
              <Field label="Description (optional)"><textarea className={iC + " resize-none"} rows={2} value={albumForm.description} onChange={e => setAlbumForm(p => ({ ...p, description: e.target.value }))} /></Field>
              <Field label="Cover Photo">
                <ImageUpload value={albumForm.coverImageUrl || null} onChange={url => setAlbumForm(p => ({ ...p, coverImageUrl: url }))} label="Upload album cover photo" />
              </Field>
              <FormActions onCancel={() => setShowAlbumForm(false)} saving={saving} editMode={!!editingAlbum} />
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPhotoForm && (
          <Modal onClose={() => setShowPhotoForm(false)} title={editingPhoto ? "Edit Photo" : "Add Photo to Album"}>
            <form onSubmit={submitPhoto} className="space-y-4">
              <Field label="Photo Caption (Hindi)" required><input className={iC} value={photoForm.titleHindi} onChange={e => setPhotoForm(p => ({ ...p, titleHindi: e.target.value }))} required placeholder="हिंदी में शीर्षक" /></Field>
              <Field label="Photo Caption (English)" required><input className={iC} value={photoForm.title} onChange={e => setPhotoForm(p => ({ ...p, title: e.target.value }))} required /></Field>
              <Field label="Category" required>
                <select className={iC} value={photoForm.category} onChange={e => setPhotoForm(p => ({ ...p, category: e.target.value }))}>
                  {["Academic", "Sports", "Cultural", "Events"].map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Photo" required>
                <ImageUpload value={photoForm.imageUrl || null} onChange={url => setPhotoForm(p => ({ ...p, imageUrl: url }))} label="Upload photo" />
              </Field>
              <FormActions onCancel={() => setShowPhotoForm(false)} saving={saving} editMode={!!editingPhoto} />
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <DeleteConfirm open={deleteAlbumId !== null} onConfirm={deleteAlbum} onCancel={() => setDeleteAlbumId(null)} message="This will delete the album and all its photos." />
      <DeleteConfirm open={deletePhotoId !== null} onConfirm={deletePhoto} onCancel={() => setDeletePhotoId(null)} />
    </div>
  );
}

// ==================== STAFF MANAGER ====================

type StaffMember = { id: number; name: string; nameHindi: string; role: string; roleHindi: string; photoUrl?: string | null; order: number; bio?: string | null; bioHindi?: string | null; bioEnabled: boolean; };
type StaffForm = { name: string; nameHindi: string; role: string; roleHindi: string; photoUrl: string; order: number; bio: string; bioHindi: string; bioEnabled: boolean; };

function StaffManager() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [form, setForm] = useState<StaffForm>({ name: "", nameHindi: "", role: "", roleHindi: "", photoUrl: "", order: 10, bio: "", bioHindi: "", bioEnabled: false });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = useCallback(() => {
    fetch("/api/staff").then(r => r.json()).then(setStaff).catch(() => {}).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm({ name: "", nameHindi: "", role: "", roleHindi: "", photoUrl: "", order: staff.length + 1, bio: "", bioHindi: "", bioEnabled: false }); setShowForm(true); };
  const openEdit = (m: StaffMember) => { setEditing(m); setForm({ name: m.name, nameHindi: m.nameHindi, role: m.role, roleHindi: m.roleHindi, photoUrl: m.photoUrl ?? "", order: m.order, bio: m.bio ?? "", bioHindi: m.bioHindi ?? "", bioEnabled: m.bioEnabled }); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const body = { ...form, photoUrl: form.photoUrl || null, bio: form.bio || null, bioHindi: form.bioHindi || null };
    const url = editing ? `/api/staff/${editing.id}` : "/api/staff";
    await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(body) });
    setSaving(false); setShowForm(false); load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/staff/${deleteId}`, { method: "DELETE", credentials: "include" });
    setDeleteId(null); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="font-serif text-2xl font-bold text-secondary">Staff Management</h2><p className="text-muted-foreground text-sm">{staff.length} members</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90"><Plus className="w-4 h-4" /> Add Member</button>
      </div>
      {loading && <Spinner />}
      <div className="space-y-3">
        {staff.map(member => (
          <div key={member.id} className="bg-card border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 border">
              {member.photoUrl ? <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} /> : <UserCircle2 className="w-6 h-6 text-muted-foreground/40" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.nameHindi}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="inline-block bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">{member.role}</span>
                {member.bioEnabled && <span className="inline-block bg-secondary/10 text-secondary rounded-full px-2 py-0.5 text-xs flex items-center gap-1"><Check className="w-2.5 h-2.5" /> Bio enabled</span>}
              </div>
            </div>
            <div className="text-xs text-muted-foreground bg-muted rounded px-2 py-1">#{member.order}</div>
            <div className="flex gap-2">
              <IconBtn icon={Pencil} onClick={() => openEdit(member)} />
              <IconBtn icon={Trash2} onClick={() => setDeleteId(member.id)} variant="danger" />
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {showForm && (
          <Modal onClose={() => setShowForm(false)} title={editing ? "Edit Staff Member" : "Add Staff Member"}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Name (Hindi)" required><input className={iC} value={form.nameHindi} onChange={e => setForm(p => ({ ...p, nameHindi: e.target.value }))} required /></Field>
                <Field label="Name (English)" required><input className={iC} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Designation (Hindi)" required><input className={iC} value={form.roleHindi} onChange={e => setForm(p => ({ ...p, roleHindi: e.target.value }))} required placeholder="e.g. प्राचार्य" /></Field>
                <Field label="Designation (English)" required><input className={iC} value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} required placeholder="e.g. Principal" /></Field>
              </div>
              <Field label="Display Order"><input type="number" className={iC} value={form.order} onChange={e => setForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} /></Field>
              <Field label="Profile Photo">
                <ImageUpload value={form.photoUrl || null} onChange={url => setForm(p => ({ ...p, photoUrl: url }))} label="Upload profile photo" />
              </Field>
              <div className="border rounded-xl p-4 bg-accent/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Enable Bio / परिचय</p>
                    <p className="text-xs text-muted-foreground">Show an "About" button on their profile</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, bioEnabled: !p.bioEnabled }))}
                    className={`w-12 h-6 rounded-full transition-colors relative ${form.bioEnabled ? "bg-primary" : "bg-muted-foreground/30"}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.bioEnabled ? "translate-x-6" : "translate-x-0.5"}`} />
                  </button>
                </div>
                {form.bioEnabled && (
                  <>
                    <Field label="Bio (Hindi)"><textarea className={iC + " resize-none"} rows={3} value={form.bioHindi} onChange={e => setForm(p => ({ ...p, bioHindi: e.target.value }))} placeholder="हिंदी में परिचय..." /></Field>
                    <Field label="Bio (English)"><textarea className={iC + " resize-none"} rows={3} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="About this person in English..." /></Field>
                  </>
                )}
              </div>
              <FormActions onCancel={() => setShowForm(false)} saving={saving} editMode={!!editing} />
            </form>
          </Modal>
        )}
      </AnimatePresence>
      <DeleteConfirm open={deleteId !== null} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}

// ==================== SETTINGS MANAGER ====================

type SiteSettings = Record<string, string>;

function SettingsManager() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [section, setSection] = useState<"home" | "about" | "contact">("home");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(setSettings).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async (updates: Partial<SiteSettings>) => {
    setSaving(true);
    const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(updates) });
    const updated = await res.json();
    setSettings(updated);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const set = (key: string, value: string) => setSettings(p => ({ ...p, [key]: value }));

  if (loading) return <Spinner />;

  const sections = [
    { id: "home" as const, label: "Home Page" },
    { id: "about" as const, label: "About Us & Founder" },
    { id: "contact" as const, label: "Contact Info" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="font-serif text-2xl font-bold text-secondary">Site Settings</h2><p className="text-muted-foreground text-sm">Manage content displayed across the website</p></div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-xs text-green-600 flex items-center gap-1"><Check className="w-3 h-3" /> Saved!</span>}
          <button onClick={() => save(settings)} disabled={saving} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60">
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {sections.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${section === s.id ? "bg-secondary text-white" : "bg-card border hover:bg-accent/40"}`}>
            {s.label}
          </button>
        ))}
      </div>

      {section === "home" && (
        <div className="space-y-5 bg-card border rounded-xl p-6">
          <h3 className="font-serif font-bold text-lg text-secondary border-b pb-3">Home Page Content</h3>
          <Field label="School Name (Hindi)"><input className={iC} value={settings.home_title_hindi ?? ""} onChange={e => set("home_title_hindi", e.target.value)} /></Field>
          <Field label="School Name (English)"><input className={iC} value={settings.home_title ?? ""} onChange={e => set("home_title", e.target.value)} /></Field>
          <Field label="Hindi Tagline (shown in hero)"><textarea className={iC + " resize-none"} rows={2} value={settings.home_tagline ?? ""} onChange={e => set("home_tagline", e.target.value)} /></Field>
          <Field label="English Subtitle"><textarea className={iC + " resize-none"} rows={2} value={settings.home_tagline_english ?? ""} onChange={e => set("home_tagline_english", e.target.value)} /></Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Students Count"><input className={iC} value={settings.home_stats_students ?? ""} onChange={e => set("home_stats_students", e.target.value)} placeholder="1200+" /></Field>
            <Field label="Teachers Count"><input className={iC} value={settings.home_stats_teachers ?? ""} onChange={e => set("home_stats_teachers", e.target.value)} placeholder="60+" /></Field>
            <Field label="Years of Excellence"><input className={iC} value={settings.home_stats_years ?? ""} onChange={e => set("home_stats_years", e.target.value)} placeholder="25+" /></Field>
          </div>
        </div>
      )}

      {section === "about" && (
        <div className="space-y-5 bg-card border rounded-xl p-6">
          <h3 className="font-serif font-bold text-lg text-secondary border-b pb-3">About Us & Founder Section</h3>
          <Field label="Mission Statement (English)"><textarea className={iC + " resize-none"} rows={3} value={settings.about_mission ?? ""} onChange={e => set("about_mission", e.target.value)} /></Field>
          <Field label="Mission Statement (Hindi)"><textarea className={iC + " resize-none"} rows={3} value={settings.about_mission_hindi ?? ""} onChange={e => set("about_mission_hindi", e.target.value)} /></Field>
          <Field label="Vision Statement (English)"><textarea className={iC + " resize-none"} rows={2} value={settings.about_vision ?? ""} onChange={e => set("about_vision", e.target.value)} /></Field>
          <Field label="Vision Statement (Hindi)"><textarea className={iC + " resize-none"} rows={2} value={settings.about_vision_hindi ?? ""} onChange={e => set("about_vision_hindi", e.target.value)} /></Field>
          <div className="border-t pt-5">
            <h4 className="font-semibold mb-4 text-secondary">Founder Information / संस्थापक परिचय</h4>
            <Field label="Founder's Name">
              <input className={iC} value={settings.founder_name ?? ""} onChange={e => set("founder_name", e.target.value)} placeholder="e.g. Late Mr. Zaheer Ahmad Hashmi" />
            </Field>
            <div className="mt-4">
              <Field label="Founder's Photo">
                <ImageUpload value={settings.founder_photo || null} onChange={url => set("founder_photo", url)} label="Upload founder's photo" />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Founder's Bio (shown on About page — use blank lines to separate paragraphs)">
                <textarea className={iC + " resize-none"} rows={10} value={settings.founder_bio ?? ""} onChange={e => set("founder_bio", e.target.value)} placeholder="About the founder..." />
              </Field>
            </div>
          </div>
        </div>
      )}

      {section === "contact" && (
        <div className="space-y-5 bg-card border rounded-xl p-6">
          <h3 className="font-serif font-bold text-lg text-secondary border-b pb-3">Contact Information</h3>
          <Field label="Address (English)"><textarea className={iC + " resize-none"} rows={2} value={settings.contact_address ?? ""} onChange={e => set("contact_address", e.target.value)} /></Field>
          <Field label="Address (Hindi)"><textarea className={iC + " resize-none"} rows={2} value={settings.contact_address_hindi ?? ""} onChange={e => set("contact_address_hindi", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone Number 1"><input className={iC} value={settings.contact_phone ?? ""} onChange={e => set("contact_phone", e.target.value)} placeholder="+91 XXXXX XXXXX" /></Field>
            <Field label="Phone Number 2 (optional)"><input className={iC} value={settings.contact_phone2 ?? ""} onChange={e => set("contact_phone2", e.target.value)} placeholder="+91 XXXXX XXXXX" /></Field>
          </div>
          <Field label="Email Address"><input type="email" className={iC} value={settings.contact_email ?? ""} onChange={e => set("contact_email", e.target.value)} /></Field>
          <Field label="Office Hours"><textarea className={iC + " resize-none"} rows={3} value={settings.contact_hours ?? ""} onChange={e => set("contact_hours", e.target.value)} placeholder="Monday – Saturday: 8:00 AM – 4:00 PM" /></Field>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button onClick={() => save(settings)} disabled={saving} className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ==================== SHARED UI ====================

const iC = "w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

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

function IconBtn({ icon: Icon, onClick, variant = "default", small = false, glass = false }: { icon: React.ElementType; onClick: () => void; variant?: "default" | "danger"; small?: boolean; glass?: boolean }) {
  const base = glass
    ? `p-${small ? "1.5" : "2"} rounded-full transition-colors ${variant === "danger" ? "bg-red-500/70 text-white hover:bg-red-500" : "bg-white/20 text-white hover:bg-white/30"}`
    : `p-${small ? "1.5" : "2"} rounded-lg transition-colors ${variant === "danger" ? "text-muted-foreground hover:text-destructive hover:bg-destructive/10" : "text-muted-foreground hover:text-primary hover:bg-accent/40"}`;
  return <button onClick={onClick} className={base}><Icon className={small ? "w-3 h-3" : "w-4 h-4"} /></button>;
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-card z-10">
          <h3 className="font-serif font-bold text-lg text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/40 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function FormActions({ onCancel, saving, editMode }: { onCancel: () => void; saving: boolean; editMode: boolean }) {
  return (
    <div className="flex gap-3 pt-2">
      <button type="submit" disabled={saving} className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
        {saving ? "Saving..." : editMode ? "Update" : "Create"}
      </button>
      <button type="button" onClick={onCancel} className="px-4 py-2.5 border rounded-lg text-sm hover:bg-accent/40 transition-colors">Cancel</button>
    </div>
  );
}

function DeleteConfirm({ open, onConfirm, onCancel, message = "This action cannot be undone." }: { open: boolean; onConfirm: () => void; onCancel: () => void; message?: string }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onCancel}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-card rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-4" />
            <h3 className="font-bold text-center mb-2 text-foreground">Confirm Delete</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">{message}</p>
            <div className="flex gap-3">
              <button onClick={onConfirm} className="flex-1 bg-destructive text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-destructive/90 transition-colors">Delete</button>
              <button onClick={onCancel} className="flex-1 border rounded-lg text-sm hover:bg-accent/40 transition-colors py-2.5">Cancel</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Spinner() {
  return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
}
