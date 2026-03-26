import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Check, ArrowRight, ArrowLeft, Loader2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { packagesAPI, bookingsAPI, availabilityAPI } from '../utils/api';
import { useBookingStore } from '../store';

const CATS = [
  { id:'weddings',   label:'Weddings',   emoji:'💍', desc:'Full-day ceremony & reception coverage' },
  { id:'portraits',  label:'Portraits',  emoji:'🎭', desc:'Studio or outdoor portrait sessions' },
  { id:'events',     label:'Events',     emoji:'🎉', desc:'Corporate & personal event coverage' },
  { id:'commercial', label:'Commercial', emoji:'💼', desc:'Brand & product photography' },
  { id:'family',     label:'Family',     emoji:'👨‍👩‍👧', desc:'Warm family portrait sessions' },
];

const STEPS = ['Category','Package','Date & Extras','Your Details','Confirm'];

const slide = {
  enter:  { x: 40,  opacity: 0 },
  center: { x: 0,   opacity: 1, transition: { duration: 0.4, ease: [0.4,0,0.2,1] } },
  exit:   { x: -30, opacity: 0, transition: { duration: 0.25 } },
};

export default function BookingPage() {
  const navigate = useNavigate();
  const store = useBookingStore();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [packages, setPackages] = useState([]);
  const [unavailable, setUnavailable] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [pkgLoading, setPkgLoading] = useState(false);

  const step = store.step;

  // Load packages when category chosen
  useEffect(() => {
    if (step === 1 && store.selectedCategory) {
      setPkgLoading(true);
      packagesAPI.getAll(store.selectedCategory)
        .then((r) => setPackages(r.data))
        .catch(() => setPackages([]))
        .finally(() => setPkgLoading(false));
    }
  }, [step, store.selectedCategory]);

  // Load month availability
  useEffect(() => {
    const now = new Date();
    availabilityAPI.month(now.getFullYear(), now.getMonth() + 1)
      .then((r) => {
        const blocked = r.data.days.filter((d) => !d.is_available).map((d) => new Date(d.date));
        setUnavailable(blocked);
      })
      .catch(() => {});
  }, []);

  const fmt = (n) => `£${Number(n).toLocaleString('en-GB')}`;
  const isBlocked = (d) => {
    if (d < new Date()) return true;
    return unavailable.some((u) => u.toDateString() === d.toDateString());
  };

  const handleFinalSubmit = async () => {
    const { clientInfo, selectedPackage, selectedDate, selectedExtras } = store;
    if (!clientInfo || !selectedPackage || !selectedDate) { toast.error('Please complete all steps'); return; }
    setSubmitting(true);
    try {
      const res = await bookingsAPI.create({
        client_name: clientInfo.name,
        client_email: clientInfo.email,
        client_phone: clientInfo.phone,
        package_id: selectedPackage.id,
        booking_date: selectedDate.toISOString(),
        location: clientInfo.location,
        notes: clientInfo.notes || null,
        selected_extras: selectedExtras,
      });
      toast.success('Booking submitted successfully!');
      store.reset();
      navigate(`/booking/confirm/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Input style shared
  const iStyle = {
    background:'transparent', border:'none', borderBottom:'1px solid var(--border-2)',
    color:'var(--fg)', fontFamily:'Montserrat,sans-serif', fontSize:'0.88rem', fontWeight:300,
    padding:'11px 0', width:'100%', outline:'none', transition:'border-color 0.3s',
  };

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', paddingTop:'72px' }}>
      <div style={{ maxWidth:'780px', margin:'0 auto', padding:'48px 6% 80px' }}>

        {/* Header */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:'44px' }}>
          <span className="section-label" style={{ display:'block', marginBottom:'10px' }}>Photography Booking</span>
          <h1 style={{ fontFamily:'Cormorant,serif', fontSize:'clamp(2.2rem,5vw,4rem)', fontWeight:300, color:'var(--fg)', margin:0 }}>
            Book a Session
          </h1>
        </motion.div>

        {/* Step indicator */}
        <div style={{ display:'flex', alignItems:'center', marginBottom:'44px' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex:1, display:'flex', alignItems:'center' }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:'0 0 auto' }}>
                <button onClick={() => i < step && store.setStep(i)} disabled={i > step}
                  style={{
                    width:'28px', height:'28px', borderRadius:'50%', border: `1px solid ${i <= step ? 'var(--gold)' : 'var(--border-2)'}`,
                    background: i < step ? 'var(--gold)' : 'transparent',
                    color: i < step ? '#0C0B09' : i === step ? 'var(--gold)' : 'var(--fg-4)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    cursor: i < step ? 'pointer' : 'default', fontFamily:'Montserrat,sans-serif',
                    fontSize:'0.65rem', fontWeight:500, transition:'all 0.35s',
                  }}>
                  {i < step ? <Check size={12} /> : i + 1}
                </button>
                <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.52rem', letterSpacing:'0.12em', textTransform:'uppercase',
                  color: i === step ? 'var(--gold)' : 'var(--fg-4)', marginTop:'5px', whiteSpace:'nowrap' }}>
                  {s}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex:1, height:'1px', margin:'0 4px 14px',
                  background: i < step ? 'var(--gold)' : 'var(--border-2)', opacity: i < step ? 0.6 : 1,
                  transition:'background 0.4s' }} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div style={{ border:'1px solid var(--border)', background:'var(--bg-2)', minHeight:'420px', overflow:'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div key={step} variants={slide} initial="enter" animate="center" exit="exit"
              style={{ padding:'36px 32px' }}>

              {/* ── STEP 0: Category ───────────────── */}
              {step === 0 && (
                <div>
                  <h2 style={{ fontFamily:'Cormorant,serif', fontSize:'1.8rem', fontWeight:300, color:'var(--fg)', marginBottom:'6px' }}>
                    What are you celebrating?
                  </h2>
                  <p style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.75rem', color:'var(--fg-3)', marginBottom:'24px', fontWeight:300 }}>
                    Select the type of photography you need.
                  </p>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                    {CATS.map((c) => (
                      <button key={c.id} onClick={() => store.setCategory(c.id)}
                        style={{
                          padding:'18px 20px', textAlign:'left', border:`1px solid ${store.selectedCategory===c.id ? 'var(--gold)' : 'var(--border)'}`,
                          background: store.selectedCategory===c.id ? 'var(--gold-dim)' : 'var(--bg)',
                          cursor:'pointer', transition:'all 0.25s',
                        }}>
                        <div style={{ fontSize:'1.4rem', marginBottom:'6px' }}>{c.emoji}</div>
                        <div style={{ fontFamily:'Cormorant,serif', fontSize:'1.15rem', color:'var(--fg)', fontWeight:400, marginBottom:'3px' }}>{c.label}</div>
                        <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.68rem', color:'var(--fg-3)', fontWeight:300 }}>{c.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── STEP 1: Package ────────────────── */}
              {step === 1 && (
                <div>
                  <h2 style={{ fontFamily:'Cormorant,serif', fontSize:'1.8rem', fontWeight:300, color:'var(--fg)', marginBottom:'6px', textTransform:'capitalize' }}>
                    {store.selectedCategory} Packages
                  </h2>
                  <p style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.75rem', color:'var(--fg-3)', marginBottom:'24px', fontWeight:300 }}>
                    Choose the package that fits your vision.
                  </p>
                  {pkgLoading ? (
                    <div style={{ display:'flex', alignItems:'center', gap:'10px', color:'var(--fg-3)', padding:'40px 0', justifyContent:'center' }}>
                      <Loader2 size={18} style={{ animation:'spin 1s linear infinite' }} /> Loading packages...
                    </div>
                  ) : packages.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'40px 0', color:'var(--fg-4)', fontFamily:'Montserrat,sans-serif', fontSize:'0.8rem' }}>
                      No packages available in this category yet.
                    </div>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                      {packages.map((pkg) => (
                        <button key={pkg.id} onClick={() => store.setPackage(pkg)}
                          style={{
                            padding:'20px 22px', textAlign:'left', border:`1px solid ${store.selectedPackage?.id===pkg.id ? 'var(--gold)' : 'var(--border)'}`,
                            background: store.selectedPackage?.id===pkg.id ? 'var(--gold-dim)' : 'var(--bg)',
                            cursor:'pointer', transition:'all 0.25s',
                          }}>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
                            <div style={{ fontFamily:'Cormorant,serif', fontSize:'1.3rem', color:'var(--fg)', fontWeight:400 }}>{pkg.name}</div>
                            <div style={{ textAlign:'right', marginLeft:'16px', flexShrink:0 }}>
                              <div style={{ fontFamily:'Cormorant,serif', fontSize:'1.5rem', color:'var(--gold)', fontWeight:300 }}>{fmt(pkg.base_price)}</div>
                              <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.55rem', letterSpacing:'0.15em', color:'var(--fg-4)' }}>{pkg.duration_hours}H</div>
                            </div>
                          </div>
                          <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.72rem', color:'var(--fg-3)', fontWeight:300, lineHeight:1.6 }}>{pkg.description}</div>
                          {pkg.includes?.length > 0 && (
                            <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginTop:'12px' }}>
                              {pkg.includes.map((inc, j) => (
                                <span key={j} style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.6rem', color:'var(--gold)', background:'var(--gold-dim)', padding:'3px 9px', border:'1px solid var(--gold-border)' }}>
                                  {inc}
                                </span>
                              ))}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  <button onClick={() => store.setStep(0)}
                    style={{ marginTop:'20px', fontFamily:'Montserrat,sans-serif', fontSize:'0.65rem', letterSpacing:'0.12em', color:'var(--fg-4)', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px' }}>
                    <ArrowLeft size={12} /> Back
                  </button>
                </div>
              )}

              {/* ── STEP 2: Date & Extras ──────────── */}
              {step === 2 && store.selectedPackage && (
                <div>
                  <h2 style={{ fontFamily:'Cormorant,serif', fontSize:'1.8rem', fontWeight:300, color:'var(--fg)', marginBottom:'6px' }}>
                    Choose a Date
                  </h2>
                  <p style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.75rem', color:'var(--fg-3)', marginBottom:'24px', fontWeight:300 }}>
                    Select your preferred date and any optional add-ons.
                  </p>

                  {/* Date picker */}
                  <div style={{ marginBottom:'28px' }}>
                    <div className="section-label" style={{ marginBottom:'10px', fontSize:'0.58rem' }}>Session Date</div>
                    <DatePicker selected={store.selectedDate} onChange={(d) => store.setDate(d)} inline
                      filterDate={(d) => !isBlocked(d)}
                      minDate={new Date()}
                    />
                  </div>

                  {/* Extras */}
                  {store.selectedPackage.extras?.length > 0 && (
                    <div style={{ marginBottom:'24px' }}>
                      <div className="section-label" style={{ marginBottom:'12px', fontSize:'0.58rem' }}>Optional Add-ons</div>
                      <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                        {store.selectedPackage.extras.map((e, i) => {
                          const sel = store.selectedExtras.find((x) => x.name === e.name);
                          return (
                            <button key={i} onClick={() => store.toggleExtra(e)}
                              style={{
                                display:'flex', justifyContent:'space-between', alignItems:'center',
                                padding:'14px 18px', border:`1px solid ${sel ? 'var(--gold)' : 'var(--border)'}`,
                                background: sel ? 'var(--gold-dim)' : 'var(--bg)',
                                cursor:'pointer', transition:'all 0.25s',
                              }}>
                              <div style={{ textAlign:'left' }}>
                                <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.8rem', color:'var(--fg)', fontWeight:400 }}>{e.name}</div>
                                {e.description && <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.65rem', color:'var(--fg-3)', marginTop:'2px', fontWeight:300 }}>{e.description}</div>}
                              </div>
                              <div style={{ display:'flex', alignItems:'center', gap:'12px', flexShrink:0, marginLeft:'16px' }}>
                                <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.8rem', color:'var(--gold)' }}>+{fmt(e.price)}</span>
                                <div style={{ width:'18px', height:'18px', border:`1px solid ${sel ? 'var(--gold)' : 'var(--border-2)'}`, background: sel ? 'var(--gold)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.25s' }}>
                                  {sel && <Check size={10} style={{ color:'#0C0B09' }} />}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Price summary */}
                  <div style={{ background:'var(--bg)', border:'1px solid var(--border)', padding:'18px 20px', marginBottom:'20px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'Montserrat,sans-serif', fontSize:'0.75rem', marginBottom:'8px' }}>
                      <span style={{ color:'var(--fg-3)' }}>Base price</span>
                      <span style={{ color:'var(--fg)' }}>{fmt(store.selectedPackage.base_price)}</span>
                    </div>
                    {store.selectedExtras.map((e, i) => (
                      <div key={i} style={{ display:'flex', justifyContent:'space-between', fontFamily:'Montserrat,sans-serif', fontSize:'0.75rem', marginBottom:'8px' }}>
                        <span style={{ color:'var(--fg-3)' }}>{e.name}</span>
                        <span style={{ color:'var(--fg)' }}>+{fmt(e.price)}</span>
                      </div>
                    ))}
                    <div style={{ height:'1px', background:'var(--border)', margin:'12px 0' }} />
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.7rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--fg-2)' }}>Total</span>
                      <span style={{ fontFamily:'Cormorant,serif', fontSize:'1.5rem', color:'var(--gold)', fontWeight:300 }}>{fmt(store.getTotalPrice())}</span>
                    </div>
                  </div>

                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <button onClick={() => store.setStep(1)} style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.65rem', letterSpacing:'0.12em', color:'var(--fg-4)', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px' }}>
                      <ArrowLeft size={12} /> Back
                    </button>
                    <button onClick={() => store.selectedDate ? store.setStep(3) : toast.error('Please select a date')}
                      className="btn-primary" style={{ padding:'12px 28px' }}>
                      <span style={{ fontSize:'0.6rem', letterSpacing:'0.2em', display:'inline-flex', alignItems:'center', gap:'8px' }}>
                        Continue <ArrowRight size={11} />
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Client details ─────────── */}
              {step === 3 && (
                <form onSubmit={handleSubmit((d) => store.setClientInfo(d))}>
                  <h2 style={{ fontFamily:'Cormorant,serif', fontSize:'1.8rem', fontWeight:300, color:'var(--fg)', marginBottom:'6px' }}>Your Details</h2>
                  <p style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.75rem', color:'var(--fg-3)', marginBottom:'28px', fontWeight:300 }}>Tell us how to reach you.</p>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px 32px', marginBottom:'28px' }}>
                    {[
                      { key:'name',     label:'Full Name',    placeholder:'Your full name',          req:true },
                      { key:'email',    label:'Email Address',placeholder:'your@email.com',          req:true, type:'email' },
                      { key:'phone',    label:'Phone',        placeholder:'+44 7xxx xxxxxx',         req:true },
                      { key:'location', label:'Venue / Location', placeholder:'e.g. Roker Beach, Sunderland', req:true },
                    ].map(({ key, label, placeholder, req, type }) => (
                      <div key={key} style={{ gridColumn: key==='location' ? 'span 2' : 'auto' }}>
                        <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.58rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--fg-4)', marginBottom:'8px' }}>{label}</div>
                        <input {...register(key, { required: req ? `${label} is required` : false, pattern: type==='email' ? { value:/^\S+@\S+$/, message:'Valid email required' } : undefined })}
                          type={type || 'text'} placeholder={placeholder}
                          style={iStyle}
                          onFocus={e => e.target.style.borderBottomColor='var(--gold)'}
                          onBlur={e => e.target.style.borderBottomColor='var(--border-2)'}
                        />
                        {errors[key] && <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.65rem', color:'#c05050', marginTop:'4px' }}>{errors[key].message}</div>}
                      </div>
                    ))}
                    <div style={{ gridColumn:'span 2' }}>
                      <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.58rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--fg-4)', marginBottom:'8px' }}>Additional Notes</div>
                      <textarea {...register('notes')} rows={3} placeholder="Any special requests or details about your session..."
                        style={{ ...iStyle, resize:'none', height:'80px' }}
                        onFocus={e => e.target.style.borderBottomColor='var(--gold)'}
                        onBlur={e => e.target.style.borderBottomColor='var(--border-2)'}
                      />
                    </div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <button type="button" onClick={() => store.setStep(2)} style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.65rem', letterSpacing:'0.12em', color:'var(--fg-4)', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px' }}>
                      <ArrowLeft size={12} /> Back
                    </button>
                    <button type="submit" className="btn-primary" style={{ padding:'12px 28px' }}>
                      <span style={{ fontSize:'0.6rem', letterSpacing:'0.2em', display:'inline-flex', alignItems:'center', gap:'8px' }}>
                        Review Booking <ArrowRight size={11} />
                      </span>
                    </button>
                  </div>
                </form>
              )}

              {/* ── STEP 4: Confirm ───────────────── */}
              {step === 4 && store.clientInfo && (
                <div>
                  <h2 style={{ fontFamily:'Cormorant,serif', fontSize:'1.8rem', fontWeight:300, color:'var(--fg)', marginBottom:'6px' }}>Review Your Booking</h2>
                  <p style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.75rem', color:'var(--fg-3)', marginBottom:'24px', fontWeight:300 }}>Please confirm all details before submitting.</p>

                  <div style={{ background:'var(--bg)', border:'1px solid var(--border)', marginBottom:'20px' }}>
                    {[
                      ['Package',    store.selectedPackage?.name],
                      ['Category',   store.selectedCategory],
                      ['Session Date', store.selectedDate?.toLocaleDateString('en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' })],
                      ['Name',       store.clientInfo.name],
                      ['Email',      store.clientInfo.email],
                      ['Phone',      store.clientInfo.phone],
                      ['Location',   store.clientInfo.location],
                    ].map(([k, v], i, arr) => v && (
                      <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'12px 20px', borderBottom: i<arr.length-1 ? '1px solid var(--border)' : 'none' }}>
                        <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.6rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--fg-4)' }}>{k}</span>
                        <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.8rem', color:'var(--fg)', textAlign:'right', maxWidth:'55%', textTransform:'capitalize' }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ display:'flex', justifyContent:'space-between', padding:'16px 20px', background:'var(--bg-3)' }}>
                      <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.6rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--fg-3)' }}>Total Amount</span>
                      <span style={{ fontFamily:'Cormorant,serif', fontSize:'1.6rem', color:'var(--gold)', fontWeight:300 }}>{fmt(store.getTotalPrice())}</span>
                    </div>
                  </div>

                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <button onClick={() => store.setStep(3)} style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.65rem', letterSpacing:'0.12em', color:'var(--fg-4)', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px' }}>
                      <ArrowLeft size={12} /> Edit Details
                    </button>
                    <button onClick={handleFinalSubmit} disabled={submitting} className="btn-primary" style={{ padding:'14px 32px', opacity: submitting ? 0.7 : 1 }}>
                      <span style={{ fontSize:'0.6rem', letterSpacing:'0.2em', display:'inline-flex', alignItems:'center', gap:'8px' }}>
                        {submitting ? <><Loader2 size={12} style={{ animation:'spin 1s linear infinite' }} /> Submitting...</> : <><Check size={12} /> Confirm Booking</>}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }`}</style>
    </div>
  );
}
