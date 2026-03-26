import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Send, CheckCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { reviewsAPI, bookingsAPI } from '../utils/api';

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

export default function ReviewPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => { bookingsAPI.getById(bookingId).then((r) => setBooking(r.data)).catch(() => {}); }, [bookingId]);

  const onSubmit = async (d) => {
    if (!rating) { toast.error('Please select a rating'); return; }
    setSubmitting(true);
    try {
      await reviewsAPI.submit({ booking_id: bookingId, rating, comment: d.comment, reviewer_name: d.name });
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit review');
    } finally { setSubmitting(false); }
  };

  if (submitted) return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} style={{ textAlign:'center', maxWidth:'360px' }}>
        <div style={{ width:'56px', height:'56px', border:'1px solid var(--gold-border)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
          <CheckCircle size={24} style={{ color:'var(--gold)' }} />
        </div>
        <h2 style={{ fontFamily:'Cormorant,serif', fontSize:'2.2rem', fontWeight:300, color:'var(--fg)', marginBottom:'10px' }}>Thank You</h2>
        <p style={{ fontFamily:'EB Garamond,serif', fontSize:'1rem', color:'var(--fg-3)', lineHeight:1.8, marginBottom:'28px' }}>
          Your review has been submitted and will be published shortly.
        </p>
        <Link to="/"><button className="btn-primary" style={{ padding:'13px 28px' }}>
          <span style={{ fontSize:'0.6rem', letterSpacing:'0.2em' }}>Return Home</span>
        </button></Link>
      </motion.div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', paddingTop:'72px', display:'flex', alignItems:'center', justifyContent:'center', padding:'100px 6%' }}>
      <div style={{ maxWidth:'480px', width:'100%' }}>
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:'32px', textAlign:'center' }}>
          <span className="section-label" style={{ display:'block', marginBottom:'10px' }}>Share Your Experience</span>
          <h1 style={{ fontFamily:'Cormorant,serif', fontSize:'2.8rem', fontWeight:300, color:'var(--fg)', margin:'0 0 10px' }}>Leave a Review</h1>
          {booking && <p style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.75rem', color:'var(--fg-3)', fontWeight:300 }}>For: {booking.package_name}</p>}
        </motion.div>

        <div style={{ background:'var(--bg-2)', border:'1px solid var(--border)', padding:'36px 32px' }}>
          {/* Stars */}
          <div style={{ textAlign:'center', marginBottom:'28px' }}>
            <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--fg-4)', marginBottom:'14px' }}>
              How was your experience?
            </div>
            <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginBottom:'8px' }}>
              {[1,2,3,4,5].map((s) => (
                <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)}
                  style={{ background:'none', border:'none', cursor:'pointer', padding:'2px', transition:'transform 0.2s' }}
                  onMouseDown={e => e.currentTarget.style.transform='scale(0.9)'}
                  onMouseUp={e => e.currentTarget.style.transform='scale(1)'}>
                  <Star size={30} style={{ color:'var(--gold)', fill: s <= (hover||rating) ? 'var(--gold)' : 'transparent', transition:'fill 0.2s' }} />
                </button>
              ))}
            </div>
            {(hover || rating) > 0 && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                style={{ fontFamily:'Cormorant,serif', fontSize:'1.05rem', fontStyle:'italic', color:'var(--gold)' }}>
                {LABELS[hover || rating]}
              </motion.div>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom:'20px' }}>
              <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.58rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--fg-4)', marginBottom:'8px' }}>Your Name</div>
              <input {...register('name', { required: 'Name is required' })} placeholder="Your name"
                style={{ background:'transparent', border:'none', borderBottom:'1px solid var(--border-2)', color:'var(--fg)', fontFamily:'Montserrat,sans-serif', fontSize:'0.88rem', padding:'10px 0', width:'100%', outline:'none', fontWeight:300 }}
                onFocus={e => e.target.style.borderBottomColor='var(--gold)'}
                onBlur={e => e.target.style.borderBottomColor='var(--border-2)'}
              />
              {errors.name && <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.65rem', color:'#c05050', marginTop:'4px' }}>{errors.name.message}</div>}
            </div>

            <div style={{ marginBottom:'28px' }}>
              <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.58rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--fg-4)', marginBottom:'8px' }}>Your Review</div>
              <textarea {...register('comment', { required:'Review is required', minLength:{ value:10, message:'Please write at least 10 characters' } })}
                rows={5} placeholder="Tell us about your experience..."
                style={{ background:'transparent', border:'none', borderBottom:'1px solid var(--border-2)', color:'var(--fg)', fontFamily:'EB Garamond,serif', fontSize:'1rem', padding:'10px 0', width:'100%', outline:'none', resize:'none', fontWeight:400, lineHeight:1.75 }}
                onFocus={e => e.target.style.borderBottomColor='var(--gold)'}
                onBlur={e => e.target.style.borderBottomColor='var(--border-2)'}
              />
              {errors.comment && <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:'0.65rem', color:'#c05050', marginTop:'4px' }}>{errors.comment.message}</div>}
            </div>

            <button type="submit" disabled={submitting || !rating} className="btn-primary"
              style={{ width:'100%', padding:'14px', justifyContent:'center', opacity: submitting||!rating ? 0.55 : 1 }}>
              <span style={{ fontSize:'0.6rem', letterSpacing:'0.2em', display:'inline-flex', alignItems:'center', gap:'10px' }}>
                {submitting ? <Loader2 size={12} style={{ animation:'spin 1s linear infinite' }} /> : <Send size={12} />}
                {submitting ? 'Submitting...' : 'Submit Review'}
              </span>
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
