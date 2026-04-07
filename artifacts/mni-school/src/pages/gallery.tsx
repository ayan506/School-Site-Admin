import { useState } from "react";
import { useListGalleryPhotos } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImageOff } from "lucide-react";

const categories = ["All", "Academic", "Sports", "Cultural", "Events"];

export default function Gallery() {
  const { data: photos, isLoading } = useListGalleryPhotos();
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState<{ imageUrl: string; title: string; titleHindi: string } | null>(null);

  const filtered = activeCategory === "All"
    ? photos
    : photos?.filter(p => p.category === activeCategory);

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-secondary to-secondary/80 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">Photo Gallery</h1>
            <p className="text-2xl text-primary/90 font-serif">फोटो गैलरी</p>
            <p className="text-white/70 mt-4">Memories from our school life</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-md"
                    : "bg-card border text-foreground hover:bg-accent/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {!isLoading && (!filtered || filtered.length === 0) && (
            <div className="text-center py-20 text-muted-foreground">
              <ImageOff className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>No photos in this category yet.</p>
            </div>
          )}

          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {filtered?.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="group cursor-pointer overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => setLightbox(photo)}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white text-sm font-semibold line-clamp-1">{photo.titleHindi}</p>
                        <p className="text-white/80 text-xs">{photo.title}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-card">
                    <p className="text-xs font-medium text-foreground line-clamp-1">{photo.titleHindi}</p>
                    <span className="inline-block mt-1 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                      {photo.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors"
              onClick={() => setLightbox(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-3xl max-h-[85vh] w-full"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={lightbox.imageUrl}
                alt={lightbox.title}
                className="w-full max-h-[70vh] object-contain rounded-xl"
              />
              <div className="mt-4 text-center text-white">
                <p className="font-bold text-lg">{lightbox.titleHindi}</p>
                <p className="text-white/70 text-sm">{lightbox.title}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
