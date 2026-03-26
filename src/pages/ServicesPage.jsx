import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import { packagesAPI } from '../utils/api';
import { useBookingStore } from '../store';

const CATS = ['all','weddings','portraits','events','commercial','family'];
const CAT_LABELS = { all:'All Services', weddings:'Weddings', portraits:'Portraits', events:'Events', commercial:'Commercial', family:'Family' };

// Fallback packages when API unavailable
const DEMO = [
  { id:'1', name:'Essential Wedding', category:'weddings', description:'Full-day ceremony & reception coverage across Sunderland and the North East.', base_price:1800, duration_hours:8, includes:['8 hours coverage','300+ edited images','Online gallery','USB drive'], extras:[{name:'Engagement shoot',price:350},{name:'Second photographer',price:450}] },
  { id:'2', name:'Signature Wedding', category:'weddings', description:'Our most comprehensive package — full day, engagement shoot, luxury album.', base_price:2800, duration_hours:12, includes:['12 hours coverage','500+ edited images','Engagement session','Luxury album','Same-day preview'], extras:[{name:'Second photographer',price:450},{name:'Drone footage',price:300}] },
  { id:'3', name:'Classic Portrait', category:'portraits', description:'Editorial portraits at Roker Beach, Mowbray Park or studio.', base_price:280, duration_hours:1, includes:['90-minute session','20 edited images','Online gallery'], extras:[{name:'Additional hour',price:120},{name:'Hair & makeup',price:150}] },
  { id:'4', name:'Extended Portrait', category:'portraits', description:'Relaxed multi-location portrait experience with wardrobe changes.', base_price:480, duration_hours:3, includes:['3-hour session','40 edited images','2 locations','5 hero retouches'], extras:[] },
  { id:'5', name:'Event Coverage', category:'events', description:'Professional coverage of corporate events, launches and celebrations.', base_price:650, duration_hours:4, includes:['4 hours coverage','150+ images','Online gallery','Commercial licence'], extras:[{name:'Additional hour',price:140}] },
  { id:'6', name:'Brand Session', category:'commercial', description:'Premium brand photography for Sunderland businesses.', base_price:950, duration_hours:4, includes:['4-hour session','30 edited images','Commercial licence','Print & web files'], extras:[{name:'Product flat-lays',price:250}] },
  { id:'7', name:'Family Session', category:'family', description:'Warm family portraits at Roker Beach, Herrington Park or your location.', base_price:250, duration_hours:1, includes:['90-minute session','25 edited images','Online gallery'], extras:[{name:'Extended session',price:100},{name:'A3 canvas print',price:95}] },
];

export default function ServicesPage() {
  const [packages, setPackages] = useState([]);
  const [cat, setCat] = useState('all');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();
  const store = useBookingStore();

  useEffect(() => {
    packagesAPI.getAll()
      .then((r) => setPackages(r.data.length ? r.data : DEMO))
      .catch(() => setPackages(DEMO))
      .finally(() => setLoading(false));
  }, []);

  const filtered = cat === 'all' ? packages : packages.filter((p) => p.category === cat);

  const handleBook = (pkg) => {
    store.setCategory(pkg.category);
    store.setPackage(pkg);
    navigate('/book');
  };

  const fmt = (n) => `£${Number(n).toLocaleString('en-GB', { minimumFractionDigits: 0 })}`;

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', paddingTop:'72px' }}>

      {/* ── Page header ─────────────────────────────────────────── */}
      <div style={{ borderBottom:'1px solid var(--border)', padding:'60px 8% 48px' }}>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
          <span className="section-label" style={{ display:'block', marginBottom:'12px' }}>What We Offer</span>
          <h1 style={{ fontFamily:'Cormorant,serif', fontSize:'clamp(2.5rem,5vw,5rem)', fontWeight:300, color:'var(--fg)', margin:'0 0 16px', lineHeight:1 }}>
            Services &amp; Pricing
          </h1>
          <p style={{ fontFamily:'EB Garamond,serif', fontSize:'1.15rem', color:'var(--fg-3)', maxWidth:'520px', lineHeight:1.8 }}>
            Transparent pricing with no hidden fees. Based in Sunderland, available across the North East and beyond.
          </p>
        </motion.div>
      </div>

      {/* ── Category tabs ────────────────────────────────────────── */}
      <div style={{ padding:'28px 8% 0', borderBottom:'1px solid var(--border)', display:'flex', gap:'0', overflowX:'auto' }}>
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            style={{
              padding:'12px 20px', border:'none', background:'transparent', cursor:'pointer',
              fontFamily:'Montserrat,sans-serif', fontSize:'0.65rem', letterSpacing:'0.18em',
              textTransform:'uppercase', fontWeight:500, transition:'all 0.3s',
              color: cat === c ? 'var(--gold)' : 'var(--fg-3)',
              borderBottom: cat === c ? '1px solid var(--gold)' : '1px solid transparent',
              marginBottom: '-1px', whiteSpace:'nowrap',
            }}>
            {CAT_LABELS[c]}
          </button>
        ))}
      </div>

      {/* ── Package grid ─────────────────────────────────────────── */}
      <div style={{ padding:'56px 8% 80px', maxWidth:'1400px' }}>
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'2px' }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:'380px' }} />)}
          </div>
        ) : (
          <motion.div layout style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'2px' }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((pkg, i) => (
                <motion.div key={pkg.id} layout initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ background:'var(--bg-2)', border:'1px solid var(--border)', display:'flex', flexDirection:'column', transition:'border-color 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='var(--gold-border)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>

                  {/* Top */}
                  <div style={{ padding:'32px 28px 24px', flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px' }}>
                      <div>
                        <span className="section-label" style={{ marginBottom:'6px', display:'block', fontSize:'0.58rem' }}>
                          {CAT_LABELS[pkg.category]}
                        </span>
                        <h3 style={{ fontFamily:'Cormorant,serif', fontSize:'1.7rem', fontWeight:400, color:'var(--fg)', lineHeight:1, margin:0 }}>
                          {pkg.name}
                        </h3>
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0, marginLeft:'12px' }}>
                        <div style={{ fontFamily:'Cormorant,serif', fontSize:'1.9rem', fontWeight:300, color:'var(--fg)' }}>
                          {fmt(pkg.base_price)}
                        </div>
                        <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.55rem', letterSpacing:'0.15em', color:'var(--fg-4)', marginTop:'2px' }}>
                          {pkg.duration_hours}H SESSION
                        </div>
                      </div>
                    </div>

                    <p style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.78rem', color:'var(--fg-3)', lineHeight:1.75, marginBottom:'22px', fontWeight:300 }}>
                      {pkg.description}
                    </p>

                    {/* Includes */}
                    {pkg.includes?.length > 0 && (
                      <ul style={{ listStyle:'none', padding:0, margin:'0 0 20px', display:'flex', flexDirection:'column', gap:'8px' }}>
                        {pkg.includes.map((inc, j) => (
                          <li key={j} style={{ display:'flex', alignItems:'flex-start', gap:'10px', fontFamily:'Montserrat,sans-serif', fontSize:'0.75rem', color:'var(--fg-2)', fontWeight:300 }}>
                            <Check size={11} style={{ color:'var(--gold)', flexShrink:0, marginTop:'2px' }} />
                            {inc}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Extras accordion */}
                    {pkg.extras?.length > 0 && (
                      <div style={{ borderTop:'1px solid var(--border)', paddingTop:'16px' }}>
                        <button onClick={() => setExpanded(expanded === pkg.id ? null : pkg.id)}
                          style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', background:'none', border:'none', cursor:'pointer', padding:0 }}>
                          <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--fg-3)' }}>
                            Optional Add-ons
                          </span>
                          <ChevronDown size={12} style={{ color:'var(--fg-3)', transition:'transform 0.3s', transform: expanded===pkg.id ? 'rotate(180deg)' : 'none' }} />
                        </button>
                        <AnimatePresence>
                          {expanded === pkg.id && (
                            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
                              transition={{ duration:0.3 }} style={{ overflow:'hidden' }}>
                              <div style={{ paddingTop:'12px', display:'flex', flexDirection:'column', gap:'8px' }}>
                                {pkg.extras.map((e, j) => (
                                  <div key={j} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                                    <div>
                                      <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.75rem', color:'var(--fg-2)', fontWeight:300 }}>{e.name}</div>
                                      {e.description && <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.65rem', color:'var(--fg-4)', marginTop:'1px' }}>{e.description}</div>}
                                    </div>
                                    <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.75rem', color:'var(--gold)', marginLeft:'12px', flexShrink:0 }}>
                                      +{fmt(e.price)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div style={{ padding:'0 28px 28px' }}>
                    <button onClick={() => handleBook(pkg)} className="btn-primary"
                      style={{ width:'100%', padding:'14px', justifyContent:'center', fontSize:'0.6rem', letterSpacing:'0.2em', gap:'10px' }}>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:'10px' }}>
                        Book This Package <ArrowRight size={12} />
                      </span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Custom CTA */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ marginTop:'48px', padding:'48px 40px', border:'1px solid var(--border)', textAlign:'center' }}>
          <span className="section-label" style={{ display:'block', marginBottom:'14px' }}>Need Something Bespoke?</span>
          <h2 style={{ fontFamily:'Cormorant,serif', fontSize:'2.2rem', fontWeight:300, color:'var(--fg)', marginBottom:'14px' }}>
            Let's Talk
          </h2>
          <p style={{ fontFamily:'EB Garamond,serif', fontSize:'1.05rem', color:'var(--fg-3)', maxWidth:'480px', margin:'0 auto 28px', lineHeight:1.8 }}>
            Have a unique vision? We create custom packages for every occasion — from intimate elopements to large-scale commercial productions.
          </p>
          <Link to="/contact">
            <button className="btn-ghost" style={{ padding:'13px 32px' }}>
              <span style={{ fontSize:'0.6rem', letterSpacing:'0.22em', display:'inline-flex', alignItems:'center', gap:'10px' }}>
                Get in Touch <ArrowRight size={12} />
              </span>
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
