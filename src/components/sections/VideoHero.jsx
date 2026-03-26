import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, VolumeX, Volume2 } from 'lucide-react';

const SLIDES = [
  { line1: 'Moments That', line2: 'Last Forever', sub: 'Wedding Photography', img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1920&q=85' },
  { line1: 'Your Story,', line2: 'Beautifully Told', sub: 'Portrait Sessions', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1920&q=85' },
  { line1: 'Every Detail,', line2: 'Perfectly Captured', sub: 'Event Coverage', img: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1920&q=85' },
  { line1: 'Light, Emotion,', line2: 'Pure Artistry', sub: 'Commercial Work', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=85' },
];

export default function VideoHero() {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [idx, setIdx] = useState(0);
  const [videoErr, setVideoErr] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const toggleMute = () => {
    setMuted(m => { if (videoRef.current) videoRef.current.muted = !m; return !m; });
  };

  const s = SLIDES[idx];

  return (
    <section className="video-hero grain">
      {/* Background */}
      {!videoErr ? (
        <video ref={videoRef} autoPlay muted loop playsInline onError={() => setVideoErr(true)} src="/hero-video.mp4"
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.28) contrast(1.1)' }} />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.6, 0.01, 0.05, 0.95] }}
            style={{ position:'absolute', inset:0, backgroundImage:`url(${s.img})`, backgroundSize:'cover', backgroundPosition:'center', filter:'brightness(0.28) contrast(1.1)' }} />
        </AnimatePresence>
      )}

      {/* Gradient overlays */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, rgba(12,11,9,0.85) 0%, rgba(12,11,9,0.2) 60%, rgba(12,11,9,0) 100%)' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(12,11,9,0.9) 0%, rgba(12,11,9,0) 50%)' }} />

      {/* Main content — left aligned, editorial */}
      <div style={{ position:'relative', zIndex:10, height:'100%', display:'flex', alignItems:'center', padding:'0 5% 0 8%', maxWidth:'1400px', margin:'0 auto' }}>
        <div style={{ maxWidth:'680px' }}>

          {/* Eyebrow */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.8 }}
            style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'32px' }}>
            <div style={{ width:'28px', height:'1px', background:'var(--gold)', opacity:0.7 }} />
            <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.58rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(191,160,106,0.8)' }}>
              Sunderland · Est. 2016
            </span>
          </motion.div>

          {/* Headline — stacked, animates per slide */}
          <div style={{ overflow:'hidden', marginBottom:'4px' }}>
            <AnimatePresence mode="wait">
              <motion.h1 key={`${idx}-l1`}
                initial={{ y: '110%', opacity:0 }} animate={{ y: '0%', opacity:1 }} exit={{ y: '-40%', opacity:0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontFamily:'Cormorant,Georgia,serif', fontSize:'clamp(3.4rem,7.5vw,8rem)', fontWeight:300, lineHeight:0.95, color:'#EDE8E0', letterSpacing:'-0.01em', margin:0 }}>
                {s.line1}
              </motion.h1>
            </AnimatePresence>
          </div>
          <div style={{ overflow:'hidden', marginBottom:'28px' }}>
            <AnimatePresence mode="wait">
              <motion.h1 key={`${idx}-l2`}
                initial={{ y: '110%', opacity:0 }} animate={{ y: '0%', opacity:1 }} exit={{ y: '-40%', opacity:0 }}
                transition={{ duration: 0.75, delay:0.08, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontFamily:'Cormorant,Georgia,serif', fontSize:'clamp(3.4rem,7.5vw,8rem)', fontWeight:400, lineHeight:0.95, fontStyle:'italic', margin:0 }}
                className="gold-gradient">
                {s.line2}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Sub category line */}
          <AnimatePresence mode="wait">
            <motion.div key={`sub-${idx}`}
              initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
              transition={{ duration:0.4 }}
              style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'44px' }}>
              <div style={{ width:'20px', height:'1px', background:'var(--gold)' }} />
              <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.58rem', letterSpacing:'0.28em', textTransform:'uppercase', color:'rgba(191,160,106,0.75)' }}>
                {s.sub}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* CTAs */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6, duration:0.7 }}
            style={{ display:'flex', flexWrap:'wrap', gap:'14px', alignItems:'center' }}>
            <Link to="/book">
              <button className="btn-primary" style={{ padding:'16px 36px' }}>
                <span style={{ fontSize:'0.58rem', letterSpacing:'0.22em', display:'flex', alignItems:'center', gap:'10px' }}>
                  Book a Session <ArrowRight size={12} />
                </span>
              </button>
            </Link>
            <Link to="/portfolio">
              <button className="btn-ghost" style={{ padding:'16px 32px', color:'rgba(237,232,224,0.75)', borderColor:'rgba(237,232,224,0.15)' }}>
                <span style={{ fontSize:'0.58rem', letterSpacing:'0.22em' }}>View Portfolio</span>
              </button>
            </Link>
          </motion.div>

          {/* Slide indicators */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1 }}
            style={{ display:'flex', gap:'6px', marginTop:'52px' }}>
            {SLIDES.map((_,i) => (
              <button key={i} onClick={() => setIdx(i)}
                style={{ height:'2px', borderRadius:'1px', background: i===idx ? 'var(--gold)' : 'rgba(237,232,224,0.2)', width: i===idx ? '32px' : '12px', transition:'all 0.5s', cursor:'pointer', border:'none' }} />
            ))}
          </motion.div>
        </div>

        {/* Right — vertical stats strip */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.1 }}
          style={{ position:'absolute', right:'8%', top:'50%', transform:'translateY(-50%)', display:'flex', flexDirection:'column', gap:'28px', alignItems:'center' }}
          className="hidden xl:flex">
          {[['500+','Sessions'],['8+','Years'],['4.9','Rating']].map(([v,l]) => (
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'Cormorant,serif', fontSize:'1.6rem', color:'rgba(237,232,224,0.9)', fontWeight:400 }}>{v}</div>
              <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.52rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(191,160,106,0.6)', marginTop:'3px' }}>{l}</div>
            </div>
          ))}
          <div style={{ width:'1px', height:'40px', background:'rgba(191,160,106,0.2)', marginTop:'8px' }} />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div style={{ position:'absolute', bottom:'40px', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', zIndex:10 }}>
        <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.52rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'rgba(237,232,224,0.3)' }}>Scroll</span>
        <div className="scroll-line" />
      </div>

      {/* Mute */}
      {!videoErr && (
        <button onClick={toggleMute}
          style={{ position:'absolute', bottom:'36px', right:'40px', zIndex:10, width:'34px', height:'34px', borderRadius:'50%', border:'1px solid rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)', cursor:'pointer', background:'transparent', transition:'all 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor='rgba(191,160,106,0.5)'}
          onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'}
        >
          {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
        </button>
      )}

      {/* Vertical left label */}
      <div style={{ position:'absolute', left:'32px', top:'50%', transform:'translateY(-50%) rotate(-90deg)', fontFamily:'Montserrat,sans-serif', fontSize:'0.5rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(237,232,224,0.18)', whiteSpace:'nowrap' }}
        className="hidden xl:block">
        Photography · Sunderland · North East England
      </div>
    </section>
  );
}
