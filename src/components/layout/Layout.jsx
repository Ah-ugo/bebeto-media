/** @format */

import { Outlet, NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div
      className='min-h-screen grain'
      style={{ background: 'var(--bg)', color: 'var(--fg)' }}
    >
      {/* Inject map filter for dark mode */}
      <style>{`
        [data-theme="dark"] iframe { filter: invert(90%) hue-rotate(180deg) brightness(0.85); }
        [data-theme="light"] iframe { filter: none; }
      `}</style>

      <Navbar />

      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        style={{
          background: 'var(--bg-2)',
          borderTop: '1px solid var(--border)',
        }}
        className='mt-20'
      >
        <div className='max-w-7xl mx-auto px-6 lg:px-20 py-16'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-10 mb-12'>
            {/* Brand */}
            <div className='md:col-span-2'>
              <div
                className='font-display text-3xl tracking-widest mb-1'
                style={{ color: 'var(--fg)' }}
              >
                BEBETO MEDIA
              </div>
              <div
                className='text-[8px] tracking-[0.4em] mb-4'
                style={{ color: 'var(--gold)' }}
              >
                PHOTOGRAPHY & VISUAL STORYTELLING
              </div>
              <p
                className='text-sm leading-relaxed max-w-sm'
                style={{
                  color: 'var(--fg-3)',
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                Born and raised in Sunderland, capturing the North East's most
                precious moments with artistry, warmth and precision since 2016.
              </p>
              <div
                className='flex items-center gap-2 mt-4'
                style={{ color: 'var(--gold)' }}
              >
                <MapPin size={11} />
                <span className='text-[10px] tracking-widest uppercase'>
                  Sunderland, Tyne & Wear
                </span>
              </div>
            </div>

            {/* Nav */}
            <div>
              <div className='section-label mb-4'>Navigate</div>
              <ul className='space-y-2.5'>
                {[
                  ['/', 'Home'],
                  ['/portfolio', 'Portfolio'],
                  ['/services', 'Services'],
                  ['/about', 'About'],
                  ['/contact', 'Contact'],
                  ['/book', 'Book a Session'],
                ].map(([to, label]) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className='text-sm transition-colors hover:text-gold'
                      style={{ color: 'var(--fg-3)' }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <div className='section-label mb-4'>Contact</div>
              <div className='space-y-3'>
                <a
                  href='mailto:info@bebetomedia.com'
                  className='flex items-center gap-2 text-sm transition-colors hover:text-gold'
                  style={{ color: 'var(--fg-3)' }}
                >
                  <Mail size={12} className='text-gold flex-shrink-0' />{' '}
                  info@bebetomedia.com
                </a>
                <a
                  href='tel:+447400123456'
                  className='flex items-center gap-2 text-sm transition-colors hover:text-gold'
                  style={{ color: 'var(--fg-3)' }}
                >
                  <Phone size={12} className='text-gold flex-shrink-0' /> +44
                  7823 686588
                </a>
                <a
                  href='https://instagram.com/bebetomedia'
                  target='_blank'
                  rel='noopener'
                  className='flex items-center gap-2 text-sm transition-colors hover:text-gold'
                  style={{ color: 'var(--fg-3)' }}
                >
                  <Instagram size={12} className='text-gold flex-shrink-0' />{' '}
                  @bebetomedia
                </a>
                <div
                  className='flex items-start gap-2 text-sm'
                  style={{ color: 'var(--fg-3)' }}
                >
                  <MapPin
                    size={12}
                    className='text-gold flex-shrink-0 mt-0.5'
                  />
                  <span>
                    Sunderland, Tyne & Wear
                    <br />
                    Available across the North East
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='gold-line mb-8' />

          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-xs' style={{ color: 'var(--fg-4)' }}>
              © 2024 BEBETO MEDIA · All rights reserved · Sunderland, UK
            </p>
            <Link
              to='/admin/login'
              className='text-xs transition-colors hover:text-fg-3'
              style={{ color: 'var(--fg-4)' }}
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
