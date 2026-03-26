import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, Info } from 'lucide-react';

export default function ImageCarousel({
  images = [],
  showThumbs = true,
  showInfo = true,
  autoPlay = true,
  interval = 5000,
  onExpand,
  className = '',
}) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const timerRef = useRef(null);

  const go = useCallback((newIdx, direction = 1) => {
    setDir(direction);
    setIdx((newIdx + images.length) % images.length);
  }, [images.length]);

  const next = () => go(idx + 1, 1);
  const prev = () => go(idx - 1, -1);

  useEffect(() => {
    if (!autoPlay || paused || images.length < 2) return;
    timerRef.current = setInterval(next, interval);
    return () => clearInterval(timerRef.current);
  }, [idx, paused, autoPlay, interval]);

  if (!images.length) return null;

  const img = images[idx];

  const variants = {
    enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? '-30%' : '30%', opacity: 0, scale: 0.97 }),
  };

  return (
    <div className={`relative rounded-sm overflow-hidden bg-noir-900 ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Main image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <AnimatePresence custom={dir} mode="popLayout">
          <motion.div
            key={idx}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <img
              src={img.url || img.image_url || img.thumbnail_url}
              alt={img.title || img.alt || `Image ${idx + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Info overlay */}
        {showInfo && img.title && (
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute inset-0 bg-black/60 flex flex-col justify-end p-6"
              >
                <div className="section-label mb-1">{img.category || img.job_type}</div>
                <h3 className="font-display text-2xl text-white mb-1">{img.title}</h3>
                {img.description && <p className="text-white/60 text-sm leading-relaxed">{img.description}</p>}
                {img.location && (
                  <div className="flex items-center gap-1 mt-2 text-gold text-xs">
                    📍 {img.location}
                  </div>
                )}
                {img.date && (
                  <div className="text-white/40 text-xs mt-1">{new Date(img.date).toLocaleDateString('en-GB', { year:'numeric', month:'long', day:'numeric' })}</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
          <div>
            {img.title && !showDetails && (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="section-label text-[9px]">{img.category}</div>
                <div className="text-white font-display text-lg">{img.title}</div>
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showInfo && (
              <button
                onClick={() => setShowDetails((d) => !d)}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                  showDetails ? 'border-gold bg-gold text-black' : 'border-white/20 text-white/60 hover:border-white/40'
                }`}
              >
                <Info size={12} />
              </button>
            )}
            {onExpand && (
              <button
                onClick={() => onExpand(idx)}
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-white/40 hover:text-white transition-colors"
              >
                <Expand size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-white/60 hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
              style={{ opacity: paused ? 1 : undefined }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-white/60 hover:bg-white/10 transition-all"
              style={{ opacity: paused ? 1 : undefined }}
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Progress bar */}
      {autoPlay && images.length > 1 && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10">
          <motion.div
            key={idx}
            className="h-full bg-gold"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: interval / 1000, ease: 'linear' }}
          />
        </div>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 py-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > idx ? 1 : -1)}
              className={`carousel-dot ${i === idx ? 'active' : ''}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail strip */}
      {showThumbs && images.length > 1 && (
        <div className="flex gap-1.5 px-3 pb-3 overflow-x-auto scrollbar-none">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => go(i, i > idx ? 1 : -1)}
              className={`flex-shrink-0 w-14 h-10 rounded-sm overflow-hidden border-2 transition-all ${
                i === idx ? 'border-gold' : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img
                src={img.thumbnail_url || img.url}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
