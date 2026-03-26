import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Tag, Download, Share2 } from 'lucide-react';

export default function Lightbox({ images, startIndex = 0, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const [dir, setDir] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const go = useCallback((n) => {
    setDir(n > idx ? 1 : -1);
    setLoaded(false);
    setIdx((n + images.length) % images.length);
  }, [idx, images.length]);

  const next = useCallback(() => go(idx + 1), [go, idx]);
  const prev = useCallback(() => go(idx - 1), [go, idx]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') onClose();
      if (e.key === 'i') setShowInfo((s) => !s);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [next, prev, onClose]);

  const img = images[idx];

  const variants = {
    enter: (d) => ({ x: d > 0 ? 80 : -80, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d) => ({ x: d > 0 ? -40 : 40, opacity: 0, scale: 0.98 }),
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="lightbox-overlay"
        onClick={onClose}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Counter */}
        <div className="absolute top-5 left-5 z-20 text-[11px] tracking-widest text-white/40">
          {idx + 1} / {images.length}
        </div>

        {/* Keyboard hints */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] tracking-widest text-white/20 hidden lg:block">
          ← → navigate · I toggle info · ESC close
        </div>

        {/* Main image area */}
        <div className="relative flex items-center justify-center w-full h-full px-16"
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence custom={dir} mode="popLayout">
            <motion.div
              key={idx}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="relative max-w-5xl max-h-[82vh] w-full flex items-center justify-center"
            >
              <img
                src={img.image_url || img.url}
                alt={img.title}
                onLoad={() => setLoaded(true)}
                className={`max-h-[82vh] max-w-full object-contain rounded-sm shadow-2xl transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              />
              {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all z-10"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all z-10"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Info panel */}
        <AnimatePresence>
          {showInfo && (img.title || img.description || img.location) && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-8 py-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-3xl mx-auto">
                {img.category && <div className="section-label mb-1">{img.category}</div>}
                {img.title && <h3 className="font-display text-2xl text-white mb-2">{img.title}</h3>}
                {img.description && <p className="text-white/60 text-sm leading-relaxed mb-3 max-w-xl">{img.description}</p>}
                <div className="flex flex-wrap gap-4 text-xs text-white/40">
                  {img.location && <span className="flex items-center gap-1"><MapPin size={10} className="text-gold" />{img.location}</span>}
                  {img.date && <span className="flex items-center gap-1"><Calendar size={10} className="text-gold" />{new Date(img.date).toLocaleDateString('en-GB')}</span>}
                  {img.tags?.map((t) => <span key={t} className="flex items-center gap-1"><Tag size={10} />{t}</span>)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Thumbnail strip */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center pb-2"
          onClick={(e) => e.stopPropagation()}
          style={{ display: images.length > 1 ? 'flex' : 'none' }}
        >
          {/* Hidden on mobile to preserve space */}
        </div>

        {/* Actions */}
        <div className="absolute top-5 right-16 z-20 flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setShowInfo((s) => !s); }}
            className={`text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full border transition-all ${
              showInfo ? 'border-gold text-gold bg-gold/10' : 'border-white/20 text-white/40 hover:border-white/40'
            }`}
          >
            Info
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
