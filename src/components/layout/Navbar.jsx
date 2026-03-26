/** @format */

import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin, Instagram } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { toggle, isDark } = useTheme();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.6, 0.01, 0.05, 0.95] }}
        className='fixed top-0 left-0 right-0 z-50'
        style={{
          transition:
            'background 0.5s, border-color 0.5s, backdrop-filter 0.5s',
          background: scrolled ? 'var(--surface)' : 'transparent',
          backdropFilter: scrolled ? 'blur(28px)' : 'none',
          borderBottom: scrolled
            ? '1px solid var(--border)'
            : '1px solid transparent',
        }}
      >
        <div
          className='max-w-screen-xl mx-auto px-8 lg:px-16 flex items-center justify-between'
          style={{ height: '72px' }}
        >
          <Link to='/' className='flex items-center gap-4 group'>
            <div className='relative w-8 h-8 flex-shrink-0'>
              <div
                className='absolute inset-0 rotate-45 border transition-all duration-500 group-hover:scale-110'
                style={{ borderColor: 'var(--gold)' }}
              />
              <div
                className='absolute inset-[7px] rotate-45'
                style={{ background: 'var(--gold)' }}
              />
            </div>
            <div>
              <div
                className='font-display tracking-[0.28em] uppercase'
                style={{
                  fontSize: '13px',
                  color: 'var(--fg)',
                  fontWeight: 400,
                  lineHeight: 1,
                }}
              >
                Bebeto
              </div>
              <div
                className='tracking-[0.5em] uppercase mt-0.5'
                style={{
                  fontSize: '6.5px',
                  color: 'var(--gold)',
                  fontWeight: 500,
                  fontFamily: 'Montserrat,sans-serif',
                  lineHeight: 1,
                }}
              >
                Media
              </div>
            </div>
          </Link>

          <nav className='hidden lg:flex flex-1 justify-center items-center gap-8 px-4'>
            {NAV.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                style={{
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontFamily: 'Montserrat,sans-serif',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
                className={({ isActive }) =>
                  `relative group transition-colors duration-300 ${isActive ? 'text-gold' : 'text-fg-3 hover:text-fg'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    <span
                      className='absolute -bottom-1 left-0 h-px transition-all duration-500 group-hover:w-full'
                      style={{
                        background: 'var(--gold)',
                        width: isActive ? '100%' : '0%',
                      }}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className='hidden lg:flex items-center gap-5'>
            <span className='location-tag' style={{ opacity: 0.6 }}>
              <MapPin size={9} /> Sunderland
            </span>
            <div
              className='w-px h-4'
              style={{ background: 'var(--fg-3)', opacity: 0.2 }}
            />
            <button onClick={toggle} className='theme-toggle flex-shrink-0'>
              <div className='knob'>{isDark ? '🌙' : '☀️'}</div>
            </button>
            <a
              href='https://instagram.com/bebetomedia'
              target='_blank'
              rel='noopener'
              className='transition-colors hover:text-gold'
              style={{ color: 'var(--fg-3)' }}
            >
              <Instagram size={14} />
            </a>
            <div
              className='w-px h-4'
              style={{ background: 'var(--fg-3)', opacity: 0.2 }}
            />
            <Link to='/book'>
              <button className='btn-primary px-6 py-3'>
                <span style={{ fontSize: '0.58rem', letterSpacing: '0.22em' }}>
                  Book Now
                </span>
              </button>
            </Link>
          </div>

          <div className='lg:hidden flex items-center gap-3'>
            <button onClick={toggle} className='theme-toggle'>
              <div className='knob'>{isDark ? '🌙' : '☀️'}</div>
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              style={{ color: 'var(--fg)' }}
              className='p-1'
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className='fixed inset-0 z-40'
            style={{ background: 'var(--overlay)' }}
          >
            <button
              onClick={() => setOpen(false)}
              className='absolute top-7 right-8 transition-colors hover:text-gold'
              style={{ color: 'var(--fg-3)' }}
            >
              <X size={20} />
            </button>
            <div className='flex flex-col justify-center items-start h-full px-12'>
              <div
                className='w-8 h-px mb-12'
                style={{ background: 'var(--gold)', opacity: 0.5 }}
              />
              {NAV.map(({ to, label, end }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.09 }}
                  className='mb-6'
                >
                  <NavLink
                    to={to}
                    end={end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `font-display block transition-colors duration-300 ${isActive ? 'text-gold' : 'hover:text-gold'}`
                    }
                    style={{
                      fontSize: 'clamp(2.2rem,7vw,3.5rem)',
                      fontWeight: 300,
                      color: 'var(--fg)',
                      textDecoration: 'none',
                    }}
                  >
                    {label}
                  </NavLink>
                </motion.div>
              ))}
              <div className='mt-10 space-y-3'>
                <div className='location-tag' style={{ opacity: 0.6 }}>
                  <MapPin size={9} /> Sunderland, UK
                </div>
                <Link to='/book' onClick={() => setOpen(false)}>
                  <button className='btn-primary px-8 py-4 mt-4'>
                    <span
                      style={{ fontSize: '0.6rem', letterSpacing: '0.22em' }}
                    >
                      Book a Session
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
