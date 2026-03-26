import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Award, Camera, Heart, ArrowRight } from 'lucide-react';

const TIMELINE = [
  { year:'2016', title:'Founded', desc:'Bebeto Media is born in Sunderland, starting with portraits and small family sessions.' },
  { year:'2018', title:'First Major Wedding', desc:'Shot the first full wedding at St Michael\'s Church — igniting a passion for wedding storytelling.' },
  { year:'2020', title:'Commercial Expansion', desc:'Expanded into commercial and brand photography, serving Sunderland businesses through lockdown and beyond.' },
  { year:'2022', title:'Award-Winning', desc:'Named Best Wedding Photographer at the North East Photography Awards.' },
  { year:'2024', title:'500+ Sessions', desc:'Over 500 sessions completed — Sunderland\'s most trusted and beloved photographer.' },
];

const LOCATIONS = ['St Michael\'s Church','Roker Beach','Stadium of Light','Mowbray Park','Roker Hotel','Wearmouth Bridge','Herrington Country Park','Penshaw Monument'];

export default function AboutPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const stagger = { hidden:{}, show:{ transition:{ staggerChildren:0.1 } } };
  const item = { hidden:{ opacity:0, y:24 }, show:{ opacity:1, y:0, transition:{ duration:0.6 } } };

  return (
    <div className="min-h-screen">
      {/* Parallax hero */}
      <section ref={heroRef} className="relative h-[70vh] overflow-hidden flex items-end">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <div className="absolute inset-0"
            style={{ backgroundImage:`url(https://images.unsplash.com/photo-1554080353-a576cf803bda?w=1400&q=85)`, backgroundSize:'cover', backgroundPosition:'center top' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/20 via-transparent to-[var(--bg)]" />
        </motion.div>
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 pb-16 w-full">
          <div className="section-label mb-3 text-gold">The Photographer</div>
          <h1 className="font-display text-6xl lg:text-8xl text-fg mb-4">Our Story</h1>
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-gold" />
            <span className="text-[11px] tracking-widest uppercase text-fg-3">Sunderland, Tyne & Wear · Est. 2016</span>
          </div>
        </motion.div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20">

        {/* Bio section */}
        <section className="py-20 grid lg:grid-cols-2 gap-16 items-start">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once:true }}>
            <motion.div variants={item} className="section-label mb-4">The Photographer</motion.div>
            <motion.h2 variants={item} className="font-display text-4xl lg:text-5xl text-fg mb-8 leading-tight">
              Sunderland-Born,<br />
              <span className="gold-gradient italic">Wearside at Heart</span>
            </motion.h2>
            <motion.div variants={item} className="space-y-5 text-fg-2 font-serif text-lg leading-relaxed">
              <p>
                Born and raised on Wearside, I grew up surrounded by the North Sea's dramatic skies, 
                Roker's golden sands, and a community brimming with warmth and character. 
                That upbringing shaped everything about how I see the world through a lens.
              </p>
              <p>
                I founded Bebeto Media in 2016 with one simple belief: every person, family and 
                business in Sunderland deserves photography that truly reflects who they are — 
                not a template, not a formula, but something real and lasting.
              </p>
              <p>
                Over 8 years and 500+ sessions later, I'm still driven by the same fire — the 
                quiet moments, the burst of laughter, the look between two people in love. 
                Sunderland is my home, and these are my people.
              </p>
            </motion.div>

            <motion.div variants={item} className="mt-8 flex gap-4">
              <Link to="/book">
                <button className="btn-primary px-6 py-3 rounded-sm text-xs flex items-center gap-2 group">
                  Work with Me <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/portfolio">
                <button className="btn-ghost px-6 py-3 rounded-sm text-xs">View Work</button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Portrait + stats */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity:0, scale:0.95 }}
              whileInView={{ opacity:1, scale:1 }}
              viewport={{ once:true }}
              className="aspect-[3/4] rounded-sm overflow-hidden border border-[var(--border)]"
            >
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=700&q=80" alt="Bebeto" className="w-full h-full object-cover" />
            </motion.div>

            <div className="grid grid-cols-3 gap-4">
              {[['500+','Sessions',Camera],['8+','Years',Award],['4.9★','Rating',Heart]].map(([val,label,Icon],i) => (
                <motion.div key={label}
                  initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                  className="card rounded-sm p-4 text-center"
                >
                  <Icon size={14} className="text-gold mx-auto mb-2" />
                  <div className="font-display text-2xl text-fg">{val}</div>
                  <div className="text-[9px] tracking-widest uppercase text-fg-4 mt-0.5">{label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 border-t border-[var(--border)]">
          <div className="text-center mb-14">
            <div className="section-label mb-3">The Journey</div>
            <h2 className="font-display text-4xl text-fg">8 Years in the Making</h2>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold via-gold/30 to-transparent" />

            <div className="space-y-10">
              {TIMELINE.map((t, i) => (
                <motion.div
                  key={t.year}
                  initial={{ opacity:0, x:-20 }}
                  whileInView={{ opacity:1, x:0 }}
                  viewport={{ once:true }}
                  transition={{ delay:i*0.1 }}
                  className="flex gap-8 pl-16 relative"
                >
                  {/* Dot */}
                  <div className="absolute left-4 top-1 w-4 h-4 rounded-full border-2 border-gold bg-[var(--bg)] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                  </div>

                  <div>
                    <div className="font-display text-gold text-xl mb-1">{t.year}</div>
                    <div className="font-semibold text-fg mb-1">{t.title}</div>
                    <p className="text-fg-3 text-sm leading-relaxed">{t.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Sunderland locations */}
        <section className="py-16 border-t border-[var(--border)]">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
              <div className="section-label mb-3">Our Territory</div>
              <h2 className="font-display text-4xl text-fg mb-4">
                Every Corner of <span className="gold-gradient">Sunderland</span>
              </h2>
              <p className="text-fg-3 leading-relaxed mb-8 font-serif text-lg">
                From the windswept sands of Roker Beach to the grandeur of Penshaw Monument, 
                we know every light, every angle, every golden hour in Sunderland and the wider North East.
              </p>
              <div className="flex flex-wrap gap-2">
                {LOCATIONS.map((loc) => (
                  <span key={loc} className="text-[10px] tracking-wider px-3 py-1.5 rounded-sm border border-[var(--gold-border)] bg-[var(--gold-dim)] text-gold">
                    📍 {loc}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity:0, scale:0.95 }}
              whileInView={{ opacity:1, scale:1 }}
              viewport={{ once:true }}
              className="rounded-sm overflow-hidden border border-[var(--border)]"
              style={{ height:320 }}
            >
              <iframe
                title="Sunderland"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-1.4700%2C54.8800%2C-1.3200%2C54.9400&layer=mapnik&marker=54.9069%2C-1.3838"
                className="w-full h-full"
                style={{ border:0 }}
                loading="lazy"
              />
            </motion.div>
          </div>
        </section>
      </div>

      {/* CTA */}
      <section className="py-24 text-center px-6">
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <div className="section-label mb-4">Ready?</div>
          <h2 className="font-display text-5xl text-fg mb-4">
            Let's Tell Your <span className="gold-gradient italic">Sunderland Story</span>
          </h2>
          <p className="text-fg-3 font-serif text-lg max-w-lg mx-auto mb-10">
            Book a session today and let's create something you'll treasure for a lifetime.
          </p>
          <Link to="/book">
            <button className="btn-primary px-10 py-4 rounded-sm text-xs flex items-center gap-2 mx-auto group">
              Book a Session <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
