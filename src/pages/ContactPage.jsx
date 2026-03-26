/** @format */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Clock,
  Send,
  Check,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: 'Location',
    value: 'Sunderland, Tyne & Wear, SR1',
    sub: 'Serving the North East & beyond',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+44 7823 686588',
    sub: 'Mon–Sat, 9am–6pm',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@bebetomedia.com',
    sub: 'Usually reply within 24 hours',
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon–Sat: 9am – 6pm',
    sub: 'Sun by appointment',
  },
];

const SERVICES_ENQUIRY = [
  'Wedding Photography',
  'Portrait Session',
  'Event Coverage',
  'Commercial Photography',
  'Family Session',
  'Other',
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    toast.success("Message sent! We'll be in touch within 24 hours.");
    reset();
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className='min-h-screen pt-28 pb-20'>
      {/* Header */}
      <div className='max-w-7xl mx-auto px-6 lg:px-20 mb-16'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className='section-label mb-3'>Let's Talk</div>
          <h1 className='font-display text-5xl lg:text-7xl text-fg mb-4'>
            Get in Touch
          </h1>
          <p className='font-serif text-xl text-fg-3 max-w-xl leading-relaxed'>
            Based in Sunderland, available across the North East and beyond.
            Let's create something beautiful together.
          </p>
        </motion.div>
      </div>

      <div className='max-w-7xl mx-auto px-6 lg:px-20 grid lg:grid-cols-2 gap-16'>
        {/* Left — info + map */}
        <motion.div
          variants={stagger}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true }}
        >
          {/* Contact cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10'>
            {CONTACT_INFO.map(({ icon: Icon, label, value, sub }) => (
              <motion.div
                key={label}
                variants={item}
                className='card rounded-sm p-5'
              >
                <Icon size={16} className='text-gold mb-3' />
                <div className='text-[9px] tracking-widest uppercase text-fg-3 mb-1'>
                  {label}
                </div>
                <div className='text-fg text-sm font-medium'>{value}</div>
                <div className='text-fg-4 text-xs mt-0.5'>{sub}</div>
              </motion.div>
            ))}
          </div>

          {/* Sunderland map embed */}
          <motion.div
            variants={item}
            className='rounded-sm overflow-hidden border border-[var(--border)] mb-8'
            style={{ height: 300 }}
          >
            <iframe
              title='Bebeto Media — Sunderland'
              src='https://www.openstreetmap.org/export/embed.html?bbox=-1.4700%2C54.8800%2C-1.3200%2C54.9400&layer=mapnik&marker=54.9069%2C-1.3838'
              className='w-full h-full'
              style={{ filter: 'var(--map-filter, none)', border: 0 }}
              loading='lazy'
            />
          </motion.div>

          {/* Social */}
          <motion.div variants={item}>
            <div className='section-label mb-4'>Follow the Work</div>
            <a
              href='https://instagram.com/bebetomedia'
              target='_blank'
              rel='noopener'
              className='inline-flex items-center gap-3 card rounded-sm px-5 py-4 hover:border-gold/40 transition-all group'
            >
              <Instagram size={18} className='text-gold' />
              <div>
                <div className='text-fg text-sm font-medium group-hover:text-gold transition-colors'>
                  @bebetomedia
                </div>
                <div className='text-fg-4 text-xs'>
                  Latest sessions on Instagram
                </div>
              </div>
            </a>
          </motion.div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className='card rounded-sm p-8 lg:p-10'>
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className='text-center py-12'
              >
                <div className='w-16 h-16 border border-gold/40 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <Check size={28} className='text-gold' />
                </div>
                <h3 className='font-display text-2xl text-fg mb-2'>
                  Message Sent!
                </h3>
                <p className='text-fg-3 text-sm'>
                  We'll be in touch within 24 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className='mt-6 text-xs text-gold hover:text-gold-light transition-colors tracking-widest uppercase'
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <>
                <div className='section-label mb-2'>Send a Message</div>
                <h2 className='font-display text-3xl text-fg mb-8'>
                  Start the Conversation
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-[10px] tracking-widest uppercase text-fg-3 mb-2'>
                        Full Name *
                      </label>
                      <input
                        {...register('name', { required: true })}
                        placeholder='Your name'
                        className='input w-full px-4 py-3 text-sm rounded-sm'
                      />
                      {errors.name && (
                        <p className='text-red-400 text-xs mt-1'>Required</p>
                      )}
                    </div>
                    <div>
                      <label className='block text-[10px] tracking-widest uppercase text-fg-3 mb-2'>
                        Email *
                      </label>
                      <input
                        {...register('email', {
                          required: true,
                          pattern: /^\S+@\S+$/,
                        })}
                        type='email'
                        placeholder='your@email.com'
                        className='input w-full px-4 py-3 text-sm rounded-sm'
                      />
                      {errors.email && (
                        <p className='text-red-400 text-xs mt-1'>
                          Valid email required
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className='block text-[10px] tracking-widest uppercase text-fg-3 mb-2'>
                      Phone
                    </label>
                    <input
                      {...register('phone')}
                      placeholder='+44 xxx xxxx xxxx'
                      className='input w-full px-4 py-3 text-sm rounded-sm'
                    />
                  </div>

                  <div>
                    <label className='block text-[10px] tracking-widest uppercase text-fg-3 mb-2'>
                      Service of Interest *
                    </label>
                    <select
                      {...register('service', { required: true })}
                      className='input w-full px-4 py-3 text-sm rounded-sm'
                    >
                      <option value=''>Select a service...</option>
                      {SERVICES_ENQUIRY.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.service && (
                      <p className='text-red-400 text-xs mt-1'>
                        Please select a service
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-[10px] tracking-widest uppercase text-fg-3 mb-2'>
                      Preferred Date / Details
                    </label>
                    <input
                      {...register('date')}
                      placeholder='e.g. 15 June 2025 — Roker Beach'
                      className='input w-full px-4 py-3 text-sm rounded-sm'
                    />
                  </div>

                  <div>
                    <label className='block text-[10px] tracking-widest uppercase text-fg-3 mb-2'>
                      Message *
                    </label>
                    <textarea
                      {...register('message', {
                        required: true,
                        minLength: 10,
                      })}
                      rows={5}
                      placeholder='Tell us about your vision, your date, your venue...'
                      className='input w-full px-4 py-3 text-sm rounded-sm resize-none'
                    />
                    {errors.message && (
                      <p className='text-red-400 text-xs mt-1'>
                        Please write a message
                      </p>
                    )}
                  </div>

                  <button
                    type='submit'
                    disabled={sending}
                    className='btn-primary w-full px-6 py-4 text-xs rounded-sm flex items-center justify-center gap-2 disabled:opacity-60'
                  >
                    {sending ? (
                      <Loader2 size={14} className='animate-spin' />
                    ) : (
                      <Send size={14} />
                    )}
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>

                  <p className='text-fg-4 text-xs text-center leading-relaxed'>
                    Based in Sunderland · Available across the North East ·
                    Nationwide travel on request
                  </p>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
