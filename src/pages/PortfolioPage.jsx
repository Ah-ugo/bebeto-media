/** @format */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid,
  Layers,
  ChevronRight,
  MapPin,
  Calendar,
  Camera,
  Loader2,
} from 'lucide-react';
import Lightbox from '../components/ui/Lightbox';
import ImageCarousel from '../components/ui/ImageCarousel';
import { portfolioAPI } from '../utils/api';

const TYPES = [
  'All',
  'weddings',
  'portraits',
  'events',
  'commercial',
  'family',
];

export default function PortfolioPage() {
  const [jobs, setJobs] = useState([]);
  const [activeType, setActiveType] = useState('All');
  const [viewMode, setViewMode] = useState('jobs'); // 'jobs' | 'grid'
  const [selectedJob, setSelectedJob] = useState(null);
  const [lightbox, setLightbox] = useState(null); // { images, startIndex }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    portfolioAPI
      .getAll()
      .then((r) => {
        const mapped = r.data.items.map((p) => ({
          id: p.id,
          title: p.title,
          type: p.category,
          date: p.created_at,
          description: p.description,
          location: 'Sunderland, UK', // Default location as not in DB schema yet
          cover: p.cover_image_url || p.images?.[0]?.image_url,
          images: p.images.map((img) => ({
            url: img.image_url,
            thumbnail_url: img.thumbnail_url,
            title: p.title,
            category: p.category,
            description: p.description,
          })),
        }));
        setJobs(mapped);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeType === 'All' ? jobs : jobs.filter((j) => j.type === activeType);

  const openLightbox = (images, startIndex = 0) =>
    setLightbox({ images, startIndex });
  const closeLightbox = () => setLightbox(null);

  const allImages = jobs.flatMap((j) => j.images);

  return (
    <div className='min-h-screen pt-24'>
      {/* Hero banner */}
      <div className='relative h-56 lg:h-72 overflow-hidden'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `url(${jobs[0]?.cover || 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&q=80'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3)',
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg)]' />
        <div className='relative z-10 h-full flex flex-col justify-end pb-10 px-6 lg:px-20 max-w-7xl mx-auto'>
          <div className='section-label mb-2'>Our Work</div>
          <h1 className='font-display text-5xl lg:text-7xl text-fg'>
            Portfolio
          </h1>
          <div className='flex items-center gap-2 mt-3 text-fg-3 text-sm'>
            <MapPin size={12} className='text-gold' /> Sunderland & across the
            North East of England
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 lg:px-20 py-12'>
        {/* Controls */}
        <div className='flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-10'>
          {/* Type filters */}
          <div className='flex flex-wrap gap-2'>
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActiveType(t);
                  setSelectedJob(null);
                }}
                className={`px-4 py-1.5 text-[10px] tracking-widest uppercase rounded-sm border transition-all ${
                  activeType === t
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-[var(--border)] text-fg-3 hover:border-[var(--border-strong)] hover:text-fg'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className='flex gap-1 border border-[var(--border)] rounded-sm p-1'>
            <button
              onClick={() => {
                setViewMode('jobs');
                setSelectedJob(null);
              }}
              className={`p-1.5 rounded-sm transition-colors ${viewMode === 'jobs' ? 'bg-gold/15 text-gold' : 'text-fg-3 hover:text-fg'}`}
            >
              <Layers size={14} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-gold/15 text-gold' : 'text-fg-3 hover:text-fg'}`}
            >
              <Grid size={14} />
            </button>
          </div>
        </div>

        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '60px',
            }}
          >
            <Loader2 size={32} className='animate-spin text-gold' />
          </div>
        ) : (
          <>
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='py-32 text-center border border-dashed border-[var(--border)] rounded-sm'
              >
                <Camera
                  size={48}
                  className='mx-auto text-fg-4 mb-4 opacity-20'
                />
                <h3 className='font-display text-2xl text-fg mb-2'>
                  No projects found
                </h3>
                <p className='text-fg-3 text-sm'>
                  Try selecting a different category or check back later.
                </p>
              </motion.div>
            )}

            {/* Job detail modal */}
            <AnimatePresence>
              {selectedJob && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/70 backdrop-blur-sm p-0 lg:p-8'
                  onClick={() => setSelectedJob(null)}
                >
                  <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 60, opacity: 0 }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    className='w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--bg-2)] border border-[var(--border)] rounded-t-2xl lg:rounded-sm'
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Job header */}
                    <div className='relative h-64 overflow-hidden rounded-t-2xl lg:rounded-t-sm'>
                      <img
                        src={selectedJob.cover}
                        alt={selectedJob.title}
                        className='w-full h-full object-cover'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent' />
                      <button
                        onClick={() => setSelectedJob(null)}
                        className='absolute top-4 right-4 w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-white/50 transition-colors'
                      >
                        ✕
                      </button>
                      <div className='absolute bottom-6 left-6'>
                        <div className='section-label mb-1'>
                          {selectedJob.type}
                        </div>
                        <h2 className='font-display text-3xl text-white'>
                          {selectedJob.title}
                        </h2>
                        <div className='flex gap-4 mt-2 text-xs text-white/50'>
                          <span className='flex items-center gap-1'>
                            <MapPin size={10} />
                            {selectedJob.location}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Calendar size={10} />
                            {new Date(selectedJob.date).toLocaleDateString(
                              'en-GB',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              },
                            )}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Camera size={10} />
                            {selectedJob.images.length} photos
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='p-6 lg:p-8'>
                      <p className='text-fg-2 leading-relaxed mb-8 font-serif text-lg'>
                        {selectedJob.description}
                      </p>

                      {/* Image carousel for this job */}
                      <ImageCarousel
                        images={selectedJob.images}
                        showThumbs
                        showInfo
                        autoPlay
                        interval={4500}
                        onExpand={(i) => openLightbox(selectedJob.images, i)}
                      />

                      {/* All images grid */}
                      <div className='mt-6'>
                        <div className='section-label mb-3'>
                          All Photos from this Session
                        </div>
                        <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
                          {selectedJob.images.map((img, i) => (
                            <button
                              key={i}
                              onClick={() =>
                                openLightbox(selectedJob.images, i)
                              }
                              className='aspect-square img-zoom rounded-sm overflow-hidden border border-[var(--border)] hover:border-gold transition-colors'
                            >
                              <img
                                src={img.url}
                                alt={img.title}
                                className='w-full h-full object-cover'
                                loading='lazy'
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* JOBS VIEW */}
            {viewMode === 'jobs' && (
              <div className='space-y-6'>
                {filtered.map((job, i) => (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className='card rounded-sm overflow-hidden cursor-pointer group'
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className='flex flex-col sm:flex-row'>
                      {/* Cover */}
                      <div className='sm:w-64 h-48 sm:h-auto flex-shrink-0 img-zoom'>
                        <img
                          src={job.cover}
                          alt={job.title}
                          className='w-full h-full object-cover'
                        />
                      </div>

                      {/* Info */}
                      <div className='flex-1 p-6 flex flex-col justify-between'>
                        <div>
                          <div className='flex items-center gap-3 mb-2'>
                            <span className='section-label'>{job.type}</span>
                            <span className='w-1 h-1 rounded-full bg-fg-4' />
                            <span className='text-fg-4 text-[10px] tracking-widest'>
                              {job.images.length} photos
                            </span>
                          </div>
                          <h3 className='font-display text-2xl text-fg mb-2 group-hover:text-gold transition-colors'>
                            {job.title}
                          </h3>
                          <p className='text-fg-3 text-sm leading-relaxed line-clamp-2'>
                            {job.description}
                          </p>
                        </div>

                        <div className='flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]'>
                          <div className='flex gap-4 text-xs text-fg-4'>
                            <span className='flex items-center gap-1'>
                              <MapPin size={10} className='text-gold' />
                              {job.location}
                            </span>
                            <span className='flex items-center gap-1'>
                              <Calendar size={10} className='text-gold' />
                              {new Date(job.date).toLocaleDateString('en-GB', {
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className='flex items-center gap-1 text-xs text-gold group-hover:gap-2 transition-all'>
                            View Gallery <ChevronRight size={12} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mini photo strip */}
                    <div className='flex gap-1 px-3 pb-3 overflow-x-auto'>
                      {job.images.map((img, i) => (
                        <div
                          key={i}
                          className='flex-shrink-0 w-16 h-10 rounded-sm overflow-hidden border border-[var(--border)]'
                        >
                          <img
                            src={img.url}
                            alt=''
                            className='w-full h-full object-cover'
                            loading='lazy'
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* GRID VIEW */}
            {viewMode === 'grid' && (
              <div className='portfolio-masonry'>
                {filtered
                  .flatMap((j) => j.images)
                  .map((img, i) => (
                    <motion.div
                      key={i}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className='portfolio-masonry-item rounded-sm border border-[var(--border)] group'
                      onClick={() =>
                        openLightbox(
                          filtered.flatMap((j) => j.images),
                          i,
                        )
                      }
                    >
                      <div className='relative overflow-hidden'>
                        <img
                          src={img.url}
                          alt={img.title}
                          className='w-full block transition-transform duration-700 group-hover:scale-105'
                          loading='lazy'
                        />
                        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-400 flex items-end p-3'>
                          <div className='translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300'>
                            <div className='section-label text-[8px]'>
                              {img.category}
                            </div>
                            <div className='text-white font-display text-sm'>
                              {img.title}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.startIndex}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
}
