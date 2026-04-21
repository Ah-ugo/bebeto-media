/** @format */

import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import {
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Camera,
  Award,
  Heart,
} from 'lucide-react';
import VideoHero from '../components/sections/VideoHero';
import ImageCarousel from '../components/ui/ImageCarousel';
import Lightbox from '../components/ui/Lightbox';
import { portfolioAPI } from '../utils/api';

const REVIEWS = [
  {
    name: 'Sarah & Tom',
    role: 'Wedding · Sunderland Minster',
    rating: 5,
    text: 'Bebeto captured every magical moment of our Sunderland wedding. The photos are beyond our wildest dreams. Absolutely the best in the North East.',
  },
  {
    name: 'Claire Harrison',
    role: 'Family · Roker Beach',
    rating: 5,
    text: "The most relaxed and professional photographer I've ever worked with. Our Roker Beach family shoot was genuinely fun and the results are simply stunning.",
  },
  {
    name: 'James Whitfield',
    role: 'Commercial · Wearside Brew Co.',
    rating: 5,
    text: 'Bebeto understood our brand immediately. The shots from our launch event went viral locally — exactly what we needed.',
  },
  {
    name: 'Sophia Okafor',
    role: 'Portrait · Mowbray Park',
    rating: 5,
    text: 'I was so nervous but Bebeto made everything completely easy. My graduation photos are everything I hoped for.',
  },
  {
    name: 'Mark & Lisa',
    role: 'Engagement · Roker Seafront',
    rating: 5,
    text: 'We did our shoot on Roker seafront and it was incredible. Bebeto knows exactly how to work with the Sunderland light.',
  },
];

const PROCESS = [
  {
    n: '01',
    title: 'Enquire',
    desc: "Reach out via our booking form or phone. We'll discuss your vision, date and find the perfect package.",
  },
  {
    n: '02',
    title: 'Plan',
    desc: 'Every detail — locations, timings, preferences — crafted together to make your session uniquely yours.',
  },
  {
    n: '03',
    title: 'Session',
    desc: 'Relax and be yourself. We create an environment where natural, authentic moments unfold.',
  },
  {
    n: '04',
    title: 'Gallery',
    desc: 'Your edited gallery arrives within 2 weeks via a beautiful private online gallery to download and share.',
  },
];

const STATS = [
  { val: '500+', label: 'Sessions Completed', icon: Camera },
  { val: '8', label: 'Years Experience', icon: Award },
  { val: '4.9', label: 'Average Rating', icon: Star },
  { val: '100%', label: 'Happy Clients', icon: Heart },
];

const S = (props) => <span {...props} />;

export default function HomePage() {
  const [reviewIdx, setReviewIdx] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [featuredItems, setFeaturedItems] = useState([]);
  const aboutRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ['start end', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);

  const nextReview = () => setReviewIdx((i) => (i + 1) % REVIEWS.length);
  const prevReview = () =>
    setReviewIdx((i) => (i - 1 + REVIEWS.length) % REVIEWS.length);

  useEffect(() => {
    const t = setInterval(nextReview, 6000);
    portfolioAPI
      .getAll({ featured: true, page_size: 7 })
      .then((r) => {
        const items = r.data.items.map((item) => ({
          ...item,
          url: item.cover_image_url || item.image_url,
        }));
        setFeaturedItems(items);
      })
      .catch((e) =>
        console.error('Failed to fetch featured portfolio items:', e),
      );
    return () => clearInterval(t);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.6, 0.01, 0.05, 0.95] },
    },
  };
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };

  return (
    <div style={{ background: 'var(--bg)' }}>
      <VideoHero items={featuredItems} />

      {/* ── TICKER ─────────────────────────────────────────── */}
      <div
        style={{
          background: 'var(--bg-2)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '12px 0',
          overflow: 'hidden',
        }}
      >
        <div className='ticker-wrap'>
          <div className='ticker-inner'>
            {[...Array(2)].map((_, k) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center' }}>
                {[
                  'Wedding Photography',
                  'Portrait Sessions',
                  'Event Coverage',
                  'Commercial Branding',
                  'Family Portraits',
                  'Sunderland & North East',
                  'Roker Beach',
                  'Mowbray Park',
                  'Stadium of Light',
                  "St Michael's",
                ].map((t, i) => (
                  <span
                    key={`${k}-${i}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '18px',
                      padding: '0 20px',
                      fontFamily: 'Montserrat,sans-serif',
                      fontSize: '0.58rem',
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: 'var(--fg-3)',
                      fontWeight: 400,
                    }}
                  >
                    {t}
                    <span style={{ color: 'var(--gold)', fontSize: '0.4rem' }}>
                      ◆
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ──────────────────────────────────────────── */}
      <section
        style={{ padding: '80px 5%', maxWidth: '1200px', margin: '0 auto' }}
      >
        <motion.div
          variants={stagger}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
            gap: '2px',
          }}
        >
          {STATS.map(({ val, label, icon: Icon }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              style={{
                padding: '40px 32px',
                borderTop: '1px solid var(--border)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '20px',
                  opacity: 0.15,
                }}
              >
                <Icon size={32} style={{ color: 'var(--gold)' }} />
              </div>
              <div
                style={{
                  fontFamily: 'Cormorant,serif',
                  fontSize: '3.5rem',
                  fontWeight: 300,
                  color: 'var(--fg)',
                  lineHeight: 1,
                  marginBottom: '8px',
                }}
              >
                {val}
              </div>
              <div
                style={{
                  fontFamily: 'Montserrat,sans-serif',
                  fontSize: '0.58rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--fg-4)',
                }}
              >
                {label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── FEATURED CAROUSEL ──────────────────────────────── */}
      <section
        style={{ padding: '0 5% 80px', maxWidth: '1400px', margin: '0 auto' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '32px',
            paddingBottom: '24px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div>
            <span
              className='section-label'
              style={{ display: 'block', marginBottom: '10px' }}
            >
              Featured Work
            </span>
            <h2
              style={{
                fontFamily: 'Cormorant,serif',
                fontSize: 'clamp(2.2rem,4vw,3.5rem)',
                fontWeight: 300,
                color: 'var(--fg)',
                margin: 0,
              }}
            >
              Recent Sessions
            </h2>
          </div>
          <Link to='/portfolio'>
            <button
              className='btn-gold-outline'
              style={{
                padding: '12px 24px',
                fontSize: '0.58rem',
                letterSpacing: '0.2em',
                gap: '8px',
              }}
            >
              All Work <ArrowRight size={11} />
            </button>
          </Link>
        </div>
        <ImageCarousel
          images={featuredItems}
          showThumbs
          showInfo
          autoPlay
          interval={5500}
          onExpand={(i) =>
            setLightbox({ images: featuredItems, startIndex: i })
          }
        />
      </section>

      {/* ── ABOUT ──────────────────────────────────────────── */}
      <section
        ref={aboutRef}
        style={{
          padding: '80px 5% 100px',
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center',
        }}
        className='grid-cols-1 lg:grid-cols-2'
      >
        {/* Image stack */}
        <div style={{ position: 'relative' }}>
          <motion.div style={{ y: imgY }}>
            <div
              style={{
                aspectRatio: '3/4',
                overflow: 'hidden',
                border: '1px solid var(--border)',
              }}
            >
              <img
                src='https://images.unsplash.com/photo-1554080353-a576cf803bda?w=700&q=80'
                alt='Bebeto at work'
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.9s',
                  display: 'block',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = 'scale(1.03)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = 'scale(1)')
                }
              />
            </div>
            {/* Floating review */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              style={{
                position: 'absolute',
                bottom: '-20px',
                right: '-24px',
                maxWidth: '200px',
                padding: '18px 20px',
                background: 'var(--bg-2)',
                border: '1px solid var(--border)',
                zIndex: 2,
              }}
            >
              <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={9}
                    style={{ color: 'var(--gold)', fill: 'var(--gold)' }}
                  />
                ))}
              </div>
              <p
                style={{
                  fontFamily: 'EB Garamond,serif',
                  fontSize: '0.82rem',
                  fontStyle: 'italic',
                  color: 'var(--fg-2)',
                  lineHeight: 1.5,
                  margin: '0 0 8px',
                }}
              >
                "The best photographer in Sunderland, bar none."
              </p>
              <div
                style={{
                  fontFamily: 'Montserrat,sans-serif',
                  fontSize: '0.52rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--fg-4)',
                }}
              >
                — Local couple, 2024
              </div>
            </motion.div>
            {/* Location chip */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              style={{
                position: 'absolute',
                top: '-16px',
                left: '-20px',
                padding: '10px 14px',
                background: 'var(--bg-3)',
                border: '1px solid var(--gold-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 2,
              }}
            >
              <MapPin size={11} style={{ color: 'var(--gold)' }} />
              <div>
                <div
                  style={{
                    fontFamily: 'Montserrat,sans-serif',
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    color: 'var(--fg)',
                  }}
                >
                  Sunderland, UK
                </div>
                <div
                  style={{
                    fontFamily: 'Montserrat,sans-serif',
                    fontSize: '0.52rem',
                    color: 'var(--fg-4)',
                    marginTop: '1px',
                  }}
                >
                  Serving the North East
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Text */}
        <motion.div
          variants={stagger}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true }}
        >
          <motion.span
            variants={fadeUp}
            className='section-label'
            style={{ display: 'block', marginBottom: '16px' }}
          >
            About Bebeto Media
          </motion.span>
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: 'Cormorant,serif',
              fontSize: 'clamp(2.2rem,4vw,3.8rem)',
              fontWeight: 300,
              color: 'var(--fg)',
              lineHeight: 1.1,
              marginBottom: '28px',
            }}
          >
            Sunderland's Story,
            <br />
            <em className='gold-gradient' style={{ fontStyle: 'italic' }}>
              Told in Light
            </em>
          </motion.h2>
          <motion.div
            variants={fadeUp}
            style={{
              fontFamily: 'EB Garamond,serif',
              fontSize: '1.12rem',
              color: 'var(--fg-2)',
              lineHeight: 1.9,
              marginBottom: '28px',
            }}
          >
            <p style={{ marginBottom: '16px' }}>
              Born and raised in Sunderland, I've spent over 8 years documenting
              the people, celebrations and businesses that make this city
              extraordinary. From intimate ceremonies at St Michael's Church to
              family portraits on Roker Beach — every location, every face tells
              a Wearside story.
            </p>
            <p>
              My approach is simple: I get to know you first. Every session is
              personal, unhurried and designed around the real you — not a pose,
              not a formula.
            </p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px 24px',
              marginBottom: '36px',
              paddingTop: '24px',
              borderTop: '1px solid var(--border)',
            }}
          >
            {[
              ['📍', 'Sunderland & North East'],
              ['📷', 'Weddings · Portraits · Events'],
              ['⚡', '2-week turnaround'],
              ['🏆', 'Award-winning'],
            ].map(([icon, text]) => (
              <div
                key={text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'Montserrat,sans-serif',
                  fontSize: '0.7rem',
                  color: 'var(--fg-3)',
                  fontWeight: 300,
                }}
              >
                <span style={{ fontSize: '0.85rem' }}>{icon}</span> {text}
              </div>
            ))}
          </motion.div>
          <motion.div
            variants={fadeUp}
            style={{ display: 'flex', gap: '12px' }}
          >
            <Link to='/about'>
              <button className='btn-primary' style={{ padding: '14px 28px' }}>
                <span style={{ fontSize: '0.58rem', letterSpacing: '0.2em' }}>
                  Read My Story
                </span>
              </button>
            </Link>
            <Link to='/portfolio'>
              <button className='btn-ghost' style={{ padding: '14px 24px' }}>
                <span style={{ fontSize: '0.58rem', letterSpacing: '0.2em' }}>
                  View Work
                </span>
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── PROCESS ────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--bg-2)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '80px 5%',
        }}
      >
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span
              className='section-label'
              style={{ display: 'block', marginBottom: '14px' }}
            >
              How It Works
            </span>
            <h2
              style={{
                fontFamily: 'Cormorant,serif',
                fontSize: 'clamp(2rem,4vw,3rem)',
                fontWeight: 300,
                color: 'var(--fg)',
                margin: 0,
              }}
            >
              Your Journey with Us
            </h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
              gap: '1px',
              background: 'var(--border)',
            }}
          >
            {PROCESS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'var(--bg-2)',
                  padding: '36px 28px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'var(--bg-3)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'var(--bg-2)')
                }
              >
                <div
                  style={{
                    fontFamily: 'Cormorant,serif',
                    fontSize: '6rem',
                    fontWeight: 300,
                    color: 'rgba(191,160,106,0.07)',
                    position: 'absolute',
                    top: '-8px',
                    right: '12px',
                    lineHeight: 1,
                    userSelect: 'none',
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    width: '20px',
                    height: '1px',
                    background: 'var(--gold)',
                    marginBottom: '20px',
                    opacity: 0.7,
                  }}
                />
                <h3
                  style={{
                    fontFamily: 'Cormorant,serif',
                    fontSize: '1.5rem',
                    fontWeight: 400,
                    color: 'var(--fg)',
                    marginBottom: '12px',
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'Montserrat,sans-serif',
                    fontSize: '0.72rem',
                    fontWeight: 300,
                    color: 'var(--fg-3)',
                    lineHeight: 1.8,
                  }}
                >
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO GRID ─────────────────────────────────── */}
      <section
        style={{ padding: '80px 5%', maxWidth: '1400px', margin: '0 auto' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '32px',
            paddingBottom: '24px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div>
            <span
              className='section-label'
              style={{ display: 'block', marginBottom: '10px' }}
            >
              The Gallery
            </span>
            <h2
              style={{
                fontFamily: 'Cormorant,serif',
                fontSize: 'clamp(2rem,4vw,3rem)',
                fontWeight: 300,
                color: 'var(--fg)',
                margin: 0,
              }}
            >
              A Glimpse Into Our Work
            </h2>
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gridTemplateRows: 'auto',
            gap: '6px',
          }}
        >
          {featuredItems.map((img, i) => (
            <motion.button
              key={img.id || i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              onClick={() =>
                setLightbox({ images: featuredItems, startIndex: i })
              }
              className='img-zoom'
              style={{
                gridColumn: i === 0 ? 'span 2' : undefined,
                gridRow: i === 0 ? 'span 2' : undefined,
                aspectRatio: '1',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                overflow: 'hidden',
              }}
            >
              <img
                src={img.url}
                alt={img.title}
                loading='lazy'
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.9s',
                }}
              />
            </motion.button>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link to='/portfolio'>
            <button className='btn-ghost' style={{ padding: '14px 36px' }}>
              <span
                style={{
                  fontSize: '0.58rem',
                  letterSpacing: '0.22em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                View All Sessions <ArrowRight size={12} />
              </span>
            </button>
          </Link>
        </div>
      </section>

      {/* ── REVIEWS ────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--bg-2)',
          borderTop: '1px solid var(--border)',
          padding: '80px 5%',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <span
              className='section-label'
              style={{ display: 'block', marginBottom: '14px' }}
            >
              Client Love
            </span>
            <h2
              style={{
                fontFamily: 'Cormorant,serif',
                fontSize: 'clamp(2rem,4vw,3rem)',
                fontWeight: 300,
                color: 'var(--fg)',
                margin: 0,
              }}
            >
              Kind Words
            </h2>
          </div>
          <div style={{ position: 'relative' }}>
            <div className='quote-mark' style={{ marginBottom: '0' }}>
              "
            </div>
            <AnimatePresence mode='wait'>
              <motion.div
                key={reviewIdx}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.45 }}
                style={{
                  padding: '32px 36px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                }}
              >
                <div
                  style={{ display: 'flex', gap: '3px', marginBottom: '20px' }}
                >
                  {[...Array(REVIEWS[reviewIdx].rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      style={{ color: 'var(--gold)', fill: 'var(--gold)' }}
                    />
                  ))}
                </div>
                <p
                  style={{
                    fontFamily: 'EB Garamond,serif',
                    fontSize: '1.25rem',
                    fontStyle: 'italic',
                    color: 'var(--fg)',
                    lineHeight: 1.75,
                    marginBottom: '24px',
                  }}
                >
                  {REVIEWS[reviewIdx].text}
                </p>
                <div>
                  <div
                    style={{
                      fontFamily: 'Montserrat,sans-serif',
                      fontSize: '0.72rem',
                      fontWeight: 500,
                      color: 'var(--fg)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {REVIEWS[reviewIdx].name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Montserrat,sans-serif',
                      fontSize: '0.58rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--fg-4)',
                      marginTop: '3px',
                    }}
                  >
                    {REVIEWS[reviewIdx].role}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '20px',
              }}
            >
              <div style={{ display: 'flex', gap: '6px' }}>
                {REVIEWS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setReviewIdx(i)}
                    className={`carousel-dot ${i === reviewIdx ? 'active' : ''}`}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[prevReview, nextReview].map((fn, i) => (
                  <button
                    key={i}
                    onClick={fn}
                    style={{
                      width: '34px',
                      height: '34px',
                      border: '1px solid var(--border-2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'transparent',
                      color: 'var(--fg-3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--gold)';
                      e.currentTarget.style.color = 'var(--gold)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-2)';
                      e.currentTarget.style.color = 'var(--fg-3)';
                    }}
                  >
                    {i === 0 ? (
                      <ChevronLeft size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section
        style={{
          padding: '100px 5%',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              'url(https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1400&q=20)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}
        >
          <span
            className='section-label'
            style={{ display: 'block', marginBottom: '20px' }}
          >
            Ready to Begin?
          </span>
          <h2
            style={{
              fontFamily: 'Cormorant,serif',
              fontSize: 'clamp(2.6rem,5vw,5rem)',
              fontWeight: 300,
              color: 'var(--fg)',
              lineHeight: 1.05,
              marginBottom: '20px',
            }}
          >
            Let's Create
            <br />
            Something{' '}
            <em className='gold-gradient' style={{ fontStyle: 'italic' }}>
              Unforgettable
            </em>
          </h2>
          <p
            style={{
              fontFamily: 'EB Garamond,serif',
              fontSize: '1.1rem',
              color: 'var(--fg-3)',
              lineHeight: 1.8,
              marginBottom: '40px',
            }}
          >
            Based in Sunderland, available across the North East. Every story
            deserves to be told beautifully.
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
            }}
          >
            <Link to='/book'>
              <button className='btn-primary' style={{ padding: '16px 40px' }}>
                <span
                  style={{
                    fontSize: '0.58rem',
                    letterSpacing: '0.22em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  Book Your Session <ArrowRight size={12} />
                </span>
              </button>
            </Link>
            <Link to='/contact'>
              <button className='btn-ghost' style={{ padding: '16px 32px' }}>
                <span style={{ fontSize: '0.58rem', letterSpacing: '0.22em' }}>
                  Get in Touch
                </span>
              </button>
            </Link>
          </div>
          <div
            // style={{ marginTop: '28px' }}
            className='location-tag'
            style={{ justifyContent: 'center', marginTop: '28px' }}
          >
            <MapPin size={9} /> Sunderland, Tyne & Wear · Available for travel
          </div>
        </motion.div>
      </section>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.startIndex}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
