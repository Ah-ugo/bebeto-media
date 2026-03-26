import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, MessageSquare, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { bookingsAPI } from '../utils/api';

export default function BookingConfirmPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingsAPI.getById(bookingId).then((r) => setBooking(r.data)).finally(() => setLoading(false));
  }, [bookingId]);

  const fmt = (n) => `£${Number(n).toLocaleString('en-GB')}`;

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <Loader2 size={24} style={{ color:'var(--gold)', animation:'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', paddingTop:'72px', display:'flex', alignItems:'center', justifyContent:'center', padding:'100px 6%' }}>
      <div style={{ maxWidth:'520px', width:'100%' }}>
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.5 }}
          style={{ textAlign:'center', marginBottom:'36px' }}>
          <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.2, type:'spring', stiffness:200 }}
            style={{ width:'64px', height:'64px', border:'1px solid var(--gold-border)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
            <CheckCircle size={28} style={{ color:'var(--gold)' }} />
          </motion.div>
          <span className="section-label" style={{ display:'block', marginBottom:'10px' }}>Booking Submitted</span>
          <h1 style={{ fontFamily:'Cormorant,serif', fontSize:'2.8rem', fontWeight:300, color:'var(--fg)', margin:'0 0 12px' }}>You're All Set</h1>
          <p style={{ fontFamily:'EB Garamond,serif', fontSize:'1.05rem', color:'var(--fg-3)', lineHeight:1.8 }}>
            Your booking has been received. We'll review it and confirm within 24 hours.
          </p>
        </motion.div>

        {booking && (
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
            style={{ background:'var(--bg-2)', border:'1px solid var(--border)', marginBottom:'24px' }}>
            {[
              ['Reference', `#${bookingId.slice(-8).toUpperCase()}`],
              ['Package', booking.package_name],
              ['Date', new Date(booking.booking_date).toLocaleDateString('en-GB',{weekday:'long',year:'numeric',month:'long',day:'numeric'})],
              ['Location', booking.location],
              ['Status', booking.status],
            ].map(([k,v], i, arr) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'12px 20px', borderBottom: i<arr.length-1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.6rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--fg-4)' }}>{k}</span>
                <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.8rem', color: k==='Status' ? 'var(--gold)' : 'var(--fg)', textTransform:'capitalize' }}>{v}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', padding:'14px 20px', background:'var(--bg-3)' }}>
              <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.6rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--fg-3)' }}>Total</span>
              <span style={{ fontFamily:'Cormorant,serif', fontSize:'1.5rem', color:'var(--gold)', fontWeight:300 }}>{fmt(booking.price?.total_price || 0)}</span>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
          style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          <Link to={`/chat/${bookingId}`}>
            <button className="btn-primary" style={{ width:'100%', padding:'14px', justifyContent:'center' }}>
              <span style={{ fontSize:'0.6rem', letterSpacing:'0.2em', display:'inline-flex', alignItems:'center', gap:'10px' }}>
                <MessageSquare size={13} /> Chat with Bebeto Media
              </span>
            </button>
          </Link>
          {booking?.invoice_url && (
            <a href={booking.invoice_url} target="_blank" rel="noopener">
              <button className="btn-ghost" style={{ width:'100%', padding:'13px', justifyContent:'center' }}>
                <span style={{ fontSize:'0.6rem', letterSpacing:'0.2em', display:'inline-flex', alignItems:'center', gap:'10px' }}>
                  <FileText size={13} /> Download Invoice
                </span>
              </button>
            </a>
          )}
          <Link to="/">
            <button style={{ width:'100%', padding:'12px', background:'none', border:'none', cursor:'pointer', fontFamily:'Montserrat,sans-serif', fontSize:'0.62rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--fg-4)', transition:'color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.color='var(--fg)'}
              onMouseLeave={e => e.currentTarget.style.color='var(--fg-4)'}>
              Return to Home
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
